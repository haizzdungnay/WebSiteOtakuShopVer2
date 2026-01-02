import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request) as { userId: string; email: string; role: string; isAdmin?: boolean } | null

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // If the token indicates an admin user (from admins table), query that table
    if (payload.isAdmin || payload.role === 'admin') {
      const admin = await prisma.admin.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          isActive: true,
          createdAt: true
        }
      })

      if (admin && admin.isActive) {
        return NextResponse.json({
          success: true,
          user: {
            id: admin.id,
            email: admin.email,
            username: admin.fullName,
            fullName: admin.fullName,
            phone: null,
            role: 'admin',
            avatar: null,
            gender: null,
            dateOfBirth: null,
            emailVerified: true,
            createdAt: admin.createdAt
          },
        })
      }

      // If not found in admins table, fall through to check users table
    }

    // Fetch user from database to get latest info
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatar: true,
        gender: true,
        dateOfBirth: true,
        emailVerified: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.fullName, // for backward compatibility
        fullName: user.fullName,
        phone: user.phone,
        role: user.role === 'ADMIN' ? 'admin' : user.role === 'STAFF' ? 'staff' : 'user',
        avatar: user.avatar,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      },
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
