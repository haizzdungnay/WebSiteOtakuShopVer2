
import { PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

const announcements = [
  {
    title: 'Khai trương cửa hàng Otaku Shop tại TP.HCM',
    summary: 'Otaku Shop chính thức khai trương chi nhánh mới tại Quận 1, TP.HCM với nhiều ưu đãi hấp dẫn.',
    content: `
      <p>Chào mừng các bạn đến với Otaku Shop!</p>
      <p>Chúng tôi rất vui mừng thông báo về việc khai trương cửa hàng mới tại trung tâm TP.HCM. Đây là bước tiến lớn trong hành trình mang đến những sản phẩm figure, manga và anime merchandise chất lượng nhất đến tay cộng đồng fan Việt Nam.</p>
      <h3>Địa điểm và Thời gian</h3>
      <ul>
        <li><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</li>
        <li><strong>Thời gian:</strong> 9:00 - 22:00 hàng ngày</li>
      </ul>
      <p>Nhân dịp khai trương, Otaku Shop giảm giá 10% cho tất cả các đơn hàng mua trực tiếp tại cửa hàng trong tuần lễ đầu tiên. Ngoài ra, 100 khách hàng đầu tiên sẽ nhận được quà tặng đặc biệt.</p>
      <p>Hãy đến và trải nghiệm không gian mua sắm đậm chất anime cùng chúng tôi!</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80',
    isActive: true,
  },
  {
    title: 'Review Figure: Genshin Impact - Hu Tao 1/7 Scale',
    summary: 'Đánh giá chi tiết về figure Hu Tao phiên bản cao cấp từ Apex Innovation. Liệu có đáng tiền?',
    content: `
      <p>Hu Tao - Đường chủ Vãng Sinh Đường, một trong những nhân vật được yêu thích nhất Genshin Impact đã có phiên bản figure 1/7 cực kỳ chất lượng.</p>
      <h3>Chi tiết sản phẩm</h3>
      <p>Figure tái hiện hoàn hảo vẻ tinh nghịch nhưng cũng đầy bí ẩn của Hu Tao. Các chi tiết như trang phục, hồn ma đi kèm và đế figure đều được chăm chút tỉ mỉ.</p>
      <p>Màu sắc sơn rất chuẩn, không bị lem. Đặc biệt là đôi mắt hoa mai đặc trưng của Hu Tao được vẽ rất có hồn.</p>
      <h3>Kết luận</h3>
      <p>Với mức giá khoảng 3-4 triệu đồng, đây là một sản phẩm rất đáng sưu tầm cho các fan của Genshin Impact nói chung và Hu Tao nói riêng.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80',
    isActive: true,
  },
  {
    title: 'Top 5 Anime đáng xem nhất Mùa Đông 2025',
    summary: 'Danh sách những bộ anime không thể bỏ qua trong mùa này. Từ hành động, tình cảm đến hài hước.',
    content: `
      <p>Mùa đông 2025 mang đến nhiều bộ anime hấp dẫn. Dưới đây là top 5 cái tên bạn không nên bỏ lỡ:</p>
      <ol>
        <li><strong>Solo Leveling Season 2:</strong> Tiếp tục hành trình của Sung Jin-Woo.</li>
        <li><strong>Spy x Family Movie:</strong> Cuộc phiêu lưu mới của gia đình Forger.</li>
        <li><strong>Chainsaw Man Season 2:</strong> Arc mới đầy kịch tính.</li>
        <li><strong>Blue Lock - Episode Nagi:</strong> Góc nhìn mới từ thiên tài Nagi.</li>
        <li><strong>Dandadan:</strong> Sự kết hợp giữa tâm linh và sci-fi cực dị.</li>
      </ol>
      <p>Bạn mong chờ bộ nào nhất? Hãy để lại bình luận nhé!</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&q=80',
    isActive: true,
  },
  {
    title: 'Thông báo lịch nghỉ Tết Nguyên Đán 2026',
    summary: 'Lịch hoạt động của Otaku Shop trong dịp Tết Nguyên Đán sắp tới.',
    content: `
      <p>Kính gửi quý khách hàng,</p>
      <p>Otaku Shop xin thông báo lịch nghỉ Tết Nguyên Đán 2026 như sau:</p>
      <ul>
        <li><strong>Thời gian nghỉ:</strong> Từ 28/01/2026 đến hết 05/02/2026</li>
        <li><strong>Hoạt động trở lại:</strong> 06/02/2026</li>
      </ul>
      <p>Trong thời gian nghỉ, quý khách vẫn có thể đặt hàng trên website, nhưng đơn hàng sẽ được xử lý bắt đầu từ ngày 06/02/2026.</p>
      <p>Chúc quý khách một năm mới An Khang Thịnh Vượng!</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?w=800&q=80',
    isActive: true,
  },
  {
    title: 'Hướng dẫn bảo quản Figure đúng cách',
    summary: 'Những mẹo nhỏ giúp bộ sưu tập figure của bạn luôn bền đẹp theo thời gian.',
    content: `
      <p>Figure là tài sản quý giá của mỗi otaku. Để giữ cho chúng luôn đẹp, bạn cần lưu ý:</p>
      <h3>1. Tránh ánh nắng trực tiếp</h3>
      <p>Tia UV có thể làm phai màu sơn và làm giòn nhựa. Hãy trưng bày figure ở nơi râm mát.</p>
      <h3>2. Vệ sinh định kỳ</h3>
      <p>Sử dụng cọ mềm (như cọ trang điểm) để quét bụi. Tránh dùng khăn ướt hoặc hóa chất tẩy rửa mạnh.</p>
      <h3>3. Kiểm soát nhiệt độ và độ ẩm</h3>
      <p>Nhiệt độ quá cao có thể làm figure bị chảy hoặc biến dạng (đặc biệt là PVC). Độ ẩm cao dễ gây nấm mốc.</p>
      <p>Hy vọng những mẹo này sẽ giúp ích cho bạn!</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&q=80',
    isActive: true,
  }
]

async function main() {
  console.log('📰 Seeding announcements...')

  // Clear old announcements
  await prisma.announcement.deleteMany()

  for (const announcement of announcements) {
    await prisma.announcement.create({
      data: announcement
    })
  }

  console.log(`✅ Created ${announcements.length} announcements`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
