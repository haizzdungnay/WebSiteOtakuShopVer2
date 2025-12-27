import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// Validation schema

const updateReviewSchema = z.object({
    rating: z.number().min(1).max(5).optional(),
    title: z.string().min(5).max(100).optional(),
    comment: z.string().min(10).max(1000).optional(),
    images: z.array(z.string().url()).max(5).optional()
})

// GET /api/reviews/[id] - Lấy thông tin đánh giá
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const review = await prisma.review.findUnique({
            where: { id: id },
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
            }
        })

        if (!review) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy đánh giá' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: review
        })

    } catch (error) {
        console.error('Get review error:', error)
        return NextResponse.json(
            { success: false, error: 'Không thể lấy thông tin đánh giá. Vui lòng thử lại' },
            { status: 500 }
        )
    }
}

// PUT /api/reviews/[id] - Cập nhật đánh giá
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        // 1 Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng đăng nhập'
                },
                { status: 401 }
            )
        }

        // 2 Lấy đánh giá
        const review = await prisma.review.findUnique({
            where: {
                id: id
            },
            select: {
                userId: true,
                productId: true
            }
        })

        if (!review) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy đánh giá'
                },
                { status: 404 }
            )
        }

        // 3 Kiểm tra quyền sở hữu
        if (review.userId !== user.userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Bạn không có quyền chỉnh sửa đánh giá này'
                },
                { status: 403 }
            )
        }

        // 4 Validate input
        const body = await request.json()
        const validatedData = updateReviewSchema.parse(body)

        // 5. Update review in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update review
            const updatedReview = await tx.review.update({
                where: { id: id },
                data: validatedData,
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

            // If rating changed, recalculate product rating
            if (validatedData.rating !== undefined) {
                const reviews = await tx.review.findMany({
                    where: { productId: review.productId },
                    select: { rating: true }
                })

                const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
                const averageRating = totalRating / reviews.length

                await tx.product.update({
                    where: { id: review.productId },
                    data: { averageRating: averageRating }
                })
            }

            return updatedReview
        })

        return NextResponse.json({
            success: true,
            message: 'Cập nhật đánh giá thành công',
            data: result
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Update review error:', error)
        return NextResponse.json(
            { success: false, error: 'Không thể cập nhật đánh giá. Vui lòng thử lại' },
            { status: 500 }
        )
    }
}

// DELETE /api/reviews/[id] - Xóa đánh giá
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        // 1. Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập' },
                { status: 401 }
            )
        }

        // 2. Lấy đánh giá
        const review = await prisma.review.findUnique({
            where: { id: id },
            select: {
                userId: true,
                productId: true
            }
        })

        if (!review) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy đánh giá' },
                { status: 404 }
            )
        }

        // 3. Kiểm tra quyền sở hữu
        if (review.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Bạn không có quyền xóa đánh giá này' },
                { status: 403 }
            )
        }

        // 4. Xóa đánh giá và cập nhật rating
        await prisma.$transaction(async (tx) => {
            // Xóa đánh giá
            await tx.review.delete({
                where: { id: id }
            })

            // Tính lại rating của sản phẩm
            const reviews = await tx.review.findMany({
                where: { productId: review.productId },
                select: { rating: true }
            })

            const averageRating = reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0

            await tx.product.update({
                where: { id: review.productId },
                data: { averageRating }
            })
        })

        return NextResponse.json({
            success: true,
            message: 'Xóa đánh giá thành công'
        })

    } catch (error) {
        console.error('Delete review error:', error)
        return NextResponse.json(
            { success: false, error: 'Không thể xóa đánh giá. Vui lòng thử lại' },
            { status: 500 }
        )
    }
}