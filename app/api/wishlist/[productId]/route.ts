import { NextRequest, NextResponse } from 'next/server'
import { prisma } from  '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// DELETE /api/wishlist/[productId] - Xóa sản phẩm khỏi wishlist

export async function DELETE(
    request: NextRequest,
    { params }: { params: { productId: string } }
) {
    try {
        // 1 Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized'
                },
                { status: 401 }
            )
        }

        // 2 find wishlist item
        const wishlistItem = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: user.userId,
                    productId: params.productId
                }
            }
        })

        if (!wishlistItem) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Item not found in wishlist'
                },
                { status: 404 }
            )
        }

        // 3 Delete wishlist item
        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId: user.userId,
                    productId: params.productId
                }
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Remove from wishlist'
            }
        )
    } catch (error) {
        console.error('Remove from wishlist error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to remove from wishlist'
            },
            { status: 500 }
        )
    }
}