import { PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

// Danh sách ảnh mẫu (sử dụng placeholder images)
const sampleImages = [
    'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400',
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400',
    'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400',
]

// Danh sách sản phẩm mẫu - Figures & Models
const figureProducts = [
    { name: 'Nendoroid Hatsune Miku: Snow Miku 2024', price: 850000, comparePrice: 950000, featured: true },
    { name: 'Figma Spy x Family - Anya Forger', price: 1200000, comparePrice: 1400000, featured: true },
    { name: 'Scale Figure Rem 1/7 - Re:Zero', price: 3500000, comparePrice: 4200000, featured: true },
    { name: 'Pop Up Parade Gojo Satoru - Jujutsu Kaisen', price: 750000, featured: true },
    { name: 'Nendoroid Chainsaw Man - Denji', price: 900000, comparePrice: 1000000, featured: true },
    { name: 'Figma Attack on Titan - Eren Yeager', price: 1350000, featured: false },
    { name: 'Scale Figure Miku Racing 2023 1/8', price: 4200000, comparePrice: 5000000, featured: true },
    { name: 'Nendoroid Demon Slayer - Nezuko Kamado', price: 850000, comparePrice: 950000, featured: true },
    { name: 'Figma My Hero Academia - Izuku Midoriya', price: 1150000, featured: false },
    { name: 'Pop Up Parade Makima - Chainsaw Man', price: 680000, featured: true },
    { name: 'Scale Figure Zero Two 1/7 - Darling in the Franxx', price: 3800000, comparePrice: 4500000, featured: false },
    { name: 'Nendoroid Naruto - Naruto Uzumaki Sage Mode', price: 920000, featured: false },
    { name: 'Figma Sword Art Online - Kirito', price: 1280000, comparePrice: 1500000, featured: false },
    { name: 'Pop Up Parade Power - Chainsaw Man', price: 720000, featured: true },
    { name: 'Scale Figure Asuna 1/7 - SAO Alicization', price: 3200000, featured: false },
]

// Gaming Gear Products
const gamingProducts = [
    { name: 'Bàn phím cơ Akko 3068B Plus - Anime Edition', price: 1890000, comparePrice: 2200000, featured: true },
    { name: 'Chuột gaming Razer Viper Mini - Hatsune Miku', price: 1290000, featured: true },
    { name: 'Tai nghe gaming HyperX Cloud Alpha - Limited', price: 2490000, comparePrice: 2900000, featured: false },
    { name: 'Mousepad XL Anime Girl 90x40cm', price: 350000, featured: false },
    { name: 'Keycap Set PBT Anime Theme - 108 phím', price: 890000, comparePrice: 1100000, featured: true },
    { name: 'Tay cầm PS5 DualSense - Custom Anime Skin', price: 1650000, featured: false },
    { name: 'Webcam Logitech C922 + Ring Light Anime', price: 2100000, comparePrice: 2500000, featured: false },
    { name: 'Ghế gaming E-Dra Anime Series', price: 4500000, comparePrice: 5200000, featured: true },
    { name: 'Bàn gaming RGB - Otaku Edition', price: 3200000, featured: false },
    { name: 'Hub USB 3.0 Anime Figure Stand', price: 450000, featured: false },
]

// Manga & Comics Products
const mangaProducts = [
    { name: 'One Piece Box Set 1 (Vol 1-23)', price: 2500000, comparePrice: 2900000, featured: true },
    { name: 'Demon Slayer Complete Box Set', price: 3200000, featured: true },
    { name: 'Attack on Titan Colossal Edition Vol 1', price: 850000, featured: false },
    { name: 'Jujutsu Kaisen Vol 1-10 Bundle', price: 1200000, comparePrice: 1400000, featured: true },
    { name: 'Chainsaw Man Vol 1-11 Complete', price: 1650000, featured: false },
    { name: 'Spy x Family Vol 1-8', price: 960000, comparePrice: 1100000, featured: true },
    { name: 'My Hero Academia Vol 1-15', price: 1800000, featured: false },
    { name: 'Tokyo Revengers Vol 1-22', price: 2640000, comparePrice: 3000000, featured: false },
    { name: 'Naruto Complete Box Set', price: 4500000, featured: true },
    { name: 'Dragon Ball Super Vol 1-18', price: 2160000, featured: false },
]

// Apparel Products
const apparelProducts = [
    { name: 'Áo thun Chainsaw Man - Pochita Design', price: 350000, comparePrice: 420000, featured: true },
    { name: 'Hoodie Attack on Titan - Survey Corps', price: 650000, featured: true },
    { name: 'Áo khoác Demon Slayer - Tanjiro Pattern', price: 890000, comparePrice: 1000000, featured: false },
    { name: 'T-shirt One Piece - Straw Hat Crew', price: 320000, featured: false },
    { name: 'Mũ bucket Jujutsu Kaisen', price: 180000, featured: false },
    { name: 'Hoodie Naruto - Akatsuki Cloud', price: 720000, comparePrice: 850000, featured: true },
    { name: 'Áo thun Spy x Family - Anya Heh', price: 280000, featured: true },
    { name: 'Jacket Bomber My Hero Academia', price: 950000, featured: false },
]

// Collectibles Products  
const collectibleProducts = [
    { name: 'Poster A2 Demon Slayer - Hashira Set', price: 150000, featured: false },
    { name: 'Keychain Set Spy x Family - 5pcs', price: 120000, comparePrice: 150000, featured: true },
    { name: 'Ốp lưng iPhone 14 - Anime Collection', price: 250000, featured: false },
    { name: 'Sticker Pack Chainsaw Man - 50pcs', price: 80000, featured: false },
    { name: 'Poster Holographic Jujutsu Kaisen', price: 280000, comparePrice: 350000, featured: true },
    { name: 'Badge Set Attack on Titan - 8pcs', price: 95000, featured: false },
    { name: 'Acrylic Stand One Piece - Luffy Gear 5', price: 180000, featured: true },
    { name: 'Wall Scroll Miku Hatsune - B2 Size', price: 420000, comparePrice: 500000, featured: false },
]

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

function getRandomImage(): string[] {
    const shuffled = [...sampleImages].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 1)
}

