import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

//GET /api/categories
export async function GET() {
    try {
        // Query database
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc' // Sắp xếp theo tên A-Z
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                imageUrl: true,
                createdAt: true
            }
        })

        // Return JSON response
        return NextResponse.json({
            success: true,
            data: categories
        })
    }
    catch (error) {
        // Errror handling
        console.error('Error fetching categories:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Không thể lấy danh sách danh mục'
            },
            { status: 500}
        )
    }
}