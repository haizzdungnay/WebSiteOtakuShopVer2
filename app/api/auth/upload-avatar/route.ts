import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { deleteFileByUrl } from '@/lib/upload'
import { z } from 'zod'

const updateAvatarSchema = z.object({
  avatarUrl: z.string()
    .url('URL avatar không hợp lệ')
    .min(1, 'URL avatar không được để trống')
})

// PUT /api/auth/upload-avatar - Cập nhật avatar URL sau khi upload
export async function PUT(request: NextRequest) {
  try {
    // 1. Get user from token
    const authUser = getUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Validate input
    const body = await request.json()
    const { avatarUrl } = updateAvatarSchema.parse(body)

    // 3. Get current user
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { id: true, avatar: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // 4. Delete old avatar from storage (if exists and is from UploadThing)
    if (user.avatar && user.avatar.includes('utfs.io')) {
      try {
        await deleteFileByUrl(user.avatar)
        console.log('Old avatar deleted:', user.avatar)
      } catch (error) {
        console.error('Failed to delete old avatar:', error)
        // Continue even if deletion fails
      }
    }

    // 5. Update user avatar
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật avatar thành công',
      data: updatedUser
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Upload avatar error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật avatar' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/upload-avatar - Xóa avatar
export async function DELETE(request: NextRequest) {
  try {
    // 1. Get user from token
    const authUser = getUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Get current user
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { id: true, avatar: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.avatar) {
      return NextResponse.json(
        { success: false, error: 'No avatar to delete' },
        { status: 400 }
      )
    }

    // 3. Delete avatar from storage
    if (user.avatar.includes('utfs.io')) {
      try {
        await deleteFileByUrl(user.avatar)
        console.log('Avatar deleted:', user.avatar)
      } catch (error) {
        console.error('Failed to delete avatar:', error)
      }
    }

    // 4. Remove avatar from user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatar: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa avatar',
      data: updatedUser
    })

  } catch (error) {
    console.error('Delete avatar error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể xóa avatar' },
      { status: 500 }
    )
  }
}
