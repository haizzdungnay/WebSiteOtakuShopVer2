import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Search products by name and product code
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            productCode: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        price: true,
        comparePrice: true
      },
      take: 5,
      orderBy: {
        name: 'asc'
      }
    });

    const suggestions = products.map((product: any) => ({
      type: 'product' as const,
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0],
      price: product.price,
      comparePrice: product.comparePrice
    }));

    return NextResponse.json({
      success: true,
      data: suggestions.slice(0, 8) // Limit to 8 suggestions
    });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Không thể tải gợi ý tìm kiếm'
      },
      { status: 500 }
    );
  }
}
