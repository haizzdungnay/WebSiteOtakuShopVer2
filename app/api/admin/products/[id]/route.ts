import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

// Helper generate slug từ tên sản phẩm
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Schema validate update sản phẩm
const updateProductSchema = z.object({
  name: z.string()
    .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
    .max(200, 'Tên sản phẩm quá dài')
    .optional(),

  description: z.string()
    .min(20, 'Mô tả phải có ít nhất 20 ký tự')
    .max(5000, 'Mô tả quá dài')
    .optional(),

  price: z.number()
    .min(0, 'Giá phải lớn hơn 0')
    .max(1000000000, 'Giá quá cao')
    .optional(),

  comparePrice: z.number()
    .min(0)
    .optional()
    .nullable(),

  categoryId: z.string()
    .min(1, 'Vui lòng chọn danh mục')
    .optional(),

  stockQuantity: z.number()
    .int('Số lượng phải là số nguyên')
    .min(0, 'Số lượng không được âm')
    .optional(),

  images: z.array(z.string().url())
    .min(1, 'Vui lòng thêm ít nhất 1 ảnh')
    .max(10, 'Tối đa 10 ảnh')
    .optional(),

  isActive: z.boolean()
    .optional(),

  featured: z.boolean()
    .optional(),

  preorderStatus: z.enum(['NONE', 'PREORDER', 'ORDER'])
    .optional(),

  // New product detail fields
  seriesName: z.string().max(200).optional().nullable(),
  brandName: z.string().max(200).optional().nullable(),
  releaseDate: z.string().optional().nullable(),
  msrpValue: z.number().min(0).optional().nullable(),
  msrpCurrency: z.string().max(3).optional().nullable(),
  productCode: z.string().max(64).optional().nullable(),
  features: z.string().max(5000).optional().nullable(),
  condition: z.string().max(100).optional().nullable(),
})

// PUT /api/admin/products/[id] - Cập nhật sản phẩm
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Check admin authorization
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    // 2. Kiểm tra sản phẩm tồn tại
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      )
    }

    // 3. Validate input
    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    // 4. Tạo slug mới nếu name thay đổi
    let slug = product.slug
    if (validatedData.name && validatedData.name !== product.name) {
      slug = generateSlug(validatedData.name)

      // Kiểm tra slug trùng
      const existingSlug = await prisma.product.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      })

      if (existingSlug) {
        slug = `${slug}-${Math.floor(Math.random() * 10000)}`
      }
    }

    // 5. Kiểm tra category tồn tại (nếu update category)
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId }
      })

      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Danh mục không tồn tại' },
          { status: 404 }
        )
      }
    }

    // 6. Validate comparePrice
    const finalPrice = validatedData.price ?? Number(product.price)
    if (
      validatedData.comparePrice !== undefined &&
      validatedData.comparePrice !== null &&
      validatedData.comparePrice <= finalPrice
    ) {
      return NextResponse.json(
        { success: false, error: 'Giá so sánh phải cao hơn giá bán' },
        { status: 400 }
      )
    }

    // 7. Handle series - create or find existing
    let seriesConnect = undefined;
    if (validatedData.seriesName) {
      const seriesSlug = validatedData.seriesName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const series = await prisma.series.upsert({
        where: { slug: seriesSlug },
        create: { name: validatedData.seriesName, slug: seriesSlug },
        update: {}
      });
      // Remove old series relations and add new one
      await prisma.productSeries.deleteMany({ where: { productId: id } });
      seriesConnect = { create: { seriesId: series.id } };
    }

    // Handle brand - create or find existing
    let brandId = undefined;
    if (validatedData.brandName) {
      const brandSlug = validatedData.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const brand = await prisma.brand.upsert({
        where: { slug: brandSlug },
        create: { name: validatedData.brandName, slug: brandSlug },
        update: {}
      });
      brandId = brand.id;
    }

    // 8. Update sản phẩm
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name, slug }),
        ...(validatedData.description && { description: validatedData.description }),
        ...(validatedData.price !== undefined && { price: validatedData.price }),
        ...(validatedData.comparePrice !== undefined && { comparePrice: validatedData.comparePrice }),
        ...(validatedData.categoryId && { categoryId: validatedData.categoryId }),
        ...(validatedData.stockQuantity !== undefined && { stockQuantity: validatedData.stockQuantity }),
        ...(validatedData.images && { images: validatedData.images }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
        ...(validatedData.featured !== undefined && { featured: validatedData.featured }),
        ...(validatedData.preorderStatus !== undefined && { preorderStatus: validatedData.preorderStatus }),
        // New detail fields
        ...(validatedData.productCode !== undefined && { productCode: validatedData.productCode }),
        ...(validatedData.releaseDate !== undefined && { releaseDate: validatedData.releaseDate ? new Date(validatedData.releaseDate) : null }),
        ...(validatedData.msrpValue !== undefined && { msrpValue: validatedData.msrpValue }),
        ...(validatedData.msrpCurrency !== undefined && { msrpCurrency: validatedData.msrpCurrency }),
        ...(validatedData.features !== undefined && { features: validatedData.features }),
        ...(validatedData.condition !== undefined && { condition: validatedData.condition }),
        ...(brandId && { brandId }),
        ...(seriesConnect && { series: seriesConnect }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true
          }
        },
        series: {
          include: {
            series: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: updatedProduct
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('[Admin] Update product error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật sản phẩm' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[id] - Xóa sản phẩm
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Check admin authorization
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { id } = await params

    // 2. Kiểm tra sản phẩm tồn tại
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            cartItems: true,
            orderItems: true,
            reviews: true,
            wishlists: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      )
    }

    // 3. Kiểm tra dependencies
    const dependencies = []

    if (product._count.orderItems > 0) {
      dependencies.push(`${product._count.orderItems} đơn hàng`)
    }
    if (product._count.cartItems > 0) {
      dependencies.push(`${product._count.cartItems} giỏ hàng`)
    }
    if (product._count.reviews > 0) {
      dependencies.push(`${product._count.reviews} đánh giá`)
    }
    if (product._count.wishlists > 0) {
      dependencies.push(`${product._count.wishlists} yêu thích`)
    }

    if (dependencies.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Không thể xóa sản phẩm đang có ${dependencies.join(', ')}. Vui lòng vô hiệu hóa thay vì xóa.`
        },
        { status: 400 }
      )
    }

    // 4. Xóa sản phẩm
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    })

  } catch (error) {
    console.error('[Admin] Delete product error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể xóa sản phẩm' },
      { status: 500 }
    )
  }
}
