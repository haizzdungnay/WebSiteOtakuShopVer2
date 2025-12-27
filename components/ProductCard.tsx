'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  badge?: 'hot' | 'new' | 'sale';
  salePercentage?: number;
  slug: string;
}

export default function ProductCard({
  id,
  name,
  price,
  discountPrice,
  image,
  badge,
  salePercentage,
  slug,
}: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        price,
        discountPrice,
        image,
        slug
      });
    }
  };

  const calculatedSalePercentage =
    salePercentage ||
    (discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0);

  return (
    <Link href={`/products/${slug}`} className="block">
      <div className="product-card group relative">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all duration-200 hover:scale-110"
          title={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart
            size={18}
            className={`transition-colors ${isWishlisted ? 'fill-accent-red text-accent-red' : 'text-gray-600 hover:text-accent-red'}`}
          />
        </button>

        {/* Badge */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {badge === 'hot' && (
            <span className="badge badge-hot shadow-sm">HOT</span>
          )}
          {badge === 'new' && (
            <span className="badge badge-new shadow-sm">NEW</span>
          )}
          {calculatedSalePercentage > 0 && (
            <span className="badge badge-sale shadow-sm">
              -{calculatedSalePercentage}%
            </span>
          )}
        </div>

        {/* Image */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
          <Image
            src={image || '/images/placeholder.jpg'}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Title */}
          <h3 className="text-sm text-gray-700 mb-2 line-clamp-2 min-h-[40px] group-hover:text-accent-red transition-colors">
            {name}
          </h3>

          {/* Price */}
          <div className="flex flex-col gap-1 min-h-[48px] justify-end">
            {discountPrice ? (
              <>
                <span className="text-gray-400 line-through text-xs">
                  {formatPrice(price)}
                </span>
                <span className="text-accent-red font-bold text-lg">
                  {formatPrice(discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-accent-red font-bold text-lg">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
