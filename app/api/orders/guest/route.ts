import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    customerEmail: z.string().email().optional(),
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
    note: z.string().max(500).optional()
});

export async function POST(request: NextRequest) {
    try {
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
                    userId: null, // Guest order

                    // Customer info
                    customerName: validatedData.customerName,
                    customerEmail: validatedData.customerEmail || null,
                    customerPhone: validatedData.customerPhone,

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
                    note: validatedData.note || null,
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
                shipping: true
            }
        });

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
