import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

export async function GET(request: NextRequest) {
    try {
        // Lấy user từ request
        const tokenUser = await getUserFromRequest(request)

        // Case 1: Không có token hoặc token không hợp lệ
        if (!tokenUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng đăng nhập'
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
                gender: true,
                dateOfBirth: true,
                avatar: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })

        // Case 3: User không tồn tại trong database
        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'Không tìm thấy thông tin tài khoản'
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
                error: 'Không thể lấy thông tin tài khoản'
            },
            { status: 500 } // Server error
        )
    }
}

// Validation schema cho update profile
const updateProfileSchema = z.object({
    fullName: z.string()
        .min(2, 'Họ tên phải có ít nhất 2 ký tự')
        .max(100, 'Họ tên quá dài')
        .optional(),
    phone: z.string()
        .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-4|6-9])[0-9]{7}$/, 'Số điện thoại không hợp lệ')
        .optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    dateOfBirth: z.string().datetime().optional(),
    avatar: z.string().url('Avatar phải là URL hợp lệ').optional()
})

// PUT /api/auth/profile - Cập nhật profile
export async function PUT(request: NextRequest) {
    try {
        // 1. Check authentication
        const tokenUser = getUserFromRequest(request)
        if (!tokenUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vui lòng đăng nhập'
                },
                { status: 401 }
            )
        }

        // 2. Validate input
        const body = await request.json()
        const validatedData = updateProfileSchema.parse(body)

        // 3. Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: tokenUser.userId },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy tài khoản'
                },
                { status: 404 }
            )
        }

        // 4. Check phone uniqueness if phone is being updated
        if (validatedData.phone) {
            const existingPhone = await prisma.user.findFirst({
                where: {
                    phone: validatedData.phone,
                    id: { not: tokenUser.userId }
                }
            })

            if (existingPhone) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Số điện thoại đã được sử dụng'
                    },
                    { status: 400 }
                )
            }
        }

        // 5. Update profile
        const updatedUser = await prisma.user.update({
            where: { id: tokenUser.userId },
            data: {
                ...(validatedData.fullName && { fullName: validatedData.fullName }),
                ...(validatedData.phone && { phone: validatedData.phone }),
                ...(validatedData.gender && { gender: validatedData.gender }),
                ...(validatedData.dateOfBirth && { dateOfBirth: new Date(validatedData.dateOfBirth) }),
                ...(validatedData.avatar && { avatar: validatedData.avatar })
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                gender: true,
                dateOfBirth: true,
                avatar: true,
                role: true,
                updatedAt: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Cập nhật thông tin thành công',
            data: updatedUser
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.issues[0].message
                },
                { status: 400 }
            )
        }

        console.error('[Auth] Update profile error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể cập nhật thông tin. Vui lòng thử lại'
            },
            { status: 500 }
        )
    }
}