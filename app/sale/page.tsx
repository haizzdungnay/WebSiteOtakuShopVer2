'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Loader2, Percent, ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  category?: Category;
}

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const limit = 24;

  // Fetch products on sale
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', limit.toString());
      params.set('page', currentPage.toString());
      params.set('onSale', 'true'); // Only products with discounts
      params.set('sort', sortBy);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
        setTotalProducts(data.pagination?.total || data.total || data.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching sale products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Transform product for ProductCard component
  const transformProduct = (product: Product) => {
    const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);
    const salePercentage = hasDiscount
      ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
      : 0;

    return {
      id: product.id,
      name: product.name,
      price: Number(product.comparePrice) || Number(product.price),
      discountPrice: hasDiscount ? Number(product.price) : undefined,
      image: product.images?.[0] || '/images/placeholder.jpg',
      badge: 'sale' as const,
      salePercentage: salePercentage > 0 ? salePercentage : undefined,
      slug: product.slug,
    };
  };

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container-custom py-12">
          <div className="text-sm mb-4">
            <Link href="/" className="hover:underline">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span>Đang giảm giá</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Percent size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">Đang giảm giá</h1>
              <p className="text-white/80">
                {totalProducts > 0 ? `${totalProducts} sản phẩm đang được giảm giá` : 'Khám phá các ưu đãi hấp dẫn'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Sort & Filter Bar */}
        <div className="bg-white dark:bg-dark-card rounded-lg dark:border dark:border-dark-border transition-colors p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-gray-600 dark:text-gray-400">
            {totalProducts > 0 ? (
              <span>Hiển thị <strong>{products.length}</strong> / <strong>{totalProducts}</strong> sản phẩm</span>
            ) : (
              <span>Đang tải sản phẩm...</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sắp xếp:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="name-asc">Tên A → Z</option>
                <option value="name-desc">Tên Z → A</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent-red" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-lg dark:border dark:border-dark-border transition-colors p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Percent size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có sản phẩm giảm giá
            </h3>
            <p className="text-gray-500 mb-6">
              Hiện tại chưa có sản phẩm nào đang giảm giá. Hãy quay lại sau nhé!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...transformProduct(product)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          currentPage === pageNum
                            ? 'bg-accent-red text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
