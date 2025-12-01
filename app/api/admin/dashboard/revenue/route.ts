import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

// GET /api/admin/dashboard/revenue - Revenue analytics
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
    const period = searchParams.get('period') || 'month' // day, week, month, year
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null

    // 3. Calculate date range
    let startDate: Date
    let endDate: Date

    if (period === 'day' && month) {
      // Daily revenue for a specific month
      startDate = new Date(year, month - 1, 1)
      endDate = new Date(year, month, 0, 23, 59, 59)
    } else if (period === 'month') {
      // Monthly revenue for a year
      startDate = new Date(year, 0, 1)
      endDate = new Date(year, 11, 31, 23, 59, 59)
    } else if (period === 'year') {
      // Yearly revenue for last 5 years
      startDate = new Date(year - 4, 0, 1)
      endDate = new Date(year, 11, 31, 23, 59, 59)
    } else {
      // Default: current month
      startDate = new Date(year, new Date().getMonth(), 1)
      endDate = new Date(year, new Date().getMonth() + 1, 0, 23, 59, 59)
    }

    // 4. Get completed orders in range
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['DELIVERED', 'COMPLETED'] },
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        id: true,
        totalAmount: true,
        createdAt: true
      }
    })

    // 5. Group by period
    const revenueByPeriod: Record<string, { revenue: number; orders: number }> = {}

    orders.forEach(order => {
      let key: string
      const orderDate = new Date(order.createdAt)

      if (period === 'day') {
        key = orderDate.getDate().toString().padStart(2, '0')
      } else if (period === 'month') {
        key = (orderDate.getMonth() + 1).toString().padStart(2, '0')
      } else if (period === 'year') {
        key = orderDate.getFullYear().toString()
      } else {
        key = orderDate.toISOString().split('T')[0]
      }

      if (!revenueByPeriod[key]) {
        revenueByPeriod[key] = { revenue: 0, orders: 0 }
      }

      revenueByPeriod[key].revenue += Number(order.totalAmount)
      revenueByPeriod[key].orders += 1
    })

    // 6. Convert to array and sort
    const chartData = Object.entries(revenueByPeriod)
      .map(([period, data]) => ({
        period,
        revenue: data.revenue,
        orders: data.orders,
        averageOrderValue: data.orders > 0 ? data.revenue / data.orders : 0
      }))
      .sort((a, b) => a.period.localeCompare(b.period))

    // 7. Calculate total statistics
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // 8. Get comparison with previous period
    let previousStartDate: Date
    let previousEndDate: Date

    if (period === 'day' && month) {
      const prevMonth = month === 1 ? 12 : month - 1
      const prevYear = month === 1 ? year - 1 : year
      previousStartDate = new Date(prevYear, prevMonth - 1, 1)
      previousEndDate = new Date(prevYear, prevMonth, 0, 23, 59, 59)
    } else if (period === 'month') {
      previousStartDate = new Date(year - 1, 0, 1)
      previousEndDate = new Date(year - 1, 11, 31, 23, 59, 59)
    } else {
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      previousEndDate = new Date(startDate.getTime() - 1)
      previousStartDate = new Date(previousEndDate.getTime() - daysDiff * 24 * 60 * 60 * 1000)
    }

    const previousPeriodStats = await prisma.order.aggregate({
      where: {
        status: { in: ['DELIVERED', 'COMPLETED'] },
        createdAt: {
          gte: previousStartDate,
          lte: previousEndDate
        }
      },
      _sum: { totalAmount: true },
      _count: true
    })

    const previousRevenue = Number(previousPeriodStats._sum.totalAmount || 0)
    const previousOrders = previousPeriodStats._count

    const revenueGrowth = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : 0

    const ordersGrowth = previousOrders > 0
      ? ((totalOrders - previousOrders) / previousOrders) * 100
      : 0

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders,
          averageOrderValue,
          revenueGrowth: Math.round(revenueGrowth * 100) / 100,
          ordersGrowth: Math.round(ordersGrowth * 100) / 100
        },
        chartData,
        period: {
          type: period,
          startDate,
          endDate,
          year,
          month
        }
      }
    })

  } catch (error) {
    console.error('[Admin] Get revenue analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy thống kê doanh thu' },
      { status: 500 }
    )
  }
}
