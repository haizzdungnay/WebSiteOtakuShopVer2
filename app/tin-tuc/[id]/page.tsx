'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: NewsArticle;
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/announcements/${id}`);
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
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-accent-red" />
            <span className="ml-2 text-gray-600">Đang tải tin tức...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
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
        </div>
      </div>
    );
  }

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
          </Link>
        </div>
      </div>
    </div>
  );
}
