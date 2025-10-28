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
      <section className="bg-gradient-to-r from-primary to-primary-light py-12 text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            JOIN US
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Khám phá bộ sưu tập figure anime chính hãng
          </p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
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