function getRandomStock(): number {
    return Math.floor(Math.random() * 100) + 5
}

function generateDescription(name: string): string {
    return `${name} - Sản phẩm chính hãng 100% từ Otaku Shop. Được nhập khẩu trực tiếp từ Nhật Bản với chất lượng cao nhất. Phù hợp cho các fan anime và manga. Bảo hành chính hãng, đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất.`
}

async function main() {
    console.log('🌱 Starting product seed...\n')

    // Get existing categories
    const categories = await prisma.category.findMany()

    if (categories.length === 0) {
        console.log('❌ No categories found. Please run the main seed first.')
        return
    }

    const figuresCategory = categories.find(c => c.slug === 'figures-models')
    const gamingCategory = categories.find(c => c.slug === 'gaming-gear')
    const mangaCategory = categories.find(c => c.slug === 'manga-comics')
    const apparelCategory = categories.find(c => c.slug === 'apparel')
    const collectiblesCategory = categories.find(c => c.slug === 'collectibles')

    // Delete existing products
    console.log('🗑️  Clearing old products...')
    await prisma.product.deleteMany()
    console.log('✅ Cleared old products\n')

    let productCount = 0

    // Create Figure products
    if (figuresCategory) {
        console.log('📦 Creating Figure products...')
        for (const product of figureProducts) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    slug: generateSlug(product.name) + '-' + Date.now().toString().slice(-4),
                    description: generateDescription(product.name),
                    price: product.price,
                    comparePrice: product.comparePrice || null,
                    stockQuantity: getRandomStock(),
                    images: getRandomImage(),
                    isActive: true,
                    featured: product.featured,
                    categoryId: figuresCategory.id,
                }
            })
            productCount++
        }
        console.log(`✅ Created ${figureProducts.length} figure products`)
    }

    // Create Gaming products
    if (gamingCategory) {
        console.log('🎮 Creating Gaming products...')
        for (const product of gamingProducts) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    slug: generateSlug(product.name) + '-' + Date.now().toString().slice(-4),
                    description: generateDescription(product.name),
                    price: product.price,
                    comparePrice: product.comparePrice || null,
                    stockQuantity: getRandomStock(),
                    images: getRandomImage(),
                    isActive: true,
                    featured: product.featured,
                    categoryId: gamingCategory.id,
                }
            })
            productCount++
        }
        console.log(`✅ Created ${gamingProducts.length} gaming products`)
    }

    // Create Manga products
    if (mangaCategory) {
        console.log('📚 Creating Manga products...')
        for (const product of mangaProducts) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    slug: generateSlug(product.name) + '-' + Date.now().toString().slice(-4),
                    description: generateDescription(product.name),
                    price: product.price,
                    comparePrice: product.comparePrice || null,
                    stockQuantity: getRandomStock(),
                    images: getRandomImage(),
                    isActive: true,
                    featured: product.featured,
                    categoryId: mangaCategory.id,
                }
            })
            productCount++
        }
        console.log(`✅ Created ${mangaProducts.length} manga products`)
    }

    // Create Apparel products
    if (apparelCategory) {
        console.log('👕 Creating Apparel products...')
        for (const product of apparelProducts) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    slug: generateSlug(product.name) + '-' + Date.now().toString().slice(-4),
                    description: generateDescription(product.name),
                    price: product.price,
                    comparePrice: product.comparePrice || null,
                    stockQuantity: getRandomStock(),
                    images: getRandomImage(),
                    isActive: true,
                    featured: product.featured,
                    categoryId: apparelCategory.id,
                }
            })
            productCount++
        }
        console.log(`✅ Created ${apparelProducts.length} apparel products`)
    }

    // Create Collectibles products
    if (collectiblesCategory) {
        console.log('🎁 Creating Collectibles products...')
        for (const product of collectibleProducts) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    slug: generateSlug(product.name) + '-' + Date.now().toString().slice(-4),
                    description: generateDescription(product.name),
                    price: product.price,
                    comparePrice: product.comparePrice || null,
                    stockQuantity: getRandomStock(),
                    images: getRandomImage(),
                    isActive: true,
                    featured: product.featured,
                    categoryId: collectiblesCategory.id,
                }
            })
            productCount++
        }
        console.log(`✅ Created ${collectibleProducts.length} collectibles products`)
    }

    console.log(`\n🎉 Total: Created ${productCount} products successfully!`)
}

main()
    .catch((e) => {
        console.error('Error seeding products:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
