'use client'

import { Truck, Percent, List, Globe } from 'lucide-react'
import Link from 'next/link'

const infoBoxes = [
  {
    icon: Truck,
    title: 'GIAO HÀNG\nNHANH CHÓNG',
    bgGradient: 'from-[#D4A5A5] to-[#B88E8E]',
    link: '/shipping',
  },
  {
    icon: Percent,
    title: 'GIẢM GIÁ\nHẤP DẪN',
    bgGradient: 'from-[#FF9966] to-[#FF7744]',
    link: '/promotions',
  },
  {
    icon: List,
    title: 'DANH SÁCH\nƯU TIÊN',
    bgGradient: 'from-[#E5D4C1] to-[#D4C4B1]',
    link: '/wishlist',
    textDark: true,
  },
  {
    icon: Globe,
    title: 'WORLDWIDE\nSHIPPING',
    bgGradient: 'from-[#FFE0B2] to-[#FFD699]',
    link: '/worldwide-shipping',
    textDark: true,
    hasImage: true,
  },
]

export default function InfoBoxes() {
  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoBoxes.map((box, index) => (
            <InfoBox key={index} {...box} />
          ))}
        </div>
      </div>
    </section>
  )
}

function InfoBox({ 
  icon: Icon, 
  title, 
  bgGradient, 
  link, 
  textDark = false,
  hasImage = false 
}: any) {
  return (
    <div
      className={`
        relative bg-gradient-to-br ${bgGradient} 
        rounded-2xl p-8 text-center
        hover:-translate-y-2 hover:shadow-xl
        transition-all duration-300 cursor-pointer
        ${textDark ? 'text-text-dark' : 'text-white'}
      `}
    >
      <Icon className="w-12 h-12 mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-4 whitespace-pre-line leading-tight">
        {title}
      </h3>
      <Link 
        href={link}
        className={`
          inline-block px-6 py-2 rounded-full text-sm font-medium
          ${textDark ? 'bg-white/30 hover:bg-white/50' : 'bg-white/20 hover:bg-white/40'}
          transition-colors
        `}
      >
        Xem chi tiết
      </Link>

      {hasImage && (
        <div className="absolute bottom-4 right-4 opacity-30">
          <Globe className="w-16 h-16" />
        </div>
      )}
    </div>
  )
}
