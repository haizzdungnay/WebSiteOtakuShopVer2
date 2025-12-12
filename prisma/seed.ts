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

  console.log('🎉 Seed completed!\n')
  console.log('📊 Summary:')
  console.log(`  - Admin: ${adminEmail} / ${adminRawPassword}`)
  console.log('  - Users: user@example.com / user123 (+ 2 more)')
  console.log('  - Categories: 5')
  console.log('  - Products: 9 (with review stats)')
  console.log('  - Addresses: 2')
  console.log('  - Coupons: 3')
  console.log('  - Reviews: 8')
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