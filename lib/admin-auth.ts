import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Admin authorization Helper - Kiểm tra user có phải admin không
export interface AdminUser {
    userId: string
    email: string
    role: string
}

// Kiểm tra user có role ADMIN không (đồng bộ - từ JWT)
export function getAdminFromRequest(request: NextRequest): AdminUser | null {
    try {
        // 1. Lấy user từ JWT token
        const user = getUserFromRequest(request)

        if (!user) {
            return null
        }

        // 2. Kiểm tra role (JWT đã có role)
        if (user.role !== 'ADMIN') {
            return null
        }

        return {
            userId: user.userId,
            email: user.email,
            role: user.role
        }
    } catch (error) {
        console.error('Lỗi kiểm tra admin:', error)
        return null
    }
}

// Async function - kiểm tra admin từ DB (an toàn hơn)
export async function verifyAdmin(request: NextRequest): Promise<AdminUser | null> {
    try {
        // 1. Lấy user từ JWT
        const user = getUserFromRequest(request)

        if (!user) {
            return null
        }

        // 2. Kiểm tra trong DB để chắc chắn
        const dbUser = await prisma.user.findUnique({
            where: {
                id: user.userId
            },
            select: {
                id: true,
                email: true,
                role: true
            }
        })

        if (!dbUser) {
            return null
        }

        // 3. Verify role
        if (dbUser.role !== 'ADMIN') {
            return null
        }

        return {
            userId: dbUser.id,
            email: dbUser.email,
            role: dbUser.role
        }
    } catch (error) {
        console.error('Lỗi verify admin:', error)
        return null
    }
}
