import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

// Schema để validate input với zod
const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ').toLowerCase(),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
})

const ACCESS_TOKEN_TTL = '1h'
const REFRESH_TOKEN_TTL = '7d'
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
}

export async function POST(request: NextRequest) {
    try {
        // Parse body từ request
        const body = await request.json()

        // Validate input với zod
        const { email, password } = loginSchema.parse(body)

        // Tìm user theo email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        // Case 1: User không tồn tại
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email hoặc mật khẩu không đúng'
                },
                { status: 401 } // Unauthorized
            )
        }

        // Case 2: Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email hoặc mật khẩu không đúng'
                },
                { status: 401 }
            )
        }

        // Case 3: Check if email is verified
        if (!user.emailVerified) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng xác nhận email trước khi đăng nhập',
                    needVerification: true,
                    email: user.email
                },
                { status: 403 }
            )
        }

        // Case 4: Password đúng -> tạo JWT
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        }

        const token = jwt.sign(
            { ...tokenPayload, tokenType: 'access' },
            process.env.JWT_SECRET!,
            {
                expiresIn: ACCESS_TOKEN_TTL
            }
        )

        const refreshToken = jwt.sign(
            { ...tokenPayload, tokenType: 'refresh' },
            process.env.JWT_SECRET!,
            {
                expiresIn: REFRESH_TOKEN_TTL
            }
        )

        // trả về token và user info lưu ý không trả về passwordHash
        const response = NextResponse.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    phone: user.phone,
                    role: user.role
                }
            }
        })

        response.cookies.set('token', token, { ...COOKIE_OPTIONS, maxAge: 60 * 60 })
        response.cookies.set('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 7 })

        return response
    }
    catch (error) {
        // validatation error
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.issues[0].message // trả về lỗi đầu tiên
                },
                { status: 400 }
            )
        }

        // Lỗi server khác
        console.error('Login error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Đăng nhập thất bại. Vui lòng thử lại'
            },
            { status: 500 }
        )
    }
}
