import { prisma } from './prisma'

/**
 * Generate unique order number / Tạo mã đơn hàng duy nhất
 * Format: OTK-YYYYMMDD-XXXXX
 * Example: OTK-20251031-47382
 * 
 * Includes retry logic to ensure uniqueness / Có cơ chế retry để đảm bảo không trùng
 * Note: Different dates will never collide / Lưu ý: Khác ngày sẽ không bao giờ trùng
 */
export async function generateOrderNumber(): Promise<string> {
    const maxRetries = 10
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const now = new Date()

        // Format date: YYYYMMDD / Định dạng ngày: YYYYMMDD
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const dateStr = `${year}${month}${day}`

        // Random 5-digit number (00000-99999) / Số ngẫu nhiên 5 chữ số (00000-99999)
        const random = Math.floor(Math.random() * 99999)
        const randomStr = String(random).padStart(5, '0')

        const orderNumber = `OTK-${dateStr}-${randomStr}`

        // Check if order number already exists (same date only) / Kiểm tra mã đơn đã tồn tại chưa (chỉ trong cùng ngày)
        const existingOrder = await prisma.order.findUnique({
            where: { orderNumber }
        })

        if (!existingOrder) {
            return orderNumber
        }

        // If exists, retry with new random number / Nếu trùng, thử lại với số random mới
        console.warn(`Order number ${orderNumber} already exists, retrying...`)
    }

    // Fallback: use timestamp for absolute uniqueness / Phương án dự phòng: dùng timestamp để đảm bảo 100% unique
    const timestamp = Date.now()
    return `OTK-${timestamp}`
}

export interface OrderCalculation {
    subtotal: number            // Tổng tiền hàng
    shippingFee: number         // Phí vận chuyển
    discount: number            // Giảm giá
    total: number               // Tổng cộng
}

export function calculateOrderTotals(
    cartItems: Array<{ quantity: number; product: { price: number } }>,
    shippingFee: number = 30000,
    discount: number = 0
): OrderCalculation {
    // Tính tổng tiền hàng
    const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity)
    }, 0)

    // Tính số tiền chiết khấu
    const total = subtotal + shippingFee - discount

    return {
        subtotal,
        shippingFee,
        discount,
        total
    }
}

// Validate stock trước khi tạo đơn hàng

export interface StockValidationResult {
    isValid: boolean
    errors: string[]
}

