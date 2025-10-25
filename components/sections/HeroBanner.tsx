'use client'

import Image from 'next/image'

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-[#FFE5ED] to-[#FFB6C1] py-20 overflow-hidden">
      <div className="container-custom relative">
        <div className="text-center relative z-10">
          {/* Decorative Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(9)].map((_, i) => (
              <span 
                key={i} 
                className="w-3 h-3 bg-[#FF6B9D] rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          {/* Main Title */}
          <h2 className="text-6xl md:text-8xl font-bold text-[#8B4C6B] tracking-[0.2em] mb-6">
            JOIN US
          </h2>

          {/* Wave Decoration */}
          <div className="flex justify-center">
            <svg className="w-20 h-6" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M0,10 Q25,0 50,10 T100,10" 
                stroke="#FF6B9D" 
                strokeWidth="2" 
                fill="none"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>

        {/* Decorative Circle - Left */}
        <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-[#E31837] rounded-full opacity-80 hidden md:block" />

        {/* Decorative Stripes - Right */}
        <div className="absolute right-0 top-0 w-20 h-full hidden md:block">
          <div 
            className="w-full h-full opacity-80"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                #E31837,
                #E31837 10px,
                transparent 10px,
                transparent 20px
              )`
            }}
          />
        </div>

        {/* QR Code */}
        <div className="absolute right-[8%] top-[20%] bg-white p-4 rounded-xl shadow-xl hidden lg:block">
          <div className="w-28 h-28 bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">QR CODE</span>
          </div>
        </div>
      </div>
    </section>
  )
}
