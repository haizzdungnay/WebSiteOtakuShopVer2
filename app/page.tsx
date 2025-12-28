'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProductCard from '@/components/ProductCard';
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
      <section className="py-8">
        <div className="container-custom space-y-10">
          {/* HÀNG TRÊN: Sidebar + JOIN US (cao bằng nhau) */}
          <div className="flex gap-6 items-stretch">
            {/* SIDEBAR */}
            <div className="w-[320px]">
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            </div>

            {/* JOIN US – banner hồng, cao bằng Sidebar + min-height để luôn đẹp */}
            <div className="flex-1">
              <div className="relative w-full min-h-[420px] overflow-hidden rounded-[32px] bg-[#ffc1c9] px-16 py-12 flex items-center justify-between gap-10 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
                {/* Decor */}
                <div className="pointer-events-none">
                  {/* chấm tròn góc trên trái */}
                  <div className="absolute left-12 top-10 grid grid-cols-4 gap-2 opacity-40">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 border border-white rounded-full"
                      />
                    ))}
                  </div>
                  {/* hình tròn đỏ góc dưới trái */}
                  <div className="absolute -left-32 bottom-[-140px] w-[340px] h-[340px] bg-[#ff4b4b] rounded-full opacity-90" />
                  {/* dải đỏ cong bên phải */}
                  <div className="absolute -right-24 -top-10 w-[220px] h-[220px] rounded-full border-[24px] border-[#ff7070] border-t-transparent border-l-transparent" />
                </div>

                {/* Nội dung bên trái */}
                <div className="relative z-10 flex-1">
                  <h2 className="text-[56px] leading-tight font-extrabold tracking-[0.25em] text-[#3b3f4a] mb-6 uppercase">
                    JOIN US
                  </h2>

                  <p className="text-lg text-[#3b3f4a] mb-4">
                    Cộng đồng yêu thích Figure &amp; Anime
                  </p>

                  <ul className="text-base text-[#3b3f4a] space-y-2 mb-8">
                    <li>✨ Sản phẩm chính hãng 100%</li>
                    <li>🎁 Ưu đãi độc quyền cho thành viên</li>
                    <li>🚀 Cập nhật sản phẩm mới hàng tuần</li>
                  </ul>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/products"
                      className="bg-[#ff4b4b] text-white px-8 py-3 rounded-2xl text-sm font-semibold shadow-md hover:bg-[#ff3333] transition-transform hover:scale-[1.02]"
                    >
                      Khám phá ngay
                    </Link>
                    <Link
                      href="/register"
                      className="bg-white text-[#3b3f4a] px-8 py-3 rounded-2xl text-sm font-semibold shadow-md hover:bg-gray-50 transition-transform hover:scale-[1.02]"
                    >
                      Đăng ký thành viên
                    </Link>
                  </div>
                </div>

                {/* QR bên phải */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-[260px] h-[260px] bg-white rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.15)] flex items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-[#f4f5f7] rounded-[24px] border border-[#e0e2e7] flex items-center justify-center">
                      <span className="text-3xl font-semibold text-[#a0a4b0]">
                        QR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-8 bg-accent-red" />
                        SẢN PHẨM HOT
                      </h2>
                      <Link
                        href="/products?featured=true"
                        className="text-accent-red hover:underline flex items-center gap-1 font-semibold"
                      >
                        Xem tất cả <ChevronRight size={16} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {hotProducts.map((product) => (
                        <ProductCard key={product.id} {...transformProduct(product)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* HÀNG MỚI VỀ */}
                {newProducts.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-8 bg-green-500" />
                        HÀNG MỚI VỀ
                      </h2>
                      <Link
                        href="/products?sort=createdAt&order=desc"
                        className="text-accent-red hover:underline flex items-center gap-1 font-semibold"
                      >
                        Xem tất cả <ChevronRight size={16} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {newProducts.map((product) => (
                        <ProductCard key={product.id} {...transformProduct(product)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ĐANG GIẢM GIÁ */}
                {saleProducts.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-8 bg-orange-500" />
                        ĐANG GIẢM GIÁ
                      </h2>
                      <Link
                        href="/products"
                        className="text-accent-red hover:underline flex items-center gap-1 font-semibold"
                      >
                        Xem tất cả <ChevronRight size={16} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {saleProducts.map((product) => (
                        <ProductCard key={product.id} {...transformProduct(product)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* TẤT CẢ SẢN PHẨM */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-1 h-8 bg-primary" />
                      TẤT CẢ SẢN PHẨM
                    </h2>
                    <Link
                      href="/products"
                      className="text-accent-red hover:underline flex items-center gap-1 font-semibold"
                    >
                      Xem tất cả <ChevronRight size={16} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
