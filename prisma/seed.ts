import { PrismaClient } from '../app/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Xóa data cũ
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.admin.deleteMany()
  console.log('✅ Cleared old data')

  // ===== 1. TẠO ADMIN =====
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      passwordHash: adminPassword,
      fullName: 'Admin Otaku Shop',
      email: 'admin@otakushop.com'
    }
  })
  console.log('✅ Created admin:', admin.username)

  // ===== 2. TẠO CATEGORIES =====
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
  console.log('✅ Created 5 categories')

  // ===== 3. LẤY CATEGORIES =====
  const figuresCategory = await prisma.category.findUnique({ where: { slug: 'figures-models' } })
  const gearCategory = await prisma.category.findUnique({ where: { slug: 'gaming-gear' } })
  const mangaCategory = await prisma.category.findUnique({ where: { slug: 'manga-comics' } })
  const apparelCategory = await prisma.category.findUnique({ where: { slug: 'apparel' } })

  // ===== 4. TẠO PRODUCTS =====
  const productsData = [
    {
      name: 'Demon Slayer Tanjiro Figure',
      slug: 'demon-slayer-tanjiro-figure',
      description: 'Mô hình Tanjiro Kamado cao 20cm, chất lượng cao với chi tiết sắc nét.',
      price: 450000,
      comparePrice: 550000,
      stockQuantity: 15,
      images: ['https://placehold.co/600x600/EF4444/FFF?text=Tanjiro'],
      categoryId: figuresCategory!.id,
      featured: true
    },
    {
      name: 'Genshin Impact Hu Tao Figure',
      slug: 'genshin-impact-hu-tao-figure',
      description: 'Mô hình Hu Tao - Genshin Impact, cao 18cm.',
      price: 520000,
      comparePrice: 620000,
      stockQuantity: 10,
      images: ['https://placehold.co/600x600/8B5CF6/FFF?text=Hu+Tao'],
      categoryId: figuresCategory!.id,
      featured: true
    },
    {
      name: 'One Piece Luffy Gear 5 Figure',
      slug: 'one-piece-luffy-gear5',
      description: 'Mô hình Luffy Gear 5 phiên bản giới hạn.',
      price: 680000,
      stockQuantity: 8,
      images: ['https://placehold.co/600x600/3B82F6/FFF?text=Luffy'],
      categoryId: figuresCategory!.id
    },
    {
      name: 'Razer DeathAdder V3 Pro',
      slug: 'razer-deathadder-v3-pro',
      description: 'Chuột gaming wireless cao cấp.',
      price: 3500000,
      stockQuantity: 12,
      images: ['https://placehold.co/600x600/10B981/FFF?text=Razer'],
      categoryId: gearCategory!.id,
      featured: true
    },
    {
      name: 'Logitech G Pro X Superlight',
      slug: 'logitech-g-pro-x-superlight',
      description: 'Chuột gaming nhẹ nhất (63g).',
      price: 3200000,
      stockQuantity: 8,
      images: ['https://placehold.co/600x600/6366F1/FFF?text=Logitech'],
      categoryId: gearCategory!.id
    },
    {
      name: 'Attack on Titan Box Set',
      slug: 'attack-on-titan-box-set',
      description: 'Bộ truyện Attack on Titan hoàn chỉnh 34 tập.',
      price: 2800000,
      comparePrice: 3500000,
      stockQuantity: 5,
      images: ['https://placehold.co/600x600/F59E0B/FFF?text=AOT'],
      categoryId: mangaCategory!.id
    },
    {
      name: 'Spy x Family Vol.1',
      slug: 'spy-x-family-vol1',
      description: 'Spy x Family tập 1 bản tiếng Việt.',
      price: 45000,
      stockQuantity: 30,
      images: ['https://placehold.co/600x600/EC4899/FFF?text=Spy'],
      categoryId: mangaCategory!.id,
      featured: true
    },
    {
      name: 'Naruto Akatsuki Hoodie',
      slug: 'naruto-akatsuki-hoodie',
      description: 'Áo hoodie Akatsuki chất cotton.',
      price: 350000,
      stockQuantity: 20,
      images: ['https://placehold.co/600x600/EF4444/000?text=Akatsuki'],
      categoryId: apparelCategory!.id
    },
    {
      name: 'Ghibli Totoro T-Shirt',
      slug: 'ghibli-totoro-tshirt',
      description: 'Áo thun Totoro 100% cotton.',
      price: 180000,
      stockQuantity: 50,
      images: ['https://placehold.co/600x600/10B981/FFF?text=Totoro'],
      categoryId: apparelCategory!.id,
      featured: true
    },
  ]

  for (const product of productsData) {
    await prisma.product.create({ data: product })
  }
  console.log('✅ Created 9 products')

  // ===== 5. TẠO TEST USER =====
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: userPassword,
      fullName: 'Nguyễn Văn A',
      phone: '0901234567'
    }
  })
  console.log('✅ Created test user:', user.email)

  console.log('\n🎉 Seed completed!')
  console.log('\n📊 Summary:')
  console.log('  - Admin: admin / admin123')
  console.log('  - User: user@example.com / user123')
  console.log('  - Categories: 5')
  console.log('  - Products: 9')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })