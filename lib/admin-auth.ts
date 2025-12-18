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

        // 2. Kiểm tra role (JWT đã có role) - hỗ trợ cả chữ hoa và chữ thường
        if (user.role?.toUpperCase() !== 'ADMIN') {
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
            console.log('[verifyAdmin] No user from JWT')
            return null
        }

        console.log('[verifyAdmin] JWT user:', { userId: user.userId, email: user.email, role: user.role })

        // 2. Nếu là env-admin (fallback admin từ biến môi trường), cho phép luôn
        if (user.userId === 'env-admin' && user.role?.toLowerCase() === 'admin') {
            console.log('[verifyAdmin] Env admin detected, granting access')
            return {
                userId: user.userId,
                email: user.email,
                role: 'ADMIN'
            }
        }

        // 3. Kiểm tra trong bảng admins trước
        const dbAdmin = await prisma.admin.findUnique({
            where: {
                id: user.userId
            },
            select: {
                id: true,
                email: true,
                isActive: true
            }
        })

        if (dbAdmin && dbAdmin.isActive) {
            console.log('[verifyAdmin] Found in admins table:', dbAdmin)
            return {
                userId: dbAdmin.id,
                email: dbAdmin.email,
                role: 'ADMIN'
            }
        }

        // 4. Kiểm tra trong bảng users
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

        console.log('[verifyAdmin] DB user:', dbUser)

        if (!dbUser) {
            console.log('[verifyAdmin] User not found in DB')
            return null
        }

        // 5. Verify role - hỗ trợ cả chữ hoa và chữ thường
        const roleUpper = dbUser.role?.toUpperCase()
        console.log('[verifyAdmin] Role check:', { dbRole: dbUser.role, roleUpper, isAdmin: roleUpper === 'ADMIN' })

        if (roleUpper !== 'ADMIN') {
            console.log('[verifyAdmin] User is not admin')
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
