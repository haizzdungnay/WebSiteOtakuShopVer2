'use client';

import { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';

interface NewsArticle {
=======
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft, Share2, Loader2 } from 'lucide-react';

interface Announcement {
>>>>>>> Stashed changes
  id: string;
  title: string;
  summary: string;
  content?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

<<<<<<< Updated upstream
interface ApiResponse {
  success: boolean;
  data: NewsArticle;
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
=======
export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [article, setArticle] = useState<Announcement | null>(null);
>>>>>>> Stashed changes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/announcements/${id}`);
<<<<<<< Updated upstream
        if (response.ok) {
          const data: ApiResponse = await response.json();
          if (data.success) {
            setArticle(data.data);
          }
        } else if (response.status === 404) {
          setError('Không tìm thấy tin tức');
        } else {
          setError('Không thể tải tin tức');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Có lỗi xảy ra khi tải tin tức');
=======
        
        if (!response.ok) {
          throw new Error('Không tìm thấy tin tức');
        }

        const data = await response.json();
        if (data.success && data.data) {
          setArticle(data.data);
        } else {
          throw new Error(data.error || 'Lỗi khi lấy tin tức');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Lỗi không xác định';
        setError(message);
>>>>>>> Stashed changes
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
<<<<<<< Updated upstream
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-accent-red" />
            <span className="ml-2 text-gray-600">Đang tải tin tức...</span>
          </div>
        </div>
=======
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
>>>>>>> Stashed changes
      </div>
    );
  }

  if (error || !article) {
    return (
<<<<<<< Updated upstream
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Không tìm thấy tin tức'}</h1>
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-red text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <ArrowLeft size={18} />
              Quay lại trang tin tức
            </Link>
          </div>
=======
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Không tìm thấy tin tức'}</p>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all"
          >
            <ArrowLeft size={18} />
            Quay lại tin tức
          </Link>
>>>>>>> Stashed changes
        </div>
      </div>
    );
  }

<<<<<<< Updated upstream
  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-accent-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/tin-tuc" className="hover:text-accent-red">Tin tức</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{article.title}</span>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ArrowLeft size={16} />
            Quay lại danh sách tin tức
          </Link>
        </div>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Đăng ngày {new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Article Content */}
        {article.content && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-red text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Xem thêm tin tức khác
=======
  const formattedDate = new Date(article.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <ArrowLeft size={18} />
            Quay lại tin tức
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-slate-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <time dateTime={article.createdAt}>
                {formattedDate}
              </time>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/tin-tuc/${id}`;
                const text = `${article.title} - 1Otaku`;
                
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    text: article.summary,
                    url: shareUrl,
                  });
                } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(shareUrl);
                  alert('Đã sao chép liên kết vào clipboard');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-sm transition-all"
            >
              <Share2 size={16} />
              Chia sẻ
            </button>
          </div>
        </div>

        {/* Article Summary */}
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg mb-8">
          <p className="text-lg text-slate-700 italic">{article.summary}</p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
          {article.content ? (
            <div 
              className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-slate-600">Không có nội dung chi tiết.</p>
          )}
        </div>

        {/* Article Footer */}
        <div className="border-t border-slate-200 pt-8">
          <div className="text-sm text-slate-600">
            <p>Cập nhật lần cuối: {new Date(article.updatedAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      <div className="bg-white mt-12 py-12 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Tin tức khác</h2>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all"
          >
            <ArrowLeft size={18} />
            Xem tất cả tin tức
>>>>>>> Stashed changes
          </Link>
        </div>
      </div>
    </div>
  );
}
<<<<<<< Updated upstream

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react'

interface Announcement {
    id: string
    title: string
    summary: string
    content: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface RelatedAnnouncement {
    id: string
    title: string
    createdAt: string
}

export default function AnnouncementDetail() {
    const params = useParams()
    const id = params?.id as string
    const [announcement, setAnnouncement] = useState<Announcement | null>(null)
    const [relatedPosts, setRelatedPosts] = useState<RelatedAnnouncement[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return

        const fetchAnnouncement = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/announcements/${id}`)
                if (!response.ok) {
                    setError('Tin tức không tồn tại')
                    return
                }
                const data = await response.json()
                setAnnouncement(data.data)
            } catch (error) {
                console.error('Fetch error:', error)
                setError('Không thể tải tin tức')
            } finally {
                setLoading(false)
            }
        }

        const fetchRelated = async () => {
            try {
                const response = await fetch('/api/announcements?limit=5')
                if (response.ok) {
                    const data = await response.json()
                    setRelatedPosts(data.data.announcements.filter((a: Announcement) => a.id !== id).slice(0, 4))
                }
            } catch (error) {
                console.error('Fetch related error:', error)
            }
        }

        fetchAnnouncement()
        fetchRelated()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        )
    }

    if (error || !announcement) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <p className="text-red-600">{error}</p>
                <Link href="/tin-tuc" className="text-indigo-600 hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="container-custom">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <Link href="/" className="hover:text-indigo-600">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link href="/tin-tuc" className="hover:text-indigo-600">Tin tức</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{announcement.title}</span>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                    <article className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-8">
                            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{announcement.title}</h1>
                            <div className="flex items-center gap-2 text-indigo-100 text-sm">
                                <Calendar size={16} />
                                <time dateTime={announcement.createdAt}>
                                    {new Date(announcement.createdAt).toLocaleDateString('vi-VN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="px-8 py-6 border-b border-gray-200 bg-indigo-50">
                            <p className="text-lg text-gray-700 italic">{announcement.summary}</p>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-8">
                            {announcement.content.includes('<') ? (
                                <div
                                    className="text-gray-700 leading-relaxed whitespace-pre-line"
                                    dangerouslySetInnerHTML={{ __html: announcement.content }}
                                />
                            ) : (
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {announcement.content}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                            Cập nhật lần cuối: <time dateTime={announcement.updatedAt}>{new Date(announcement.updatedAt).toLocaleDateString('vi-VN')}</time>
                        </div>
                    </article>

                    {/* Related & Newsletter */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                                    📰 Tin tức khác
                                </h3>
                                <div className="space-y-4">
                                    {relatedPosts.map((post) => (
                                        <Link
                                            key={post.id}
                                            href={`/tin-tuc/${post.id}`}
                                            className="block p-3 bg-gray-50 rounded hover:bg-indigo-50 transition group"
                                        >
                                            <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">
                                                {post.title}
                                            </h4>
                                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                                <Calendar size={12} />
                                                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Newsletter */}
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-6 text-white text-center">
                            <h3 className="text-xl font-bold mb-2">📧 Đăng ký nhận tin</h3>
                            <p className="text-sm text-indigo-100 mb-4">
                                Nhận thông báo về tin tức và ưu đãi mới nhất
                            </p>
                            <form className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="w-full px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-white text-gray-900 placeholder-gray-600"
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
    )
}
=======
>>>>>>> Stashed changes
