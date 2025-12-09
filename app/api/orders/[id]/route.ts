import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/orders/[id] - Lấy chi tiết đơn hàng theo ID

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 1 Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng đăng nhập để xem đơn hàng'
                },
                { status: 401 }
            )
        }

        // 2 Lấy đơn hàng với đầy đủ thông tin
        const order = await prisma.order.findUnique({
            where: {
                id: params.id
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                price: true,
                                images: true,
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                        slug: true
                                    }
                                }
                            }
                        }
                    }
                },
                payment: true,
                shipping: true,
                address: {
                    select: {
                        id: true,
                        label: true,
                        fullName: true,
                        phone: true,
                        address: true,
                        ward: true,
                        district: true,
                        city: true
                    }
                },
                coupon: {
                    select: {
                        id: true,
                        code: true,
                        type: true,
                        value: true
                    }
                }
            }
        })

        // 3 Kiểm tra nếu order đã tồn tại
        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy đơn hàng'
                },
                { status: 404 }
            )
        }

        // 4 Kiểm tra nếu user không phải chủ đơn hàng
        if (order.userId !== user.userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Bạn không có quyền xem đơn hàng này'
                },
                { status: 403 }
            )
        }

        // 5 Xây dựng timeline cho đơn hàng
        let timeline = [
            {
                status: 'PENDING',
                label: 'Đơn hàng đã đặt',
                timestamp: order.createdAt,
                completed: true,
                description: 'Đơn hàng của bạn đã được tiếp nhận'
            },
            {
                status: 'CONFIRMED',
                label: 'Đã xác nhận',
                timestamp: ['CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'COMPLETED'].includes(order.status)
                    ? order.updatedAt : null,
                completed: ['CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'COMPLETED'].includes(order.status),
                description: 'Đơn hàng đã được xác nhận'
            },
            {
                status: 'PREPARING',
                label: 'Đang chuẩn bị',
                timestamp: ['PREPARING', 'SHIPPING', 'DELIVERED', 'COMPLETED'].includes(order.status)
                    ? order.updatedAt : null,
                completed: ['PREPARING', 'SHIPPING', 'DELIVERED', 'COMPLETED'].includes(order.status),
                description: 'Đang đóng gói đơn hàng của bạn'
            },
            {
                status: 'SHIPPING',
                label: 'Đang giao hàng',
                timestamp: ['SHIPPING', 'DELIVERED', 'COMPLETED'].includes(order.status)
                    ? order.updatedAt : null,
                completed: ['SHIPPING', 'DELIVERED', 'COMPLETED'].includes(order.status),
                description: 'Đơn hàng đang trên đường giao đến bạn'
            },
            {
                status: 'DELIVERED',
                label: 'Đã giao hàng',
                timestamp: ['DELIVERED', 'COMPLETED'].includes(order.status)
                    ? order.updatedAt : null,
                completed: ['DELIVERED', 'COMPLETED'].includes(order.status),
                description: 'Đơn hàng đã được giao thành công'
            },
            {
                status: 'COMPLETED',
                label: 'Hoàn thành',
                timestamp: order.status === 'COMPLETED' ? order.updatedAt : null,
                completed: order.status === 'COMPLETED',
                description: 'Đơn hàng đã hoàn tất'
            }
        ]

        // Handle cancelled status - thay thế timeline nếu đơn hàng bị hủy
        if (order.status === 'CANCELLED') {
            timeline = [
                {
                    status: 'PENDING',
                    label: 'Đơn hàng đã đặt',
                    timestamp: order.createdAt,
                    completed: true,
                    description: 'Đơn hàng của bạn đã được tiếp nhận'
                },
                {
                    status: 'CANCELLED',
                    label: 'Đơn hàng đã hủy',
                    timestamp: order.updatedAt,
                    completed: true,
                    description: 'Đơn hàng đã bị hủy'
                }
            ]
        }

        // 6 Trả về response với đầy đủ thông tin
        return NextResponse.json({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            
            // Thông tin khách hàng
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            
            // Thông tin giao hàng
            shippingAddress: {
                fullName: order.shippingFullName,
                phone: order.shippingPhone,
                address: order.shippingAddress,
                ward: order.shippingWard,
                district: order.shippingDistrict,
                city: order.shippingCity
            },
            
            // Chi tiết đơn hàng
            items: order.orderItems.map(item => ({
                id: item.id,
                productId: item.productId,
                productName: item.product.name,
                productImage: item.product.images[0],
                quantity: item.quantity,
                price: item.price.toNumber(),
                total: item.price.toNumber() * item.quantity
            })),
            
            // Tài chính
            totalAmount: order.totalAmount.toNumber(),
            
            // Payment & shipping
            payment: order.payment,
            shipping: order.shipping,
            
            // Mã giảm giá nếu có
            coupon: order.coupon ? {
                code: order.coupon.code,
                discount: order.coupon.type === 'PERCENTAGE' 
                    ? `${order.coupon.value}%`
                    : `${order.coupon.value.toNumber()}đ`
            } : null,
            
            // Ghi chú
            note: order.note,
            
            // Timeline
            timeline,
            
            // Timestamps
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        })

    } catch (error) {
        console.error('Error fetching order:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể lấy thông tin đơn hàng'
            },
            { status: 500 }
        )
    }
}