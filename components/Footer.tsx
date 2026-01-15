import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-300 pt-12 pb-6 transition-colors duration-200" suppressHydrationWarning>
      <div className="container-custom" suppressHydrationWarning>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8" suppressHydrationWarning>
          {/* About */}
          <div suppressHydrationWarning>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4">DN FIGURE</h3>
            <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
              Chuyên cung cấp các loại figure chính hãng, mô hình anime, manga và
              các sản phẩm collectibles chất lượng cao.
            </p>
            <div className="flex gap-3" suppressHydrationWarning>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 dark:bg-gray-800 hover:bg-primary text-gray-600 dark:text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 dark:bg-gray-800 hover:bg-primary text-gray-600 dark:text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 dark:bg-gray-800 hover:bg-primary text-gray-600 dark:text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div suppressHydrationWarning>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gioi-thieu" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/tin-tuc" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chinh-sach-van-chuyen" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-hanh" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="/huong-dan-thanh-toan" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                <span>123 Đường ABC, Quận 1, TP. HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a href="tel:0389836514" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  0389 836 514
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <a
                  href="mailto:tuanduongtempproject@gmail.com"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  tuanduongtempproject@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <div className="text-center">
            <h4 className="text-gray-900 dark:text-white font-semibold mb-3 text-sm">
              Phương thức thanh toán
            </h4>
            <div className="flex justify-center gap-4 flex-wrap">
              <div suppressHydrationWarning className="bg-white dark:bg-dark-card rounded px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border">
                VISA
              </div>
              <div suppressHydrationWarning className="bg-white dark:bg-dark-card rounded px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border">
                MASTERCARD
              </div>
              <div suppressHydrationWarning className="bg-white dark:bg-dark-card rounded px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border">
                MOMO
              </div>
              <div suppressHydrationWarning className="bg-white dark:bg-dark-card rounded px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border">
                ZALOPAY
              </div>
              <div suppressHydrationWarning className="bg-white dark:bg-dark-card rounded px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border">
                COD
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © 2025 DN Figure Store. All rights reserved. | Made with ❤️ by Team Dương
            - Nguyên - Lâm
          </p>
        </div>
      </div>
    </footer>
  );
}