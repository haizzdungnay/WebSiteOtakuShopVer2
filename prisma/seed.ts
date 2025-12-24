import { PrismaClient } from '../app/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...\n')

  // Clear old data
  console.log('🗑️  Clearing old data...')
  await prisma.reviewVote.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.shipping.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.address.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.admin.deleteMany()
  console.log('✅ Cleared old data\n')

  // ===== 1. ADMIN =====
  console.log('👤 Creating admin...')
  // Use environment variables or fallback to defaults
  const adminEmail = process.env.ADMIN_USERNAME || 'admin@otakushop.com'
  const adminRawPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const adminDisplayName = process.env.ADMIN_DISPLAY_NAME || 'Admin Otaku Shop'
  const adminPassword = await bcrypt.hash(adminRawPassword, 10)
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      passwordHash: adminPassword,
      fullName: adminDisplayName,
      email: adminEmail
    }
  })
  console.log(`✅ Created admin: ${admin.username} (${adminEmail})\n`)

  // ===== 2. CATEGORIES =====
  console.log('📁 Creating categories...')
  const categoriesData = [
    {
      name: 'Figures & Models',
      slug: 'figures-models',
      description: 'Mô hình nhân vật anime, game cao cấp'
    },
    {
      name: 'Gaming Gear',
      slug: 'gaming-gear',
      description: 'Phụ kiện gaming: chuột, bàn phím, tai nghe'
    },
    {
      name: 'Manga & Comics',
      slug: 'manga-comics',
      description: 'Truyện tranh Nhật Bản, Hàn Quốc'
    },
    {
      name: 'Apparel',
      slug: 'apparel',
      description: 'Áo thun, hoodie, mũ anime/game'
    },
    {
      name: 'Collectibles',
      slug: 'collectibles',
      description: 'Đồ sưu tầm, poster, keychain'
    },
  ]

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat })
  }
  console.log('✅ Created 5 categories\n')

  // ===== 3. PRODUCTS =====
  console.log('📦 Creating products...')
  const figuresCategory = await prisma.category.findUnique({ where: { slug: 'figures-models' } })
  const gearCategory = await prisma.category.findUnique({ where: { slug: 'gaming-gear' } })
  const mangaCategory = await prisma.category.findUnique({ where: { slug: 'manga-comics' } })
  const apparelCategory = await prisma.category.findUnique({ where: { slug: 'apparel' } })

  const productsData = [
    {
      name: 'Demon Slayer Tanjiro Figure',
      slug: 'demon-slayer-tanjiro-figure',
      description: 'Mô hình Tanjiro Kamado cao 20cm, chất lượng cao với chi tiết sắc nét. Sản phẩm chính hãng, màu sắc sống động.',
      price: 450000,
      comparePrice: 550000,
      stockQuantity: 15,
      images: ['https://placehold.co/600x600/EF4444/FFF?text=Tanjiro'],
      categoryId: figuresCategory!.id,
      featured: true,
      reviewCount: 8,
      averageRating: 4.8
    },
    {
      name: 'Genshin Impact Hu Tao Figure',
      slug: 'genshin-impact-hu-tao-figure',
      description: 'Mô hình Hu Tao - Genshin Impact, cao 18cm, chi tiết tinh xảo.',
      price: 520000,
      comparePrice: 620000,
      stockQuantity: 10,
      images: ['https://placehold.co/600x600/8B5CF6/FFF?text=Hu+Tao'],
      categoryId: figuresCategory!.id,
      featured: true,
      reviewCount: 5,
      averageRating: 4.6
    },
    {
      name: 'One Piece Luffy Gear 5 Figure',
      slug: 'one-piece-luffy-gear5',
      description: 'Mô hình Luffy Gear 5 phiên bản giới hạn, cao 22cm.',
      price: 680000,
      stockQuantity: 8,
      images: ['https://placehold.co/600x600/3B82F6/FFF?text=Luffy'],
      categoryId: figuresCategory!.id,
      reviewCount: 3,
      averageRating: 5.0
    },
    {
      name: 'Razer DeathAdder V3 Pro',
      slug: 'razer-deathadder-v3-pro',
      description: 'Chuột gaming wireless cao cấp, cảm biến Focus Pro 30K.',
      price: 3500000,
      stockQuantity: 12,
      images: ['https://placehold.co/600x600/10B981/FFF?text=Razer'],
      categoryId: gearCategory!.id,
      featured: true,
      reviewCount: 12,
      averageRating: 4.7
    },
    {
      name: 'Logitech G Pro X Superlight',
      slug: 'logitech-g-pro-x-superlight',
      description: 'Chuột gaming nhẹ nhất (63g), pin 70 giờ.',
      price: 3200000,
      stockQuantity: 8,
      images: ['https://placehold.co/600x600/6366F1/FFF?text=Logitech'],
      categoryId: gearCategory!.id,
      reviewCount: 7,
      averageRating: 4.5
    },
    {
      name: 'Attack on Titan Box Set',
      slug: 'attack-on-titan-box-set',
      description: 'Bộ truyện Attack on Titan hoàn chỉnh 34 tập.',
      price: 2800000,
      comparePrice: 3500000,
      stockQuantity: 5,
      images: ['https://placehold.co/600x600/F59E0B/FFF?text=AOT'],
      categoryId: mangaCategory!.id,
      reviewCount: 4,
      averageRating: 4.9
    },
    {
      name: 'Spy x Family Vol.1',
      slug: 'spy-x-family-vol1',
      description: 'Spy x Family tập 1 bản tiếng Việt.',
      price: 45000,
      stockQuantity: 30,
      images: ['https://placehold.co/600x600/EC4899/FFF?text=Spy'],
      categoryId: mangaCategory!.id,
      featured: true,
      reviewCount: 15,
      averageRating: 4.3
    },
    {
      name: 'Naruto Akatsuki Hoodie',
      slug: 'naruto-akatsuki-hoodie',
      description: 'Áo hoodie Akatsuki chất cotton cao cấp.',
      price: 350000,
      stockQuantity: 20,
      images: ['https://placehold.co/600x600/EF4444/000?text=Akatsuki'],
      categoryId: apparelCategory!.id,
      reviewCount: 6,
      averageRating: 4.4
    },
    {
      name: 'Ghibli Totoro T-Shirt',
      slug: 'ghibli-totoro-tshirt',
      description: 'Áo thun Totoro 100% cotton.',
      price: 180000,
      stockQuantity: 50,
      images: ['https://placehold.co/600x600/10B981/FFF?text=Totoro'],
      categoryId: apparelCategory!.id,
      featured: true,
      reviewCount: 10,
      averageRating: 4.2
    },
  ]

  const createdProducts = []
  for (const product of productsData) {
    const p = await prisma.product.create({ data: product })
    createdProducts.push(p)
  }
  console.log('✅ Created 9 products\n')

  // ===== 4. TEST USERS =====
  console.log('👤 Creating test users...')
  const userPassword = await bcrypt.hash('user123', 10)

  const user1 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: userPassword,
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      gender: 'MALE',
      dateOfBirth: new Date('1995-05-15')
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      passwordHash: userPassword,
      fullName: 'Trần Thị B',
      phone: '0909876543',
      gender: 'FEMALE',
      dateOfBirth: new Date('1998-08-20')
    }
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'user3@example.com',
      passwordHash: userPassword,
      fullName: 'Lê Văn C',
      phone: '0905555555',
      gender: 'MALE'
    }
  })

  console.log('✅ Created 3 test users\n')

  // ===== 5. ADDRESSES =====
  console.log('📍 Creating addresses...')
  await prisma.address.createMany({
    data: [
      {
        userId: user1.id,
        label: 'Home',
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Nguyễn Văn Linh',
        ward: 'Tân Phong',
        district: 'Quận 7',
        city: 'Hồ Chí Minh',
        isDefault: true
      },
      {
        userId: user1.id,
        label: 'Office',
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '456 Lê Văn Việt',
        ward: 'Hiệp Phú',
        district: 'Quận 9',
        city: 'Hồ Chí Minh',
        isDefault: false
      }
    ]
  })
  console.log('✅ Created 2 addresses\n')

  // ===== 6. COUPONS =====
  console.log('🎟️  Creating coupons...')
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10,
        minOrder: 200000,
        maxDiscount: 50000,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
        usageLimit: 100,
        description: 'Giảm 10% cho đơn hàng đầu tiên (tối đa 50k)',
        isActive: true
      },
      {
        code: 'FREESHIP',
        type: 'FIXED_AMOUNT',
        value: 30000,
        minOrder: 500000,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-06-30'),
        description: 'Miễn phí ship cho đơn từ 500k',
        isActive: true
      },
      {
        code: 'NEWYEAR2025',
        type: 'PERCENTAGE',
        value: 20,
        minOrder: 1000000,
        maxDiscount: 200000,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-01-31'),
        usageLimit: 50,
        description: 'Tết sale 20% cho đơn từ 1 triệu',
        isActive: true
      }
    ]
  })
  console.log('✅ Created 3 coupons\n')

  // ===== 7. SAMPLE REVIEWS =====
  console.log('⭐ Creating sample reviews...')

  // Reviews for Tanjiro Figure
  const reviewsData = [
    {
      productId: createdProducts[0].id, // Tanjiro
      userId: user1.id,
      rating: 5,
      title: 'Tuyệt vời!',
      comment: 'Mô hình rất đẹp, chi tiết sắc nét. Đóng gói cẩn thận, ship nhanh. Rất hài lòng với sản phẩm!',
      isVerified: true,
      isApproved: true,
      helpfulCount: 12
    },
    {
      productId: createdProducts[0].id, // Tanjiro
      userId: user2.id,
      rating: 5,
      title: 'Chất lượng cao',
      comment: 'Mua tặng em, em rất thích. Màu sắc đẹp, chất liệu tốt.',
      isVerified: true,
      isApproved: true,
      helpfulCount: 8
    },
    {
      productId: createdProducts[0].id, // Tanjiro
      userId: user3.id,
      rating: 4,
      title: 'Tốt',
      comment: 'Sản phẩm ok, nhưng giá hơi cao.',
      isVerified: false,
      isApproved: true,
      helpfulCount: 3
    },

    // Reviews for Razer Mouse
    {
      productId: createdProducts[3].id, // Razer
      userId: user1.id,
      rating: 5,
      title: 'Gaming cực đỉnh',
      comment: 'Chuột rất nhạy, pin trâu, thiết kế đẹp. Đáng tiền!',
      isVerified: true,
      isApproved: true,
      helpfulCount: 25
    },
    {
      productId: createdProducts[3].id, // Razer
      userId: user2.id,
      rating: 4,
      title: 'Tốt nhưng đắt',
      comment: 'Chất lượng tốt, nhưng giá hơi chát. Phù hợp pro player.',
      isVerified: true,
      isApproved: true,
      helpfulCount: 10
    },

    // Reviews for Spy x Family
    {
      productId: createdProducts[6].id, // Spy x Family
      userId: user2.id,
      rating: 5,
      title: 'Truyện hay!',
      comment: 'Nội dung hài hước, dễ thương. Bản in đẹp, giấy tốt.',
      isVerified: true,
      isApproved: true,
      helpfulCount: 18
    },
    {
      productId: createdProducts[6].id, // Spy x Family
      userId: user3.id,
      rating: 4,
      title: 'Ổn',
      comment: 'Truyện hay, giá hợp lý. Giao hàng nhanh.',
      isVerified: true,
      isApproved: true,
      helpfulCount: 5
    },

    // Review for Totoro T-Shirt
    {
      productId: createdProducts[8].id, // Totoro
      userId: user1.id,
      rating: 4,
      title: 'Áo đẹp',
      comment: 'Chất liệu cotton mềm, form chuẩn. Hơi dễ phai màu sau vài lần giặt.',
      isVerified: true,
      isApproved: true,
      helpfulCount: 7
    }
  ]

  for (const review of reviewsData) {
    await prisma.review.create({ data: review })
  }
  console.log('✅ Created 8 sample reviews\n')

  // ===== 8. ANNOUNCEMENTS/NEWS =====
  console.log('📰 Creating announcements/news...')
  const announcementsData = [
    {
      title: 'Top 10 Figure Anime Hot Nhất Tháng 12/2024',
      summary: 'Khám phá những mẫu figure anime được săn đón nhiều nhất trong tháng này với những thiết kế độc đáo và chất lượng tuyệt vời từ các thương hiệu hàng đầu.',
      content: `
        <h2>Những mẫu figure nổi bật tháng 12</h2>
        <p>Tháng 12 này, cộng đồng otaku Việt Nam đang "phát cuồng" với các mẫu figure mới ra mắt. Hãy cùng điểm qua top 10 figure hot nhất hiện nay!</p>

        <h3>1. Nendoroid Hatsune Miku - Snow White Ver.</h3>
        <p>Mẫu figure phiên bản giới hạn của Vocaloid nổi tiếng, với thiết kế trang phục mùa đông tinh tế và chi tiết.</p>

        <h3>2. SPM Figure - Demon Slayer Special Edition</h3>
        <p>Bộ sưu tập figure đặc biệt từ thương hiệu SPM, tái hiện các nhân vật chính trong Demon Slayer với tỷ lệ 1/8.</p>

        <h3>3. Good Smile Company - Spy x Family Collection</h3>
        <p>Lineup figure hoàn chỉnh cho bộ anime Spy x Family đang cực kỳ hot, bao gồm Anya, Yor và Loid.</p>

        <p>Các mẫu figure này không chỉ có thiết kế đẹp mắt mà còn có chất lượng hoàn thiện cao, phù hợp cho cả người mới chơi lẫn collector lâu năm.</p>
      `,
      isActive: true
    },
    {
      title: 'Hướng Dẫn Bảo Quản Figure Để Giữ Được Lâu',
      summary: 'Những mẹo và cách bảo quản figure đúng cách để sản phẩm của bạn luôn như mới và tránh bị hư hỏng theo thời gian.',
      content: `
        <h2>Mẹo bảo quản figure hiệu quả</h2>
        <p>Figure là món đồ sưu tầm đắt đỏ, việc bảo quản đúng cách sẽ giúp chúng luôn giữ được vẻ đẹp ban đầu.</p>

        <h3>1. Tránh ánh nắng trực tiếp</h3>
        <p>Đặt figure ở nơi tránh ánh nắng mặt trời để màu sắc không bị phai nhạt theo thời gian.</p>

        <h3>2. Lau chùi định kỳ</h3>
        <p>Sử dụng khăn microfiber ẩm để lau bụi, tránh dùng nước hoặc chất tẩy rửa mạnh.</p>

        <h3>3. Sử dụng hộp đựng</h3>
        <p>Đầu tư hộp acrylic hoặc box chuyên dụng để bảo vệ figure khỏi bụi và va đập.</p>

        <h3>4. Kiểm tra định kỳ</h3>
        <p>Thường xuyên kiểm tra các khớp nối và bề mặt để phát hiện sớm dấu hiệu hư hỏng.</p>

        <p>Áp dụng những mẹo này sẽ giúp bộ sưu tập figure của bạn bền đẹp theo năm tháng!</p>
      `,
      isActive: true
    },
    {
      title: 'Sự Kiện Pre-Order Figure Mới Từ Good Smile Company',
      summary: 'Đừng bỏ lỡ cơ hội đặt trước những mẫu figure độc quyền từ Good Smile Company với giá ưu đãi đặc biệt.',
      content: `
        <h2>Pre-order Figure GSC 2025</h2>
        <p>Good Smile Company chính thức mở pre-order cho các mẫu figure mới năm 2025 với ưu đãi hấp dẫn.</p>

        <h3>Ưu đãi đặc biệt:</h3>
        <ul>
          <li>Giảm 10% cho đơn pre-order từ 2 figure trở lên</li>
          <li>Tặng kèm face plate thay thế</li>
          <li>Miễn phí ship nội địa</li>
          <li>Đặt cọc chỉ 30% giá trị</li>
        </ul>

        <h3>Các mẫu figure nổi bật:</h3>
        <p>- Nendoroid: Attack on Titan Levi Ackerman</p>
        <p>- Moderoid: My Hero Academia All Might</p>
        <p>- Scale Figure: Sword Art Online Asuna</p>

        <p>Thời hạn pre-order đến hết tháng 1/2025. Đừng bỏ lỡ cơ hội sở hữu những mẫu figure chất lượng từ GSC!</p>
      `,
      isActive: true
    },
    {
      title: 'Review Chi Tiết Nendoroid Hatsune Miku Snow Ver.',
      summary: 'Đánh giá chi tiết về chất lượng, phụ kiện và độ hoàn thiện của bộ Nendoroid Hatsune Miku phiên bản Snow 2024.',
      content: `
        <h2>Review Nendoroid Hatsune Miku - Snow White Version</h2>
        <p>Sau thời gian chờ đợi, cuối cùng mình cũng nhận được mẫu figure Hatsune Miku phiên bản Snow White. Hãy cùng review chi tiết nhé!</p>

        <h3>Thiết kế và chất lượng</h3>
        <p>Mẫu figure này có thiết kế trang phục mùa đông rất tinh tế, với màu trắng chủ đạo kết hợp xanh dương tạo nên vẻ đẹp thuần khiết. Chất lượng in ấn sắc nét, không có lỗi màu.</p>

        <h3>Phụ kiện đi kèm</h3>
        <ul>
          <li>3 mặt thay thế (mặt cười, mặt giận, mặt buồn)</li>
          <li>2 tư thế tay cầm micro</li>
          <li>Base đế tuyết với hiệu ứng ánh sáng</li>
          <li>Phụ kiện guitar mini</li>
        </ul>

        <h3>Độ hoàn thiện</h3>
        <p>GSC đã làm rất tốt phần chi tiết, từ mái tóc dài uốn lượn đến trang phục phức tạp. Khớp nối chắc chắn, có thể tạo nhiều pose khác nhau.</p>

        <h3>Giá cả</h3>
        <p>Giá bán lẻ khoảng 480.000đ, khá hợp lý cho một mẫu Nendoroid chất lượng cao từ GSC.</p>

        <p>Tổng thể: 9/10. Rất đáng để mua nếu bạn là fan của Vocaloid!</p>
      `,
      isActive: true
    },
    {
      title: 'Phân Biệt Figure Chính Hãng Và Hàng Fake',
      summary: 'Những dấu hiệu nhận biết để phân biệt figure chính hãng và hàng nhái giúp bạn tránh mua phải sản phẩm giả.',
      content: `
        <h2>Cách phân biệt figure chính hãng</h2>
        <p>Thị trường figure Việt Nam đang có nhiều hàng nhái kém chất lượng. Hãy học cách phân biệt để tránh "tiền mất tật mang"!</p>

        <h3>Dấu hiệu figure chính hãng:</h3>
        <ul>
          <li><strong>Hộp đóng gói:</strong> In ấn sắc nét, logo thương hiệu rõ ràng, có tem bảo hành</li>
          <li><strong>Serial number:</strong> Dán ở đáy figure, có thể tra cứu trên website nhà sản xuất</li>
          <li><strong>Chất liệu:</strong> Nhựa PVC cao cấp, không mùi, bề mặt nhẵn mịn</li>
          <li><strong>Chi tiết:</strong> Sắc nét, không lem màu, decal thẳng hàng</li>
        </ul>

        <h3>Dấu hiệu hàng fake:</h3>
        <ul>
          <li>Hộp in mờ, sai chính tả</li>
          <li>Không có serial number hoặc không thể tra cứu</li>
          <li>Mùi nhựa hóa chất mạnh</li>
          <li>Chi tiết thô, màu sắc không chuẩn</li>
        </ul>

        <h3>Lời khuyên</h3>
        <p>Luôn mua ở cửa hàng uy tín, kiểm tra kỹ trước khi thanh toán. Nếu nghi ngờ, hãy hỏi ý kiến cộng đồng figure Việt Nam.</p>
      `,
      isActive: true
    },
    {
      title: 'Những Bộ Figure Limited Edition Đáng Sưu Tầm 2024',
      summary: 'Tổng hợp những bộ figure phiên bản giới hạn được các collector đánh giá cao nhất năm 2024.',
      content: `
        <h2>Top Figure Limited Edition 2024</h2>
        <p>Năm 2024 có rất nhiều mẫu figure limited edition đáng chú ý. Dưới đây là những bộ được cộng đồng đánh giá cao nhất:</p>

        <h3>1. SPM Demon Slayer - Tamayo</h3>
        <p>Phiên bản giới hạn chỉ 500 bộ toàn cầu. Thiết kế Tamayo với trang phục dạ hội cực kỳ ấn tượng.</p>

        <h3>2. Kotobukiya - Fate/stay night Sakura</h3>
        <p>Bộ figure tỷ lệ 1/7 với chi tiết cực kỳ tinh xảo, trang phục phức tạp và ánh sáng LED.</p>

        <h3>3. Good Smile Company - Nendoroid Hunter x Hunter</h3>
        <p>Lineup hoàn chỉnh các nhân vật chính từ Hunter x Hunter, bao gồm Gon, Killua, Kurapika.</p>

        <h3>4. Aniplex - Sword Art Online Alice</h3>
        <p>Mẫu figure tái hiện Alice trong Sword Art Online với trang phục Integrity Knight.</p>

        <h3>5. Bandai - One Piece Special Collection</h3>
        <p>Bộ sưu tập đặc biệt mừng 25 năm One Piece với các nhân vật được thiết kế lại.</p>

        <p>Những mẫu limited edition này thường có giá cao và khó tìm, nhưng chúng xứng đáng là món đồ sưu tầm quý giá trong bộ collection của bạn!</p>
      `,
      isActive: true
    },
    {
      title: 'Khuyến Mãi Giáng Sinh - Giảm Giá Tới 50%',
      summary: 'Nhân dịp Giáng Sinh, Otaku Shop dành tặng khách hàng ưu đãi giảm giá lên tới 50% cho các sản phẩm figure và manga.',
      content: `
        <h2>🎄 KHUYẾN MÃI GIÁNG SINH 2024 🎄</h2>
        <p>Merry Christmas! Otaku Shop dành tặng quý khách hàng chương trình khuyến mãi đặc biệt nhân dịp Giáng Sinh.</p>

        <h3>🎁 Ưu đãi hấp dẫn:</h3>
        <ul>
          <li>Giảm 50% cho tất cả figure từ Good Smile Company</li>
          <li>Giảm 30% cho manga box set</li>
          <li>Miễn phí ship cho đơn hàng từ 1 triệu đồng</li>
          <li>Tặng kèm poster Giáng Sinh cho mỗi đơn hàng</li>
        </ul>

        <h3>⏰ Thời gian áp dụng:</h3>
        <p>Từ 20/12/2024 đến 31/12/2024</p>

        <h3>📍 Cách nhận ưu đãi:</h3>
        <p>Sử dụng mã <strong>XMAS2024</strong> khi thanh toán online hoặc liên hệ hotline để được tư vấn.</p>

        <p>Đừng bỏ lỡ cơ hội sở hữu những món đồ yêu thích với giá ưu đãi đặc biệt này nhé! 🎅</p>
      `,
      isActive: true
    },
    {
      title: 'Hướng Dẫn Mua Hàng Online An Toàn',
      summary: 'Những lưu ý quan trọng khi mua hàng figure và manga online để tránh rủi ro và đảm bảo quyền lợi người tiêu dùng.',
      content: `
        <h2>Mua hàng online an toàn</h2>
        <p>Mua sắm online ngày càng phổ biến, nhưng cũng tiềm ẩn nhiều rủi ro. Hãy áp dụng những lưu ý sau để mua hàng an toàn:</p>

        <h3>1. Chọn website uy tín</h3>
        <p>Kiểm tra tuổi website, đánh giá khách hàng, chính sách đổi trả. Ưu tiên các shop có tên tuổi trong cộng đồng otaku.</p>

        <h3>2. Kiểm tra sản phẩm kỹ</h3>
        <p>Xem hình ảnh chi tiết, mô tả sản phẩm. Hỏi shop về nguồn gốc, xuất xứ. Với figure, luôn hỏi về seal và box condition.</p>

        <h3>3. Thanh toán an toàn</h3>
        <p>Sử dụng thẻ tín dụng hoặc ví điện tử có bảo hiểm. Tránh chuyển khoản trực tiếp cho người lạ.</p>

        <h3>4. Chính sách đổi trả</h3>
        <p>Đọc kỹ chính sách đổi trả trước khi mua. Giữ nguyên seal và hóa đơn để có thể đổi trả khi cần.</p>

        <h3>5. Bảo vệ quyền lợi</h3>
        <p>Giữ lại tất cả tin nhắn, hóa đơn. Nếu có vấn đề, liên hệ ngay với shop hoặc cơ quan chức năng.</p>

        <p>Áp dụng những lưu ý này sẽ giúp bạn mua sắm an tâm và tránh được những rủi ro không đáng có!</p>
      `,
      isActive: true
    }
  ]

  for (const announcement of announcementsData) {
    await prisma.announcement.create({ data: announcement })
  }
  console.log('✅ Created 8 sample announcements\n')

  console.log('🎉 Seed completed!\n')
  console.log('📊 Summary:')
  console.log(`  - Admin: ${adminEmail} / ${adminRawPassword}`)
  console.log('  - Users: user@example.com / user123 (+ 2 more)')
  console.log('  - Categories: 5')
  console.log('  - Products: 9 (with review stats)')
  console.log('  - Addresses: 2')
  console.log('  - Coupons: 3')
  console.log('  - Reviews: 8')
  console.log('  - Announcements/News: 8')
  console.log('')
  console.log('🔐 Login Credentials:')
  console.log(`  Admin: ${adminEmail} / ${adminRawPassword}`)
  console.log('  User 1: user@example.com / user123')
  console.log('  User 2: user2@example.com / user123')
  console.log('  User 3: user3@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
