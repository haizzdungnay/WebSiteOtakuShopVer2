import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

// Schema validate update coupon
const updateCouponSchema = z.object({
  code: z.string()
    .min(3, 'Mã coupon phải có ít nhất 3 ký tự')
    .max(50, 'Mã coupon quá dài')
    .regex(/^[A-Z0-9_-]+$/, 'Mã coupon chỉ được chứa chữ hoa, số, gạch ngang và gạch dưới')
    .optional(),

  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'], {
    message: 'Loại coupon không hợp lệ'
  }).optional(),

  value: z.number()
    .min(0, 'Giá trị phải lớn hơn 0')
    .optional(),

  minOrder: z.number()
    .min(0, 'Đơn hàng tối thiểu không được âm')
    .optional()
    .nullable(),

  maxDiscount: z.number()
    .min(0, 'Giảm tối đa không được âm')
    .optional()
    .nullable(),

  validFrom: z.string()
    .datetime('Ngày bắt đầu không hợp lệ')
    .optional(),

  validTo: z.string()
    .datetime('Ngày kết thúc không hợp lệ')
    .optional(),

  usageLimit: z.number()
    .int('Số lần sử dụng phải là số nguyên')
    .min(1, 'Số lần sử dụng phải lớn hơn 0')
    .optional()
    .nullable(),

  description: z.string()
    .max(500, 'Mô tả quá dài')
    .optional()
    .nullable(),

  isActive: z.boolean()
    .optional()
})

// PUT /api/admin/coupons/[id] - Update coupon
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Check admin authorization
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = params

    // 2. Check coupon exists
    const coupon = await prisma.coupon.findUnique({
      where: { id }
    })

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy coupon' },
        { status: 404 }
      )
    }

    // 3. Validate input
    const body = await request.json()
    const validatedData = updateCouponSchema.parse(body)

    // 4. Check code uniqueness if changed
    if (validatedData.code && validatedData.code !== coupon.code) {
      const existingCoupon = await prisma.coupon.findFirst({
        where: {
          code: validatedData.code,
          id: { not: id }
        }
      })

      if (existingCoupon) {
        return NextResponse.json(
          { success: false, error: 'Mã coupon đã tồn tại' },
          { status: 400 }
        )
      }
    }

    // 5. Validate PERCENTAGE value
    const finalType = validatedData.type ?? coupon.type
    const finalValue = validatedData.value ?? Number(coupon.value)
    
    if (finalType === 'PERCENTAGE' && finalValue > 100) {
      return NextResponse.json(
        { success: false, error: 'Phần trăm giảm giá không được vượt quá 100%' },
        { status: 400 }
      )
    }

    // 6. Validate date range
    const finalValidFrom = validatedData.validFrom 
      ? new Date(validatedData.validFrom) 
      : coupon.validFrom
    const finalValidTo = validatedData.validTo 
      ? new Date(validatedData.validTo) 
      : coupon.validTo

    if (finalValidTo <= finalValidFrom) {
      return NextResponse.json(
        { success: false, error: 'Ngày kết thúc phải sau ngày bắt đầu' },
        { status: 400 }
      )
    }

    // 7. Update coupon
    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(validatedData.code && { code: validatedData.code }),
        ...(validatedData.type && { type: validatedData.type }),
        ...(validatedData.value !== undefined && { value: validatedData.value }),
        ...(validatedData.minOrder !== undefined && { minOrder: validatedData.minOrder }),
        ...(validatedData.maxDiscount !== undefined && { maxDiscount: validatedData.maxDiscount }),
        ...(validatedData.validFrom && { validFrom: new Date(validatedData.validFrom) }),
        ...(validatedData.validTo && { validTo: new Date(validatedData.validTo) }),
        ...(validatedData.usageLimit !== undefined && { usageLimit: validatedData.usageLimit }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật coupon thành công',
      data: updatedCoupon
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('[Admin] Update coupon error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật coupon' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/coupons/[id] - Xóa coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Check admin authorization
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = params

    // 2. Check coupon exists
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy coupon' },
        { status: 404 }
      )
    }

    // 3. Check if coupon is used in orders
    if (coupon._count.orders > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Không thể xóa coupon đã được sử dụng trong ${coupon._count.orders} đơn hàng. Vui lòng vô hiệu hóa thay vì xóa.` 
        },
        { status: 400 }
      )
    }

    // 4. Delete coupon
    await prisma.coupon.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Xóa coupon thành công'
    })

  } catch (error) {
    console.error('[Admin] Delete coupon error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể xóa coupon' },
      { status: 500 }
    )
  }
}
