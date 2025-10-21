import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        // Tìm product theo slug
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        })

        // Nếu không tìm thấy product -> trả về 404
        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Product not found'
                },
                { status: 404 }
            )
        }

        // Nếu product không active -> trả về 404
        if (!product.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Product is not available'
                },
                { status: 404 }
            )
        }

        // Trả về product
        return NextResponse.json({
            success: true,
            data: product
        })
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch product'
            },
            { status: 500 }
        )
    }
}