import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

// GET /api/admin/orders - List all orders
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
    const search = searchParams.get('search') || '' // orderNumber, customer name/email
    const status = searchParams.get('status') // OrderStatus enum
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // 3. Build where clause
    const where: any = {}

    // Search by orderNumber or customer info
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filter by status
    if (status) {
      where.status = status
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    // 4. Query orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          customerEmail: true,
          customerPhone: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatar: true
            }
          },
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  name: true,
                  slug: true,
                  images: true
                }
              }
            }
          },
          _count: {
            select: { orderItems: true }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    // 5. Get summary statistics
    const [
      totalRevenue,
      statusCounts
    ] = await Promise.all([
      // Total revenue
      prisma.order.aggregate({
        where: {
          ...where,
          status: { in: ['DELIVERED', 'COMPLETED'] }
        },
        _sum: {
          totalAmount: true
        }
      }),
      // Count by status
      prisma.order.groupBy({
        by: ['status'],
        where,
        _count: {
          status: true
        }
      })
    ])

    const summary = {
      total,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status
        return acc
      }, {} as Record<string, number>)
    }

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        summary
      }
    })

  } catch (error) {
    console.error('[Admin] Get orders error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách đơn hàng' },
      { status: 500 }
    )
  }
}
