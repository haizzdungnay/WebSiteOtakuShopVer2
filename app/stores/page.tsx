'use client';

import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import Link from 'next/link';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  openHours: string;
  mapUrl: string;
  image: string;
}

const stores: Store[] = [
  {
    id: '1',
    name: 'Otaku Shop - Chi nhánh Quận 1',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    phone: '0389836514',
    openHours: '9:00 - 21:00',
    mapUrl: 'https://maps.google.com/?q=10.7756,106.7019',
    image: '/images/store-1.jpg',
  },
  {
    id: '2',
    name: 'Otaku Shop - Chi nhánh Quận 3',
    address: '456 Võ Văn Tần, Phường 5, Quận 3, TP.HCM',
    phone: '0389836515',
    openHours: '9:00 - 21:00',
    mapUrl: 'https://maps.google.com/?q=10.7756,106.6819',
    image: '/images/store-2.jpg',
  },
  {
    id: '3',
    name: 'Otaku Shop - Chi nhánh Quận 7',
    address: '789 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP.HCM',
    phone: '0389836516',
    openHours: '9:00 - 22:00',
    mapUrl: 'https://maps.google.com/?q=10.7256,106.7219',
    image: '/images/store-3.jpg',
  },
];

export default function StoresPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-red to-red-600 text-white">
        <div className="container-custom py-12">
          <div className="text-sm mb-4">
            <Link href="/" className="hover:underline">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span>Hệ thống cửa hàng</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Hệ thống cửa hàng</h1>
          <p className="text-white/80">Ghé thăm cửa hàng gần bạn nhất để trải nghiệm trực tiếp các sản phẩm Figure</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stores Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Store Image */}
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-red/20 to-orange-500/20 flex items-center justify-center">
                  <MapPin size={64} className="text-white/50" />
                </div>
              </div>

              {/* Store Info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">{store.name}</h3>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-accent-red flex-shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-accent-red flex-shrink-0" />
                    <a href={`tel:${store.phone}`} className="hover:text-accent-red">
                      {store.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-accent-red flex-shrink-0" />
                    <span>{store.openHours} (Thứ 2 - Chủ nhật)</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-accent-red text-white py-2.5 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    <Navigation size={18} />
                    Chỉ đường
                  </a>
                  <a
                    href={`tel:${store.phone}`}
                    className="flex items-center justify-center gap-2 px-4 border border-accent-red text-accent-red py-2.5 rounded-lg hover:bg-accent-red hover:text-white transition-colors font-medium"
                  >
                    <Phone size={18} />
                    Gọi ngay
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bạn cần hỗ trợ thêm?
            </h2>
            <p className="text-gray-600 mb-6">
              Liên hệ với chúng tôi qua hotline hoặc đến trực tiếp cửa hàng để được tư vấn về các sản phẩm Figure, Nendoroid, Scale Figure chính hãng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0389836514"
                className="inline-flex items-center justify-center gap-2 bg-accent-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                <Phone size={20} />
                Hotline: 0389836514
              </a>
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Gửi yêu cầu hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
