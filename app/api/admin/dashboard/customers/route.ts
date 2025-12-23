import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

// GET /api/admin/dashboard/customers - Customers analytics
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
    const limit = parseInt(searchParams.get('limit') || '10')
    const _period = searchParams.get('period') || 'month' // day, week, month, year (reserved for future use)

    // 3. Calculate date ranges
    const now = new Date()
    const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    // 4. Get top customers by total spending
    const topCustomers = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        createdAt: true,
        orders: {
          where: {
            status: { in: ['DELIVERED', 'COMPLETED'] }
          },
          select: {
            id: true,
            totalAmount: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            orders: true,
            reviews: true
          }
        }
      },
      take: 100
    })

    // Calculate lifetime value for each customer
    const customersWithLTV = topCustomers.map(customer => {
      const totalSpent = customer.orders.reduce(
        (sum, order) => sum + Number(order.totalAmount), 
        0
      )
      const orderCount = customer.orders.length

      return {
        id: customer.id,
        email: customer.email,
        fullName: customer.fullName,
        avatar: customer.avatar,
        joinedDate: customer.createdAt,
        totalSpent,
        orderCount,
        reviewCount: customer._count.reviews,
        averageOrderValue: orderCount > 0 ? totalSpent / orderCount : 0,
        lastOrderDate: customer.orders.length > 0 
          ? customer.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
          : null
      }
    })

    // Sort by total spent
    const topSpenders = customersWithLTV
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit)

    // 5. Get new customers (this month vs last month)
    const [
      newCustomersThisMonth,
      newCustomersLastMonth,
      totalCustomers
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: currentPeriodStart }
        }
      }),
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: {
            gte: previousPeriodStart,
            lte: previousPeriodEnd
          }
        }
      }),
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      })
    ])

    const customerGrowth = newCustomersLastMonth > 0
      ? ((newCustomersThisMonth - newCustomersLastMonth) / newCustomersLastMonth) * 100
      : 0

    // 6. Get recently registered customers
    const recentCustomers = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // 7. Get customer retention stats
    const customersWithOrders = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        orders: {
          some: {
            status: { in: ['DELIVERED', 'COMPLETED'] }
          }
        }
      }
    })

    const _repeatCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        orders: {
          some: {
            status: { in: ['DELIVERED', 'COMPLETED'] }
          }
        }
      }
    })

    // Count customers with 2+ orders
    const customersWithMultipleOrders = customersWithLTV.filter(c => c.orderCount >= 2).length

    // 8. Get customer segmentation by order count
    const segmentation = {
      oneTime: customersWithLTV.filter(c => c.orderCount === 1).length,
      occasional: customersWithLTV.filter(c => c.orderCount >= 2 && c.orderCount <= 5).length,
      frequent: customersWithLTV.filter(c => c.orderCount >= 6 && c.orderCount <= 10).length,
      loyal: customersWithLTV.filter(c => c.orderCount > 10).length
    }

    // 9. Calculate average metrics
    const totalSpent = customersWithLTV.reduce((sum, c) => sum + c.totalSpent, 0)
    const totalOrders = customersWithLTV.reduce((sum, c) => sum + c.orderCount, 0)

    const averageLifetimeValue = totalCustomers > 0 ? totalSpent / totalCustomers : 0
    const averageOrdersPerCustomer = totalCustomers > 0 ? totalOrders / totalCustomers : 0

    // 10. Get customer growth chart data (last 6 months)
    const growthData = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
      
      const count = await prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      growthData.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
        newCustomers: count
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        topSpenders,
        recentCustomers,
        summary: {
          totalCustomers,
          newCustomersThisMonth,
          customerGrowth: Math.round(customerGrowth * 100) / 100,
          customersWithOrders,
          repeatCustomersCount: customersWithMultipleOrders,
          repeatCustomerRate: totalCustomers > 0 
            ? Math.round((customersWithMultipleOrders / totalCustomers) * 100 * 100) / 100
            : 0,
          averageLifetimeValue: Math.round(averageLifetimeValue),
          averageOrdersPerCustomer: Math.round(averageOrdersPerCustomer * 100) / 100
        },
        segmentation,
        growthChart: growthData
      }
    })

  } catch (error) {
    console.error('[Admin] Get customers analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy thống kê khách hàng' },
      { status: 500 }
    )
  }
}
