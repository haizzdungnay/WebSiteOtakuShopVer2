import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // lấy query param từ url
        const searchParams = request.nextUrl.searchParams

        // Parse params với default values
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const category = searchParams.get('category') // slug của category (chỉ lấy 1)
        const search = searchParams.get('search')
        const sortParam = searchParams.get('sort') || 'newest' // sort option
        const featured = searchParams.get('featured') // 'true' hoặc null
        const inStock = searchParams.get('inStock') // 'true' = only in-stock products
        const preorder = searchParams.get('preorder') // 'true' = only pre-order products

        // Map sort param to actual field and order
        let sortField = 'createdAt'
        let sortOrder: 'asc' | 'desc' = 'desc'

        switch (sortParam) {
            case 'newest':
                sortField = 'createdAt'
                sortOrder = 'desc'
                break
            case 'oldest':
                sortField = 'createdAt'
                sortOrder = 'asc'
                break
            case 'price-asc':
                sortField = 'price'
                sortOrder = 'asc'
                break
            case 'price-desc':
                sortField = 'price'
                sortOrder = 'desc'
                break
            case 'name-asc':
                sortField = 'name'
                sortOrder = 'asc'
                break
            case 'name-desc':
                sortField = 'name'
                sortOrder = 'desc'
                break
            default:
                // If it's a valid field name, use it directly
                if (['createdAt', 'updatedAt', 'price', 'name', 'stockQuantity'].includes(sortParam)) {
                    sortField = sortParam
                    sortOrder = searchParams.get('order') === 'asc' ? 'asc' : 'desc'
                }
        }

        // Build where condition
        const where: any = {
            isActive: true // Chỉ lấy products active
        }

        // Filter by category
        if (category) {
            where.category = {
                slug: category
            }
        }

        //Filter feature products
        if (featured == 'true') {
            where.featured = true
        }

        // Filter by stock status - In-stock products (preorderStatus = NONE and stockQuantity > 0)
        if (inStock === 'true') {
            where.preorderStatus = 'NONE'
            where.stockQuantity = { gt: 0 }
        }

        // Filter by pre-order status
        if (preorder === 'true') {
            where.preorderStatus = { in: ['PREORDER', 'ORDER'] }
        }

        //search by name, description, shortDescription, productCode
        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive' // không phân biệt hoa thường
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    shortDescription: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    productCode: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        }
        // Query products + count total
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
                    }
                },
                orderBy: {
                    [sortField]: sortOrder
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.product.count({ where })
        ])

        // Return với pagination info
        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể lấy danh sách sản phẩm'
            },
            { status: 500 }
        )
    }
}
