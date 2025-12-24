import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const addToCartSchema = z.object({
    productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
    quantity: z.number().int().positive('Số lượng phải lớn hơn 0')
})

// POST /api/cart - Thêm sản phẩm vào giỏ hàng
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const userPayload = await getUserFromRequest(request)
        if (!userPayload) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng đăng nhập',
                },
                { status: 401 }
            )
        }

        // Verify user exists in database
        const user = await prisma.user.findUnique({
            where: { id: userPayload.userId },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
                },
                { status: 401 }
            )
        }

        // 2 Validate input
        const body = await request.json()
        const { productId, quantity } = addToCartSchema.parse(body)

        // 3 Check product exists and is active
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                stockQuantity: true,
                isActive: true,
                images: true
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
                    error: 'Sản phẩm này hiện không còn bán'
                },
                { status: 400 }
            )
        }

        // 4 Check stock availability
        if (product.stockQuantity < quantity) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Chỉ còn ${product.stockQuantity} sản phẩm trong kho`
                },
                { status: 400 }
            )
        }

        // 5 Check if iteam already in cart
        const existingCartItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId: userPayload.userId,
                    productId: productId
                }
            }
        })

        let cartItem

        if (existingCartItem) {
            // Update quantity if already in cart
            const newQuantity = existingCartItem.quantity + quantity

            // Check stock for new total quantity
            if (product.stockQuantity < newQuantity) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Không thể thêm ${quantity} sản phẩm. Chỉ còn ${product.stockQuantity - existingCartItem.quantity} sản phẩm trong kho`
                    },
                    { status: 400 }
                )
            }

            cartItem = await prisma.cartItem.update({
                where: {
                    id: existingCartItem.id
                },
                data: {
                    quantity: newQuantity
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
        } else {
            // tạo moi cart item
            cartItem = await prisma.cartItem.create({
                data: {
                    userId: userPayload.userId,
                    productId: productId,
                    quantity: quantity
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
        }

        return NextResponse.json(
            {
                success: true,
                message: existingCartItem ? 'Đã cập nhật giỏ hàng' : 'Đã thêm vào giỏ hàng',
                data: cartItem
            },
            { status: existingCartItem ? 200 : 201 }
        )

    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    sucess: false,
                    error: error.issues[0].message
                },
                { status: 400 }
            )
        }

        console.error('Error adding to cart:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể thêm sản phẩm vào giỏ hàng'
            },
            { status: 500 }
        )
    }
}

// GET /api/cart - Get cart items
export async function GET(request: NextRequest) {
    try {
        // 1 Check authentication
        const userPayload = await getUserFromRequest(request)
        if (!userPayload) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng đăng nhập'
                },
                { status: 401 }
            )
        }

        // 2 Get cart items
        const cartItems = await prisma.cartItem.findMany({
            where: {
                userId: userPayload.userId
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
                        isActive: true
                    }
                }
            },
            orderBy: { addedAt: 'desc' }
        })

        // 3 Calculate total price
        const totals = cartItems.reduce(
            (acc, item) => {
                const itemTotal = Number(item.product.price) * item.quantity
                return {
                    itemCount: acc.itemCount + item.quantity,
                    subtotal: acc.subtotal + itemTotal
                }
            },
            { itemCount: 0, subtotal: 0 }
        )

        return NextResponse.json({
            success: true,
            data: {
                items: cartItems,
                summary: {
                    itemCount: totals.itemCount,
                    subtotal: totals.subtotal,

                    // có thể thêm các phí khác như tax, shipping ở đây
                    total: totals.subtotal
                }
            }
        })
    }
    catch (error) {
        console.error('Get cart error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể lấy giỏ hàng'
            },
            { status: 500 }
        )
    }
}

// DELETE /api/cart - Clear all cart items
export async function DELETE(request: NextRequest) {
    try {
        // 1 Check authentication
        const userPayload = await getUserFromRequest(request)
        if (!userPayload) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng đăng nhập'
                },
                { status: 401 }
            )
        }

        // 2 Delete all cart items
        const result = await prisma.cartItem.deleteMany({
            where: {
                userId: userPayload.userId
            }
        })

        return NextResponse.json({
            success: true,
            message: `Đã xóa ${result.count} sản phẩm khỏi giỏ hàng`
        })
    }
    catch (error) {
        console.error('Clear cart error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể xóa giỏ hàng'
            },
            { status: 500 }
        )
    }
}