import { PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

// Ảnh mẫu cho figures/anime products
const figureImages = [
    'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=500',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500',
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500',
    'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500',
    'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=500',
    'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=500',
]

// Anime series để tạo sản phẩm
const animeSeries = [
    'One Piece', 'Naruto', 'Dragon Ball', 'Demon Slayer', 'Jujutsu Kaisen',
    'Attack on Titan', 'My Hero Academia', 'Chainsaw Man', 'Spy x Family', 
    'Bleach', 'Tokyo Ghoul', 'Death Note', 'Fullmetal Alchemist', 'Hunter x Hunter',
    'One Punch Man', 'Mob Psycho 100', 'Vinland Saga', 'Blue Lock', 'Haikyuu',
    'Sword Art Online', 'Re:Zero', 'Konosuba', 'Overlord', 'Mushoku Tensei',
]

const characters = [
    // One Piece
    { series: 'One Piece', chars: ['Luffy Gear 5', 'Zoro', 'Nami', 'Sanji', 'Robin', 'Chopper', 'Law', 'Shanks', 'Kaido', 'Yamato'] },
    // Naruto
    { series: 'Naruto', chars: ['Naruto Sage Mode', 'Sasuke', 'Kakashi', 'Itachi', 'Minato', 'Madara', 'Jiraiya', 'Tsunade', 'Hinata', 'Sakura'] },
    // Dragon Ball
    { series: 'Dragon Ball', chars: ['Goku Ultra Instinct', 'Vegeta', 'Gohan', 'Piccolo', 'Frieza', 'Cell', 'Broly', 'Beerus', 'Trunks', 'Android 18'] },
    // Demon Slayer
    { series: 'Demon Slayer', chars: ['Tanjiro', 'Nezuko', 'Zenitsu', 'Inosuke', 'Giyu', 'Rengoku', 'Shinobu', 'Muzan', 'Akaza', 'Mitsuri'] },
    // Jujutsu Kaisen
    { series: 'Jujutsu Kaisen', chars: ['Gojo Satoru', 'Itadori Yuji', 'Megumi', 'Nobara', 'Sukuna', 'Todo', 'Nanami', 'Maki', 'Toge', 'Yuta'] },
    // Attack on Titan
    { series: 'Attack on Titan', chars: ['Eren', 'Mikasa', 'Levi', 'Armin', 'Erwin', 'Hange', 'Annie', 'Reiner', 'Historia', 'Sasha'] },
    // My Hero Academia
    { series: 'My Hero Academia', chars: ['Deku', 'Bakugo', 'Todoroki', 'All Might', 'Endeavor', 'Hawks', 'Shigaraki', 'Dabi', 'Toga', 'Uraraka'] },
    // Chainsaw Man
    { series: 'Chainsaw Man', chars: ['Denji', 'Makima', 'Power', 'Aki', 'Pochita', 'Reze', 'Himeno', 'Kobeni', 'Angel Devil', 'Kishibe'] },
    // Spy x Family
    { series: 'Spy x Family', chars: ['Anya', 'Loid', 'Yor', 'Bond', 'Yuri', 'Fiona', 'Damian', 'Becky', 'Franky', 'Sylvia'] },
]

// Product types
const figureTypes = [
    { type: 'Nendoroid', priceRange: [750000, 1200000] },
    { type: 'Figma', priceRange: [1100000, 1600000] },
    { type: 'Pop Up Parade', priceRange: [600000, 900000] },
    { type: 'Scale Figure 1/7', priceRange: [2800000, 5500000] },
    { type: 'Scale Figure 1/8', priceRange: [2200000, 4200000] },
    { type: 'Prize Figure', priceRange: [400000, 700000] },
    { type: 'S.H.Figuarts', priceRange: [1500000, 2800000] },
    { type: 'Chibi Masters', priceRange: [350000, 550000] },
    { type: 'ARTFX J', priceRange: [3000000, 6000000] },
    { type: 'Statue', priceRange: [4500000, 12000000] },
]

// Merchandise types
const merchandiseTypes = [
    { type: 'Áo thun', priceRange: [280000, 450000] },
    { type: 'Hoodie', priceRange: [550000, 850000] },
    { type: 'Mũ bucket', priceRange: [150000, 280000] },
    { type: 'Balo', priceRange: [450000, 750000] },
    { type: 'Túi tote', priceRange: [180000, 320000] },
    { type: 'Poster A2', priceRange: [120000, 220000] },
    { type: 'Keychain Set', priceRange: [80000, 180000] },
    { type: 'Acrylic Stand', priceRange: [150000, 350000] },
    { type: 'Ốp điện thoại', priceRange: [180000, 350000] },
    { type: 'Sticker Pack', priceRange: [50000, 120000] },
]

// Manga sets
const mangaSets = [
    { name: 'One Piece Box Set Vol 1-23', price: 2500000 },
    { name: 'Naruto Complete Box Set', price: 4200000 },
    { name: 'Dragon Ball Super Vol 1-20', price: 2400000 },
    { name: 'Demon Slayer Complete Set', price: 3200000 },
    { name: 'Jujutsu Kaisen Vol 1-22', price: 2640000 },
    { name: 'Attack on Titan Complete', price: 5800000 },
    { name: 'My Hero Academia Vol 1-38', price: 4560000 },
    { name: 'Chainsaw Man Vol 1-15', price: 1800000 },
    { name: 'Spy x Family Vol 1-12', price: 1440000 },
    { name: 'Tokyo Revengers Complete', price: 3600000 },
]

// Gaming gear
const gamingProducts = [
    { name: 'Bàn phím cơ Akko 3068B Plus - Anime Edition', price: 1890000 },
    { name: 'Chuột gaming Razer Viper Mini - Hatsune Miku', price: 1290000 },
    { name: 'Tai nghe gaming HyperX Cloud Alpha - Limited', price: 2490000 },
    { name: 'Mousepad XL Anime Art 90x40cm', price: 350000 },
    { name: 'Keycap Set PBT Anime Theme - 108 keys', price: 890000 },
    { name: 'Controller PS5 Custom Anime Skin', price: 1650000 },
    { name: 'Webcam Setup + Ring Light Anime', price: 2100000 },
    { name: 'Gaming Chair E-Dra Anime Series', price: 4500000 },
    { name: 'RGB Gaming Desk - Otaku Edition', price: 3200000 },
    { name: 'USB Hub 3.0 Figure Stand', price: 450000 },
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

function getImagesForProduct(name: string, seedBase: number): string[] {
    const encodedName = encodeURIComponent(name)
    const count = Math.floor(Math.random() * 2) + 1
    const images = []
    for (let i = 0; i < count; i++) {
        const seed = seedBase * 10 + i
        const imageUrl = `https://image.pollinations.ai/prompt/anime%20figure%20${encodedName}?width=800&height=800&nologo=true&seed=${seed}&model=flux`
        images.push(imageUrl)
    }
    return images
}

function getRandomPrice(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
}

function getRandomPreorderStatus(): 'NONE' | 'PREORDER' | 'ORDER' {
    const rand = Math.random()
    if (rand < 0.65) return 'NONE'
    if (rand < 0.85) return 'PREORDER'
    return 'ORDER'
}

function getStockForStatus(status: 'NONE' | 'PREORDER' | 'ORDER'): number {
    if (status === 'NONE') return Math.floor(Math.random() * 50) + 5
    return 0
}

function generateDescription(name: string, type: string): string {
    const descriptions = [
        `${name} - Sản phẩm chính hãng 100% từ Otaku Shop. Nhập khẩu trực tiếp từ Nhật Bản với chất lượng cao nhất.`,
        `${type} ${name} - Chất lượng cao cấp, chi tiết tinh xảo. Phù hợp cho collector và fan anime.`,
        `${name} Official - Hàng chính hãng, full box. Bảo hành đổi trả trong 7 ngày.`,
        `${name} - Limited Edition, số lượng có hạn. Sản phẩm dành cho các fan anime chân chính.`,
    ]
    return descriptions[Math.floor(Math.random() * descriptions.length)]
}

async function main() {
    console.log('🌱 Bắt đầu seed 500 món hàng mẫu (mỗi món là sản phẩm riêng)...\n')

    // Get existing categories
    const categories = await prisma.category.findMany()
    
    if (categories.length === 0) {
        console.log('❌ Không tìm thấy category. Đang tạo categories mặc định...')
        
        // Create default categories
        const defaultCategories = [
            { name: 'Figures & Models', slug: 'figures-models', description: 'Mô hình nhân vật anime/manga chính hãng' },
            { name: 'Manga & Comics', slug: 'manga-comics', description: 'Manga, Light Novel, Comics' },
            { name: 'Apparel', slug: 'apparel', description: 'Áo thun, Hoodie, Phụ kiện thời trang' },
            { name: 'Gaming Gear', slug: 'gaming-gear', description: 'Phụ kiện gaming, Bàn phím, Chuột' },
            { name: 'Collectibles', slug: 'collectibles', description: 'Poster, Keychain, Sticker, Acrylic' },
        ]
        
        for (const cat of defaultCategories) {
            await prisma.category.create({ data: cat })
        }
        console.log('✅ Đã tạo 5 categories mặc định')
    }
    
    // Re-fetch categories
    const allCategories = await prisma.category.findMany()
    const figuresCategory = allCategories.find(c => c.slug === 'figures-models' || c.name.toLowerCase().includes('figure'))
    const mangaCategory = allCategories.find(c => c.slug === 'manga-comics' || c.name.toLowerCase().includes('manga'))
    const apparelCategory = allCategories.find(c => c.slug === 'apparel' || c.name.toLowerCase().includes('apparel'))
    const gamingCategory = allCategories.find(c => c.slug === 'gaming-gear' || c.name.toLowerCase().includes('gaming'))
    const collectiblesCategory = allCategories.find(c => c.slug === 'collectibles' || c.name.toLowerCase().includes('collectible'))
    
    // Use first category as fallback
    const defaultCategory = allCategories[0]

    // XÓA TẤT CẢ SẢN PHẨM CŨ (và các bản ghi liên quan)
    console.log('🗑️  Đang xóa tất cả dữ liệu cũ...')
    
    // Xóa theo thứ tự: OrderItems -> CartItems -> Wishlist -> Reviews -> Products
    await prisma.orderItem.deleteMany()
    console.log('   ✓ Đã xóa order items')
    
    await prisma.cartItem.deleteMany()
    console.log('   ✓ Đã xóa cart items')
    
    await prisma.wishlist.deleteMany()
    console.log('   ✓ Đã xóa wishlist')
    
    await prisma.review.deleteMany()
    console.log('   ✓ Đã xóa reviews')
    
    await prisma.productVariant.deleteMany()
    console.log('   ✓ Đã xóa product variants')
    
    await prisma.productCharacter.deleteMany()
    console.log('   ✓ Đã xóa product characters')
    
    await prisma.productSeries.deleteMany()
    console.log('   ✓ Đã xóa product series')
    
    await prisma.productTag.deleteMany()
    console.log('   ✓ Đã xóa product tags')
    
    await prisma.product.deleteMany()
    console.log('✅ Đã xóa tất cả sản phẩm cũ\n')

    let productCount = 0
    const products: Array<{
        name: string;
        slug: string;
        description: string;
        price: number;
        comparePrice: number | null;
        stockQuantity: number;
        images: string[];
        isActive: boolean;
        featured: boolean;
        categoryId: string;
        preorderStatus: 'NONE' | 'PREORDER' | 'ORDER';
    }> = []

    console.log('📦 Đang tạo 500 món hàng...\n')
    
    // Tạo đúng 500 sản phẩm KHÁC NHAU
    let counter = 0
    
    // 1. Figures - 200 món (40%)
    for (let i = 0; i < 200; i++) {
        const seriesData = characters[counter % characters.length]
        const char = seriesData.chars[i % seriesData.chars.length]
        const figureType = figureTypes[i % figureTypes.length]
        
        const name = `${figureType.type} ${seriesData.series} - ${char} [ID-${counter + 1}]`
        const price = getRandomPrice(figureType.priceRange[0], figureType.priceRange[1])
        const hasComparePrice = Math.random() > 0.5
        const preorderStatus = getRandomPreorderStatus()
        
        products.push({
            name,
            slug: generateSlug(name) + '-' + (counter + 1),
            description: generateDescription(name, figureType.type),
            price,
            comparePrice: hasComparePrice ? Math.floor(price * 1.15) : null,
            stockQuantity: getStockForStatus(preorderStatus),
            images: getImagesForProduct(name, counter),
            isActive: true,
            featured: (counter % 5) === 0, // Mỗi 5 sản phẩm có 1 featured
            categoryId: figuresCategory?.id || defaultCategory.id,
            preorderStatus,
        })
        counter++
    }
    console.log(`✅ Đã tạo 200 món hàng figures`)

    // 2. Apparel - 125 món (25%)
    for (let i = 0; i < 125; i++) {
        const series = animeSeries[counter % animeSeries.length]
        const merchType = merchandiseTypes[i % 6] // First 6 are apparel
        
        const name = `${merchType.type} ${series} Edition [ID-${counter + 1}]`
        const price = getRandomPrice(merchType.priceRange[0], merchType.priceRange[1])
        const hasComparePrice = Math.random() > 0.6
        
        products.push({
            name,
            slug: generateSlug(name) + '-' + (counter + 1),
            description: generateDescription(name, merchType.type),
            price,
            comparePrice: hasComparePrice ? Math.floor(price * 1.2) : null,
            stockQuantity: Math.floor(Math.random() * 100) + 20,
            images: getImagesForProduct(name, counter),
            isActive: true,
            featured: (counter % 6) === 0,
            categoryId: apparelCategory?.id || defaultCategory.id,
            preorderStatus: 'NONE',
        })
        counter++
    }
    console.log(`✅ Đã tạo 125 món hàng apparel`)

    // 3. Manga - 75 món (15%)
    for (let i = 0; i < 75; i++) {
        const series = animeSeries[counter % animeSeries.length]
        const volNumber = (i % 10) + 1
        
        const name = `Manga ${series} Vol ${volNumber}-${volNumber + 10} Box Set [ID-${counter + 1}]`
        const price = getRandomPrice(1500000, 5000000)
        const hasComparePrice = Math.random() > 0.5
        
        products.push({
            name,
            slug: generateSlug(name) + '-' + (counter + 1),
            description: `${name} - Manga chính hãng, bản tiếng Việt/Anh. In ấn đẹp, giấy chất lượng cao.`,
            price,
            comparePrice: hasComparePrice ? Math.floor(price * 1.15) : null,
            stockQuantity: Math.floor(Math.random() * 30) + 10,
            images: getImagesForProduct(name, counter),
            isActive: true,
            featured: (counter % 5) === 0,
            categoryId: mangaCategory?.id || defaultCategory.id,
            preorderStatus: 'NONE',
        })
        counter++
    }
    console.log(`✅ Đã tạo 75 món hàng manga`)

    // 4. Gaming - 50 món (10%)
    for (let i = 0; i < 50; i++) {
        const series = animeSeries[counter % animeSeries.length]
        const gamingType = ['Keyboard', 'Mouse', 'Headset', 'Mousepad', 'Controller', 'Webcam', 'Chair', 'Desk', 'Monitor Stand', 'Cable Management']
        
        const name = `${gamingType[i]} ${series} Gaming Edition [ID-${counter + 1}]`
        const price = getRandomPrice(350000, 5000000)
        const hasComparePrice = Math.random() > 0.5
        
        products.push({
            name,
            slug: generateSlug(name) + '-' + (counter + 1),
            description: `${name} - Gaming gear chất lượng cao dành cho game thủ và otaku.`,
            price,
            comparePrice: hasComparePrice ? Math.floor(price * 1.18) : null,
            stockQuantity: Math.floor(Math.random() * 25) + 5,
            images: getImagesForProduct(name, counter),
            isActive: true,
            featured: (counter % 4) === 0,
            categoryId: gamingCategory?.id || defaultCategory.id,
            preorderStatus: 'NONE',
        })
        counter++
    }
    console.log(`✅ Đã tạo 50 món hàng gaming`)

    // 5. Collectibles - 50 món (10%)
    for (let i = 0; i < 50; i++) {
        const series = animeSeries[counter % animeSeries.length]
        const merchType = merchandiseTypes.slice(6)[i % 4] // Last 4 are collectibles
        
        const name = `${merchType.type} ${series} Premium Collection [ID-${counter + 1}]`
        const price = getRandomPrice(merchType.priceRange[0], merchType.priceRange[1])
        const hasComparePrice = Math.random() > 0.7
        
        products.push({
            name,
            slug: generateSlug(name) + '-' + (counter + 1),
            description: generateDescription(name, merchType.type),
            price,
            comparePrice: hasComparePrice ? Math.floor(price * 1.25) : null,
            stockQuantity: Math.floor(Math.random() * 150) + 30,
            images: getImagesForProduct(name, counter),
            isActive: true,
            featured: (counter % 4) === 0,
            categoryId: collectiblesCategory?.id || defaultCategory.id,
            preorderStatus: 'NONE',
        })
        counter++
    }
    console.log(`✅ Đã tạo 50 món hàng collectibles`)

    console.log(`\n💾 Đang lưu ${products.length} món hàng vào database...`)
    
    // Bulk insert all products
    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        try {
            await prisma.product.create({ data: product })
            if ((i + 1) % 50 === 0) {
                console.log(`   ✓ Đã lưu ${i + 1}/${products.length} sản phẩm...`)
            }
        } catch (error) {
            console.error(`   ✗ Lỗi khi lưu sản phẩm ${product.name}:`, error)
            // If slug exists, add random suffix and retry
            product.slug = product.slug + '-' + Math.random().toString(36).substring(7)
            await prisma.product.create({ data: product })
        }
    }

    console.log(`\n✅ Đã tạo thành công ${products.length} món hàng!`)
    
    // Summary
    const summary = await prisma.product.groupBy({
        by: ['categoryId'],
        _count: { id: true }
    })
    
    console.log('\n📊 Thống kê theo danh mục:')
    for (const s of summary) {
        const cat = allCategories.find(c => c.id === s.categoryId)
        console.log(`   - ${cat?.name || 'Unknown'}: ${s._count.id} món hàng`)
    }
    
    const totalProducts = await prisma.product.count()
    const featuredProducts = await prisma.product.count({ where: { featured: true } })
    const preorderProducts = await prisma.product.count({ where: { preorderStatus: { not: 'NONE' } } })
    
    console.log(`\n📈 Thống kê tổng quan:`)
    console.log(`   - Tổng số món hàng: ${totalProducts}`)
    console.log(`   - Sản phẩm nổi bật: ${featuredProducts}`)
    console.log(`   - Sản phẩm preorder/order: ${preorderProducts}`)
    console.log(`   - Sản phẩm có sẵn: ${totalProducts - preorderProducts}`)
    console.log(`\n🎉 Hoàn tất! Bạn có ${totalProducts} món hàng khác nhau để test!`)
}

main()
    .catch((e) => {
        console.error('❌ Lỗi:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
