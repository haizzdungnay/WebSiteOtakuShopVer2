import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// Schema validation
const updateAddressSchema = z.object({
    label: z.string().max(50, 'Nhãn địa chỉ quá dài').optional(),
    fullName: z.string().min(1, 'Vui lòng nhập họ và tên').max(100, 'Họ và tên quá dài').optional(),
    phone: z.string()
        .regex(/^(03[2-9]|05[2|6|8|9]|07[0|6|7|8|9]|08[1-9]|09[0-9])\d{7}$/, 'Số điện thoại di động không hợp lệ')
        .refine(val => val.length === 10, 'Số điện thoại phải có đúng 10 chữ số')
        .optional(),
    city: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố').max(100, 'Tên tỉnh/thành phố quá dài').optional(),
    district: z.string().min(1, 'Vui lòng chọn quận/huyện').max(100, 'Tên quận/huyện quá dài').optional(),
    ward: z.string().max(100, 'Tên phường/xã quá dài').optional().nullable(),
    address: z.string()
        .min(5, 'Vui lòng nhập địa chỉ')
        .max(200, 'Địa chỉ quá dài')
        .refine(val => val.trim().length >= 5, 'Địa chỉ không được chỉ có khoảng trắng')
        .optional(),
    isDefault: z.boolean().optional()
})

// PATCH /api/addresses/[id] - Cập nhật địa chỉ
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Get params (Next.js 16+ requires await)
        const { id } = await params

        // 1. Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập' },
                { status: 401 }
            )
        }

        // 2. Validate input
        const body = await request.json()
        const validatedData = updateAddressSchema.parse(body)

        // 3. Tìm address và check ownership
        const existingAddress = await prisma.address.findUnique({
            where: { id }
        })

        if (!existingAddress) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy địa chỉ' },
                { status: 404 }
            )
        }

        if (existingAddress.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Bạn không có quyền truy cập địa chỉ này' },
                { status: 403 }
            )
        }

        // 4. Nếu set làm default, bỏ default các địa chỉ khác
        if (validatedData.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: user.userId,
                    id: { not: id }
                },
                data: { isDefault: false }
            })
        }

        // 5. Update address
        const updatedAddress = await prisma.address.update({
            where: { id },
            data: validatedData
        })

        return NextResponse.json({
            success: true,
            message: 'Cập nhật địa chỉ thành công',
            data: updatedAddress
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Dữ liệu không hợp lệ',
                    details: error.issues
                },
                { status: 400 }
            )
        }

        console.error('Update address error:', error)
        return NextResponse.json(
            { success: false, error: 'Không thể cập nhật địa chỉ. Vui lòng thử lại' },
            { status: 500 }
        )
    }
}

// DELETE /api/addresses/[id] - Xóa địa chỉ
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Get params (Next.js 16+ requires await)
        const { id } = await params

        // 1. Check authentication
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập' },
                { status: 401 }
            )
        }

        // 2. Tìm address và check ownership
        const address = await prisma.address.findUnique({
            where: { id }
        })

        if (!address) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy địa chỉ' },
                { status: 404 }
            )
        }

        if (address.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Bạn không có quyền xóa địa chỉ này' },
                { status: 403 }
            )
        }

        // 3. Xóa address
        await prisma.address.delete({
            where: { id }
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
            message: 'Xóa địa chỉ thành công'
        })

    } catch (error) {
        console.error('Delete address error:', error)
        return NextResponse.json(
            { success: false, error: 'Không thể xóa địa chỉ. Vui lòng thử lại' },
            { status: 500 }
        )
    }
}
