import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// Schema validation
const updateAddressSchema = z.object({
    label: z.string().optional(),
    fullName: z.string().min(2).max(100).optional(),
    phone: z.string().regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/).optional(),
    city: z.string().min(1).optional(),
    district: z.string().min(1).optional(),
    ward: z.string().optional(),
    address: z.string().min(5).optional(),
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
