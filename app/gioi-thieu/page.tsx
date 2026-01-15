import { Metadata } from 'next';
import { Store, Users, Award, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Giới thiệu | DN Figure',
  description: 'Tìm hiểu về DN Figure - Cửa hàng figure anime chính hãng hàng đầu Việt Nam',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200 py-12">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Về DN Figure</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi là cửa hàng chuyên cung cấp các sản phẩm figure anime, manga và collectibles chính hãng với chất lượng cao nhất.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Sản phẩm chính hãng</h3>
            <p className="text-gray-600 text-sm">100% sản phẩm được nhập khẩu trực tiếp từ nhà sản xuất</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Đội ngũ chuyên nghiệp</h3>
            <p className="text-gray-600 text-sm">Nhân viên am hiểu sản phẩm, tư vấn nhiệt tình</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Uy tín hàng đầu</h3>
            <p className="text-gray-600 text-sm">Được hàng ngàn khách hàng tin tưởng lựa chọn</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Đam mê anime</h3>
            <p className="text-gray-600 text-sm">Xuất phát từ tình yêu với văn hóa anime Nhật Bản</p>
          </div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
            <p>
              DN Figure được thành lập với sứ mệnh mang đến cho cộng đồng yêu thích anime tại Việt Nam những sản phẩm figure, mô hình chất lượng cao với giá cả hợp lý.
            </p>
            <p>
              Chúng tôi hiểu rằng mỗi figure không chỉ là một món đồ chơi, mà còn là một tác phẩm nghệ thuật, là cách để bạn thể hiện tình yêu với những nhân vật anime yêu thích.
            </p>
            <p>
              Với đội ngũ nhân viên đam mê anime và am hiểu sâu về thị trường figure, chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm tốt nhất, từ việc tư vấn sản phẩm đến dịch vụ hậu mãi.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-2xl font-bold mb-4">Bạn có câu hỏi?</h2>
          <p className="mb-6 opacity-90">Liên hệ với chúng tôi ngay để được hỗ trợ tốt nhất</p>
          <a
            href="/lien-he"
            className="inline-block bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Liên hệ ngay
          </a>
        </div>
      </div>
    </div>
  );
}
