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
            {/* SẢN PHẨM HOT */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-8 bg-accent-red" />
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

            {/* HÀNG MỚI VỀ */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-8 bg-green-500" />
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

            {/* ĐANG GIẢM GIÁ */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-8 bg-orange-500" />
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

            {/* TẤT CẢ SẢN PHẨM */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-8 bg-primary" />
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
      </section>
    </div>
  );
}
