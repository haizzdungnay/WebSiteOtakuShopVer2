'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Grid3x3, List, Loader2, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    stockQuantity: number;
    featured: boolean;
    preorderStatus: 'NONE' | 'PREORDER' | 'ORDER';
    releaseDate?: string;
    createdAt: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá: Tăng dần' },
    { value: 'price-desc', label: 'Giá: Giảm dần' },
    { value: 'name-asc', label: 'A-Z' },
];

export default function NewReleasesPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedPreorderStatus, setSelectedPreorderStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Build query params - lấy sản phẩm mới nhất
                const params = new URLSearchParams();
                params.set('limit', '12');
                params.set('page', currentPage.toString());
                params.set('sort', 'newest'); // Sắp xếp theo mới nhất

                if (selectedCategory) {
                    params.set('category', selectedCategory);
                }

                if (selectedPreorderStatus) {
                    if (selectedPreorderStatus === 'preorder') {
                        params.set('preorder', 'true');
                    } else if (selectedPreorderStatus === 'instock') {
                        params.set('inStock', 'true');
                    }
                }

                const response = await fetch(`/api/products?${params.toString()}`);
                const data = await response.json();

                if (data.success) {
                    let fetchedProducts = data.data || [];

                    // Sort on client side based on selected option
                    fetchedProducts = [...fetchedProducts].sort((a: Product, b: Product) => {
                        switch (sortBy) {
                            case 'price-asc':
                                return Number(a.price) - Number(b.price);
                            case 'price-desc':
                                return Number(b.price) - Number(a.price);
                            case 'name-asc':
                                return a.name.localeCompare(b.name);
                            case 'newest':
                            default:
                                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        }
                    });

                    setProducts(fetchedProducts);
                    setTotal(data.pagination?.total || fetchedProducts.length);
                    setTotalPages(data.pagination?.totalPages || 1);
                } else {
                    setError(data.error || 'Không thể tải sản phẩm');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Không thể kết nối đến server');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, selectedCategory, selectedPreorderStatus, sortBy]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                if (data.success) {
                    setCategories(data.data || []);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const getBadge = (product: Product): 'hot' | 'new' | 'sale' | undefined => {
        // Sản phẩm tạo trong 7 ngày gần đây = NEW
        const createdDate = new Date(product.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

        if (product.comparePrice && Number(product.comparePrice) > Number(product.price)) {
            return 'sale';
        }
        if (diffDays <= 7) {
            return 'new';
        }
        if (product.featured) {
            return 'hot';
        }
        return undefined;
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200">
            {/* Hero Banner */}
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-orange-500 to-red-500 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-red-600/70 flex items-center">
                    <div className="container-custom">
                        <div className="text-white max-w-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-10 h-10" />
                                <h1 className="text-5xl md:text-6xl font-bold">
                                    NEW RELEASES
                                </h1>
                            </div>
                            <p className="text-lg md:text-xl mb-6">Những sản phẩm mới nhất vừa cập nhật</p>
                            <Link
                                href="#products"
                                className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
                            >
                                XEM NGAY
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-white dark:bg-dark-card border-b dark:border-dark-border transition-colors">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-accent-red">Trang chủ</Link>
                        <ChevronRight size={16} className="text-gray-400" />
                        <span className="text-gray-900 font-medium">NEW RELEASES</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom py-8" id="products">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6 sticky top-4">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-orange-500" />
                                Hàng mới phát hành
                            </h2>

                            {/* Preorder Status Filter */}
                            <div className="mb-6">
                                <h3 className="font-bold text-base mb-3">Trạng thái</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="rounded-full"
                                            checked={selectedPreorderStatus === ''}
                                            onChange={() => setSelectedPreorderStatus('')}
                                        />
                                        <span className="text-sm">Tất cả</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="rounded-full"
                                            checked={selectedPreorderStatus === 'instock'}
                                            onChange={() => setSelectedPreorderStatus('instock')}
                                        />
                                        <span className="text-sm flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            Sẵn hàng
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="rounded-full"
                                            checked={selectedPreorderStatus === 'preorder'}
                                            onChange={() => setSelectedPreorderStatus('preorder')}
                                        />
                                        <span className="text-sm flex items-center gap-2">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                            Pre-order / Đặt hàng
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6 border-t pt-6">
                                <h3 className="font-bold text-base mb-3">Danh mục</h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                        <input
                                            type="radio"
                                            name="category"
                                            className="rounded-full"
                                            checked={selectedCategory === ''}
                                            onChange={() => setSelectedCategory('')}
                                        />
                                        <span className="text-sm">Tất cả danh mục</span>
                                    </label>
                                    {categories.map((category) => (
                                        <label key={category.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                            <input
                                                type="radio"
                                                name="category"
                                                className="rounded-full"
                                                checked={selectedCategory === category.slug}
                                                onChange={() => setSelectedCategory(category.slug)}
                                            />
                                            <span className="text-sm">{category.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Reset Filters */}
                            {(selectedCategory || selectedPreorderStatus) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setSelectedPreorderStatus('');
                                    }}
                                    className="w-full py-2 text-sm text-orange-600 hover:text-orange-700 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                                >
                                    Xóa bộ lọc
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-4 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="text-gray-600 dark:text-gray-400">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Đang tải...
                                        </span>
                                    ) : (
                                        <>
                                            Hiển thị <span className="font-semibold text-gray-900 dark:text-gray-100">{products.length}</span> / {total} sản phẩm
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    {/* Sort */}
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                            title="Sắp xếp"
                                        >
                                            {sortOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* View Mode */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                                            title="Xem dạng lưới"
                                        >
                                            <Grid3x3 size={20} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                                            title="Xem dạng danh sách"
                                        >
                                            <List size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="text-center py-20">
                                <p className="text-red-500 mb-4">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                >
                                    Thử lại
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && products.length === 0 && (
                            <div className="text-center py-20">
                                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-gray-500 mb-4">Hãy thử thay đổi bộ lọc hoặc quay lại sau</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setSelectedPreorderStatus('');
                                    }}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}

                        {/* Products */}
                        {!loading && !error && products.length > 0 && (
                            <>
                                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                                    {products.map((product) => (
                                        <div key={product.id} className="relative">
                                            {/* Preorder Badge */}
                                            {product.preorderStatus !== 'NONE' && (
                                                <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-bold ${product.preorderStatus === 'PREORDER'
                                                        ? 'bg-orange-500 text-white'
                                                        : 'bg-blue-500 text-white'
                                                    }`}>
                                                    {product.preorderStatus === 'PREORDER' ? 'Pre-order' : 'Đặt hàng'}
                                                </div>
                                            )}
                                            <ProductCard
                                                id={product.id}
                                                slug={product.slug}
                                                name={product.name}
                                                price={Number(product.price)}
                                                discountPrice={product.comparePrice ? Number(product.price) : undefined}
                                                image={product.images?.[0] || '/images/placeholder.jpg'}
                                                badge={getBadge(product)}
                                            />
                                        </div>
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
                                                        className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                                                                ? 'bg-orange-500 text-white'
                                                                : 'border border-gray-300 hover:bg-gray-50'
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
