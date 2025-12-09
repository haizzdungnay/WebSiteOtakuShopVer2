import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

// Schema validate tạo coupon
const createCouponSchema = z.object({
  code: z.string()
    .min(3, 'Mã coupon phải có ít nhất 3 ký tự')
    .max(50, 'Mã coupon quá dài')
    .regex(/^[A-Z0-9_-]+$/, 'Mã coupon chỉ được chứa chữ hoa, số, gạch ngang và gạch dưới'),

  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'], {
    message: 'Loại coupon không hợp lệ'
  }),

  value: z.number()
    .min(0, 'Giá trị phải lớn hơn 0'),

  minOrder: z.number()
    .min(0, 'Đơn hàng tối thiểu không được âm')
    .optional()
    .nullable(),

  maxDiscount: z.number()
    .min(0, 'Giảm tối đa không được âm')
    .optional()
    .nullable(),

  validFrom: z.string()
    .datetime('Ngày bắt đầu không hợp lệ'),

  validTo: z.string()
    .datetime('Ngày kết thúc không hợp lệ'),

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
    .default(true)
}).refine(
  (data) => {
    if (data.type === 'PERCENTAGE' && data.value > 100) {
      return false
    }
    return true
  },
  {
    message: 'Phần trăm giảm giá không được vượt quá 100%',
    path: ['value']
  }
).refine(
  (data) => {
    const from = new Date(data.validFrom)
    const to = new Date(data.validTo)
    return to > from
  },
  {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['validTo']
  }
)

// GET /api/admin/coupons - List coupons
export async function GET(request: NextRequest) {
  try {
    // 1. Check admin authorization
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    // 2. Parse query params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') // PERCENTAGE, FIXED_AMOUNT
    const isActive = searchParams.get('isActive') // true, false
    const status = searchParams.get('status') // active, expired, upcoming

    // 3. Build where clause
    const where: any = {}

    // Search by code or description
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filter by type
    if (type) {
      where.type = type
    }

    // Filter by isActive
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // Filter by status (active/expired/upcoming)
    const now = new Date()
    if (status === 'active') {
      where.validFrom = { lte: now }
      where.validTo = { gte: now }
      where.isActive = true
    } else if (status === 'expired') {
      where.validTo = { lt: now }
    } else if (status === 'upcoming') {
      where.validFrom = { gt: now }
    }

    // 4. Query coupons with pagination
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        include: {
          _count: {
            select: { orders: true }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.coupon.count({ where })
    ])

    // 5. Add computed fields
    const couponsWithStatus = coupons.map(coupon => {
      const now = new Date()
      let computedStatus = 'upcoming'
      
      if (coupon.validFrom <= now && coupon.validTo >= now && coupon.isActive) {
        computedStatus = 'active'
      } else if (coupon.validTo < now) {
        computedStatus = 'expired'
      }

      // Check if usage limit reached
      const usageLimitReached = coupon.usageLimit !== null && 
                                coupon.usedCount >= coupon.usageLimit

      return {
        ...coupon,
        status: computedStatus,
        usageLimitReached,
        remainingUses: coupon.usageLimit !== null 
          ? Math.max(0, coupon.usageLimit - coupon.usedCount)
          : null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        coupons: couponsWithStatus,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('[Admin] Get coupons error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách coupon' },
      { status: 500 }
    )
  }
}

// POST /api/admin/coupons - Tạo coupon mới
export async function POST(request: NextRequest) {
  try {
    // 1. Check admin authorization
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    // 2. Validate input
    const body = await request.json()
    const validatedData = createCouponSchema.parse(body)

    // 3. Check code uniqueness
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: validatedData.code }
    })

    if (existingCoupon) {
      return NextResponse.json(
        { success: false, error: 'Mã coupon đã tồn tại' },
        { status: 400 }
      )
    }

    // 4. Validate maxDiscount for PERCENTAGE type
    if (validatedData.type === 'PERCENTAGE' && validatedData.maxDiscount !== undefined) {
      // maxDiscount is optional but recommended for PERCENTAGE type
    }

    // 5. Create coupon
    const coupon = await prisma.coupon.create({
      data: {
        code: validatedData.code,
        type: validatedData.type,
        value: validatedData.value,
        minOrder: validatedData.minOrder,
        maxDiscount: validatedData.maxDiscount,
        validFrom: new Date(validatedData.validFrom),
        validTo: new Date(validatedData.validTo),
        usageLimit: validatedData.usageLimit,
        description: validatedData.description,
        isActive: validatedData.isActive,
        usedCount: 0
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Tạo coupon thành công',
      data: coupon
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('[Admin] Create coupon error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể tạo coupon' },
      { status: 500 }
    )
  }
}
