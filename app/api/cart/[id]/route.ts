import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const updateQuantitySchema = z.object({
    quantity: z.number().int().positive('Số lượng phải lớn hơn 0')
})

// PATCH /api/cart/[id] - Update cart item quantity
export async function PATCH(
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
                    error: 'Vui lòng đăng nhập'
                },
                { status: 401 }
            )
        }

        // 2 Validate input
        const body = await request.json()
        const { quantity } = updateQuantitySchema.parse(body)

        // 3 Find cart item
        const cartItem = await prisma.cartItem.findUnique({
            where: {
                id: params.id
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        stockQuantity: true,
                        isActive: true
                    }
                }
            }
        })

        if (!cartItem) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy sản phẩm trong giỏ hàng'
                },
                { status: 404 }
            )
        }

        // 5 Check product still active
        if (!cartItem.product.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Sản phẩm này không còn bán'
                },
                { status: 404 }
            )
        }

        // 6 Check stock availability
        if (cartItem.product.stockQuantity < quantity) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Chỉ còn ${cartItem.product.stockQuantity} sản phẩm trong kho`
                },
                { status: 400 }
            )
        }

        // 7 Update cart item quantity
        const updatedCartItem = await prisma.cartItem.update({
            where: {
                id: params.id
            },
            data: {
                quantity
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
                        stockQuantity: true
                    }
                }
            }
        })

        return NextResponse.json({
                success: true,
                message: 'Đã cập nhật giỏ hàng',
                data: updatedCartItem
            })
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

        console.error('Update cart items error', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể cập nhật giỏ hàng'
            },
            { status: 500 }
        )
    }
}

// DELETE /api/cart/[id] - Remove item
export async function DELETE(
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
                    error: 'Vui lòng đăng nhập'
                },
                { status: 401 }
            )
        }

        // 2 Find cart item
        const cartItem = await prisma.cartItem.findUnique({
            where: {
                id: params.id
            }
        })

        if (!cartItem) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy sản phẩm trong giỏ hàng'
                },
                { status: 404 }
            )
        }

        // 3 Check ownership
        if (cartItem.userId !== user.userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không có quyền thực hiện'
                },
                { status: 403 }
            )
        }

        // 4 Delete item
        await prisma.cartItem.delete({
            where: { id: params.id }
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Đã xóa sản phẩm khỏi giỏ hàng'
            }
        )
    } catch (error) {
        console.error('Remove from cart error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể xóa sản phẩm'
            },
            { status: 500 }
        )
    }
}