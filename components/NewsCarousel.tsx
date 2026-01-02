'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';

interface HotNews {
  id: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function NewsCarousel() {
  const [hotNews, setHotNews] = useState<HotNews[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch hot news
  useEffect(() => {
    const fetchHotNews = async () => {
      try {
        const response = await fetch('/api/announcements/hot?limit=10');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setHotNews(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching hot news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotNews();
  }, []);

  // Auto-slide every 10 seconds
  useEffect(() => {
    if (hotNews.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hotNews.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [hotNews.length, isPaused]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + hotNews.length) % hotNews.length);
  }, [hotNews.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % hotNews.length);
  }, [hotNews.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Don't render if loading or no hot news
  if (loading) {
    return (
      <div className="relative w-full min-h-[220px] sm:min-h-[320px] lg:min-h-[420px] overflow-hidden rounded-[16px] sm:rounded-[24px] lg:rounded-[32px] bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Newspaper className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-rose-300" />
          <span className="text-rose-400 font-medium text-sm sm:text-base">Đang tải tin tức...</span>
        </div>
      </div>
    );
  }

  if (hotNews.length === 0) {
    return (
      <div className="relative w-full min-h-[220px] sm:min-h-[320px] lg:min-h-[420px] overflow-hidden rounded-[16px] sm:rounded-[24px] lg:rounded-[32px] bg-gradient-to-br from-rose-100 to-pink-200 px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12 flex items-center justify-center shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
        <div className="text-center">
          <Newspaper className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-rose-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-rose-500 mb-2">Tin tức nổi bật</h3>
          <p className="text-rose-400 text-sm sm:text-base">Chưa có tin tức hot nào</p>
        </div>
      </div>
    );
  }

  const currentNews = hotNews[currentIndex];

  return (
    <div
      className="relative w-full min-h-[220px] sm:min-h-[320px] lg:min-h-[420px] overflow-hidden rounded-[16px] sm:rounded-[24px] lg:rounded-[32px] bg-gradient-to-br from-rose-50 via-pink-100 to-rose-200 shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative elements - ẩn trên mobile để đơn giản hóa */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        {/* Dots pattern top left */}
        <div className="absolute left-8 top-8 grid grid-cols-4 gap-2 opacity-30">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="w-2 h-2 border border-rose-400 rounded-full"
            />
          ))}
        </div>
        {/* Circle bottom left */}
        <div className="absolute -left-24 -bottom-24 w-[280px] h-[280px] bg-rose-400/30 rounded-full" />
        {/* Arc top right */}
        <div className="absolute -right-16 -top-8 w-[180px] h-[180px] rounded-full border-[20px] border-rose-300/40 border-t-transparent border-l-transparent" />
      </div>

      {/* Main content */}
      <Link
        href={`/tin-tuc/${currentNews.id}`}
        className="relative z-10 flex flex-col sm:flex-row h-full min-h-[220px] sm:min-h-[320px] lg:min-h-[420px] items-stretch"
      >
        {/* Left side - Text content */}
        <div className="flex-1 flex flex-col justify-center px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-10 order-2 sm:order-1">
          {/* Hot badge */}
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3 lg:mb-4">
            <span className="bg-rose-500 text-white px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider animate-pulse">
              Hot News
            </span>
            <span className="text-rose-500 text-xs sm:text-sm font-medium">
              {new Date(currentNews.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-800 mb-2 sm:mb-3 lg:mb-4 line-clamp-2 sm:line-clamp-3 leading-tight hover:text-rose-600 transition-colors">
            {currentNews.title}
          </h2>

          {/* Summary - ẩn trên mobile để tiết kiệm không gian */}
          <p className="hidden sm:block text-slate-600 text-sm sm:text-base lg:text-lg line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 lg:mb-6">
            {currentNews.summary}
          </p>

          {/* Read more button */}
          <div className="flex items-center gap-2 text-rose-500 font-semibold group text-sm sm:text-base">
            <span>Đọc thêm</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Right side - Image */}
        <div className="w-full sm:w-[45%] relative flex items-center justify-center p-3 sm:p-5 lg:p-8 order-1 sm:order-2">
          <div className="relative w-full h-[120px] sm:h-[200px] lg:h-[320px] rounded-[12px] sm:rounded-[16px] lg:rounded-[24px] overflow-hidden shadow-2xl bg-white">
            {currentNews.imageUrl ? (
              <Image
                src={currentNews.imageUrl}
                alt={currentNews.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 45vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
                <Newspaper className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 text-rose-300" />
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Navigation arrows - nhỏ hơn trên mobile */}
      {hotNews.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              goToPrevious();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
            aria-label="Previous news"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-700" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              goToNext();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
            aria-label="Next news"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-700" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {hotNews.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-2">
          {hotNews.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                goToSlide(index);
              }}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-rose-500 w-5 sm:w-8'
                  : 'bg-white/70 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {hotNews.length > 1 && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-200/50">
          <div
            className="h-full bg-rose-500 transition-all"
            style={{
              width: `${((currentIndex + 1) / hotNews.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
