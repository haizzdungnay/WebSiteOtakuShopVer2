'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import Link from 'next/link'

const flashSaleProducts = [
  {
    id: '1',
    name: 'Nendoroid Doll Outfit Set (Sailor Uniform - Girl)',
    price: 850000,
    discountPrice: 595000,
    image: '/images/products/product1.jpg',
    badge: { text: '-30%', type: 'sale' as const },
    slug: 'nendoroid-doll-sailor-uniform',
  },
  {
    id: '2',
    name: 'POP UP PARADE Hatsune Miku: LAM Ver.',
    price: 950000,
    discountPrice: 712500,
    image: '/images/products/product2.jpg',
    badge: { text: '-25%', type: 'sale' as const },
    slug: 'popup-parade-miku-lam',
  },
  {
    id: '3',
    name: 'figma Oshi no Ko Ai Hoshino',
    price: 1850000,
    discountPrice: 1480000,
    image: '/images/products/product3.jpg',
    badge: { text: '-20%', type: 'sale' as const },
    slug: 'figma-ai-hoshino',
  },
  {
    id: '4',
    name: 'Nendoroid Hatsune Miku: Magical Mirai 2023 Ver.',
    price: 1200000,
    discountPrice: 780000,
    image: '/images/products/product4.jpg',
    badge: { text: '-35%', type: 'sale' as const },
    slug: 'nendoroid-miku-magical-mirai',
  },
  {
    id: '5',
    name: 'Nendoroid Doll Snow Miku',
    price: 950000,
    discountPrice: 570000,
    image: '/images/products/product5.jpg',
    badge: { text: '-40%', type: 'sale' as const },
    slug: 'nendoroid-snow-miku',
  },
]

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes--
          } else {
            minutes = 59
            if (hours > 0) {
              hours--
            } else {
              // Sale ended
              clearInterval(timer)
              return { hours: 0, minutes: 0, seconds: 0 }
            }
          }
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-12 bg-gradient-to-br from-[#FFE5ED] to-[#FFEEF3]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <h2 className="text-3xl font-bold text-text-dark">
            ⚡ FLASH SALE
          </h2>

          {/* Countdown */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-dark font-medium">
              Kết thúc trong
            </span>
            <div className="flex gap-2">
              <TimeBox value={timeLeft.hours} />
              <TimeBox value={timeLeft.minutes} />
              <TimeBox value={timeLeft.seconds} />
            </div>
          </div>

          <Link 
            href="/flash-sale"
            className="text-[#FF6B9D] font-semibold hover:text-[#FF8FAB] transition-colors"
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <button className="btn-secondary px-12 py-4">
            XEM THÊM
          </button>
        </div>
      </div>
    </section>
  )
}

function TimeBox({ value }: { value: number }) {
  return (
    <div className="bg-[#FF6B9D] text-white font-bold text-xl px-4 py-2 rounded-lg min-w-[50px] text-center">
      {value.toString().padStart(2, '0')}
    </div>
  )
}
