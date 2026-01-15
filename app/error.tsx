'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Đã xảy ra lỗi!
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 mb-8">
          Rất tiếc, đã có lỗi xảy ra khi tải trang này. Vui lòng thử lại hoặc quay về trang chủ.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 dark:bg-dark-border rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-gray-500 mb-2 font-medium">Chi tiết lỗi:</p>
            <p className="text-sm text-red-600 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-400 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-accent-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            <RefreshCw size={20} />
            Thử lại
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <Home size={20} />
            Về trang chủ
          </Link>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-2 text-gray-500 hover:text-accent-red transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại trang trước
        </button>
      </div>
    </div>
  );
}
