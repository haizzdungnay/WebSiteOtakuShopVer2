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
        const sort = searchParams.get('sort') || 'createdAt' // field để sort
        const order = searchParams.get('order') || 'desc' // asc hoặc desc
        const featured = searchParams.get('featured') // 'true' hoặc null

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

        //search by name hoặc description
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
                    [sort]: order
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
            error: 'Failed to fetch products'
        },
        { status: 500 }
    )
}
}
