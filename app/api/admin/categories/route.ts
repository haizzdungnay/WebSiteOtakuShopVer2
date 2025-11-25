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

const createCategorySchema = z.object({
  name: z.string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(100, 'Tên danh mục quá dài'),
  
  description: z.string()
    .max(500, 'Mô tả quá dài')
    .optional()
    .nullable(),
  
  imageUrl: z.string()
    .url('URL ảnh không hợp lệ')
    .optional()
    .nullable()
})

// GET /api/admin/categories - Danh sách categories
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { products: true } }
        }
      }),
      prisma.category.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        categories,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('[Admin] Get categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách danh mục' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Tạo category mới
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    const slug = generateSlug(validatedData.name)

    const existingSlug = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'Tên danh mục đã tồn tại (slug trùng)' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('[Admin] Create category error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể tạo danh mục' },
      { status: 500 }
    )
  }
}