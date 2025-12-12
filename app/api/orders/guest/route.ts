import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateOrderNumber } from '@/lib/order-helpers'

// Validation schema cho guest checkout
const guestOrderSchema = z.object({
    // Thông tin khách hàng
    customerName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    customerPhone: z.string().min(10, 'Số điện thoại không hợp lệ'),
    customerEmail: z.string().email('Email không hợp lệ').optional().or(z.literal('')),

    // Địa chỉ giao hàng
    shippingAddress: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
    shippingWard: z.string().optional(),
    shippingDistrict: z.string().min(1, 'Vui lòng nhập quận/huyện'),
    shippingCity: z.string().min(1, 'Vui lòng nhập thành phố'),

    // Items
    items: z.array(z.object({
        productId: z.string().min(1),
        quantity: z.number().min(1)
    })).min(1, 'Giỏ hàng không được trống'),

    // Phương thức thanh toán
    paymentMethod: z.enum(['COD', 'BANK_TRANSFER']).default('COD'),

    // Ghi chú
    note: z.string().max(500).optional()
})

// POST /api/orders/guest - Tạo đơn hàng cho khách (không cần đăng nhập)
export async function POST(request: NextRequest) {
    try {
        // 1. Validate input
        const body = await request.json()
        const validationResult = guestOrderSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Dữ liệu không hợp lệ',
                    details: validationResult.error.flatten().fieldErrors
                },
                { status: 400 }
            )
        }

        const data = validationResult.data

        // 2. Lấy thông tin sản phẩm và validate
        const productIds = data.items.map(item => item.productId)
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                isActive: true
            },
            select: {
                id: true,
                name: true,
                price: true,
                stockQuantity: true
            }
        })

        // 3. Kiểm tra sản phẩm có tồn tại không
        if (products.length !== productIds.length) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Một số sản phẩm không tồn tại hoặc đã ngừng bán'
                },
                { status: 400 }
            )
        }

        // 4. Kiểm tra tồn kho
        const stockErrors: string[] = []
        for (const item of data.items) {
            const product = products.find(p => p.id === item.productId)
            if (product && product.stockQuantity < item.quantity) {
                stockErrors.push(`Sản phẩm "${product.name}" chỉ còn ${product.stockQuantity} sản phẩm`)
            }
        }

        if (stockErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không đủ hàng tồn kho',
                    details: stockErrors
                },
                { status: 400 }
            )
        }

        // 5. Tính tổng tiền
        let subtotal = 0
        for (const item of data.items) {
            const product = products.find(p => p.id === item.productId)
            if (product) {
                subtotal += Number(product.price) * item.quantity
            }
        }

        // 6. Tính phí ship (đơn giản)
        const shippingFee = subtotal >= 500000 ? 0 : 30000 // Free ship đơn >= 500k
        const totalAmount = subtotal + shippingFee

        // 7. Tạo mã đơn hàng
        const orderNumber = await generateOrderNumber()

        // 8. Transaction để tạo đơn hàng
        const order = await prisma.$transaction(async (tx) => {
            // Tạo đơn hàng
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    userId: null, // Guest order

                    customerName: data.customerName,
                    customerEmail: data.customerEmail || null,
                    customerPhone: data.customerPhone,

                    shippingFullName: data.customerName,
                    shippingPhone: data.customerPhone,
                    shippingAddress: data.shippingAddress,
                    shippingWard: data.shippingWard || null,
                    shippingDistrict: data.shippingDistrict,
                    shippingCity: data.shippingCity,

                    totalAmount: totalAmount,
                    status: 'PENDING',
                    note: data.note || null,
                },
                include: {
                    orderItems: true
                }
            })

            // Tạo order items
            for (const item of data.items) {
                const product = products.find(p => p.id === item.productId)!
                await tx.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: Number(product.price)
                    }
                })
            }

            // Giảm tồn kho
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQuantity: { decrement: item.quantity }
                    }
                })
            }

            // Tạo payment record
            await tx.payment.create({
                data: {
                    orderId: newOrder.id,
                    method: data.paymentMethod,
                    amount: totalAmount,
                    status: 'PENDING'
                }
            })

            // Tạo shipping record
            await tx.shipping.create({
                data: {
                    orderId: newOrder.id,
                    carrier: 'GHN',
                    fee: shippingFee,
                    status: 'PREPARING'
                }
            })

            return newOrder
        })

        // 9. Trả về kết quả
        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                status: order.status,
                message: 'Đặt hàng thành công!'
            }
        }, { status: 201 })

    } catch (error) {
        console.error('[Guest Order] Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể tạo đơn hàng. Vui lòng thử lại sau.'
            },
            { status: 500 }
        )
    }
}
