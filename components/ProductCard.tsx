'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  price: number
  discountPrice?: number
  image: string
  badge?: {
    text: string
    type: 'sale' | 'hot' | 'preorder'
  }
  slug: string
}

export default function ProductCard({
  id,
  name,
  price,
  discountPrice,
  image,
  badge,
  slug,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Add to cart logic
    console.log('Add to cart:', id)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const discountPercentage = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0

  return (
    <Link href={`/products/${slug}`}>
      <div className="product-card group relative">
        {/* Badge */}
        {badge && (
          <div
            className={`
              absolute top-3 left-3 z-10 px-4 py-1 rounded-full text-sm font-bold text-white
              ${badge.type === 'sale' ? 'bg-[#FF4757]' : ''}
              ${badge.type === 'hot' ? 'bg-[#FF6348]' : ''}
              ${badge.type === 'preorder' ? 'bg-[#2ECC71] clip-ribbon' : ''}
            `}
          >
            {badge.text}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`
            absolute top-3 right-3 z-10 w-10 h-10 rounded-full
            flex items-center justify-center
            bg-white/80 hover:bg-white transition-all
            ${isWishlisted ? 'text-[#FF6B9D]' : 'text-gray-400'}
          `}
        >
          <Heart 
            size={20} 
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Image */}
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-text-dark mb-3 line-clamp-2 min-h-[40px]">
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            {discountPrice ? (
              <>
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(price)}
                </span>
                <span className="text-[#FF6B9D] font-bold text-lg">
                  {formatPrice(discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-[#FF6B9D] font-bold text-lg">
                {formatPrice(price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#FF6B9D] text-white py-2 rounded-lg font-medium
                     opacity-0 group-hover:opacity-100 transition-opacity
                     hover:bg-[#FF8FAB] active:scale-95"
          >
            <ShoppingCart className="inline-block w-4 h-4 mr-2" />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </Link>
  )
}
