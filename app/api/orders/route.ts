import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'
import {
    generateOrderNumber,
    validateStock,
    validateCoupon,
    calculateDiscount,
    calculateShippingFee
} from '@/lib/order-helpers'

// Validation schema cho tạo đơn hàng
const createOrderSchema = z.object({
    addressId: z.string().min(1, 'Address is required'),
    couponCode: z.string().optional(),
    paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'MOMO', 'VNPAY', 'ZALOPAY', 'CREDIT_CARD'], {
        message: 'Invalid payment method'
    }),
    notes: z.string().max(500).optional()
})

// POST /api/orders - Tạo đơn hàng mới
export async function POST(request: NextRequest) {
    try {
        // 1 Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng đăng nhập để đặt hàng'
                },
                { status: 401 }
            )
        }

        // 2 Validate input
        const body = await request.json()
        const validatedData = createOrderSchema.parse(body)

        // 3 Lấy giỏ hàng với thông tin sản phẩm
        const cartItems = await prisma.cartItem.findMany({
            where: {
                userId: user.userId
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        price: true,
                        stockQuantity: true,
                        isActive: true,
                        images: true
                    }
                }
            }
        })

        // 4 Kiểm tra giỏ hàng có sản phẩm không
        if (cartItems.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Giỏ hàng của bạn đang trống'
                },
                { status: 400 }
            )
        }

        // 5 Validate hàng tồn kho
        const stockValidation = await validateStock(
            cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        )

        if (!stockValidation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Một số sản phẩm đã hết hàng',
                    details: stockValidation.errors
                },
                { status: 400 }
            )
        }

        // 6 Lấy và validate địa chỉ giao hàng
        const address = await prisma.address.findUnique({
            where: {
                id: validatedData.addressId
            }
        })

        if (!address) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy địa chỉ giao hàng'
                },
                { status: 404 }
            )
        }

        // Kiểm tra địa chỉ có thuộc về user không
        if (address.userId !== user.userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Địa chỉ không hợp lệ'
                },
                { status: 401 }
            )
        }

        // 7 Tính tổng tiền hàng (convert Decimal to number)
        const subtotal = cartItems.reduce((sum, item) => {
            return sum + (Number(item.product.price) * item.quantity)
        }, 0)

        // 8 Tính phí vận chuyển
        const shippingFee = calculateShippingFee(address.city, address.district)

        // 9 Validate và tính giảm giá từ coupon nếu có
        let couponData = null
        let discountAmount = 0

        if (validatedData.couponCode) {
            const couponValidation = await validateCoupon(
                validatedData.couponCode,
                user.userId,
                subtotal
            )

            if (!couponValidation.isValid) {
                return NextResponse.json(
                    {
                        success: false,
                        error: couponValidation.error
                    },
                    { status: 400 }
                )
            }

            couponData = couponValidation.coupon!
            discountAmount = calculateDiscount(subtotal, couponData)
        }

        // 10 Tính tổng đơn hàng
        const total = subtotal + shippingFee - discountAmount

        // 11 Tạo mã đơn hàng
        const orderNumber = await generateOrderNumber()

        // 12 Tạo giao dịch và đơn hàng trong transaction
        const result = await prisma.$transaction(async (tx) => {
            // Tạo đơn hàng
            const order = await tx.order.create({
                data: {
                    orderNumber: orderNumber,
                    userId: user.userId,

                    // Thông tin khách hàng (snapshot)
                    customerName: address.fullName,
                    customerEmail: user.email,
                    customerPhone: address.phone,

                    // Địa chỉ giao hàng (snapshot)
                    shippingFullName: address.fullName,
                    shippingPhone: address.phone,
                    shippingAddress: address.address,
                    shippingWard: address.ward,
                    shippingDistrict: address.district,
                    shippingCity: address.city,

                    // Tổng tiền
                    totalAmount: total,

                    // Trạng thái
                    status: 'PENDING',

                    // Ghi chú
                    note: validatedData.notes || null,

                    // Relations
                    addressId: address.id,
                    couponId: couponData?.id || null
                }
            })

            // Tạo các mục đơn hàng
            const orderItems = await Promise.all(
                cartItems.map(item => {
                    return tx.orderItem.create({
                        data: {
                            orderId: order.id,
                            productId: item.productId,
                            quantity: item.quantity,
                            price: Number(item.product.price)
                        }
                    })
                })
            )

            // Update tồn kho sản phẩm
            await Promise.all(
                cartItems.map(item =>
                    tx.product.update({
                        where: {
                            id: item.productId
                        },
                        data: {
                            stockQuantity: {
                                decrement: item.quantity
                            }
                        }
                    })
                )
            )

            // Tạo bản ghi giao dịch thanh toán
            const payment = await tx.payment.create({
                data: {
                    orderId: order.id,
                    method: validatedData.paymentMethod,
                    amount: total,
                    status: 'PENDING'
                }
            })

            // Tạo bản ghi vận chuyển
            const shipping = await tx.shipping.create({
                data: {
                    orderId: order.id,
                    carrier: 'GHN', // Default carrier
                    fee: shippingFee,
                    status: 'PREPARING'
                }
            })

            // Cập nhật số lần sử dụng coupon
            if (couponData) {
                await tx.coupon.update({
                    where: { id: couponData.id },
                    data: {
                        usedCount: { increment: 1 }
                    }
                })
            }

            // Xoá giỏ hàng của user
            await tx.cartItem.deleteMany({
                where: { userId: user.userId }
            })

            // Trả về tất cả dữ liệu
            return {
                order,
                orderItems,
                payment,
                shipping
            }
        })

        // 13 Fetch order với full details
        const fullOrder = await prisma.order.findUnique({
            where: {
                id: result.order.id
            },
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
        })

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
        )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.issues[0].message
                },
                { status: 400 }
            )
        }

        console.error('Create order error', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể tạo đơn hàng. Vui lòng thử lại'
            },
            { status: 500 }
        )
    }
}

// GET /api/orders - Lấy danh sách đơn hàng của user
export async function GET(request: NextRequest) {
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

        // 2 Get query parameters
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        // 3 Build where clause
        const  where: any = {
            userId: user.userId
        }

        if (status) {
            where.status = status
        }

        // 4 Lấy danh sách đơn hàng với phân trang
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
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
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.order.count({ where })
        ])

        return NextResponse.json({
            success: true,
            message: 'Lấy danh sách đơn hàng thành công',
            data: orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Get orders error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể lấy danh sách đơn hàng'
            },
            { status: 500 }
        )
    }
}