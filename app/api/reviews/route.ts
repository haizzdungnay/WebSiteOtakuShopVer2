import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// Validation schema

const createReviewSchema = z.object({
    productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
    rating: z.number()
        .min(1, 'Đánh giá thấp nhất là 1 sao')
        .max(5, 'Đánh giá cao nhất là 5 sao'),
    title: z.string()
        .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
        .max(100, 'Tiêu đề quá dài (tối đa 100 ký tự)'),
    comment: z.string()
        .min(10, 'Nội dung đánh giá phải có ít nhất 10 ký tự')
        .max(1000, 'Nội dung quá dài (tối đa 1000 ký tự)'),
    images: z.array(z.string().url('Link ảnh không hợp lệ')).max(5, 'Tối đa 5 ảnh').optional()
})

// POST /api/reviews - Tạo đánh giá cho sản phẩm
export async function POST(request: NextRequest) {
    try {
        // 1 Check authentication
        const user = getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng đăng nhập để đánh giá sản phẩm'
                },
                { status: 401 }
            )
        }

        // 2 Validate input
        const body = await request.json()
        const validatedData = createReviewSchema.parse(body)

        // 3 Kiểm tra sản phẩm có tồn tại và đang hoạt động không
        const product = await prisma.product.findUnique({
            where: {
                id: validatedData.productId
            },
            select: {
                id: true,
                name: true,
                isActive: true
            }
        })

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy sản phẩm'
                },
                { status: 404 }
            )
        }

        if (!product.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không thể đánh giá sản phẩm không còn bán'
                },
                { status: 400 }
            )
        }

        // 4 Kiểm tra người dùng đã mua sản phẩm chưa
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId: validatedData.productId,
                order: {
                    userId: user.userId,
                    status: {
                        in: ['DELIVERED', 'COMPLETED']
                    }
                }
            }
        })

        if (!hasPurchased) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Chỉ có thể đánh giá sản phẩm khi đã mua hoặc đã nhận hàng'
                },
                { status: 403 }
            )
        }

        // 5 Kiểm tra người dùng đã đánh giá sản phẩm chưa
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: user.userId,
                productId: validatedData.productId
            }
        })

        if (existingReview) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Bạn đã đánh giá sản phẩm này rồi'
                },
                { status: 400 }
            )
        }

        // 6 Tạo đánh giá mới
        const result = await prisma.$transaction(async (tx) => {
            // 6.1 Tạo review
            const review = await tx.review.create({
                data: {
                    userId: user.userId,
                    productId: validatedData.productId,
                    rating: validatedData.rating,
                    title: validatedData.title,
                    comment: validatedData.comment,
                    images: validatedData.images
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                }
            })

            // 6.2 Cập nhật lại rating trung bình cho sản phẩm
            const reviews = await tx.review.findMany({
                where: {
                    productId: validatedData.productId
                },
                select: {
                    rating: true
                }
            })

            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
            const averageRating = totalRating / reviews.length

            await tx.product.update({
                where: {
                    id: validatedData.productId
                },
                data: {
                    averageRating: averageRating,
                    reviewCount: reviews.length
                }
            })

            return review
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Tạo đánh giá thành công',
                data: result
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

        console.error('Tạo đánh giá thất bại:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Tạo đánh giá thất bại. Vui lòng thử lại sau'
            },
            { status: 500 }
        )
    }
}

// GET /api/reviews?productId= - Lấy danh sách đánh giá của sản phẩm

export async function GET(request: NextRequest) {
    try {
        // 1 Lấy productId từ query
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')
        const rating = searchParams.get('rating')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        // 2 Xây dựng điều kiện lọc
        const where: any ={}

        if (productId) {
            where.productId = productId
        }

        if (rating) {
            where.rating = parseInt(rating)
        }

        // 3 Lấy đánh giá và phân trang
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            images: true
                        }
                    }
                },
                orderBy: [
                    { createdAt: 'desc' }
                ],
                skip,
                take: limit
            }),
            prisma.review.count({ where })
        ])

        // 4 Return response
        return NextResponse.json({
            success: true,
            message: 'Lấy danh sách đánh giá thành công',
            data: reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('Get reviews error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể lấy danh sách đánh giá'
            },
            { status: 500 }
        )
    }
}