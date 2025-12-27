import { NextResponse, NextRequest } from "next/server"
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from "@/lib/auth"

// DELETE /api/wishlist/[id] - Xóa sản phẩm khỏi wishlist
// id ở đây là productId
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
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

        const productId = params.id

        // Xóa dựa trên userId và productId
        const deleted = await prisma.wishlist.deleteMany({
            where: {
                userId: user.userId,
                productId: productId
            }
        })

        if (deleted.count === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Sản phẩm không có trong danh sách yêu thích'
                },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Đã xóa khỏi danh sách yêu thích'
        })

    } catch (error) {
        console.error('Delete wishlist error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Lỗi server'
            },
            { status: 500 }
        )
    }
}
