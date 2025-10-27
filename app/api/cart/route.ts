import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'
import { get } from 'http'

// ==========================================
// POST /api/cart - Add to cart
// ==========================================

const addToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be a positive number')
})

// POST /api/cart - Thêm sản phẩm vào giỏ hàng
export async function POST(request: NextRequest) {
})

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
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

        // 4 Check stock availability
        if (product.stockQuantity < quantity) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Only ${product.stockQuantity} items left in stock`
                },
                { status: 400 }
            )
        }

        // 5 Check if iteam already in cart
        const existingCartItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId: user.userId,
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
                        error: `Cannot add ${quantity} more. Only ${product.stockQuantity - existingCartItem.quantity} items left in stock`
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
                    userId: user.userId,
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
                message: existingCartItem ? 'Cart updated' : 'Added to cart',
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
                error: 'Failed to add item to cart'
            },
            { status: 500 }
        )
    }
}

// GET /api/cart - Get cart items
export async function GET(request: NextRequest) {
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

        // 2 Get cart items
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
                error: 'Failed to get cart'
            },
            { status: 500 }
        )
    }
}

// DELETE /api/cart - Clear all cart items
export async function DELETE(request: NextRequest) {
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

        // 2 Delete all cart items
        const result = await prisma.cartItem.deleteMany({
            where: {
                userId: user.userId
            }
        })

        return NextResponse.json({
            success: true,
            message: `Cleared ${result.count} items from cart`
        })
    }
    catch (error) {
        console.error('Clear cart error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to clear cart'
            },
            { status: 500 }
        )
    }
}