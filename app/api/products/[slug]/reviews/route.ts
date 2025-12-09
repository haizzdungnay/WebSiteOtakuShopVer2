import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ==========================================
// GET /api/products/[slug]/reviews
// Lấy danh sách review của sản phẩm theo slug
// ==========================================

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        // 1. Get query parameters
        const { searchParams } = new URL(request.url)
        const rating = searchParams.get('rating')
        const sort = searchParams.get('sort') || 'recent' // recent, rating_high, rating_low
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        // 2. Find product
        const product = await prisma.product.findUnique({
            where: { slug: params.slug },
            select: { 
                id: true, 
                name: true, 
                averageRating: true 
            }
        })

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy sản phẩm' },
                { status: 404 }
            )
        }

        // 3. Build where clause
        const where: any = {
            productId: product.id
        }

        if (rating) {
            where.rating = parseInt(rating)
        }

        // 4. Build orderBy clause
        let orderBy: any = {}
        
        switch (sort) {
            case 'recent':
                orderBy = { createdAt: 'desc' }
                break
            case 'rating_high':
                orderBy = { rating: 'desc' }
                break
            case 'rating_low':
                orderBy = { rating: 'asc' }
                break
            default:
                orderBy = { createdAt: 'desc' }
        }

        // 5. Get reviews
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true
                        }
                    }
                },
                orderBy,
                skip,
                take: limit
            }),
            prisma.review.count({ where })
        ])

        // 6. Format reviews
        const reviewsData = reviews.map(review => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            images: review.images,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            user: {
                id: review.user.id,
                name: review.user.fullName
            }
        }))

        // 7. Calculate rating distribution
        const ratingDistribution = await prisma.review.groupBy({
            by: ['rating'],
            where: { productId: product.id },
            _count: { rating: true }
        })

        const distribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        }

        ratingDistribution.forEach(item => {
            distribution[item.rating as keyof typeof distribution] = item._count.rating
        })

        return NextResponse.json({
            success: true,
            data: {
                product: {
                    id: product.id,
                    name: product.name,
                    averageRating: product.averageRating,
                    totalReviews: total
                },
                ratingDistribution: distribution,
                reviews: reviewsData,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        })

    } catch (error) {
        console.error('Get product reviews error:', error)
        return NextResponse.json(
            { success: false, error: 'Không thể lấy danh sách đánh giá. Vui lòng thử lại' },
            { status: 500 }
        )
    }
}