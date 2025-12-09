import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Interface cho payload trong token
export interface JWTPayLoad {
    userId: string
    email: string
    role: string
    iat: number
    exp: number
}

// Verify JWT token
export function verifyToken(token: string): JWTPayLoad | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayLoad
        return decoded
    }
    catch (error) {
        // Nếu token không hợp lệ hoặc hết hạn
        return null
    }
}

// Lấy token từ header Authorization
export function getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('Authorization')

    //Format: "Bearer <token>"
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7) // Lấy phần <token>
    }

    return null
}

// Helper: Get user from request
export function getUserFromRequest(request: NextRequest): JWTPayLoad | null {
    const token = getTokenFromRequest(request)

    if (!token) {
        return null
    }

    return verifyToken(token)
}