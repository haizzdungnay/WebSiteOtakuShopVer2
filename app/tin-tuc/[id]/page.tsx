'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  summary: string;
  content?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/announcements/${id}`);
        
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy tin tức</h1>
          <p className="text-gray-600 mb-6">{error || 'Tin tức này không tồn tại'}</p>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <ArrowLeft size={18} />
            Quay lại tin tức
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const updatedDate = new Date(article.updatedAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-accent-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/tin-tuc" className="hover:text-accent-red">Tin tức</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{article.title}</span>
        </div>

        {/* Back Button */}
        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-8"
        >
          <ArrowLeft size={18} />
          Quay lại tin tức
        </Link>

        {/* Main Article */}
        <article className="bg-white rounded-lg overflow-hidden shadow-sm mb-8">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <time dateTime={article.createdAt}>
                  Đăng: {formattedDate}
                </time>
              </div>
              {article.updatedAt !== article.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <time dateTime={article.updatedAt}>
                    Cập nhật: {updatedDate}
                  </time>
                </div>
              )}
            </div>
          </div>

          {/* Summary Box */}
          {article.summary && (
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 m-8 rounded-lg">
              <p className="text-lg text-gray-700 italic">{article.summary}</p>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none px-8 py-8 text-gray-700">
            {article.content ? (
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <p className="text-gray-600">Không có nội dung chi tiết.</p>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>Cập nhật lần cuối: {updatedDate}</p>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tin tức khác</h2>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
          >
            Xem tất cả tin tức
            <ArrowLeft size={18} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
