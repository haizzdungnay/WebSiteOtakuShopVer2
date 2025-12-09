import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

// GET /api/admin/dashboard/products - Products analytics
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

    // 3. Get top selling products (by quantity sold)
    const topSellingProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        price: true,
        stockQuantity: true,
        isActive: true,
        orderItems: {
          where: {
            order: {
              status: { in: ['DELIVERED', 'COMPLETED'] }
            }
          },
          select: {
            quantity: true,
            price: true
          }
        }
      },
      take: 100 // Get more to calculate properly
    })

    // Calculate total sold and revenue for each product
    const productsWithStats = topSellingProducts.map(product => {
      const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalRevenue = product.orderItems.reduce(
        (sum, item) => sum + item.quantity * Number(item.price), 
        0
      )

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] || null,
        price: product.price,
        stockQuantity: product.stockQuantity,
        isActive: product.isActive,
        totalSold,
        totalRevenue,
        stockStatus: product.stockQuantity === 0 ? 'out_of_stock' :
                    product.stockQuantity <= 10 ? 'low_stock' : 'in_stock'
      }
    })

    // Sort by total sold and take top N
    const topSelling = productsWithStats
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit)

    // 4. Get top revenue products
    const topRevenue = productsWithStats
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit)

    // 5. Get low stock products
    const lowStock = await prisma.product.findMany({
      where: {
        stockQuantity: { gt: 0, lte: 10 },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        price: true,
        stockQuantity: true
      },
      orderBy: { stockQuantity: 'asc' },
      take: limit
    })

    // 6. Get out of stock products
    const outOfStock = await prisma.product.findMany({
      where: {
        stockQuantity: 0,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        price: true
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    })

    // 7. Get recently added products
    const recentlyAdded = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        price: true,
        stockQuantity: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // 8. Get inventory statistics
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalStock,
      lowStockCount,
      outOfStockCount
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
      prisma.product.aggregate({
        _sum: { stockQuantity: true }
      }),
      prisma.product.count({
        where: {
          stockQuantity: { gt: 0, lte: 10 },
          isActive: true
        }
      }),
      prisma.product.count({
        where: { stockQuantity: 0 }
      })
    ])

    // 9. Get category distribution
    const categoryStats = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        products: {
          _count: 'desc'
        }
      },
      take: 10
    })

    return NextResponse.json({
      success: true,
      data: {
        topSelling,
        topRevenue,
        lowStock,
        outOfStock,
        recentlyAdded,
        inventory: {
          totalProducts,
          activeProducts,
          inactiveProducts,
          totalStock: totalStock._sum.stockQuantity || 0,
          lowStockCount,
          outOfStockCount,
          healthyStockCount: totalProducts - lowStockCount - outOfStockCount
        },
        categoryDistribution: categoryStats.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          productCount: cat._count.products
        }))
      }
    })

  } catch (error) {
    console.error('[Admin] Get products analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy thống kê sản phẩm' },
      { status: 500 }
    )
  }
}
