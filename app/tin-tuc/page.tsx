'use client';

import { useState, useEffect } from 'react';
<<<<<<< Updated upstream
=======
import Image from 'next/image';
>>>>>>> Stashed changes
import Link from 'next/link';
import { Calendar, ChevronRight, ChevronLeft, Tag, Loader2 } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  summary: string;
  content?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NewsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 9;
  const [articles, setArticles] = useState<Announcement[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

<<<<<<< Updated upstream
  // Fetch announcements from API
=======
  // Fetch announcements
>>>>>>> Stashed changes
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/announcements?page=${currentPage}&limit=${articlesPerPage}`);
<<<<<<< Updated upstream
        const data = await response.json();
        
        if (data.success) {
          setAnnouncements(data.data?.announcements || []);
          const pagination = data.data?.pagination;
          if (pagination) {
            setTotalPages(pagination.totalPages || 1);
          }
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [currentPage]);

  const recentPosts = announcements.slice(0, 5);
=======
        
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách tin tức');
        }

        const data = await response.json();
        if (data.success && data.data) {
          setArticles(data.data.announcements);
          setTotalPages(data.data.pagination.totalPages);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Lỗi không xác định';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
>>>>>>> Stashed changes

    fetchAnnouncements();
  }, [currentPage]);

<<<<<<< Updated upstream
=======
  const currentArticles = articles;

>>>>>>> Stashed changes
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
          {/* Loading State */}
          {loading && (
            <div className="lg:col-span-3 flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-accent-red" />
              <span className="ml-2 text-gray-600">Đang tải tin tức...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="lg:col-span-3 text-center py-16">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-accent-red text-white rounded-lg hover:bg-red-600"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Main Content - News Grid */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
<<<<<<< Updated upstream
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : announcements.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {announcements.map((announcement) => (
                    <article key={announcement.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Featured Image - Placeholder */}
                      <div className="relative w-full aspect-video bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                        <div className="text-white text-center p-4">
                          <div className="text-4xl mb-2">📰</div>
                          <p className="text-sm font-medium">Tin tức</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Date */}
                        <div className="flex items-center gap-3 mb-3 text-sm">
                          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full font-semibold text-xs">
                            Tin tức
                          </span>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar size={14} />
                            <span>{new Date(announcement.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-2">
                          {announcement.title}
                        </h2>

                        {/* Summary */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {announcement.summary}
                        </p>

                        {/* Read More Link */}
                        <Link href={`/tin-tuc/${announcement.id}`} className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:gap-2 transition-all group">
                          Xem thêm
                          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">Chưa có tin tức nào</p>
=======
                <Loader2 className="animate-spin text-indigo-600" size={40} />
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">Chưa có tin tức nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentArticles.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Featured Image - Placeholder */}
                    <Link href={`/tin-tuc/${article.id}`}>
                      <div className="relative w-full aspect-video bg-gradient-to-br from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 transition-all flex items-center justify-center">
                        <div className="text-white text-center">
                          <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-semibold opacity-75">Ảnh tin tức</p>
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-5">
                      {/* Date */}
                      <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                        <Calendar size={14} />
                        <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>

                      {/* Title */}
                      <Link href={`/tin-tuc/${article.id}`}>
                        <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                      </Link>

                      {/* Summary */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.summary}
                      </p>

                      {/* Read More Link */}
                      <Link
                        href={`/tin-tuc/${article.id}`}
                        className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:gap-2 transition-all"
                      >
                        Xem thêm
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
            

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
>>>>>>> Stashed changes
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
                  {articles.slice(0, 5).map((post) => (
                    <Link
                      key={post.id}
                      href={`/tin-tuc/${post.id}`}
                      className="flex gap-3 group"
                    >
<<<<<<< Updated upstream
                      <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <div className="text-white text-2xl">📰</div>
=======
                      <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Calendar size={20} className="text-white opacity-50" />
>>>>>>> Stashed changes
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar size={12} />
                          <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

<<<<<<< Updated upstream
              {/* Tags */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Tag bài viết
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-700 rounded-full text-sm font-medium transition-colors"
                    >
                      <Tag size={14} />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">
=======
              {/* Newsletter */}
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">
>>>>>>> Stashed changes
                  Đăng ký nhận tin
                </h3>
                <p className="text-sm text-indigo-100 mb-4">
                  Nhận thông báo về tin tức và ưu đãi mới nhất
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email của bạn"
<<<<<<< Updated upstream
                    className="w-full px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-white text-gray-900 placeholder-gray-600"
=======
                    className="w-full px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-white bg-indigo-400 placeholder-indigo-200 text-white"
>>>>>>> Stashed changes
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
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
