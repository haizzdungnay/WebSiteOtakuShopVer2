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
        { success: false, error: 'Kh�ng c� quy?n truy c?p' },
        { status: 403 }
      )
    }

    const dates = getDateRanges()

    return NextResponse.json({
      success: true,
      message: 'API ho?t d?ng OK',
      data: {}
    })

  } catch (error) {
    console.error('[ADMIN] Dashboard stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Kh�ng th? l?y th?ng k� dashboard' },
      { status: 500 }
    )
  }
}
