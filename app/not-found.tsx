import Link from 'next/link';
import { Home, Search, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <span className="text-[150px] font-bold text-gray-200 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-accent-red/10 rounded-full flex items-center justify-center">
                <Search size={40} className="text-accent-red" />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Không tìm thấy trang
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. 
          Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>

        {/* Quick Links */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <p className="text-sm text-gray-500 mb-4">Bạn có thể thử:</p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <Home size={18} className="text-accent-red" />
              <span className="text-sm font-medium">Trang chủ</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <ShoppingBag size={18} className="text-accent-red" />
              <span className="text-sm font-medium">Sản phẩm</span>
            </Link>
            <Link
              href="/sale"
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <span className="text-accent-red font-bold">%</span>
              <span className="text-sm font-medium">Giảm giá</span>
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <Search size={18} className="text-accent-red" />
              <span className="text-sm font-medium">Tìm kiếm</span>
            </Link>
          </div>
        </div>

        {/* Main CTA */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-accent-red text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          <Home size={20} />
          Quay về trang chủ
        </Link>

        {/* Back Link */}
        <div className="mt-6">
          <Link
            href="javascript:history.back()"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-accent-red transition-colors"
          >
            <ArrowLeft size={16} />
            Quay lại trang trước
          </Link>
        </div>
      </div>
    </div>
  );
}
