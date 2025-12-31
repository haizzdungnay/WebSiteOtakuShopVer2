import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

// GET /api/admin/users - List users
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
    const role = searchParams.get('role') // CUSTOMER, ADMIN
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // 3. Build where clause
    const where: any = {}

    // Search by email, fullName, phone
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filter by role
    if (role) {
      where.role = role
    }

    // Filter by email verification status
    const verified = searchParams.get('verified')
    if (verified === 'true') {
      where.emailVerified = true
    } else if (verified === 'false') {
      where.emailVerified = false
    }

    // 4. Query users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          gender: true,
          dateOfBirth: true,
          avatar: true,
          role: true,
          emailVerified: true,
          otpCode: true,
          otpExpires: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
              wishlists: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    // 5. Add computed fields for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get total spent
        const totalSpentResult = await prisma.order.aggregate({
          where: {
            userId: user.id,
            status: { in: ['DELIVERED', 'COMPLETED'] }
          },
          _sum: {
            totalAmount: true
          }
        })

        // Get latest order
        const latestOrder = await prisma.order.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            orderNumber: true,
            createdAt: true,
            status: true
          }
        })

        return {
          ...user,
          totalSpent: totalSpentResult._sum.totalAmount || 0,
          latestOrder
        }
      })
    )

    // 6. Get summary statistics
    const summary = {
      total,
      customers: await prisma.user.count({ where: { ...where, role: 'CUSTOMER' } }),
      staff: await prisma.user.count({ where: { ...where, role: 'STAFF' } }),
      admins: await prisma.user.count({ where: { ...where, role: 'ADMIN' } }),
      newThisMonth: await prisma.user.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        summary,
        // Thông tin về quyền của admin hiện tại
        currentAdmin: {
          canPromoteUsers: admin.isOriginalAdmin,
          role: admin.role
        }
      }
    })

  } catch (error) {
    console.error('[Admin] Get users error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách người dùng' },
      { status: 500 }
    )
  }
}
