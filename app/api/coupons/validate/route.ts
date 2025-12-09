import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'
import { validateCoupon, calculateDiscount } from '@/lib/order-helpers'

// Validation schema 
const validateCouponSchema = z.object({
    code: z.string()
        .min(1, 'Vui lòng nhập mã giảm giá')
        .max(50, 'Mã giảm giá quá dài')
        .transform((val) => val.trim().toUpperCase()),
    subtotal: z.number()
        .min(0, 'Tổng tiền không hợp lệ')
        .optional()
})

// POST /api/coupons/validate - Validate coupon code và tính toán giảm giá
export async function POST(request: NextRequest) {
    try {
        // 1. Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng đăng nhập để sử dụng mã giảm giá'
                },
                { status: 401 }
            )
        }

        // 2. Validate input
        const body = await request.json()
        const validatedData = validateCouponSchema.parse(body)

        // 3. Nếu subtotal không được cung cấp, lấy subtotal từ giỏ hàng của user
        let subtotal = validatedData.subtotal || 0

        if (!validatedData.subtotal) {
            const cartItems = await prisma.cartItem.findMany({
                where: {
                    userId: user.userId
                },
                include: {
                    product: {
                        select: {
                            price: true
                        }
                    }
                }
            })

            if (cartItems.length === 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Giỏ hàng của bạn đang trống'
                    },
                    { status: 400 }
                )
            }

            subtotal = cartItems.reduce((total, item) => {
                return total + (Number(item.product.price) * item.quantity)
            }, 0)
        }

        // 4. Validate coupon using helper
        const couponValidation = await validateCoupon(
            validatedData.code,
            user.userId,
            subtotal
        )

        if (!couponValidation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: couponValidation.error || 'Mã giảm giá không hợp lệ'
                },
                { status: 400 }
            )
        }

        // 5. Calculate discount using helper
        const coupon = couponValidation.coupon!
        const discountAmount = calculateDiscount(subtotal, coupon)

        // 6. Calculate final amount
        const finalAmount = subtotal - discountAmount

        // 7. Format response chi tiết
        const discountPercentage = coupon.discountType === 'PERCENTAGE' 
            ? coupon.discountValue
            : Math.round((discountAmount / subtotal) * 100)

        return NextResponse.json({
            success: true,
            message: 'Áp dụng mã giảm giá thành công!',
            data: {
                coupon: {
                    id: coupon.id,
                    code: coupon.code,
                    type: coupon.discountType,
                    value: coupon.discountValue,
                    description: coupon.discountType === 'PERCENTAGE'
                        ? `Giảm ${coupon.discountValue}%`
                        : `Giảm ${coupon.discountValue.toLocaleString('vi-VN')}đ`
                },
                calculation: {
                    subtotal: subtotal,
                    discountAmount: discountAmount,
                    finalAmount: finalAmount,
                    savedAmount: discountAmount,
                    savedPercentage: discountPercentage
                },
                formatted: {
                    subtotal: `${subtotal.toLocaleString('vi-VN')}đ`,
                    discount: `-${discountAmount.toLocaleString('vi-VN')}đ`,
                    finalAmount: `${finalAmount.toLocaleString('vi-VN')}đ`,
                    saved: `Tiết kiệm ${discountAmount.toLocaleString('vi-VN')}đ (${discountPercentage}%)`
                }
            }
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

        console.error('Validate coupon error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể kiểm tra mã giảm giá. Vui lòng thử lại'
            },
            { status: 500 }
        )
    }
}