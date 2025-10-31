'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronRight, ChevronLeft, Tag } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  slug: string;
  tags: string[];
}

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  // Mock news data
  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Top 10 Figure Anime Hot Nhất Tháng 3/2024',
      excerpt: 'Khám phá những mẫu figure anime được săn đón nhiều nhất trong tháng này với những thiết kế độc đáo và chất lượng tuyệt vời...',
      image: '/images/news/news-1.jpg',
      date: '15/03/2024',
      category: 'Tin tức',
      slug: 'top-10-figure-anime-hot-nhat-thang-3-2024',
      tags: ['Figure', 'Top 10', 'Hot'],
    },
    {
      id: '2',
      title: 'Hướng Dẫn Bảo Quản Figure Để Giữ Được Lâu',
      excerpt: 'Những mẹo và cách bảo quản figure đúng cách để sản phẩm của bạn luôn như mới và tránh bị hư hỏng theo thời gian...',
      image: '/images/news/news-2.jpg',
      date: '12/03/2024',
      category: 'Hướng dẫn',
      slug: 'huong-dan-bao-quan-figure',
      tags: ['Hướng dẫn', 'Bảo quản'],
    },
    {
      id: '3',
      title: 'Sự Kiện Pre-Order Figure Mới Từ Good Smile Company',
      excerpt: 'Đừng bỏ lỡ cơ hội đặt trước những mẫu figure độc quyền từ Good Smile Company với giá ưu đãi đặc biệt...',
      image: '/images/news/news-3.jpg',
      date: '10/03/2024',
      category: 'Sự kiện',
      slug: 'su-kien-pre-order-figure-moi',
      tags: ['Sự kiện', 'Pre-order', 'Good Smile'],
    },
    {
      id: '4',
      title: 'Review Chi Tiết Nendoroid Hatsune Miku Snow Ver.',
      excerpt: 'Đánh giá chi tiết về chất lượng, phụ kiện và độ hoàn thiện của bộ Nendoroid Hatsune Miku phiên bản Snow 2024...',
      image: '/images/news/news-4.jpg',
      date: '08/03/2024',
      category: 'Review',
      slug: 'review-nendoroid-hatsune-miku-snow',
      tags: ['Review', 'Nendoroid', 'Miku'],
    },
    {
      id: '5',
      title: 'Phân Biệt Figure Chính Hãng Và Hàng Fake',
      excerpt: 'Những dấu hiệu nhận biết để phân biệt figure chính hãng và hàng nhái giúp bạn tránh mua phải sản phẩm giả...',
      image: '/images/news/news-5.jpg',
      date: '05/03/2024',
      category: 'Hướng dẫn',
      slug: 'phan-biet-figure-chinh-hang',
      tags: ['Hướng dẫn', 'Chính hãng'],
    },
    {
      id: '6',
      title: 'Những Bộ Figure Limited Edition Đáng Sưu Tầm 2024',
      excerpt: 'Tổng hợp những bộ figure phiên bản giới hạn được các collector đánh giá cao nhất năm 2024...',
      image: '/images/news/news-6.jpg',
      date: '01/03/2024',
      category: 'Tin tức',
      slug: 'figure-limited-edition-2024',
      tags: ['Limited', 'Collection', '2024'],
    },
  ];

  const recentPosts = newsArticles.slice(0, 5);

  const allTags = [
    'Figure',
    'Nendoroid',
    'Scale Figure',
    'Review',
    'Hướng dẫn',
    'Tin tức',
    'Pre-order',
    'Limited',
    'Good Smile',
    'Anime',
    'Manga',
    'Collection',
  ];

  const totalPages = Math.ceil(newsArticles.length / articlesPerPage);
  const currentArticles = newsArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-accent-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Tin tức</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tin tức & Blog</h1>
          <p className="text-gray-600">
            Cập nhật những tin tức mới nhất về figure, anime và manga
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - News Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentArticles.map((article) => (
                <article key={article.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Featured Image */}
                  <Link href={`/tin-tuc/${article.slug}`}>
                    <div className="relative w-full aspect-video bg-gray-200">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    {/* Category & Date */}
                    <div className="flex items-center gap-3 mb-3 text-sm">
                      <span className="bg-accent-red text-white px-3 py-1 rounded-full font-semibold">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar size={14} />
                        <span>{article.date}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/tin-tuc/${article.slug}`}>
                      <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-accent-red transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Read More Link */}
                    <Link
                      href={`/tin-tuc/${article.slug}`}
                      className="inline-flex items-center gap-1 text-accent-red font-semibold text-sm hover:gap-2 transition-all"
                    >
                      Xem thêm
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-accent-red text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Recent Posts */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Bài viết mới nhất
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/tin-tuc/${post.slug}`}
                      className="flex gap-3 group"
                    >
                      <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-accent-red transition-colors mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar size={12} />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Tag bài viết
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-accent-red hover:text-white text-gray-700 rounded-full text-sm font-medium transition-colors"
                    >
                      <Tag size={14} />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-primary to-primary-light rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Đăng ký nhận tin
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Nhận thông báo về tin tức và ưu đãi mới nhất
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-red"
                  />
                  <button
                    type="submit"
                    className="w-full bg-accent-red text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Đăng ký ngay
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
