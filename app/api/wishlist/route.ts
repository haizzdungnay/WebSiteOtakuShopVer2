import { NextResponse, NextRequest } from "next/server"
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from "@/lib/auth"
import { z } from 'zod'

// POST /api/wishlist - Thêm sản phẩm vào wishlist

const addToWishlistSchema = z.object({
    productId: z.string().min(1, 'Product ID is required')
})

export async function POST(request: NextRequest) {
    try {
        // 1 Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'Please login to add items to wishlist'
            },
                { status: 401 }
            )
        }

        // 2 Validate input
        const body = await request.json()
        const  { productId } = addToWishlistSchema.parse(body)

        // 3 Check product exist and is active
        const product = await prisma.product.findUnique({
            where: { id: productId
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
                    error: 'Product not found'
                },
                { status: 404 }
            )
        }

        if (!product.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Product is not available'
                },
                { status: 400 }
            )
        }

        // 4 Check product đã có trong wishlist chưa
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: user.userId,
                    productId: product.id
                }
            }
        })

        if (existing) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Product already in wishlist'
                },
                { status: 400 }
            )
        }

        // 5 thêm sản phẩm vào wishlist
        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId: user.userId,
                productId: productId
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        price: true,
                        comparePrice: true,
                        images: true,
                        averageRating: true,
                        reviewCount: true
                    }
                }
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Added to wishlist'
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

        console.error('Add to wishlist error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to add to wishlist'
            },
                { status: 500 }
        )
    }
}

// GET /api/wishlist - Lấy danh sách sản phẩm trong wishlist của user
export async function GET(request: NextRequest) {
    try {
        // 1 Check authentication
        const user = getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                {
                success: false,
                error: 'Please login to view wishlist'
            },
            { status: 400 }
        )
        }

        // 2 Lấy danh sách sản phẩm trong wishlist
        const wishlistItems = await prisma.wishlist.findMany({
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
                        comparePrice: true,
                        images: true,
                        stockQuantity: true,
                        isActive: true,
                        averageRating: true,
                        reviewCount: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        }
                    }
                }
            },
            orderBy: { addedAt: 'desc' }
        })

        return NextResponse.json({
            success: true,
            data: wishlistItems,
            count: wishlistItems.length
        })

    } catch (error) {
        console.error('Get wishlist error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to get wishlist' 
            },
            { status: 500 }
        )

    }
}