import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        // Lấy user từ request
        const tokenUser = getUserFromRequest(request)

        // Case 1: Không có token hoặc token không hợp lệ
        if (!tokenUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized - Please login'
                },
                { status: 401 } // Unauthorized
            )
        }

        // Case 2: Tìm user trong database
        const user = await prisma.user.findUnique({
            where: { id: tokenUser.userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })

        // Case 3: User không tồn tại trong database
        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'User not found'
            },
                { status: 404 } // Not found
            )
        }

        // Trả về profile user
        return NextResponse.json({
            success: true,
            data: user
        })
    }
    catch (error) {
        console.error('Profile Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to get profile'
            },
            { status: 500 } // Server error
        )
    }
}