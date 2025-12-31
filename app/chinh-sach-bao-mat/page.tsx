import { Metadata } from 'next';
import { Lock, Eye, Shield, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | DN Figure',
  description: 'Chính sách bảo mật thông tin khách hàng của DN Figure',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Chính sách bảo mật</h1>

        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          {/* Highlights */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Mã hóa SSL</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Không chia sẻ</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Bảo vệ dữ liệu</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-xl">
              <UserCheck className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Quyền riêng tư</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>1. Thu thập thông tin</h2>
            <p>Chúng tôi thu thập thông tin khi bạn:</p>
            <ul>
              <li>Đăng ký tài khoản trên website</li>
              <li>Đặt hàng hoặc thanh toán</li>
              <li>Đăng ký nhận bản tin</li>
              <li>Liên hệ với chúng tôi</li>
            </ul>
            <p>Các thông tin được thu thập bao gồm:</p>
            <ul>
              <li>Họ tên, email, số điện thoại</li>
              <li>Địa chỉ giao hàng</li>
              <li>Thông tin đơn hàng và lịch sử mua sắm</li>
            </ul>

            <h2>2. Sử dụng thông tin</h2>
            <p>Thông tin của bạn được sử dụng để:</p>
            <ul>
              <li>Xử lý đơn hàng và giao hàng</li>
              <li>Liên hệ về đơn hàng, khuyến mãi</li>
              <li>Cải thiện trải nghiệm mua sắm</li>
              <li>Hỗ trợ khách hàng</li>
            </ul>

            <h2>3. Bảo vệ thông tin</h2>
            <p>Chúng tôi cam kết bảo vệ thông tin của bạn bằng cách:</p>
            <ul>
              <li>Sử dụng mã hóa SSL cho mọi giao dịch</li>
              <li>Không chia sẻ thông tin với bên thứ ba (trừ đối tác vận chuyển)</li>
              <li>Hạn chế quyền truy cập thông tin khách hàng</li>
              <li>Thường xuyên cập nhật biện pháp bảo mật</li>
            </ul>

            <h2>4. Chia sẻ thông tin</h2>
            <p>Chúng tôi chỉ chia sẻ thông tin trong các trường hợp:</p>
            <ul>
              <li>Với đối tác vận chuyển để giao hàng</li>
              <li>Với cổng thanh toán để xử lý giao dịch</li>
              <li>Khi có yêu cầu từ cơ quan pháp luật</li>
            </ul>

            <h2>5. Cookie</h2>
            <p>
              Website sử dụng cookie để cải thiện trải nghiệm người dùng.
              Cookie giúp ghi nhớ giỏ hàng, tài khoản đăng nhập và các tùy chọn của bạn.
              Bạn có thể tắt cookie trong cài đặt trình duyệt.
            </p>

            <h2>6. Quyền của bạn</h2>
            <p>Bạn có quyền:</p>
            <ul>
              <li>Truy cập và xem thông tin cá nhân</li>
              <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
              <li>Yêu cầu xóa tài khoản và dữ liệu</li>
              <li>Hủy đăng ký nhận email marketing</li>
            </ul>

            <h2>7. Liên hệ</h2>
            <p>
              Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:<br />
              Email: <strong>tuanduongtempproject@gmail.com</strong><br />
              Hotline: <strong>0389 836 514</strong>
            </p>

            <p className="text-sm text-gray-500 italic">
              Cập nhật lần cuối: Tháng 12, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
