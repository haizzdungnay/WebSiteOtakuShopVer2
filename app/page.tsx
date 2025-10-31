'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ProductCard from '@/components/ProductCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Sample products - replace with actual data fetching
const sampleProducts = [
  {
    id: '1',
    name: 'Nendoroid Hatsune Miku: Snow Miku 2024',
    price: 850000,
    discountPrice: 595000,
    image: '/images/products/product1.jpg',
    badge: 'hot' as const,
    slug: 'nendoroid-miku-snow-2024',
  },
  {
    id: '2',
    name: 'Figma Spy x Family - Anya Forger',
    price: 1200000,
    discountPrice: 1050000,
    image: '/images/products/product2.jpg',
    badge: 'new' as const,
    slug: 'figma-anya-forger',
  },
  {
    id: '3',
    name: 'Scale Figure - Rem - 1/7',
    price: 3500000,
    discountPrice: 2800000,
    image: '/images/products/product3.jpg',
    salePercentage: 20,
    slug: 'scale-figure-rem',
  },
  {
    id: '4',
    name: 'Pop Up Parade - Gojo Satoru',
    price: 750000,
    image: '/images/products/product4.jpg',
    badge: 'new' as const,
    slug: 'popup-parade-gojo',
  },
  {
    id: '5',
    name: 'Nendoroid Chainsaw Man - Denji',
    price: 900000,
    discountPrice: 720000,
    image: '/images/products/product5.jpg',
    badge: 'hot' as const,
    slug: 'nendoroid-denji',
  },
  {
    id: '6',
    name: 'Figma Attack on Titan - Eren Yeager',
    price: 1350000,
    image: '/images/products/product6.jpg',
    slug: 'figma-eren-yeager',
  },
  {
    id: '7',
    name: 'Scale Figure - Miku Racing 2023',
    price: 4200000,
    discountPrice: 3360000,
    image: '/images/products/product7.jpg',
    salePercentage: 20,
    slug: 'scale-miku-racing',
  },
  {
    id: '8',
    name: 'Nendoroid Demon Slayer - Nezuko',
    price: 850000,
    discountPrice: 680000,
    image: '/images/products/product8.jpg',
    badge: 'hot' as const,
    slug: 'nendoroid-nezuko',
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background-light">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary py-16 relative overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-block lg:block">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2 drop-shadow-lg">
                  JOIN US
                </h1>
                <div className="h-2 w-32 bg-accent-red rounded-full mx-auto lg:mx-0"></div>
              </div>
              <p className="text-xl md:text-2xl text-gray-800 font-medium">
                Cộng đồng yêu thích Figure & Anime
              </p>
              <div className="space-y-3">
                <p className="text-base text-gray-700">
                  ✨ Sản phẩm chính hãng 100%
                </p>
                <p className="text-base text-gray-700">
                  🎁 Ưu đãi độc quyền cho thành viên
                </p>
                <p className="text-base text-gray-700">
                  🚀 Cập nhật sản phẩm mới hàng tuần
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  href="/products"
                  className="inline-block bg-accent-red text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-600 transition-all hover:scale-105 shadow-lg"
                >
                  Khám phá ngay
                </Link>
                <Link
                  href="/register"
                  className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
                >
                  Đăng ký thành viên
                </Link>
              </div>
            </div>

            {/* Right: QR Code & Info */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Kết nối với chúng tôi
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quét mã QR để tham gia nhóm Zalo
                  </p>
                </div>

                {/* QR Code Placeholder */}
                <div className="bg-gray-100 rounded-xl p-6 mb-6 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-white rounded-lg shadow-inner mb-3 flex items-center justify-center border-4 border-gray-300">
                      <div className="text-gray-400 text-6xl font-bold">QR</div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Quét để tham gia ngay
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center">
                    <div className="text-2xl font-bold">2.2K+</div>
                    <div className="text-xs opacity-90">Thành viên</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white text-center">
                    <div className="text-2xl font-bold">1.5K+</div>
                    <div className="text-xs opacity-90">Sản phẩm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-48 translate-y-48"></div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-8">
        <div className="container-custom">
          <div className="flex gap-6">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1">
              {/* Section: Hot Products */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-8 bg-accent-red"></span>
                    SẢN PHẨM HOT
                  </h2>
                  <Link
                    href="/products?filter=hot"
                    className="text-accent-red hover:underline flex items-center gap-1 font-semibold"
                  >
                    Xem tất cả <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sampleProducts
                    .filter((p) => p.badge === 'hot')
                    .map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                </div>
              </div>

              {/* Section: New Arrivals */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-8 bg-green-500"></span>
                    HÀNG MỚI VỀ
                  </h2>
                  <Link
                    href="/products?filter=new"
                    className="text-accent-red hover:underline flex items-center gap-1 font-semibold"
                  >
                    Xem tất cả <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sampleProducts
                    .filter((p) => p.badge === 'new')
                    .map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                </div>
              </div>

              {/* Section: Sale Products */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-8 bg-orange-500"></span>
                    ĐANG GIẢM GIÁ
                  </h2>
                  <Link
                    href="/products?filter=sale"
                    className="text-accent-red hover:underline flex items-center gap-1 font-semibold"
                  >
                    Xem tất cả <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sampleProducts
                    .filter((p) => p.discountPrice)
                    .map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                </div>
              </div>

              {/* Section: All Products */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-8 bg-primary"></span>
                    TẤT CẢ SẢN PHẨM
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sampleProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
