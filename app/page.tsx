'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProductCard from '@/components/ProductCard';
import NewsCarousel from '@/components/NewsCarousel';
import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Interface for product from database
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  featured: boolean;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await fetch('/api/products?limit=50');
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Products data:', data);
          setProducts(data.data || []);
        } else {
            console.error('Fetch failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Transform product for ProductCard component
  const transformProduct = (product: Product) => {
    const price = Number(product.price);
    const comparePrice = product.comparePrice ? Number(product.comparePrice) : 0;
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
      price: Number(product.comparePrice) || Number(product.price),
      discountPrice: hasDiscount ? Number(product.price) : undefined,
      image: product.images?.[0] || '/images/placeholder.jpg',
      badge,
      salePercentage: salePercentage > 0 ? salePercentage : undefined,
      slug: product.slug,
    };
  };

  // Filter products
  const hotProducts = products.filter(p => p.featured).slice(0, 10);
  const newProducts = products
    .filter(p => new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .slice(0, 10);
  const saleProducts = products
    .filter(p => p.comparePrice && Number(p.comparePrice) > Number(p.price))
    .slice(0, 10);
  const allProducts = products.slice(0, 10);

  return (
    <div className="bg-background-light">
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="container-custom space-y-6 sm:space-y-8 lg:space-y-10">
          {/* HÀNG TRÊN: Sidebar + News Carousel */}
          <div className="flex gap-4 items-stretch">
            {/* SIDEBAR - ẩn trên mobile */}
            <div className="hidden lg:block w-[280px] flex-shrink-0">
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            </div>

            {/* News Carousel Banner - Tin tức hot */}
            <div className="flex-1 min-w-0">
              <NewsCarousel />
            </div>
          </div>

          {/* HÀNG DƯỚI: các section sản phẩm – full chiều ngang phần content */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-3 text-gray-500">Đang tải sản phẩm...</span>
              </div>
            ) : (
              <>
                {/* SẢN PHẨM HOT */}
                {hotProducts.length > 0 && (
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
                      {hotProducts.map((product) => (
                        <ProductCard key={product.id} {...transformProduct(product)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* HÀNG MỚI VỀ */}
                {newProducts.length > 0 && (
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
                      {newProducts.map((product) => (
                        <ProductCard key={product.id} {...transformProduct(product)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ĐANG GIẢM GIÁ */}
                {saleProducts.length > 0 && (
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
                      {saleProducts.map((product) => (
                        <ProductCard key={product.id} {...transformProduct(product)} />
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
                    {allProducts.map((product) => (
                      <ProductCard key={product.id} {...transformProduct(product)} />
                    ))}
                  </div>
                  {products.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      Chưa có sản phẩm nào. Vui lòng thêm sản phẩm từ trang quản trị.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
