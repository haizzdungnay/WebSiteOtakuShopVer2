import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

// Schema để validate input với zod
const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ').toLowerCase(),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
})

export async function POST(request: Request) {
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

        // Case 3: Password đúng -> tạo JWT
        const token = jwt.sign(
            {
                // Payload
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET!, // secret key
            {
                expiresIn: '7d' // tạo token có hạn trong 7 ngày
            }
        )

        // trả về token và user info lưu ý không trả về passwordHash
        return NextResponse.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    phone: user.phone,
                    role: user.role
                }
            }
        })
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
