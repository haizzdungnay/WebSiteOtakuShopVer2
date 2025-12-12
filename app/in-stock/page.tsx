'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Loader2, Filter, ChevronDown, X, Package, Truck } from 'lucide-react';

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
    stockQuantity: number;
    preorderStatus: string;
    category?: Category;
}

function InStockContent() {
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

    // Fetch in-stock products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('limit', limit.toString());
            params.set('page', currentPage.toString());
            params.set('inStock', 'true'); // Only fetch in-stock products

            if (categorySlug) params.set('category', categorySlug);
            if (sortBy) params.set('sort', sortBy);
            if (order) params.set('order', order);

            const response = await fetch(`/api/products?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data.data || []);
                setTotalProducts(data.pagination?.total || data.data?.length || 0);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, categorySlug, sortBy, order]);

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
        return `/in-stock?${params.toString()}`;
    };

    const totalPages = Math.ceil(totalProducts / limit);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <div className="container-custom py-8">
                    {/* Breadcrumb */}
                    <div className="text-sm text-green-100 mb-4">
                        <Link href="/" className="hover:text-white">Trang chủ</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white font-medium">Sản phẩm sẵn hàng</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Package size={32} />
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    Sản phẩm sẵn hàng
                                </h1>
                            </div>
                            <p className="text-green-100 flex items-center gap-2">
                                <Truck size={18} />
                                Giao hàng ngay - Không cần đặt trước
                                {totalProducts > 0 && (
                                    <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                                        {totalProducts} sản phẩm
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg"
                        >
                            <Filter size={18} />
                            Bộ lọc
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-green-50 border-b border-green-200">
                <div className="container-custom py-4">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-green-800">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span>Hàng có sẵn tại kho</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck size={16} />
                            <span>Giao hàng trong 1-3 ngày</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package size={16} />
                            <span>Đóng gói cẩn thận</span>
                        </div>
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
                                        href={buildUrl({ category: null })}
                                        className={`block px-3 py-2 rounded-lg transition-colors ${!categorySlug ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        Tất cả
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={buildUrl({ category: cat.slug })}
                                            className={`block px-3 py-2 rounded-lg transition-colors ${categorySlug === cat.slug ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
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
                                        <option value="stockQuantity-desc">Còn nhiều nhất</option>
                                        <option value="name-asc">Tên: A-Z</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            {/* Clear filters */}
                            {categorySlug && (
                                <Link
                                    href="/in-stock"
                                    className="mt-6 block text-center text-sm text-green-600 hover:underline"
                                >
                                    Xóa bộ lọc
                                </Link>
                            )}

                            {/* Other pages link */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-3">Xem thêm:</p>
                                <div className="space-y-2">
                                    <Link
                                        href="/products?preorder=true"
                                        className="block px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                                    >
                                        📦 Sản phẩm Pre-order
                                    </Link>
                                    <Link
                                        href="/products"
                                        className="block px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        🛍️ Tất cả sản phẩm
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                                <span className="ml-3 text-gray-500">Đang tải sản phẩm...</span>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-lg">
                                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Chưa có sản phẩm sẵn hàng
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Hiện tại chưa có sản phẩm nào sẵn hàng trong danh mục này
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                                >
                                    Xem tất cả sản phẩm
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {products.map((product) => (
                                        <div key={product.id} className="relative">
                                            <ProductCard {...transformProduct(product)} />
                                            {/* In-stock badge */}
                                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                                Sẵn hàng
                                            </div>
                                        </div>
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
                                                                ? 'bg-green-500 text-white'
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

export default function InStockPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                <span className="ml-3 text-gray-500">Đang tải...</span>
            </div>
        }>
            <InStockContent />
        </Suspense>
    );
}
