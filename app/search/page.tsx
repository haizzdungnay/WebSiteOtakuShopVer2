'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Search as SearchIcon } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

// Mock search results
const mockSearchResults = [
  {
    id: 1,
    name: 'Hatsune Miku - VOCALOID / Model Kit',
    price: 2300000,
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop',
    badge: 'new',
  },
  {
    id: 2,
    name: 'Miku Snow Miku 2025 Ver. - Character Vocal Series',
    price: 1800000,
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=400&fit=crop',
    badge: 'preorder',
  },
  {
    id: 3,
    name: 'Racing Miku 2024 Ver. - Hatsune Miku GT Project',
    price: 4500000,
    image: 'https://images.unsplash.com/photo-1614680376408-81e0d76bfcdf?w=400&h=400&fit=crop',
    discount: 10,
  },
  {
    id: 4,
    name: 'Hatsune Miku Symphony 2024 Concert Ver.',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1618336752974-aae8e04506aa?w=400&h=400&fit=crop',
    badge: 'hot',
  },
  {
    id: 5,
    name: 'Miku Sakura 2025 - Hatsune Miku Spring Ver.',
    price: 2100000,
    image: 'https://images.unsplash.com/photo-1614680376739-5dc71c0d8b84?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    name: 'Hatsune Miku V4X Bundle - Software + Figure',
    price: 5600000,
    image: 'https://images.unsplash.com/photo-1614680376739-5cd0c1a0a1c6?w=400&h=400&fit=crop',
    discount: 15,
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');
  const [searchQuery, setSearchQuery] = useState(queryParam || '');
  const [results, setResults] = useState<typeof mockSearchResults>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = (query: string) => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      if (query.trim()) {
        setResults(mockSearchResults);
      } else {
        setResults([]);
      }
      setIsSearching(false);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newUrl = `/search?q=${encodeURIComponent(searchQuery)}`;
      window.history.pushState({}, '', newUrl);
      performSearch(searchQuery);
    }
  };

  const hasSearched = queryParam || results.length > 0;

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
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">PVC Figure</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Nendoroid</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Figma</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Scale Figure</span>
                        </label>
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
                      Tìm thấy <span className="font-semibold text-gray-900">{results.length}</span> kết quả
                      {queryParam && (
                        <> cho &quot;<span className="font-semibold text-gray-900">{queryParam}</span>&quot;</>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {results.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id.toString()}
                        slug={`product-${product.id}`}
                        name={product.name}
                        price={product.price}
                        discountPrice={product.discount ? product.price * (1 - product.discount / 100) : undefined}
                        image={product.image}
                        badge={product.badge as 'hot' | 'new' | 'sale' | undefined}
                        salePercentage={product.discount}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-8 flex justify-center">
                    <div className="flex gap-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        1
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        2
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        3
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        4
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        5
                      </button>
                    </div>
                  </div>
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
