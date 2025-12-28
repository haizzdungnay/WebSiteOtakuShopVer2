'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromotionSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  backgroundColor: string;
  textColor: string;
  image?: string;
  decoration?: {
    dots?: boolean;
    circles?: boolean;
    shapes?: boolean;
  };
}

const promotionSlides: PromotionSlide[] = [
  {
    id: '1',
    title: 'MÙA SALE CUỐI NĂM',
    subtitle: 'GIẢM GIÁ LÊN ĐẾN 50%',
    description: 'Hàng ngàn sản phẩm Figure & Anime với ưu đãi hấp dẫn. Đừng bỏ lỡ cơ hội sở hữu những món đồ yêu thích với giá siêu hời!',
    ctaText: 'Mua ngay',
    ctaLink: '/products?onSale=true',
    ctaSecondaryText: 'Xem tất cả',
    ctaSecondaryLink: '/products',
    backgroundColor: 'bg-red-500',
    textColor: 'text-white',
    image: 'https://media.tenor.com/sbfBfp3FeY8AAAAj/oia-uia.gif',
    decoration: {
      dots: true,
      circles: true,
      shapes: true,
    },
  },
  {
    id: '2',
    title: 'FIGURE MỚI NHẤT',
    subtitle: 'CẬP NHẬT HÀNG TUẦN',
    description: 'Khám phá bộ sưu tập Figure mới nhất từ các series Anime hot nhất. Sản phẩm chính hãng, chất lượng cao, giá cả phải chăng.',
    ctaText: 'Khám phá',
    ctaLink: '/new-releases',
    ctaSecondaryText: 'Đặt trước',
    ctaSecondaryLink: '/products?preorder=true',
    backgroundColor: 'bg-gradient-to-br from-blue-400 to-purple-500',
    textColor: 'text-white',
    image: 'https://media.tenor.com/sbfBfp3FeY8AAAAj/oia-uia.gif',
    decoration: {
      dots: true,
      circles: true,
      shapes: false,
    },
  },
  {
    id: '3',
    title: 'THÀNH VIÊN VIP',
    subtitle: 'ƯU ĐÃI ĐẶC BIỆT',
    description: 'Đăng ký thành viên ngay để nhận ưu đãi 10% cho đơn hàng đầu tiên và cập nhật sớm nhất về sản phẩm mới.',
    ctaText: 'Đăng ký ngay',
    ctaLink: '/register',
    ctaSecondaryText: 'Đăng nhập',
    ctaSecondaryLink: '/login',
    backgroundColor: 'bg-gradient-to-br from-green-400 to-teal-500',
    textColor: 'text-white',
    image: 'https://media.tenor.com/sbfBfp3FeY8AAAAj/oia-uia.gif',
    decoration: {
      dots: false,
      circles: true,
      shapes: true,
    },
  },
  {
    id: '4',
    title: 'PVC FIGURE HOT',
    subtitle: 'BỘ SƯU TẬP ĐẶC BIỆT',
    description: 'Những mẫu PVC Figure hot nhất từ Nendoroid, figma, và các thương hiệu uy tín. Chất lượng cao, pose đẹp, giá tốt.',
    ctaText: 'Xem ngay',
    ctaLink: '/products?category=figures-models',
    ctaSecondaryText: 'So sánh',
    ctaSecondaryLink: '/products',
    backgroundColor: 'bg-gradient-to-br from-orange-400 to-red-500',
    textColor: 'text-white',
    image: 'https://images-ext-1.discordapp.net/external/QDu45ZtENTwk5Y3jRK1W2FiUAZH_FxuXe2feH38F9js/https/down-vn.img.susercontent.com/file/vn-11134201-7ras8-mccwn9pbhylf16.webp?format=webp&width=815&height=815',
    decoration: {
      dots: true,
      circles: false,
      shapes: true,
    },
  },
];

export default function PromotionSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotionSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotionSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotionSlides.length) % promotionSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = promotionSlides[currentSlide];

  return (
    <div className="relative w-full min-h-[420px] overflow-hidden rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
      {/* Slides */}
      <div className="relative h-full">
        {promotionSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background */}
            <div className={`w-full h-full ${slide.backgroundColor} relative overflow-hidden`} style={{ minHeight: '420px' }}>
              {/* Decorative Elements */}
              <div className="pointer-events-none absolute inset-0">
                {/* Dots pattern */}
                {slide.decoration?.dots && (
                  <div className="absolute left-12 top-10 grid grid-cols-4 gap-2 opacity-30">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 border border-white rounded-full"
                      />
                    ))}
                  </div>
                )}

                {/* Circles */}
                {slide.decoration?.circles && (
                  <>
                    <div className="absolute -left-32 bottom-[-140px] w-[340px] h-[340px] bg-white bg-opacity-20 rounded-full" />
                    <div className="absolute -right-24 -top-10 w-[220px] h-[220px] rounded-full border-[24px] border-white border-opacity-30 border-t-transparent border-l-transparent" />
                  </>
                )}

                {/* Shapes */}
                {slide.decoration?.shapes && (
                  <>
                    <div className="absolute top-20 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse" />
                    <div className="absolute bottom-32 left-32 w-12 h-12 bg-white bg-opacity-20 rounded-lg rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
                  </>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10 h-full px-16 py-12 flex items-center justify-between gap-10">
                {/* Left Content */}
                <div className="flex-1">
                  <h2 className={`text-[56px] leading-tight font-extrabold tracking-[0.25em] ${slide.textColor} mb-6 uppercase`}>
                    {slide.title}
                  </h2>

                  <p className={`text-2xl font-bold ${slide.textColor} mb-4`}>
                    {slide.subtitle}
                  </p>

                  <p className={`text-lg ${slide.textColor} mb-8 max-w-lg`}>
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={slide.ctaLink}
                      className="bg-white bg-opacity-20 backdrop-blur-sm text-white border-2 border-white border-opacity-30 px-8 py-3 rounded-2xl text-sm font-semibold shadow-md hover:bg-opacity-30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      {slide.ctaText}
                    </Link>
                    {slide.ctaSecondaryText && slide.ctaSecondaryLink && (
                      <Link
                        href={slide.ctaSecondaryLink}
                        className="bg-white text-gray-800 px-8 py-3 rounded-2xl text-sm font-semibold shadow-md hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02]"
                      >
                        {slide.ctaSecondaryText}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right Visual */}
                <div className="relative z-10 flex items-center justify-center">
                  {slide.image ? (
                    <div className="w-[260px] h-[260px] rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.15)] overflow-hidden border-4 border-white border-opacity-30">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="fallback hidden w-full h-full bg-white bg-opacity-10 backdrop-blur-sm items-center justify-center text-center">
                        <div className={`text-6xl font-bold ${slide.textColor} mb-2`}>
                          {index + 1}
                        </div>
                        <div className={`text-lg font-semibold ${slide.textColor} opacity-80`}>
                          PROMOTION
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-[260px] h-[260px] bg-white bg-opacity-10 backdrop-blur-sm rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.15)] flex items-center justify-center border border-white border-opacity-20">
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${slide.textColor} mb-2`}>
                          {index + 1}
                        </div>
                        <div className={`text-lg font-semibold ${slide.textColor} opacity-80`}>
                          PROMOTION
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-300 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-300 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {promotionSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20">
        <div
          className="h-full bg-white transition-all duration-[5000ms] ease-linear"
          style={{
            width: `${((currentSlide + 1) / promotionSlides.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
