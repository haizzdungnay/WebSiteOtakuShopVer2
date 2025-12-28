import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

// Schema validate update user
const updateUserSchema = z.object({
  role: z.enum(['CUSTOMER', 'ADMIN'], {
    message: 'Role không hợp lệ'
  }).optional(),

  fullName: z.string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên quá dài')
    .optional(),

  phone: z.string()
    .regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .nullable()
})

// GET /api/admin/users/[id] - User detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // 2. Get user detail
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlists: true,
            addresses: true
          }
        },
        addresses: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy người dùng' },
        { status: 404 }
      )
    }

    // 3. Get order statistics
    const [
      totalSpentResult,
      completedOrders,
      cancelledOrders,
      recentOrders
    ] = await Promise.all([
      // Total spent
      prisma.order.aggregate({
        where: {
          userId: id,
          status: { in: ['DELIVERED', 'COMPLETED'] }
        },
        _sum: {
          totalAmount: true
        }
      }),
      // Completed orders count
      prisma.order.count({
        where: {
          userId: id,
          status: { in: ['DELIVERED', 'COMPLETED'] }
        }
      }),
      // Cancelled orders count
      prisma.order.count({
        where: {
          userId: id,
          status: 'CANCELLED'
        }
      }),
      // Recent orders (last 10)
      prisma.order.findMany({
        where: { userId: id },
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          _count: {
            select: { orderItems: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ])

    // 4. Get review statistics
    const reviewStats = await prisma.review.groupBy({
      by: ['rating'],
      where: { userId: id },
      _count: {
        rating: true
      }
    })

    // 5. Get recent reviews
    const recentReviews = await prisma.review.findMany({
      where: { userId: id },
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // 6. Compile statistics
    const statistics = {
      totalOrders: user._count.orders,
      completedOrders,
      cancelledOrders,
      totalSpent: totalSpentResult._sum.totalAmount || 0,
      averageOrderValue: completedOrders > 0 
        ? Number(totalSpentResult._sum.totalAmount || 0) / completedOrders 
        : 0,
      totalReviews: user._count.reviews,
      reviewsByRating: reviewStats.reduce((acc, stat) => {
        acc[stat.rating] = stat._count.rating
        return acc
      }, {} as Record<number, number>),
      totalWishlists: user._count.wishlists,
      totalAddresses: user._count.addresses
    }

    // Remove password hash from response
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        statistics,
        recentOrders,
        recentReviews
      }
    })

  } catch (error) {
    console.error('[Admin] Get user detail error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy thông tin người dùng' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // 2. Check user exists
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy người dùng' },
        { status: 404 }
      )
    }

    // 3. Validate input
    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // 4. Check phone uniqueness if changed
    if (validatedData.phone && validatedData.phone !== user.phone) {
      const existingPhone = await prisma.user.findFirst({
        where: {
          phone: validatedData.phone,
          id: { not: id }
        }
      })

      if (existingPhone) {
        return NextResponse.json(
          { success: false, error: 'Số điện thoại đã được sử dụng' },
          { status: 400 }
        )
      }
    }

    // 5. Prevent changing own role
    if (validatedData.role && admin.userId === id) {
      return NextResponse.json(
        { success: false, error: 'Không thể thay đổi quyền của chính mình' },
        { status: 400 }
      )
    }

    // 6. Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(validatedData.role && { role: validatedData.role }),
        ...(validatedData.fullName && { fullName: validatedData.fullName }),
        ...(validatedData.phone !== undefined && { phone: validatedData.phone })
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật người dùng thành công',
      data: updatedUser
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('[Admin] Update user error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật người dùng' },
      { status: 500 }
    )
  }
}
