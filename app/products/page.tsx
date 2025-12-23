'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

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

function ProductsContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states from URL
  const categorySlug = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const featured = searchParams.get('featured') === 'true';
  const limit = 20;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', limit.toString());
      params.set('page', currentPage.toString());

      if (categorySlug) params.set('category', categorySlug);
      if (sortBy) params.set('sort', sortBy);
      if (order) params.set('order', order);
      if (featured) params.set('featured', 'true');

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
        setTotalProducts(data.total || data.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, categorySlug, sortBy, order, featured]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Transform product for ProductCard component
  const transformProduct = (product: Product) => {
    const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);
    const salePercentage = hasDiscount
      ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
      : 0;

    let badge: 'hot' | 'new' | 'sale' | undefined;
    if (product.featured) {
      badge = 'hot';
    } else if (new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      badge = 'new';
    } else if (hasDiscount) {
      badge = 'sale';
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

  // Get current filter title
  const getPageTitle = () => {
    if (featured) return 'Sản phẩm Hot';
    if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      return cat?.name || 'Sản phẩm';
    }
    return 'Tất cả sản phẩm';
  };

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-accent-red">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{getPageTitle()}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="container-custom py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-500">Đang tải sản phẩm...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600">
              Chưa có sản phẩm nào trong danh mục này
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} {...transformProduct(product)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-500">Đang tải...</span>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
