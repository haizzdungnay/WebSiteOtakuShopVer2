'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Loader2, Filter, ChevronDown, X } from 'lucide-react';

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
  const [showFilters, setShowFilters] = useState(false);

  // Filter states from URL
  const categorySlug = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const featured = searchParams.get('featured') === 'true';
  const searchQuery = searchParams.get('q') || '';
  const limit = 24;

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
      if (searchQuery) params.set('q', searchQuery);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
        // Lấy total từ pagination.total (API format)
        setTotalProducts(data.pagination?.total || data.total || data.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, categorySlug, sortBy, order, featured, searchQuery]);

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

  // Build URL with new params
  const buildUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    return `/products?${params.toString()}`;
  };

  // Get current filter title
  const getPageTitle = () => {
    if (featured) return 'Sản phẩm Hot';
    if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      return cat?.name || 'Sản phẩm';
    }
    if (searchQuery) return `Kết quả tìm kiếm: "${searchQuery}"`;
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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {getPageTitle()}
              {totalProducts > 0 && (
                <span className="text-lg font-normal text-gray-500 ml-2">
                  ({totalProducts} sản phẩm)
                </span>
              )}
            </h1>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Filter size={18} />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="font-bold text-lg text-gray-900">Bộ lọc</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden p-1"
                  title="Đóng bộ lọc"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Danh mục</h4>
                <div className="space-y-2">
                  <Link
                    href={buildUrl({ category: null, featured: null })}
                    className={`block px-3 py-2 rounded-lg transition-colors ${!categorySlug && !featured ? 'bg-accent-red text-white' : 'hover:bg-gray-100'
                      }`}
                  >
                    Tất cả
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={buildUrl({ category: cat.slug, featured: null })}
                      className={`block px-3 py-2 rounded-lg transition-colors ${categorySlug === cat.slug ? 'bg-accent-red text-white' : 'hover:bg-gray-100'
                        }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Lọc nhanh</h4>
                <div className="space-y-2">
                  <Link
                    href={buildUrl({ featured: 'true', category: null })}
                    className={`block px-3 py-2 rounded-lg transition-colors ${featured ? 'bg-accent-red text-white' : 'hover:bg-gray-100'
                      }`}
                  >
                    🔥 Sản phẩm Hot
                  </Link>
                  <Link
                    href={buildUrl({ sort: 'createdAt', order: 'desc', featured: null })}
                    className={`block px-3 py-2 rounded-lg transition-colors ${sortBy === 'createdAt' && order === 'desc' && !featured ? 'bg-accent-red text-white' : 'hover:bg-gray-100'
                      }`}
                  >
                    ✨ Mới nhất
                  </Link>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Sắp xếp theo</h4>
                <div className="relative">
                  <select
                    value={`${sortBy}-${order}`}
                    onChange={(e) => {
                      const [newSort, newOrder] = e.target.value.split('-');
                      window.location.href = buildUrl({ sort: newSort, order: newOrder });
                    }}
                    title="Sắp xếp sản phẩm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none bg-white pr-10"
                  >
                    <option value="createdAt-desc">Mới nhất</option>
                    <option value="createdAt-asc">Cũ nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="name-asc">Tên: A-Z</option>
                    <option value="name-desc">Tên: Z-A</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Clear filters */}
              {(categorySlug || featured || searchQuery) && (
                <Link
                  href="/products"
                  className="mt-6 block text-center text-sm text-accent-red hover:underline"
                >
                  Xóa bộ lọc
                </Link>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-3 text-gray-500">Đang tải sản phẩm...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? `Không có sản phẩm nào phù hợp với "${searchQuery}"`
                    : 'Chưa có sản phẩm nào trong danh mục này'}
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Xem tất cả sản phẩm
                </Link>
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
                            className={`w-10 h-10 rounded-lg font-semibold transition-colors ${currentPage === pageNum
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
          </main>
        </div>
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
