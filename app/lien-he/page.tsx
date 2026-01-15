import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Liên hệ | DN Figure',
  description: 'Liên hệ với DN Figure - Hotline: 0389 836 514',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ qua các kênh dưới đây.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Địa chỉ</h3>
                    <p className="text-gray-600 dark:text-gray-400">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Hotline</h3>
                    <a href="tel:0389836514" className="text-pink-600 hover:underline font-semibold text-lg">
                      0389 836 514
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Email</h3>
                    <a href="mailto:tuanduongtempproject@gmail.com" className="text-pink-600 hover:underline">
                      tuanduongtempproject@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Giờ làm việc</h3>
                    <p className="text-gray-600 dark:text-gray-400">Thứ 2 - Chủ nhật: 9:00 - 21:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kết nối với chúng tôi</h2>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://zalo.me/0389836514"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none"
                  placeholder="Nhập nội dung tin nhắn"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors"
              >
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
