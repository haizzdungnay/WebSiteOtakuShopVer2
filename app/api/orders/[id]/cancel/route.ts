import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// Validation schema
const cancelOrderSchema = z.object({
    reason: z.string()
    .max(500, 'Too long')
    .optional()
})

// PUT /api/orders/[id]/cancel - Hủy đơn hàng
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Get params (Next.js 16+ requires await)
        const { id } = await params

        // 1 Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Please login to cancel order'
                },
                { status: 401 }
            )
        }

        // 2 Validate input
        const body = await request.json()
        const validatedData = cancelOrderSchema.parse(body)

        // 3 Lấy đơn hàng
        const order = await prisma.order.findUnique({
            where: {
                id
            },
            include: {
                orderItems: {
                    select: {
                        productId: true,
                        quantity: true
                    }
                },
                payment: true
            }
        })

        // 4 Kiểm tra đơn hàng có tồn tại
        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Order not found'
                },
                { status: 404 }
            )
        }

        // 5 Kiem tra đơn hàng có thuộc về user
        if (order.userId !== user.userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized to cancel this order'
                },
                { status: 403 }
            )
        }

        // 6 Kiểm tra trạng thái đơn hàng có thể hủy
        const cancellableStatuses = ['PENDING', 'CONFIRMED', 'PREPARING']

        if (!cancellableStatuses.includes(order.status)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Cannot cancel order with status ${order.status}. Only orders with status ${cancellableStatuses.join(', ')} can be canceled.`
                },
                { status: 400 }
            )
        }

        // 7 Kiểm tra nếu đã hủy rồi
        if (order.status === 'CANCELLED') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Order is already cancelled'
                },
                { status: 400 }
            )
        }

        // 8 Hủy order trong transaction
        const cancelledOrder = await prisma.$transaction(async (tx) => {
            // 8.1 Restore stock cho các sản phẩm
            for (const item of order.orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQuantity: {
                            increment: item.quantity
                        }
                    }
                })
            }

            // 8.2 Giảm usage count của coupon nếu có
            if (order.couponId) {
                await tx.coupon.update({
                    where: { id: order.couponId },
                    data: {
                        usedCount: {
                            decrement: 1
                        }
                    }
                })
            }

            // 8.3 Update payment status nếu đã thanh toán
            if (order.payment && order.payment.status === 'COMPLETED') {
                await tx.payment.update({
                    where: { id: order.payment.id },
                    data: {
                        status: 'REFUNDED'
                    }
                })
            }

            // 8.4 Update order status
            return await tx.order.update({
                where: { id: params.id },
                data: {
                    status: 'CANCELLED',
                    note: validatedData.reason 
                        ? `${order.note ? order.note + '\n' : ''}Lý do hủy: ${validatedData.reason}`
                        : order.note
                }
            })
        })

        // 9 Return success response
        return NextResponse.json({
            success: true,
            message: 'Order cancelled successfully',
            data: {
                orderId: cancelledOrder.id,
                orderNumber: cancelledOrder.orderNumber,
                status: cancelledOrder.status,
                cancelledAt: cancelledOrder.updatedAt, // Thời điểm hủy
                cancelReason: validatedData.reason || null
            }
        })

    } catch (error) {
        // Xử lý Zod validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.issues[0].message
                },
                { status: 400 }
            )
        }

        console.error('Cancel order error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to cancel order. Please try again.'
            },
            { status: 500 }
        )
    }
}