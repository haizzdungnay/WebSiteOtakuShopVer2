import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Định nghĩa schema để validate với zod
const registerSchema = z.object({
    email: z
        .string()
        .email('Invalid email format')
        .toLowerCase(), // chuyển về lowercase

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password is too long'),

    fullName: z
        .string()
        .min(2, 'Must be at least 2 characters')
        .max(100, 'Your name is too long')
        .trim(), // loại bỏ khoảng trắng thừa
        
    phone: z
        .string()
        .regex(/^(03[2-9]|05[2|6|8|9]|07[0|6|7|8|9]|08[1-9]|09[0-9])\d{7}$/, 'Số điện thoại di động không hợp lệ') // giới hạn các đầu số của nhà mạng Việt Nam
        .optional()
        .or(z.literal('')), // cho phép để trống
})

export async function POST(request: Request) {
    try {
        // parse body từ request
        const body = await request.json()

        //validate input với zod
        const validatedData = registerSchema.parse(body)

        // Check email đã được dùng chưa
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email }
        })

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email has already been registered'
                },
                { status: 400 }
            )
        }

        // Hash password
        const passwordHash = await bcrypt.hash(validatedData.password, 10) // 10 rounds for 2^10 = 1024 rounds

        // Tạo user mới
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                passwordHash: passwordHash,
                fullName: validatedData.fullName,
                phone: validatedData.phone || null,
                role: 'CUSTOMER'
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                createdAt: true
                // Không trả về passwordHash, trả về là toang đấy :)))))
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                data: user
            },
            { status: 201 } // Created
        )
    } catch (error) {
        // Xử lý lỗi validate của zod
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
        console.error('Registration error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Registration failed'
            },
            { status: 500 }
        )
    }
}