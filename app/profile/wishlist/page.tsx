'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="text-accent-red fill-accent-red" />
            Sản phẩm yêu thích
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Danh sách yêu thích trống</h2>
            <p className="text-gray-500 mb-6">Hãy thêm những sản phẩm bạn yêu thích vào đây nhé!</p>
            <Link
              href="/products"
              className="inline-block bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                discountPrice={item.discountPrice}
                image={item.image}
                slug={item.slug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
