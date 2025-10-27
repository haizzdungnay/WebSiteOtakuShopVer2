import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// Validation schema
const createAddressSchema = z.object({
    label: z.string().optional().default('Home'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
    phone: z.string().regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, 'Invalid Vietnamese phone number'),
    city: z.string().min(1, 'City/Province is required'),
    district: z.string().min(1, 'District is required'),
    ward: z.string().optional(),
    address: z.string().min(5, 'Full address must be at least 5 characters'),
    isDefault: z.boolean().optional().default(false)
})

// POST /api/addresses - Tạo địa chỉ mới
export async function POST(request: NextRequest) {
    try {
        // 1. Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // 2. Validate input
        const body = await request.json()
        const validatedData = createAddressSchema.parse(body)

        // 3. Nếu set làm default, bỏ default các địa chỉ cũ
        if (validatedData.isDefault) {
            await prisma.address.updateMany({
                where: { userId: user.userId },
                data: { isDefault: false }
            })
        }

        // 4. Tạo địa chỉ mới
        const address = await prisma.address.create({
            data: {
                userId: user.userId,
                label: validatedData.label,
                fullName: validatedData.fullName,
                phone: validatedData.phone,
                city: validatedData.city,
                district: validatedData.district,
                ward: validatedData.ward,
                address: validatedData.address,
                isDefault: validatedData.isDefault
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Address created successfully',
            data: address
        }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation error',
                    details: error.issues
                },
                { status: 400 }
            )
        }

        console.error('Create address error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create address' },
            { status: 500 }
        )
    }
}

// GET /api/addresses - Lấy danh sách địa chỉ
export async function GET(request: NextRequest) {
    try {
        // 1. Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // 2. Lấy tất cả địa chỉ của user
        const addresses = await prisma.address.findMany({
            where: { userId: user.userId },
            orderBy: [
                { isDefault: 'desc' },  // Default address lên đầu
                { createdAt: 'desc' }   // Mới nhất tiếp theo
            ]
        })

        return NextResponse.json({
            success: true,
            data: {
                addresses,
                count: addresses.length
            }
        })

    } catch (error) {
        console.error('Get addresses error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch addresses' },
            { status: 500 }
        )
    }
}
