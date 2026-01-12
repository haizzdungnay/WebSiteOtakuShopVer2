/**
 * Swagger/OpenAPI Configuration
 * API Documentation setup for OtakuShop
 */

export const swaggerConfig = {
    openapi: '3.0.3',
    info: {
        title: 'OtakuShop API',
        version: '2.0.0',
        description: `
## Giới thiệu

OtakuShop API cung cấp các endpoints để quản lý cửa hàng bán figure, mô hình anime và các sản phẩm otaku.

### Xác thực

API sử dụng JWT (JSON Web Token) để xác thực. Token được lưu trong HTTP-only cookie sau khi đăng nhập.

### Rate Limiting

- **API chung**: 100 requests/phút
- **Auth endpoints**: 5 requests/15 phút
- **Write operations**: 20 requests/phút
- **Payment endpoints**: 3 requests/10 phút

### Response Format

Tất cả API responses đều có format chuẩn:

\`\`\`json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "meta": {
    "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
\`\`\`
    `,
        contact: {
            name: 'OtakuShop Support',
            email: 'support@otakushop.vn',
        },
    },
    servers: [
        {
            url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            description: 'Current Server',
        },
        {
            url: 'https://otakushop.vn',
            description: 'Production Server',
        },
    ],
    tags: [
        {
            name: 'Auth',
            description: 'Xác thực và quản lý tài khoản',
        },
        {
            name: 'Products',
            description: 'Quản lý sản phẩm',
        },
        {
            name: 'Categories',
            description: 'Danh mục sản phẩm',
        },
        {
            name: 'Cart',
            description: 'Giỏ hàng',
        },
        {
            name: 'Orders',
            description: 'Đơn hàng',
        },
        {
            name: 'Reviews',
            description: 'Đánh giá sản phẩm',
        },
        {
            name: 'Shipping',
            description: 'Vận chuyển và tính phí ship',
        },
        {
            name: 'Payment',
            description: 'Thanh toán',
        },
        {
            name: 'Admin',
            description: 'Quản trị (yêu cầu quyền admin)',
        },
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'token',
                description: 'JWT token stored in HTTP-only cookie',
            },
        },
        schemas: {
            // Common schemas
            ApiError: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                        type: 'object',
                        properties: {
                            code: { type: 'string', example: 'VALIDATION_ERROR' },
                            message: { type: 'string', example: 'Email không hợp lệ' },
                            details: { type: 'object' },
                        },
                    },
                },
            },
            Pagination: {
                type: 'object',
                properties: {
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 20 },
                    total: { type: 'integer', example: 100 },
                    totalPages: { type: 'integer', example: 5 },
                    hasMore: { type: 'boolean', example: true },
                },
            },
            // User schemas
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    email: { type: 'string', format: 'email' },
                    fullName: { type: 'string' },
                    phone: { type: 'string' },
                    role: { type: 'string', enum: ['USER', 'ADMIN', 'STAFF'] },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            // Product schemas
            Product: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    shortDescription: { type: 'string' },
                    price: { type: 'number' },
                    comparePrice: { type: 'number', nullable: true },
                    images: { type: 'array', items: { type: 'string' } },
                    stockQuantity: { type: 'integer' },
                    preorderStatus: { type: 'string', enum: ['NONE', 'PREORDER', 'ORDER'] },
                    featured: { type: 'boolean' },
                    isActive: { type: 'boolean' },
                    category: { $ref: '#/components/schemas/Category' },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            // Category schema
            Category: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    image: { type: 'string' },
                },
            },
            // Order schemas
            Order: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    orderCode: { type: 'string' },
                    status: {
                        type: 'string',
                        enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED']
                    },
                    totalAmount: { type: 'number' },
                    shippingFee: { type: 'number' },
                    paymentMethod: { type: 'string', enum: ['COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER'] },
                    paymentStatus: { type: 'string', enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] },
                    items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            OrderItem: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    productId: { type: 'string', format: 'uuid' },
                    productName: { type: 'string' },
                    quantity: { type: 'integer' },
                    price: { type: 'number' },
                },
            },
            // Cart schema
            CartItem: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    productId: { type: 'string', format: 'uuid' },
                    quantity: { type: 'integer' },
                    product: { $ref: '#/components/schemas/Product' },
                },
            },
            // Shipping schema
            ShippingOption: {
                type: 'object',
                properties: {
                    serviceId: { type: 'integer' },
                    serviceName: { type: 'string' },
                    fee: { type: 'number' },
                    estimatedDays: { type: 'string' },
                },
            },
        },
        responses: {
            UnauthorizedError: {
                description: 'Chưa xác thực hoặc token hết hạn',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ApiError' },
                    },
                },
            },
            ForbiddenError: {
                description: 'Không có quyền truy cập',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ApiError' },
                    },
                },
            },
            NotFoundError: {
                description: 'Không tìm thấy tài nguyên',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ApiError' },
                    },
                },
            },
            RateLimitError: {
                description: 'Quá nhiều yêu cầu',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ApiError' },
                    },
                },
                headers: {
                    'Retry-After': {
                        schema: { type: 'integer' },
                        description: 'Số giây cần chờ trước khi thử lại',
                    },
                },
            },
        },
    },
    paths: {
        // ============================================
        // AUTH ENDPOINTS
        // ============================================
        '/api/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Đăng ký tài khoản mới',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password', 'fullName'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', minLength: 8 },
                                    fullName: { type: 'string' },
                                    phone: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Đăng ký thành công',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user: { $ref: '#/components/schemas/User' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': { $ref: '#/components/responses/NotFoundError' },
                    '429': { $ref: '#/components/responses/RateLimitError' },
                },
            },
        },
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Đăng nhập',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Đăng nhập thành công',
                        headers: {
                            'Set-Cookie': {
                                schema: { type: 'string' },
                                description: 'JWT token cookie',
                            },
                        },
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user: { $ref: '#/components/schemas/User' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '401': { $ref: '#/components/responses/UnauthorizedError' },
                    '429': { $ref: '#/components/responses/RateLimitError' },
                },
            },
        },
        '/api/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Đăng xuất',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': {
                        description: 'Đăng xuất thành công',
                    },
                },
            },
        },
        '/api/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Lấy thông tin user hiện tại',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': {
                        description: 'Thông tin user',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: { $ref: '#/components/schemas/User' },
                                    },
                                },
                            },
                        },
                    },
                    '401': { $ref: '#/components/responses/UnauthorizedError' },
                },
            },
        },
        // ============================================
        // PRODUCTS ENDPOINTS
        // ============================================
        '/api/products': {
            get: {
                tags: ['Products'],
                summary: 'Lấy danh sách sản phẩm',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 48 } },
                    { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category slug' },
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                    {
                        name: 'sort',
                        in: 'query',
                        schema: {
                            type: 'string',
                            enum: ['newest', 'oldest', 'price-asc', 'price-desc', 'name-asc', 'name-desc'],
                            default: 'newest'
                        }
                    },
                    { name: 'featured', in: 'query', schema: { type: 'boolean' } },
                    { name: 'inStock', in: 'query', schema: { type: 'boolean' } },
                    { name: 'preorder', in: 'query', schema: { type: 'boolean' } },
                    { name: 'onSale', in: 'query', schema: { type: 'boolean' } },
                    { name: 'minPrice', in: 'query', schema: { type: 'number' } },
                    { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
                ],
                responses: {
                    '200': {
                        description: 'Danh sách sản phẩm',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Product' },
                                        },
                                        pagination: { $ref: '#/components/schemas/Pagination' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/products/{slug}': {
            get: {
                tags: ['Products'],
                summary: 'Lấy chi tiết sản phẩm',
                parameters: [
                    { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    '200': {
                        description: 'Chi tiết sản phẩm',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: { $ref: '#/components/schemas/Product' },
                                    },
                                },
                            },
                        },
                    },
                    '404': { $ref: '#/components/responses/NotFoundError' },
                },
            },
        },
        // ============================================
        // CATEGORIES ENDPOINTS
        // ============================================
        '/api/categories': {
            get: {
                tags: ['Categories'],
                summary: 'Lấy danh sách danh mục',
                responses: {
                    '200': {
                        description: 'Danh sách danh mục',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Category' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        // ============================================
        // CART ENDPOINTS
        // ============================================
        '/api/cart': {
            get: {
                tags: ['Cart'],
                summary: 'Lấy giỏ hàng',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': {
                        description: 'Giỏ hàng',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/CartItem' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '401': { $ref: '#/components/responses/UnauthorizedError' },
                },
            },
            post: {
                tags: ['Cart'],
                summary: 'Thêm sản phẩm vào giỏ',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['productId', 'quantity'],
                                properties: {
                                    productId: { type: 'string', format: 'uuid' },
                                    quantity: { type: 'integer', minimum: 1 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Thêm thành công',
                    },
                    '401': { $ref: '#/components/responses/UnauthorizedError' },
                },
            },
        },
        // ============================================
        // ORDERS ENDPOINTS
        // ============================================
        '/api/orders': {
            get: {
                tags: ['Orders'],
                summary: 'Lấy danh sách đơn hàng của user',
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                ],
                responses: {
                    '200': {
                        description: 'Danh sách đơn hàng',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Order' },
                                        },
                                        pagination: { $ref: '#/components/schemas/Pagination' },
                                    },
                                },
                            },
                        },
                    },
                    '401': { $ref: '#/components/responses/UnauthorizedError' },
                },
            },
            post: {
                tags: ['Orders'],
                summary: 'Tạo đơn hàng mới',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['addressId', 'paymentMethod'],
                                properties: {
                                    addressId: { type: 'string', format: 'uuid' },
                                    paymentMethod: { type: 'string', enum: ['COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER'] },
                                    couponCode: { type: 'string' },
                                    note: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Đơn hàng đã tạo',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: { $ref: '#/components/schemas/Order' },
                                    },
                                },
                            },
                        },
                    },
                    '400': { $ref: '#/components/responses/NotFoundError' },
                    '401': { $ref: '#/components/responses/UnauthorizedError' },
                },
            },
        },
        // ============================================
        // SHIPPING ENDPOINTS
        // ============================================
        '/api/shipping/calculate': {
            post: {
                tags: ['Shipping'],
                summary: 'Tính phí vận chuyển',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['toDistrictId', 'toWardCode'],
                                properties: {
                                    toDistrictId: { type: 'integer', description: 'Mã quận/huyện GHN' },
                                    toWardCode: { type: 'string', description: 'Mã phường/xã GHN' },
                                    weight: { type: 'integer', default: 500, description: 'Trọng lượng (gram)' },
                                    length: { type: 'integer', default: 20 },
                                    width: { type: 'integer', default: 20 },
                                    height: { type: 'integer', default: 10 },
                                    insuranceValue: { type: 'number', default: 0 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Các option vận chuyển',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/ShippingOption' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        // ============================================
        // REVIEWS ENDPOINTS
        // ============================================
        '/api/reviews': {
            post: {
                tags: ['Reviews'],
                summary: 'Tạo đánh giá sản phẩm',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['productId', 'rating'],
                                properties: {
                                    productId: { type: 'string', format: 'uuid' },
                                    rating: { type: 'integer', minimum: 1, maximum: 5 },
                                    comment: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Đánh giá đã tạo' },
                    '401': { $ref: '#/components/responses/UnauthorizedError' },
                },
            },
        },
        '/api/reviews/product/{productId}': {
            get: {
                tags: ['Reviews'],
                summary: 'Lấy đánh giá của sản phẩm',
                parameters: [
                    { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                ],
                responses: {
                    '200': {
                        description: 'Danh sách đánh giá',
                    },
                },
            },
        },
        // ============================================
        // HEALTH CHECK
        // ============================================
        '/api/health': {
            get: {
                tags: ['System'],
                summary: 'Health check',
                responses: {
                    '200': {
                        description: 'Server is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'ok' },
                                        timestamp: { type: 'string', format: 'date-time' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export function getSwaggerSpec() {
    return swaggerConfig;
}
