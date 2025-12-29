import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalCustomers, totalOrders] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        customers: totalCustomers,
        orders: totalOrders,
      },
    })
  } catch (error) {
    console.error('Error fetching public stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
