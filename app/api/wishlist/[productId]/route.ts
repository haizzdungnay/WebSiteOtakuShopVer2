import { NextRequest, NextResponse } from 'next/server'
import { prisma } from  '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// DELETE /api/wishlist/[productId] - Xóa sản phẩm khỏi wishlist

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;
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

        // 2 find wishlist item
        const wishlistItem = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: user.userId,
                    productId: productId
                }
            }
        })

        if (!wishlistItem) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy sản phẩm trong danh sách yêu thích'
                },
                { status: 404 }
            )
        }

        // 3 Delete wishlist item
        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId: user.userId,
                    productId: productId
                }
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Đã xóa khỏi danh sách yêu thích'
            }
        )
    } catch (error) {
        console.error('Remove from wishlist error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể xóa khỏi danh sách yêu thích'
            },
            { status: 500 }
        )
    }
}