/**
 * Test fixtures for unit and integration tests
 */

// ==================== USER FIXTURES ====================
export const mockUsers = {
  customer: {
    id: 'user-customer-1',
    email: 'customer@test.com',
    passwordHash: '$2a$10$abcdefghijklmnopqrstuv', // hashed "Password123"
    fullName: 'Test Customer',
    phone: '0901234567',
    role: 'CUSTOMER',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  admin: {
    id: 'user-admin-1',
    email: 'admin@test.com',
    passwordHash: '$2a$10$abcdefghijklmnopqrstuv',
    fullName: 'Test Admin',
    phone: '0909999999',
    role: 'ADMIN',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  unverified: {
    id: 'user-unverified-1',
    email: 'unverified@test.com',
    passwordHash: '$2a$10$abcdefghijklmnopqrstuv',
    fullName: 'Unverified User',
    role: 'CUSTOMER',
    emailVerified: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
}

// ==================== PRODUCT FIXTURES ====================
export const mockProducts = {
  inStock: {
    id: 'product-1',
    name: 'Naruto Figure',
    slug: 'naruto-figure',
    price: 1500000,
    comparePrice: 1800000,
    stockQuantity: 10,
    isActive: true,
    description: 'High quality Naruto figure',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  outOfStock: {
    id: 'product-2',
    name: 'Sasuke Figure',
    slug: 'sasuke-figure',
    price: 2000000,
    stockQuantity: 0,
    isActive: true,
    description: 'Limited edition Sasuke figure',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  inactive: {
    id: 'product-3',
    name: 'Discontinued Figure',
    slug: 'discontinued-figure',
    price: 500000,
    stockQuantity: 5,
    isActive: false,
    description: 'No longer available',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
}

// ==================== CART FIXTURES ====================
export const mockCartItems = [
  {
    id: 'cart-item-1',
    userId: mockUsers.customer.id,
    productId: mockProducts.inStock.id,
    quantity: 2,
    product: mockProducts.inStock,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

// ==================== ORDER FIXTURES ====================
export const mockOrders = {
  pending: {
    id: 'order-1',
    orderNumber: 'OTK-20240101-12345',
    userId: mockUsers.customer.id,
    status: 'PENDING',
    subtotal: 3000000,
    shippingFee: 30000,
    discount: 0,
    total: 3030000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  completed: {
    id: 'order-2',
    orderNumber: 'OTK-20240101-54321',
    userId: mockUsers.customer.id,
    status: 'COMPLETED',
    subtotal: 1500000,
    shippingFee: 0,
    discount: 150000,
    total: 1350000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
}

// ==================== COUPON FIXTURES ====================
export const mockCoupons = {
  percentage: {
    id: 'coupon-1',
    code: 'SALE10',
    type: 'PERCENTAGE',
    value: 10, // 10%
    minOrder: 500000,
    maxDiscount: 100000,
    usageLimit: 100,
    usedCount: 50,
    isActive: true,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2025-12-31'),
  },
  fixed: {
    id: 'coupon-2',
    code: 'FLAT50K',
    type: 'FIXED',
    value: 50000, // 50,000 VND
    minOrder: 300000,
    maxDiscount: null,
    usageLimit: 50,
    usedCount: 10,
    isActive: true,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2025-12-31'),
  },
  expired: {
    id: 'coupon-3',
    code: 'EXPIRED',
    type: 'PERCENTAGE',
    value: 20,
    minOrder: null,
    maxDiscount: null,
    usageLimit: null,
    usedCount: 0,
    isActive: true,
    validFrom: new Date('2023-01-01'),
    validTo: new Date('2023-12-31'), // Already expired
  },
  inactive: {
    id: 'coupon-4',
    code: 'DISABLED',
    type: 'PERCENTAGE',
    value: 15,
    minOrder: null,
    maxDiscount: null,
    usageLimit: null,
    usedCount: 0,
    isActive: false,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2025-12-31'),
  },
}

// ==================== ADDRESS FIXTURES ====================
export const mockAddresses = {
  hcmInner: {
    id: 'address-1',
    userId: mockUsers.customer.id,
    fullName: 'Test Customer',
    phone: '0901234567',
    province: 'Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    street: '123 Nguyễn Huệ',
    isDefault: true,
  },
  hcmOuter: {
    id: 'address-2',
    userId: mockUsers.customer.id,
    fullName: 'Test Customer',
    phone: '0901234567',
    province: 'Hồ Chí Minh',
    district: 'Hóc Môn',
    ward: 'Xã Tân Thới Nhì',
    street: '456 Quốc Lộ 22',
    isDefault: false,
  },
  hanoi: {
    id: 'address-3',
    userId: mockUsers.customer.id,
    fullName: 'Test Customer',
    phone: '0901234567',
    province: 'Hà Nội',
    district: 'Quận Hoàn Kiếm',
    ward: 'Phường Hàng Bạc',
    street: '789 Hàng Đào',
    isDefault: false,
  },
}

// ==================== JWT FIXTURES ====================
export const mockJWTPayloads = {
  customer: {
    userId: mockUsers.customer.id,
    email: mockUsers.customer.email,
    role: 'CUSTOMER',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  },
  admin: {
    userId: mockUsers.admin.id,
    email: mockUsers.admin.email,
    role: 'ADMIN',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  },
  expired: {
    userId: mockUsers.customer.id,
    email: mockUsers.customer.email,
    role: 'CUSTOMER',
    iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago (expired)
  },
}
