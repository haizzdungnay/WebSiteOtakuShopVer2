'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Search as SearchIcon, Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

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

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');
  const [searchQuery, setSearchQuery] = useState(queryParam || '');
  const [results, setResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch categories for filter
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

  // Transform product for ProductCard
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

  // Perform real search via API
  const performSearch = useCallback(async (query: string, page: number = 1, category: string = '') => {
    if (!query.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      params.set('search', query);
      params.set('page', page.toString());
      params.set('limit', '20');
      if (category) params.set('category', category);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.data || []);
        setTotalResults(data.pagination?.total || data.data?.length || 0);
      } else {
        setResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Search when URL param changes
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
      performSearch(queryParam, currentPage, selectedCategory);
    }
  }, [queryParam, currentPage, selectedCategory, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newUrl = `/search?q=${encodeURIComponent(searchQuery)}`;
      window.history.pushState({}, '', newUrl);
      setCurrentPage(1);
      performSearch(searchQuery, 1, selectedCategory);
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
    if (queryParam) {
      performSearch(queryParam, 1, categorySlug);
    }
  };

  const hasSearched = !!queryParam;
  const totalPages = Math.ceil(totalResults / 20);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-accent-red">
              Trang chủ
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">Tìm kiếm</span>
            {queryParam && (
              <>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-gray-600">{queryParam}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container-custom py-12">
        {!hasSearched ? (
          /* Empty Search State */
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Tìm kiếm</h1>
            <h2 className="text-2xl font-semibold mb-4">Nhập từ khóa tìm kiếm</h2>
            <p className="text-gray-600 mb-8">
              Vui lòng nhập từ khóa vào ô tìm kiếm để bắt đầu. Bạn có thể sử dụng các từ khóa tổng quát để dễ tìm hơn.
            </p>

            {/* Large Search Box */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Search Results */
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">Tìm kiếm</h1>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                  >
                    {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
                  </button>
                </div>
              </form>
            </div>

            {isSearching ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red"></div>
                <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="lg:w-72 flex-shrink-0">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                    <h3 className="font-bold text-lg mb-4">Bộ lọc</h3>

                    {/* Price Range */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Khoảng giá</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Dưới 1,000,000đ</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">1,000,000đ - 3,000,000đ</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">3,000,000đ - 5,000,000đ</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Trên 5,000,000đ</span>
                        </label>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="mb-6 border-t pt-6">
                      <h4 className="font-semibold mb-3">Danh mục</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            className="rounded"
                            checked={selectedCategory === ''}
                            onChange={() => handleCategoryChange('')}
                          />
                          <span className="text-sm">Tất cả</span>
                        </label>
                        {categories.map((cat) => (
                          <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              className="rounded"
                              checked={selectedCategory === cat.slug}
                              onChange={() => handleCategoryChange(cat.slug)}
                            />
                            <span className="text-sm">{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-3">Trạng thái</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Còn hàng</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Pre-order</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Sắp về</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Results */}
                <div className="flex-1">
                  <div className="mb-6">
                    <p className="text-gray-600">
                      Tìm thấy <span className="font-semibold text-gray-900">{totalResults}</span> kết quả
                      {queryParam && (
                        <> cho &quot;<span className="font-semibold text-gray-900">{queryParam}</span>&quot;</>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {results.map((product) => (
                      <ProductCard
                        key={product.id}
                        {...transformProduct(product)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Trước
                        </button>
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
                              className={`px-4 py-2 border rounded-lg ${currentPage === pageNum
                                  ? 'bg-accent-red text-white border-accent-red'
                                  : 'border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-600">
                  Không tìm thấy sản phẩm nào phù hợp với từ khóa &quot;{queryParam}&quot;
                </p>
                <p className="text-gray-600 mt-2">Vui lòng thử lại với từ khóa khác</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
