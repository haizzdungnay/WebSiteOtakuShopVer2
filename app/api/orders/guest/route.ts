import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { sendEmail, getOrderConfirmationEmailTemplate } from '@/lib/email';
import { z } from 'zod';
import {
    generateOrderNumber,
    validateStock,
    calculateShippingFee
} from '@/lib/order-helpers';

// Validation schema for guest orders
const guestOrderSchema = z.object({
    customerName: z.string().min(1, 'Customer name is required'),
    customerPhone: z.string().min(1, 'Customer phone is required'),
    customerEmail: z.string().email().optional().or(z.literal('')),
    notificationEmail: z.string().email().optional().nullable(), // Email phụ để nhận thông báo
    shippingAddress: z.string().min(1, 'Shipping address is required'),
    shippingWard: z.string().optional(),
    shippingDistrict: z.string().min(1, 'Shipping district is required'),
    shippingCity: z.string().min(1, 'Shipping city is required'),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(1)
    })),
    paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'MOMO', 'VNPAY', 'ZALOPAY', 'CREDIT_CARD'], {
        message: 'Invalid payment method'
    }),
    note: z.string().max(500).optional().transform(val => val && val.trim() !== '' ? val.trim() : null)
});

export async function POST(request: NextRequest) {
    try {
        // Check if user is logged in (optional)
        const user = await getUserFromRequest(request);
        let userId: string | null = null;

        if (user) {
            // Verify user exists in DB to avoid foreign key constraint errors
            const dbUser = await prisma.user.findUnique({
                where: { id: user.userId },
                select: { id: true }
            });
            if (dbUser) {
                userId = dbUser.id;
            }
        }

        // Validate input
        const body = await request.json();
        const validatedData = guestOrderSchema.parse(body);

        // Fetch product details for cart items
        const productIds = validatedData.items.map(item => item.productId);
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                isActive: true
            },
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                stockQuantity: true,
                isActive: true,
                images: true
            }
        });

        // Validate that all products exist and match cart items
        const cartItems = validatedData.items.map(cartItem => {
            const product = products.find(p => p.id === cartItem.productId);
            if (!product) {
                throw new Error(`Product ${cartItem.productId} not found`);
            }
            return {
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                product: product
            };
        });

        // Validate stock
        const stockValidation = await validateStock(
            cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        );

        if (!stockValidation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Một số sản phẩm đã hết hàng',
                    details: stockValidation.errors
                },
                { status: 400 }
            );
        }

        // Calculate shipping fee
        const shippingFee = calculateShippingFee(
            validatedData.shippingCity,
            validatedData.shippingDistrict
        );

        // Calculate total
        const subtotal = cartItems.reduce((sum, item) => {
            return sum + (Number(item.product.price) * item.quantity);
        }, 0);

        const total = subtotal + shippingFee;

        // Generate order number
        const orderNumber = await generateOrderNumber();

        // Create order in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create order
            const order = await tx.order.create({
                data: {
                    orderNumber: orderNumber,
                    userId: userId, // Link to user if logged in

                    // Customer info
                    customerName: validatedData.customerName,
                    customerEmail: validatedData.customerEmail || null,
                    customerPhone: validatedData.customerPhone,
                    notificationEmail: validatedData.notificationEmail || null, // Email phụ để nhận thông báo

                    // Shipping info
                    shippingFullName: validatedData.customerName,
                    shippingPhone: validatedData.customerPhone,
                    shippingAddress: validatedData.shippingAddress,
                    shippingWard: validatedData.shippingWard || null,
                    shippingDistrict: validatedData.shippingDistrict,
                    shippingCity: validatedData.shippingCity,

                    // Order details
                    totalAmount: total,
                    status: 'PENDING',
                    note: validatedData.note,
                    addressId: null
                }
            });

            // Create order items
            const orderItems = await Promise.all(
                cartItems.map(item => {
                    return tx.orderItem.create({
                        data: {
                            orderId: order.id,
                            productId: item.productId,
                            quantity: item.quantity,
                            price: Number(item.product.price)
                        }
                    });
                })
            );

            // Update stock
            await Promise.all(
                cartItems.map(item =>
                    tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stockQuantity: { decrement: item.quantity }
                        }
                    })
                )
            );

            // Create payment record
            const payment = await tx.payment.create({
                data: {
                    orderId: order.id,
                    method: validatedData.paymentMethod,
                    amount: total,
                    status: 'PENDING'
                }
            });

            // Create shipping record
            const shipping = await tx.shipping.create({
                data: {
                    orderId: order.id,
                    carrier: 'GHN',
                    fee: shippingFee,
                    status: 'PREPARING'
                }
            });

            return {
                order,
                orderItems,
                payment,
                shipping
            };
        });

        // Fetch full order details
        const fullOrder = await prisma.order.findUnique({
            where: { id: result.order.id },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                images: true
                            }
                        }
                    }
                },
                payment: true,
                shipping: true,
                user: {
                    select: {
                        email: true,
                        emailVerified: true
                    }
                }
            }
        });

        // Gửi email xác nhận đơn hàng
        if (fullOrder) {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                const orderUrl = userId ? `${baseUrl}/profile/orders` : `${baseUrl}/tra-cuu?orderNumber=${orderNumber}`;
                
                const emailHtml = getOrderConfirmationEmailTemplate({
                    customerName: validatedData.customerName,
                    orderNumber: orderNumber,
                    items: cartItems.map(item => ({
                        name: item.product.name,
                        quantity: item.quantity,
                        price: Number(item.product.price) * item.quantity
                    })),
                    subtotal: subtotal,
                    shippingFee: shippingFee,
                    total: total,
                    shippingAddress: `${validatedData.customerName}, ${validatedData.customerPhone}, ${validatedData.shippingAddress}${validatedData.shippingWard ? `, ${validatedData.shippingWard}` : ''}, ${validatedData.shippingDistrict}, ${validatedData.shippingCity}`,
                    paymentMethod: validatedData.paymentMethod,
                    orderUrl
                });

                const emailSubject = `Xác nhận đơn hàng #${orderNumber} - OtakuShop`;

                // Xác định email để gửi
                // 1. Nếu user đã verified -> gửi đến email tài khoản
                // 2. Nếu có customerEmail -> gửi đến customerEmail
                // 3. Nếu có notificationEmail và khác -> gửi thêm
                
                const emailsToSend: string[] = [];

                // Email chính của user đã verified
                if (fullOrder.user?.emailVerified && fullOrder.user.email) {
                    emailsToSend.push(fullOrder.user.email);
                }

                // Email khách hàng nhập (nếu có và chưa có trong list)
                if (validatedData.customerEmail && !emailsToSend.includes(validatedData.customerEmail)) {
                    emailsToSend.push(validatedData.customerEmail);
                }

                // Notification email (nếu có và chưa có trong list)
                if (validatedData.notificationEmail && !emailsToSend.includes(validatedData.notificationEmail)) {
                    emailsToSend.push(validatedData.notificationEmail);
                }

                // Gửi email đến tất cả địa chỉ
                for (const email of emailsToSend) {
                    const sent = await sendEmail({
                        to: email,
                        subject: emailSubject,
                        html: emailHtml
                    });
                    if (sent) {
                        console.log(`[EMAIL] Order confirmation sent to ${email} for order #${orderNumber}`);
                    } else {
                        console.error(`[EMAIL] Failed to send order confirmation to ${email}`);
                    }
                }
            } catch (emailError) {
                // Don't fail the order if email fails
                console.error('[EMAIL] Failed to send order confirmation email:', emailError);
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Đặt hàng thành công',
                data: {
                    order: fullOrder,
                    orderNumber: result.order.orderNumber
                }
            },
            { status: 201 }
        );

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.issues[0].message
                },
                { status: 400 }
            );
        }

        console.error('Guest order creation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể tạo đơn hàng. Vui lòng thử lại.'
            },
            { status: 500 }
        );
    }
}
