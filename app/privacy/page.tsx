import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-accent-red transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Về trang chủ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Chính sách bảo mật
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn với các biện pháp
            bảo mật tiên tiến nhất, đảm bảo quyền riêng tư được tôn trọng.
          </p>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Nguyên tắc bảo mật</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Bảo vệ tối đa</h3>
              <p className="text-gray-600 mb-4">
                Sử dụng công nghệ mã hóa tiên tiến để bảo vệ dữ liệu cá nhân.
              </p>
              <div className="text-sm font-medium text-accent-red">SSL 256-bit</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Minh bạch</h3>
              <p className="text-gray-600 mb-4">
                Thông tin rõ ràng về cách chúng tôi thu thập và sử dụng dữ liệu.
              </p>
              <div className="text-sm font-medium text-accent-red">100% minh bạch</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Kiểm soát</h3>
              <p className="text-gray-600 mb-4">
                Bạn có quyền kiểm soát thông tin cá nhân của mình bất cứ lúc nào.
              </p>
              <div className="text-sm font-medium text-accent-red">Toàn quyền</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Database size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Lưu trữ an toàn</h3>
              <p className="text-gray-600 mb-4">
                Dữ liệu được lưu trữ trên hệ thống bảo mật với nhiều lớp bảo vệ.
              </p>
              <div className="text-sm font-medium text-accent-red">Đa lớp</div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Collection */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Thu thập thông tin</h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-green-800">Thông tin bạn cung cấp:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Tên, địa chỉ email, số điện thoại</li>
                  <li>• Địa chỉ giao hàng và thanh toán</li>
                  <li>• Thông tin tài khoản (khi đăng ký)</li>
                  <li>• Nội dung liên hệ và phản hồi</li>
                  <li>• Thông tin thanh toán (được mã hóa)</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-blue-800">Thông tin tự động thu thập:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Địa chỉ IP và vị trí địa lý</li>
                  <li>• Loại trình duyệt và thiết bị</li>
                  <li>• Trang web giới thiệu bạn đến</li>
                  <li>• Thời gian truy cập và hành vi duyệt web</li>
                  <li>• Cookies và dữ liệu phân tích</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Usage */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Cách sử dụng thông tin</h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-3">Cung cấp dịch vụ</h3>
                <p className="text-gray-600">
                  Xử lý đơn hàng, giao hàng, thanh toán và cung cấp các dịch vụ khách hàng.
                  Gửi thông tin về đơn hàng và cập nhật trạng thái giao hàng.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-3">Cải thiện trải nghiệm</h3>
                <p className="text-gray-600">
                  Phân tích hành vi người dùng để cải thiện website, sản phẩm và dịch vụ.
                  Cá nhân hóa nội dung và đề xuất sản phẩm phù hợp với sở thích của bạn.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-3">Tuân thủ pháp luật</h3>
                <p className="text-gray-600">
                  Đáp ứng các yêu cầu pháp lý, bảo vệ quyền lợi hợp pháp và ngăn chặn hoạt động
                  bất hợp pháp. Tuân thủ các quy định về bảo vệ dữ liệu cá nhân.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-3">Liên lạc và hỗ trợ</h3>
                <p className="text-gray-600">
                  Gửi thông tin về chương trình khuyến mãi, sản phẩm mới và cập nhật dịch vụ.
                  Hỗ trợ khách hàng và giải đáp thắc mắc một cách kịp thời.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sharing */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Chia sẻ thông tin</h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-red-800 mb-6">Chúng tôi KHÔNG bán thông tin cá nhân của bạn</h3>
              <p className="text-red-700">
                JH Figure Store cam kết không bán, trao đổi hoặc cho thuê thông tin cá nhân của khách hàng
                cho bên thứ ba vì mục đích thương mại. Thông tin của bạn chỉ được sử dụng để phục vụ
                nhu cầu của chính bạn và cải thiện dịch vụ của chúng tôi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-800 mb-3">Chia sẻ cần thiết:</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Đơn vị vận chuyển để giao hàng</li>
                  <li>• Ngân hàng/ví điện tử để thanh toán</li>
                  <li>• Cơ quan chức năng khi có yêu cầu pháp lý</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-3">Đối tác tin cậy:</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• VNPay, MoMo, ZaloPay (thanh toán)</li>
                  <li>• Viettel Post, GHN (vận chuyển)</li>
                  <li>• Google Analytics (phân tích)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Rights */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Quyền của bạn</h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Quyền truy cập</h3>
                    <p className="text-gray-600 text-sm">
                      Yêu cầu biết thông tin cá nhân nào đang được lưu trữ.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Quyền chỉnh sửa</h3>
                    <p className="text-gray-600 text-sm">
                      Yêu cầu cập nhật hoặc sửa đổi thông tin cá nhân.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Quyền xóa</h3>
                    <p className="text-gray-600 text-sm">
                      Yêu cầu xóa thông tin cá nhân khỏi hệ thống.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Quyền từ chối</h3>
                    <p className="text-gray-600 text-sm">
                      Từ chối nhận thông tin marketing và khuyến mãi.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Quyền khiếu nại</h3>
                    <p className="text-gray-600 text-sm">
                      Khiếu nại về cách xử lý thông tin cá nhân.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    6
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Quyền di chuyển</h3>
                    <p className="text-gray-600 text-sm">
                      Yêu cầu chuyển dữ liệu sang nền tảng khác.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookies */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Cookies và Công nghệ Theo dõi</h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Chúng tôi sử dụng Cookies để:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red mt-1">✓</span>
                    <span>Ghi nhớ thông tin đăng nhập</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red mt-1">✓</span>
                    <span>Lưu trữ giỏ hàng của bạn</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red mt-1">✓</span>
                    <span>Cá nhân hóa trải nghiệm mua sắm</span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red mt-1">✓</span>
                    <span>Phân tích lưu lượng truy cập</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red mt-1">✓</span>
                    <span>Cải thiện hiệu suất website</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red mt-1">✓</span>
                    <span>Hiển thị quảng cáo phù hợp</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Quản lý Cookies:</strong> Bạn có thể tắt Cookies bất cứ lúc nào thông qua
                  cài đặt trình duyệt. Tuy nhiên, điều này có thể ảnh hưởng đến trải nghiệm sử dụng website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-accent-red">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Câu hỏi về bảo mật?
          </h2>
          <p className="text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật hoặc cách chúng tôi
            xử lý thông tin cá nhân, vui lòng liên hệ với chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-accent-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Liên hệ ngay
            </Link>
            <Link
              href="mailto:privacy@jhfigure.com"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent-red transition-colors"
            >
              Gửi email
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
