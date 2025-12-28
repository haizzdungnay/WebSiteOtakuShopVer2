import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const updateCategorySchema = z.object({
  name: z.string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(100, 'Tên danh mục quá dài')
    .optional(),
  
  description: z.string()
    .max(500, 'Mô tả quá dài')
    .optional()
    .nullable(),
  
  imageUrl: z.string()
    .url('URL ảnh không hợp lệ')
    .optional()
    .nullable()
})

// PUT /api/admin/categories/[id] - Cập nhật category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy danh mục' },
        { status: 404 }
      )
    }

    let slug = category.slug
    if (validatedData.name && validatedData.name !== category.name) {
      slug = generateSlug(validatedData.name)

      const existingSlug = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      })

      if (existingSlug) {
        return NextResponse.json(
          { success: false, error: 'Tên danh mục đã tồn tại (slug trùng)' },
          { status: 400 }
        )
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name, slug }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.imageUrl !== undefined && { imageUrl: validatedData.imageUrl })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: updatedCategory
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('[Admin] Update category error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật danh mục' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/[id] - Xóa category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy danh mục' },
        { status: 404 }
      )
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Không thể xóa danh mục đang có ${category._count.products} sản phẩm` 
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Xóa danh mục thành công'
    })

  } catch (error) {
    console.error('[Admin] Delete category error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể xóa danh mục' },
      { status: 500 }
    )
  }
}
