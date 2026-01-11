import Sidebar from '@/components/Sidebar';
import ProductCard from '@/components/ProductCard';
import NewsCarousel from '@/components/NewsCarousel';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

// Interface for product from database
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  featured: boolean;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

// Fetch products directly from database
async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Convert Decimal to number for serialization
    return products.map(p => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Transform product for ProductCard component
function transformProduct(product: Product) {
  const price = product.price;
  const comparePrice = product.comparePrice || 0;
  const hasDiscount = comparePrice > price;

  const salePercentage = hasDiscount
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  // Determine badge based on product attributes
  let badge: 'hot' | 'new' | 'sale' | undefined;
  if (product.featured) {
    badge = 'hot';
  } else if (new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
    badge = 'new'; // Products created within last 7 days
  }

  return {
    id: product.id,
    name: product.name,
    price: product.comparePrice || product.price,
    discountPrice: hasDiscount ? product.price : undefined,
    image: product.images?.[0] || '/images/placeholder.jpg',
    badge,
    salePercentage: salePercentage > 0 ? salePercentage : undefined,
    slug: product.slug,
  };
}

// Client Component wrapper for sidebar interaction
import HomepageClient from './HomepageClient';

export default async function Home() {
  // Fetch data on server
  const products = await getProducts();

  // Filter products
  const hotProducts = products.filter(p => p.featured).slice(0, 10);
  const newProducts = products
    .filter(p => new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .slice(0, 10);
  const saleProducts = products
    .filter(p => p.comparePrice && p.comparePrice > p.price)
    .slice(0, 10);
  const allProducts = products.slice(0, 10);

  // Transform products for cards
  const transformedHotProducts = hotProducts.map(transformProduct);
  const transformedNewProducts = newProducts.map(transformProduct);
  const transformedSaleProducts = saleProducts.map(transformProduct);
  const transformedAllProducts = allProducts.map(transformProduct);

  return (
    <div className="bg-background-light">
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="container-custom space-y-6 sm:space-y-8 lg:space-y-10">
          {/* HÀNG TRÊN: Sidebar + News Carousel */}
          <div className="flex gap-4 items-stretch">
            {/* SIDEBAR - ẩn trên mobile */}
            <div className="hidden lg:block w-[280px] flex-shrink-0">
              <HomepageClient />
            </div>

            {/* News Carousel Banner - Tin tức hot */}
            <div className="flex-1 min-w-0">
              <NewsCarousel />
            </div>
          </div>

          {/* HÀNG DƯỚI: các section sản phẩm – full chiều ngang phần content */}
          <div>
            {/* SẢN PHẨM HOT */}
            {transformedHotProducts.length > 0 && (
              <div className="mb-8 sm:mb-10 lg:mb-12">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-6 sm:h-8 bg-accent-red" />
                    SẢN PHẨM HOT
                  </h2>
                  <Link
                    href="/products?featured=true"
                    className="text-accent-red hover:underline flex items-center gap-1 font-semibold text-sm sm:text-base"
                  >
                    Xem tất cả <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                  {transformedHotProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>
            )}

            {/* HÀNG MỚI VỀ */}
            {transformedNewProducts.length > 0 && (
              <div className="mb-8 sm:mb-10 lg:mb-12">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-6 sm:h-8 bg-green-500" />
                    HÀNG MỚI VỀ
                  </h2>
                  <Link
                    href="/products?sort=createdAt&order=desc"
                    className="text-accent-red hover:underline flex items-center gap-1 font-semibold text-sm sm:text-base"
                  >
                    Xem tất cả <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                  {transformedNewProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>
            )}

            {/* ĐANG GIẢM GIÁ */}
            {transformedSaleProducts.length > 0 && (
              <div className="mb-8 sm:mb-10 lg:mb-12">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-6 sm:h-8 bg-orange-500" />
                    ĐANG GIẢM GIÁ
                  </h2>
                  <Link
                    href="/products"
                    className="text-accent-red hover:underline flex items-center gap-1 font-semibold text-sm sm:text-base"
                  >
                    Xem tất cả <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                  {transformedSaleProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>
            )}

            {/* TẤT CẢ SẢN PHẨM */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-6 sm:h-8 bg-primary" />
                  TẤT CẢ SẢN PHẨM
                </h2>
                <Link
                  href="/products"
                  className="text-accent-red hover:underline flex items-center gap-1 font-semibold text-sm sm:text-base"
                >
                  Xem tất cả <ChevronRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                {transformedAllProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
              {products.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  Chưa có sản phẩm nào. Vui lòng thêm sản phẩm từ trang quản trị.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
