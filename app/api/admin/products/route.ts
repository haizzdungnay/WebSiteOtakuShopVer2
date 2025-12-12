import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'
import { z } from 'zod'
import { compare } from 'bcryptjs'

// Helper generate slug từ tên sản phẩm

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // xoa dấu
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

// Schema validate tạo sản phẩm
const createProductSchema = z.object({
    name: z.string()
        .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
        .max(200, 'Tên sản phẩm quá dài'),

    slug: z.string()
        .max(200)
        .optional(),

    description: z.string()
        .min(20, 'Mô tả phải có ít nhất 20 ký tự')
        .max(5000, 'Mô tả quá dài'),

    price: z.number()
        .min(0, 'Giá phải lớn hơn 0')
        .max(1000000000, 'Giá quá cao'),

    comparePrice: z.number()
        .min(0)
        .optional()
        .nullable(),

    categoryId: z.string()
        .min(1, 'Vui lòng chọn danh mục'),

    stockQuantity: z.number()
        .int('Số lượng phải là số nguyên')
        .min(0, 'Số lượng không được âm'),

    images: z.array(z.string().url())
        .min(1, 'Vui lòng thêm ít nhất 1 ảnh')
        .max(10, 'Tối đa 10 ảnh'),

    isActive: z.boolean()
        .optional()
        .default(true),

    featured: z.boolean()
        .optional()
        .default(false),

    preorderStatus: z.enum(['NONE', 'PREORDER', 'ORDER'])
        .optional()
        .default('NONE'),

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

// GET /api/admin/products - Lấy danh sách sản phẩm (có phân trang)

export async function GET(request: NextRequest) {
    try {
        // 1 Check admin authorization
        const admin = await verifyAdmin(request)
        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Truy cập bị từ chối'
                },
                { status: 403 }
            )
        }

        // 2 Lấy danh sách sản phẩm
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const categoryId = searchParams.get('categoryId')
        const isActive = searchParams.get('isActive')
        const isFeatured = searchParams.get('isFeatured')
        const stockStatus = searchParams.get('stockStatus') // 'in_stock', 'low_stock', 'out_of_stock'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        // 3 Xây dựng điều kiện lọc
        const where: any = {}

        // Tim kiếm theo tên hoặc slug
        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    },
                    slug: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        }

        // Lọc theo danh mục
        if (categoryId) {
            where.categoryId = categoryId
        }

        // Lọc theo trạng thái hoạt động
        if (isActive !== null) {
            where.isActive = isActive === 'true'
        }

        // Lọc theo trạng thái nổi bật
        if (isFeatured !== null) {
            where.featured = isFeatured === 'true'
        }

        // Lọc theo trạng thái kho hàng
        if (stockStatus) {
            switch (stockStatus) {
                case 'in_stock':
                    where.stockQuantity = { gt: 10 }
                    break
                case 'low_stock':
                    where.stockQuantity = { gte: 1, lte: 10 }
                    break
                case 'out_of_stock':
                    where.stockQuantity = 0
                    break
            }
        }

        // 4 Lấy products và phân trang
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
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
                },
                orderBy: [
                    { createdAt: 'desc' }
                ],
                skip,
                take: limit
            }),
            prisma.product.count({ where })
        ])

        // 5 Thêm trạng thái vào mỗi sản phẩm
        const productsWithStatus = products.map(product => ({
            ...product,
            stockStatus:
                product.stockQuantity === 0 ? 'out_of_stock' :
                    product.stockQuantity <= 10 ? 'low_stock' :
                        'in_stock',
            // Flatten series and brand for easier access
            seriesName: product.series?.[0]?.series?.name || null,
            brandName: product.brand?.name || null,
        }))

        return NextResponse.json({
            success: true,
            data: {
                products: productsWithStatus,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                },
                summary: {
                    total,
                    active: await prisma.product.count({ where: { ...where, isActive: true } }),
                    inactive: await prisma.product.count({ where: { ...where, isActive: false } }),
                    outOfStock: await prisma.product.count({ where: { ...where, stockQuantity: 0 } }),
                    lowStock: await prisma.product.count({
                        where: { ...where, stockQuantity: { gt: 0, lte: 10 } }
                    }),
                    inStock: await prisma.product.count({
                        where: { ...where, stockQuantity: { gt: 10 } }
                    })
                }
            }
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

        console.error('Get products error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể lấy danh sách sản phẩm. Vui lòng thử lại'
            },
            { status: 500 }
        )
    }
}

