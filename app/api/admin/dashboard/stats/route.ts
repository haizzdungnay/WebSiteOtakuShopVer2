import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

// ==========================================
// Helper: Get date ranges
// ==========================================

function getDateRanges() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  return {
    today: today,
    yesterday: new Date(today.getTime() - 24 * 60 * 60 * 1000),
    thisWeekStart: new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000),
    lastWeekStart: new Date(today.getTime() - (today.getDay() + 7) * 24 * 60 * 60 * 1000),
    thisMonthStart: new Date(now.getFullYear(), now.getMonth(), 1),
    lastMonthStart: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    lastMonthEnd: new Date(now.getFullYear(), now.getMonth(), 0),
    thisYearStart: new Date(now.getFullYear(), 0, 1),
    last7Days: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    last30Days: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

// ==========================================
// Helper: Calculate growth rate
// ==========================================

function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

// ==========================================
// GET /api/admin/dashboard/stats
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const dates = getDateRanges()

    // Lấy thống kê từ database
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      revenueData,
      recentOrders,
      topProducts,
      ordersByStatus
    ] = await Promise.all([
      // Tổng sản phẩm
      prisma.product.count({ where: { isActive: true } }),
      
      // Tổng đơn hàng
      prisma.order.count(),
      
      // Tổng khách hàng
      prisma.user.count(),
      
      // Đơn hàng chờ xử lý
      prisma.order.count({ where: { status: 'PENDING' } }),
      
      // Tổng doanh thu (đơn đã hoàn thành hoặc đã giao)
      prisma.order.aggregate({
        where: { status: { in: ['DELIVERED', 'COMPLETED'] } },
        _sum: { totalAmount: true }
      }),
      
      // 5 đơn hàng gần nhất
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          totalAmount: true,
          status: true,
          createdAt: true
        }
      }),
      
      // Top 5 sản phẩm bán chạy
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),
      
      // Đếm đơn hàng theo trạng thái
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true }
      })
    ])

    // Lấy thông tin sản phẩm bán chạy
    const topProductIds = topProducts.map(p => p.productId)
    const topProductsInfo = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, images: true, price: true }
    })

    const topProductsWithInfo = topProducts.map(item => {
      const product = topProductsInfo.find(p => p.id === item.productId)
      return {
        productId: item.productId,
        name: product?.name || 'Unknown',
        image: product?.images?.[0] || null,
        price: product?.price || 0,
        totalSold: item._sum.quantity || 0
      }
    })

    // Tính doanh thu theo tháng (6 tháng gần nhất)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const monthlyRevenue = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        status: { in: ['DELIVERED', 'COMPLETED'] },
        createdAt: { gte: sixMonthsAgo }
      },
      _sum: { totalAmount: true }
    })

    // Format status counts
    const statusCounts: Record<string, number> = {}
    ordersByStatus.forEach(item => {
      statusCounts[item.status] = item._count.status
    })

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        pendingOrders,
        totalRevenue: Number(revenueData._sum.totalAmount || 0),
        recentOrders,
        topProducts: topProductsWithInfo,
        ordersByStatus: statusCounts
      }
    })

  } catch (error) {
    console.error('[ADMIN] Dashboard stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy thống kê dashboard' },
      { status: 500 }
    )
  }
}
