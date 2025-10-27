import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// Schema validation
const updateAddressSchema = z.object({
    label: z.string().max(50, 'Label too long').optional(),
    fullName: z.string().min(1, 'Full name is required').max(100, 'Name too long').optional(),
    phone: z.string()
        .regex(/^(03[2-9]|05[2|6|8|9]|07[0|6|7|8|9]|08[1-9]|09[0-9])\d{7}$/, 'Invalid Vietnamese mobile phone number')
        .refine(val => val.length === 10, 'Phone must be exactly 10 digits')
        .optional(),
    city: z.string().min(1, 'Please select a city').max(100, 'City name too long').optional(),
    district: z.string().min(1, 'Please select a district').max(100, 'District name too long').optional(),
    ward: z.string().max(100, 'Ward name too long').optional().nullable(),
    address: z.string()
        .min(5, 'Please enter street address')
        .max(200, 'Address too long')
        .refine(val => val.trim().length >= 5, 'Street address cannot be only spaces')
        .optional(),
    isDefault: z.boolean().optional()
})

// PATCH /api/addresses/[id] - Cập nhật địa chỉ
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const validatedData = updateAddressSchema.parse(body)

        // 3. Tìm address và check ownership
        const existingAddress = await prisma.address.findUnique({
            where: { id: params.id }
        })

        if (!existingAddress) {
            return NextResponse.json(
                { success: false, error: 'Address not found' },
                { status: 404 }
            )
        }

        if (existingAddress.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Forbidden' },
                { status: 403 }
            )
        }

        // 4. Nếu set làm default, bỏ default các địa chỉ khác
        if (validatedData.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: user.userId,
                    id: { not: params.id }
                },
                data: { isDefault: false }
            })
        }

        // 5. Update address
        const updatedAddress = await prisma.address.update({
            where: { id: params.id },
            data: validatedData
        })

        return NextResponse.json({
            success: true,
            message: 'Address updated successfully',
            data: updatedAddress
        })

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

        console.error('Update address error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update address' },
            { status: 500 }
        )
    }
}

// DELETE /api/addresses/[id] - Xóa địa chỉ
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 1. Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // 2. Tìm address và check ownership
        const address = await prisma.address.findUnique({
            where: { id: params.id }
        })

        if (!address) {
            return NextResponse.json(
                { success: false, error: 'Address not found' },
                { status: 404 }
            )
        }

        if (address.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Forbidden' },
                { status: 403 }
            )
        }

        // 3. Xóa address
        await prisma.address.delete({
            where: { id: params.id }
        })

        // 4. Nếu xóa default address, set default cho address khác
        if (address.isDefault) {
            const firstAddress = await prisma.address.findFirst({
                where: { userId: user.userId },
                orderBy: { createdAt: 'asc' }
            })

            if (firstAddress) {
                await prisma.address.update({
                    where: { id: firstAddress.id },
                    data: { isDefault: true }
                })
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Address deleted successfully'
        })

    } catch (error) {
        console.error('Delete address error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete address' },
            { status: 500 }
        )
    }
}
