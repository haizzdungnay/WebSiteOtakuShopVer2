'use client';

import Link from 'next/link';
import { Truck, RotateCcw, Shield, DollarSign, MapPin, Clock } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-accent-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Chính sách giao hàng & bảo hành</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Chính sách giao hàng & bảo hành
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tất cả thông tin về chính sách giao hàng, đổi trả và bảo hành sản phẩm tại DN Figure
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Shipping Policy */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck size={24} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Chính sách giao hàng</h2>
            </div>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1. Phạm vi giao hàng
                </h3>
                <p className="mb-2">
                  DN Figure giao hàng trên toàn quốc với các hình thức vận chuyển đa dạng:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Giao hàng tận nơi tại TP.HCM</li>
                  <li>Giao hàng qua đơn vị vận chuyển cho các tỉnh thành khác</li>
                  <li>Nhận hàng tại cửa hàng (miễn phí)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  2. Thời gian giao hàng
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Nội thành TP.HCM:</span>
                    <span className="text-accent-red font-semibold">1-2 ngày</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Ngoại thành & tỉnh lân cận:</span>
                    <span className="text-accent-red font-semibold">2-3 ngày</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Các tỉnh thành khác:</span>
                    <span className="text-accent-red font-semibold">3-5 ngày</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Vùng xa, hải đảo:</span>
                    <span className="text-accent-red font-semibold">5-7 ngày</span>
                  </div>
                </div>
                <p className="text-sm mt-2 text-gray-600">
                  * Thời gian trên không bao gồm thứ 7, Chủ nhật và các ngày lễ
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  3. Phí vận chuyển
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="font-semibold text-green-800 mb-2">
                    ✓ MIỄN PHÍ GIAO HÀNG
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>• Đơn hàng từ 500.000đ (nội thành TP.HCM)</li>
                    <li>• Đơn hàng từ 1.000.000đ (ngoại thành & tỉnh lân cận)</li>
                    <li>• Đơn hàng từ 2.000.000đ (toàn quốc)</li>
                  </ul>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="font-medium">Phí ship cho đơn hàng dưới mức miễn phí:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nội thành TP.HCM: 30.000đ</li>
                    <li>Ngoại thành & tỉnh lân cận: 40.000đ</li>
                    <li>Các tỉnh thành khác: 50.000đ</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  4. Kiểm tra hàng khi nhận
                </h3>
                <p className="mb-2">
                  Quý khách có quyền kiểm tra hàng trước khi thanh toán:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Kiểm tra tình trạng bên ngoài của hộp (có bị móp, ướt hay không)</li>
                  <li>Đếm số lượng sản phẩm theo đơn hàng</li>
                  <li>Từ chối nhận hàng nếu phát hiện bất thường</li>
                </ul>
                <p className="mt-2 text-sm text-red-600 font-medium">
                  Lưu ý: Sau khi ký nhận hàng, shop sẽ không chịu trách nhiệm với các vấn đề về hư hỏng do vận chuyển.
                </p>
              </div>
            </div>
          </section>

          {/* Return & Exchange Policy */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <RotateCcw size={24} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Điều khoản đổi trả và bảo hành</h2>
            </div>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1. Điều kiện đổi trả
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Trong vòng 7 ngày kể từ ngày nhận hàng</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Sản phẩm chưa qua sử dụng, còn nguyên tem, hộp</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Có đầy đủ phụ kiện đi kèm</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Có hóa đơn mua hàng</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  2. Các trường hợp được đổi/trả
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-red font-bold">•</span>
                    <span>Sản phẩm bị lỗi do nhà sản xuất (bể vỡ, lỗi sơn, khuyết điểm kỹ thuật)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-red font-bold">•</span>
                    <span>Giao sai sản phẩm so với đơn hàng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-red font-bold">•</span>
                    <span>Sản phẩm bị hư hỏng trong quá trình vận chuyển (đã báo ngay khi nhận hàng)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-red font-bold">•</span>
                    <span>Không muốn mua nữa (chịu phí ship và phí xử lý 10%)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  3. Thời gian và địa điểm đổi trả
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={18} className="text-accent-red" />
                      <span className="font-semibold">Thời gian xử lý</span>
                    </div>
                    <p className="text-sm">5-7 ngày làm việc kể từ khi nhận lại sản phẩm</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={18} className="text-accent-red" />
                      <span className="font-semibold">Địa điểm</span>
                    </div>
                    <p className="text-sm">Trả hàng trực tiếp tại cửa hàng hoặc gửi qua bưu điện</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  4. Chi phí vận chuyển khi đổi trả
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span>Lỗi do shop:</span>
                    <span className="font-semibold text-green-600">Shop chịu phí</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span>Khách đổi ý:</span>
                    <span className="font-semibold text-yellow-600">Khách chịu phí</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  5. Quy định đổi góm khi chuyển trả
                </h3>
                <p className="mb-2">
                  Trong một số trường hợp đặc biệt, khách hàng có thể đổi sang sản phẩm khác:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Sản phẩm mới phải có giá trị bằng hoặc cao hơn sản phẩm cũ</li>
                  <li>Nếu sản phẩm mới có giá cao hơn, khách hàng thanh toán phần chênh lệch</li>
                  <li>Nếu sản phẩm mới có giá thấp hơn, shop sẽ hoàn lại tiền thừa (trừ phí xử lý 10%)</li>
                  <li>Không áp dụng cho sản phẩm đang khuyến mãi hoặc limited edition</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Warranty Policy */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield size={24} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Chính sách bảo hành</h2>
            </div>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1. Chính sách bảo hành theo hãng
                </h3>
                <p className="mb-3">
                  DN Figure cam kết 100% sản phẩm chính hãng và được bảo hành theo chính sách của từng hãng:
                </p>
                <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="font-semibold text-purple-900 mb-1">Good Smile Company (GSC)</div>
                    <p className="text-sm">Bảo hành 30 ngày với các lỗi kỹ thuật do nhà sản xuất</p>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-900 mb-1">Kotobukiya</div>
                    <p className="text-sm">Bảo hành 30 ngày, hỗ trợ linh kiện thay thế</p>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-900 mb-1">Bandai / Banpresto</div>
                    <p className="text-sm">Bảo hành theo chính sách Nhật Bản, 30 ngày</p>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-900 mb-1">Các hãng khác</div>
                    <p className="text-sm">Liên hệ để được tư vấn cụ thể</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  2. Điều kiện được bảo hành
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Sản phẩm còn trong thời hạn bảo hành</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Lỗi do nhà sản xuất (không do tác động bên ngoài)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Còn hóa đơn mua hàng và tem bảo hành (nếu có)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Sản phẩm chưa qua sửa chữa tại nơi khác</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  3. Không áp dụng bảo hành
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Sản phẩm bị rơi, va đập, nứt vỡ do người dùng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Tự ý tháo rời, sửa chữa, thay đổi cấu trúc sản phẩm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Hư hỏng do thiên tai, hỏa hoạn, ngập nước</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Hết thời hạn bảo hành</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Sản phẩm không phải chính hãng (mua từ nguồn khác)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-primary to-primary-light rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Cần hỗ trợ thêm?
            </h2>
            <p className="text-gray-700 mb-6">
              Liên hệ với bộ phận chăm sóc khách hàng để được giải đáp mọi thắc mắc
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:0389836514"
                className="bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors inline-flex items-center gap-2"
              >
                <DollarSign size={20} />
                Hotline: 0389 836 514
              </a>
              <a
                href="mailto:tuanduongtempproject@gmail.com"
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Email: tuanduongtempproject@gmail.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