// POST /api/admin/products - Tạo sản phẩm mới  
export async function POST(request: NextRequest) {
    try {
        // 1 Check admin authorization
        const admin = await verifyAdmin(request)
        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Chỉ quản trị viên mới có quyền quản lý sản phẩm'
                },
                { status: 403 }
            )
        }

        // 2 Validate input
        const body = await request.json()
        const validatedData = createProductSchema.parse(body)

        // 3 Tạo slug nếu không có
        let slug = validatedData.slug || generateSlug(validatedData.name)

        // Kiểm tra slug đã tồn tại chưa, nếu có thì thêm số vào cuối
        const existingSlug = await prisma.product.findUnique({
            where: {
                slug
            },
            select: {
                id: true
            }
        })

        if (existingSlug) {
            // thêm số ngẫu nhiên vào cuối slug
            slug = `${slug}-${Math.floor(Math.random() * 10000)}`
        }

        // 4 Kiểm tra category tồn tại
        const category = await prisma.category.findUnique({
            where: {
                id: validatedData.categoryId
            },
            select: {
                id: true,
                name: true
            }
        })

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Danh mục không tồn tại'
                },
                { status: 404 }
            )
        }

        // 5 Validate compareAtPrice
        if (validatedData.comparePrice !== undefined &&
            validatedData.comparePrice !== null &&
            validatedData.comparePrice <= validatedData.price) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Giá so sánh phải cao hơn giá bán'
                },
                { status: 400 }
            )
        }

        // 6 Tạo sản phẩm
        // Handle series - create or find existing
        let seriesConnect = undefined;
        if (validatedData.seriesName) {
            const seriesSlug = validatedData.seriesName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const series = await prisma.series.upsert({
                where: { slug: seriesSlug },
                create: { name: validatedData.seriesName, slug: seriesSlug },
                update: {}
            });
            seriesConnect = { create: { seriesId: series.id } };
        }

        // Handle brand - create or find existing
        let brandConnect = undefined;
        if (validatedData.brandName) {
            const brandSlug = validatedData.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const brand = await prisma.brand.upsert({
                where: { slug: brandSlug },
                create: { name: validatedData.brandName, slug: brandSlug },
                update: {}
            });
            brandConnect = brand.id;
        }

        const product = await prisma.product.create({
            data: {
                name: validatedData.name,
                slug: slug,
                description: validatedData.description,
                price: validatedData.price,
                comparePrice: validatedData.comparePrice,
                categoryId: validatedData.categoryId,
                stockQuantity: validatedData.stockQuantity,
                images: validatedData.images,
                isActive: validatedData.isActive,
                featured: validatedData.featured,
                preorderStatus: validatedData.preorderStatus,
                // New detail fields
                productCode: validatedData.productCode,
                releaseDate: validatedData.releaseDate ? new Date(validatedData.releaseDate) : null,
                msrpValue: validatedData.msrpValue,
                msrpCurrency: validatedData.msrpCurrency || 'JPY',
                features: validatedData.features,
                condition: validatedData.condition,
                brandId: brandConnect,
                series: seriesConnect,
                averageRating: 0,
                reviewCount: 0
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

        return NextResponse.json(
            {
                success: true,
                message: 'Tạo sản phẩm thành công',
                data: product
            },
            { status: 201 }
        )
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

        console.error('Lỗi không xác định', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Tạo sản phẩm thất bại. Vui lòng thử lại'
            },
            { status: 500 }
        )
    }
}