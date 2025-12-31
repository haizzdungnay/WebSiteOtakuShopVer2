import { Metadata } from 'next';
import { Truck, Clock, MapPin, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách vận chuyển | DN Figure',
  description: 'Thông tin về chính sách vận chuyển của DN Figure',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Chính sách vận chuyển</h1>

        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          {/* Highlights */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-pink-50 rounded-xl">
              <Truck className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Giao hàng toàn quốc</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">2-5 ngày làm việc</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Theo dõi đơn hàng</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Đóng gói cẩn thận</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <h2>1. Phạm vi giao hàng</h2>
            <p>DN Figure hỗ trợ giao hàng đến tất cả 63 tỉnh thành trên toàn quốc Việt Nam.</p>

            <h2>2. Thời gian giao hàng</h2>
            <ul>
              <li><strong>Nội thành TP.HCM:</strong> 1-2 ngày làm việc</li>
              <li><strong>Các tỉnh miền Nam:</strong> 2-3 ngày làm việc</li>
              <li><strong>Miền Trung và miền Bắc:</strong> 3-5 ngày làm việc</li>
              <li><strong>Vùng sâu, vùng xa:</strong> 5-7 ngày làm việc</li>
            </ul>
            <p><em>Lưu ý: Thời gian trên không bao gồm ngày lễ, Tết và chủ nhật.</em></p>

            <h2>3. Phí vận chuyển</h2>
            <ul>
              <li><strong>Đơn hàng từ 500.000đ:</strong> Miễn phí vận chuyển toàn quốc</li>
              <li><strong>Đơn hàng dưới 500.000đ:</strong> Phí vận chuyển từ 25.000đ - 50.000đ tùy khu vực</li>
            </ul>

            <h2>4. Đơn vị vận chuyển</h2>
            <p>Chúng tôi hợp tác với các đơn vị vận chuyển uy tín:</p>
            <ul>
              <li>Giao Hàng Nhanh (GHN)</li>
              <li>Giao Hàng Tiết Kiệm (GHTK)</li>
              <li>Viettel Post</li>
              <li>J&T Express</li>
            </ul>

            <h2>5. Đóng gói sản phẩm</h2>
            <p>
              Tất cả sản phẩm figure được đóng gói cẩn thận với nhiều lớp bảo vệ để đảm bảo hàng hóa
              đến tay bạn trong tình trạng hoàn hảo nhất.
            </p>

            <h2>6. Theo dõi đơn hàng</h2>
            <p>
              Sau khi đơn hàng được gửi đi, bạn sẽ nhận được mã vận đơn qua email/SMS.
              Bạn có thể tra cứu tình trạng đơn hàng tại mục &quot;Tra cứu đơn hàng&quot; trên website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