export async function validateStock(
    cartItems: Array<{
        productId: string
        quantity: number
    }>
): Promise<StockValidationResult> {
    const errors: string[] = []

    // Kiểm tra từng sản phẩm trong giỏ hàng
    for (const item of cartItems) {
        const product = await prisma.product.findUnique({
            where: {
                id: item.productId
            },
            select: {
                id: true,
                name: true,
                stockQuantity: true,
                isActive: true
            }
        })

        if (!product) {
            errors.push(`Product not found`)
            continue
        }

        if (!product.isActive) {
            errors.push(`${product.name} is no longer available`)
            continue
        }

        if (product.stockQuantity < item.quantity) {
            errors.push(
                `${product.name}: Only ${product.stockQuantity} left in stock (requested ${item.quantity})`
            )
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// Validate và apply coupon

export interface CouponValidationResult {
    isValid: boolean
    coupon?: {
        id: string
        code: string
        discountType: string
        discountValue: number
    }
    error?: string
}

export async function validateCoupon(
    couponCode: string,
    userId: string,
    subtotal: number
): Promise<CouponValidationResult> {
    // Tìm coupon theo mã
    const coupon = await prisma.coupon.findUnique({
        where: {
            code: couponCode
        }
    })

    if (!coupon) {
        return {
            isValid: false,
            error: 'Invalid coupon code'
        }
    }

    const now = new Date()
    
    // Kiểm tra coupon có đang active không
    if (!coupon.isActive) {
        return {
            isValid: false,
            error: 'Coupon is not active'
        }
    }

    // Kiểm tra coupon đã hết hạn chưa
    if (coupon.validTo && coupon.validTo < now) {
        return {
            isValid: false,
            error: 'Coupon has expired'
        }
    }

    // Kiểm tra coupon đã bắt đầu chưa
    if (coupon.validFrom && coupon.validFrom > now) {
        return {
            isValid: false,
            error: 'Coupon is not yet valid'
        }
    }

    //  Kiểm tra số tiền tối thiểu để áp dụng coupon
    if (coupon.minOrder && subtotal < Number(coupon.minOrder)) {
        return {
            isValid: false,
            error: `Minimum order amount for this coupon is ${Number(coupon.minOrder).toLocaleString('vi-VN')}đ`
        }
    }

    // Kiểm tra giới hạn sử dụng tổng thể
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return {
            isValid: false,
            error: 'Coupon usage limit has been reached'
        }
    }

    // Coupon hợp lệ
    return {
        isValid: true,
        coupon: {
            id: coupon.id,
            code: coupon.code,
            discountType: coupon.type,
            discountValue: Number(coupon.value)
        }
    }
}

// Tinh toán chiết khấu từ coupon
export function calculateDiscount(
    subtotal: number,
    coupon: {
        discountType: string
        discountValue: number
    }
): number {
    if (coupon.discountType === 'PERCENTAGE') {
        // Giảm giá theo phần trăm
        return Math.floor(subtotal * (coupon.discountValue / 100))
    }else {
        // Giảm giá theo số tiền cố định
        return Math.min(coupon.discountValue, subtotal)
    }
}

/**
 * Calculate shipping fee based on region / Tính phí vận chuyển theo vùng miền
 * 
 * Shipping zones / Khu vực vận chuyển:
 * - HCM inner city: FREE / Nội thành HCM: MIỄN PHÍ
 * - Southern region: 30,000 VND / Miền Nam: 30,000đ
 * - Central region: 35,000 VND / Miền Trung: 35,000đ
 * - Northern region: 40,000 VND / Miền Bắc: 40,000đ
 */
export function calculateShippingFee(
    city: string,
    district: string
): number {
    // Normalize city and district names / Chuẩn hóa tên thành phố và quận
    const normalizedCity = city.trim().toLowerCase()
        .replace(/^tp\.?\s*/i, '')  // Remove "TP." or "TP"
        .replace(/^thành phố\s*/i, '')  // Remove "Thành phố"
    
    const normalizedDistrict = district.trim().toLowerCase()

    // FREE shipping for inner districts of HCM / MIỄN PHÍ ship nội thành HCM
    if (normalizedCity === 'hồ chí minh' || normalizedCity === 'hcm') {
        const innerDistricts = [
            'quận 1', 'quận 2', 'quận 3', 'quận 4', 'quận 5',
            'quận 6', 'quận 7', 'quận 8', 'quận 10', 'quận 11',
            'quận tân bình', 'quận bình thạnh', 'quận phú nhuận',
            'quận gò vấp', 'quận tân phú'
        ]
        
        if (innerDistricts.includes(normalizedDistrict)) {
            return 0 // FREE shipping / Miễn phí
        }
    }

    // Southern region cities / Các tỉnh/thành miền Nam
    const southernCities = [
        'hồ chí minh', 'hcm', 'đồng nai', 'bình dương', 'bà rịa vũng tàu',
        'long an', 'tiền giang', 'bến tre', 'vĩnh long', 'cần thơ',
        'an giang', 'kiên giang', 'hậu giang', 'sóc trăng', 'bạc liêu',
        'cà mau', 'đồng tháp', 'trà vinh', 'tây ninh', 'bình phước'
    ]

    // Central region cities / Các tỉnh/thành miền Trung
    const centralCities = [
        'đà nẵng', 'huế', 'thừa thiên huế', 'quảng nam', 'quảng ngãi',
        'bình định', 'phú yên', 'khánh hòa', 'nha trang', 'ninh thuận',
        'bình thuận', 'quảng trị', 'quảng bình', 'hà tĩnh', 'nghệ an',
        'thanh hóa', 'gia lai', 'kon tum', 'đắk lắk', 'đắk nông', 'lâm đồng'
    ]

    // Northern region cities / Các tỉnh/thành miền Bắc
    const northernCities = [
        'hà nội', 'hải phòng', 'quảng ninh', 'hải dương', 'hưng yên',
        'bắc ninh', 'bắc giang', 'vĩnh phúc', 'phú thọ', 'thái nguyên',
        'lạng sơn', 'cao bằng', 'bắc kạn', 'tuyên quang', 'lào cai',
        'yên bái', 'điện biên', 'lai châu', 'sơn la', 'hòa bình',
        'nam định', 'thái bình', 'ninh bình', 'hà nam'
    ]

    // Check region and return corresponding fee / Kiểm tra miền và trả về phí tương ứng
    if (southernCities.includes(normalizedCity)) {
        return 30000 // Southern region / Miền Nam
    }
    
    if (centralCities.includes(normalizedCity)) {
        return 35000 // Central region / Miền Trung
    }
    
    if (northernCities.includes(normalizedCity)) {
        return 40000 // Northern region / Miền Bắc
    }

    // Default: Southern region fee / Mặc định: phí miền Nam
    return 30000
}
