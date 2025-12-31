import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Debug mode - set to true in development for verbose logging
const DEBUG = process.env.NODE_ENV === 'development' && process.env.DEBUG_AUTH === 'true'

// Admin authorization Helper - Kiểm tra user có phải admin không
export interface AdminUser {
    userId: string
    email: string
    role: 'ADMIN' | 'STAFF'  // ADMIN = admin gốc, STAFF = admin nhân viên
    isOriginalAdmin: boolean  // true nếu là ADMIN gốc (có quyền cấp quyền)
}

// Kiểm tra user có role ADMIN hoặc STAFF không (đồng bộ - từ JWT)
export function getAdminFromRequest(request: NextRequest): AdminUser | null {
    try {
        // 1. Lấy user từ JWT token
        const user = getUserFromRequest(request)

        if (!user) {
            return null
        }

        // 2. Kiểm tra role (JWT đã có role) - hỗ trợ cả ADMIN và STAFF
        const roleUpper = user.role?.toUpperCase()
        if (roleUpper !== 'ADMIN' && roleUpper !== 'STAFF') {
            return null
        }

        return {
            userId: user.userId,
            email: user.email,
            role: roleUpper as 'ADMIN' | 'STAFF',
            isOriginalAdmin: roleUpper === 'ADMIN'
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
            if (DEBUG) console.warn('[verifyAdmin] No user from JWT')
            return null
        }

        if (DEBUG) console.warn('[verifyAdmin] JWT user:', { userId: user.userId, email: user.email, role: user.role })

        // 2. Nếu là env-admin (fallback admin từ biến môi trường), cho phép luôn
        if (user.userId === 'env-admin' && user.role?.toLowerCase() === 'admin') {
            if (DEBUG) console.warn('[verifyAdmin] Env admin detected, granting access')
            return {
                userId: user.userId,
                email: user.email,
                role: 'ADMIN',
                isOriginalAdmin: true
            }
        }

        // 3. Kiểm tra trong bảng admins trước (admins table = original admin)
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
            if (DEBUG) console.warn('[verifyAdmin] Found in admins table:', dbAdmin)
            return {
                userId: dbAdmin.id,
                email: dbAdmin.email,
                role: 'ADMIN',
                isOriginalAdmin: true
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

        if (DEBUG) console.warn('[verifyAdmin] DB user:', dbUser)

        if (!dbUser) {
            if (DEBUG) console.warn('[verifyAdmin] User not found in DB')
            return null
        }

        // 5. Verify role - hỗ trợ cả ADMIN và STAFF
        const roleUpper = dbUser.role?.toUpperCase()
        if (DEBUG) console.warn('[verifyAdmin] Role check:', { dbRole: dbUser.role, roleUpper })

        if (roleUpper !== 'ADMIN' && roleUpper !== 'STAFF') {
            if (DEBUG) console.warn('[verifyAdmin] User is not admin or staff')
            return null
        }

        return {
            userId: dbUser.id,
            email: dbUser.email,
            role: roleUpper as 'ADMIN' | 'STAFF',
            isOriginalAdmin: roleUpper === 'ADMIN'
        }
    } catch (error) {
        console.error('Lỗi verify admin:', error)
        return null
    }
}
