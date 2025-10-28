# 🛠️ Development Guide - Otaku Shop

Best practices và hướng dẫn phát triển cho dự án Otaku Shop.

## 📁 Project Structure

```
WebSiteOtakuShopVer2/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── login/           # POST /api/auth/login
│   │   │   ├── register/        # POST /api/auth/register
│   │   │   ├── logout/          # POST /api/auth/logout
│   │   │   └── me/              # GET /api/auth/me
│   │   └── products/            # Product endpoints
│   │       ├── route.ts         # GET /api/products, POST /api/products
│   │       └── [id]/            # GET/PUT/DELETE /api/products/:id
│   ├── (pages)/                  # Frontend Pages
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   ├── products/            # Products listing
│   │   └── cart/                # Shopping cart
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global Tailwind styles
│
├── components/                   # Reusable React Components
│   ├── Header.tsx               # Navigation header
│   ├── Footer.tsx               # Footer component
│   ├── ProductCard.tsx          # Product display card
│   └── sections/                # Page sections
│       ├── HeroBanner.tsx       # Hero section with animations
│       ├── FlashSale.tsx        # Flash sale countdown
│       └── InfoBoxes.tsx        # Info boxes grid
│
├── contexts/                     # React Context
│   └── AuthContext.tsx          # Authentication state management
│
├── lib/                          # Utility Libraries
│   ├── db.ts                    # PostgreSQL connection & queries
│   ├── jwt.ts                   # JWT token utilities
│   ├── csrf.ts                  # CSRF protection
│   └── sanitize.ts              # XSS sanitization
│
├── types/                        # TypeScript Type Definitions
│   ├── product.ts               # Product interfaces
│   ├── user.ts                  # User interfaces
│   └── cart.ts                  # Cart interfaces
│
├── public/                       # Static Assets
│   ├── images/                  # Image files
│   └── php/                     # PHP legacy files
│
├── Configuration Files
│   ├── .env.local               # Environment variables (local)
│   ├── .env.example             # Environment template
│   ├── next.config.js           # Next.js configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── tailwind.config.ts       # Tailwind CSS config
│   ├── .eslintrc.json           # ESLint rules
│   ├── .prettierrc              # Prettier formatting
│   ├── docker-compose.yml       # Docker orchestration
│   ├── Dockerfile               # Next.js container
│   └── package.json             # Dependencies & scripts
```

---

## 🔧 Development Workflow

### 1. Setup Development Environment

```bash
# Clone repository
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2

# Install dependencies
npm install

# Start PostgreSQL
docker-compose up postgres -d

# Run development server
npm run dev
```

### 2. Before You Code

```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Check everything works
npm run validate
```

### 3. While Coding

```bash
# Run dev server with hot reload
npm run dev

# Run type checking in watch mode
npm run type-check -- --watch

# Format code on save (configure your IDE)
# Or manually: npm run format
```

### 4. Before Commit

```bash
# Run all checks
npm run validate

# Format all files
npm run format

# Fix linting issues
npm run lint:fix

# Test build
npm run build
```

### 5. Commit & Push

```bash
# Stage changes
git add .

# Commit with meaningful message
git commit -m "feat: add product filtering feature"

# Push to remote
git push origin feature/your-feature-name
```

---

## 📝 Coding Standards

### TypeScript

**✅ DO:**
```typescript
// Use explicit types
interface Product {
  id: string;
  name: string;
  price: number;
}

// Use type inference when obvious
const products = await getProducts(); // Type inferred

// Use async/await instead of promises
const data = await fetchData();

// Handle errors properly
try {
  const result = await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
}
```

**❌ DON'T:**
```typescript
// Avoid any
const data: any = getData(); // Bad

// Avoid implicit any
function process(data) { } // Bad

// Don't use var
var count = 0; // Use const or let
```

### React Components

**✅ DO:**
```typescript
// Functional components with TypeScript
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>
    </div>
  );
}

// Use hooks properly
const [count, setCount] = useState<number>(0);
const { user } = useAuth();

// Extract complex logic to custom hooks
const { products, loading, error } = useProducts();
```

**❌ DON'T:**
```typescript
// Don't use class components (prefer functional)
class ProductCard extends React.Component { } // Avoid

// Don't manipulate DOM directly
document.getElementById('product').innerHTML = 'Product'; // Bad

// Don't forget dependencies in useEffect
useEffect(() => {
  fetchData(productId); // Missing productId in deps
}, []); // Add [productId]
```

### API Routes

**✅ DO:**
```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { sanitizeInput } from '@/lib/sanitize';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = sanitizeInput(searchParams.get('category') || '');

    const products = await getProducts(category);

    return NextResponse.json({
      success: true,
      products
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Verify authentication
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Verify JWT
  const user = await verifyJWT(token);
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  }

  // Process request...
}
```

**Security Best Practices:**
```typescript
// Always sanitize user input
import { sanitizeInput } from '@/lib/sanitize';
const cleanInput = sanitizeInput(userInput);

// Use parameterized queries (NEVER string concatenation)
// ✅ Good
const result = await db.query(
  'SELECT * FROM products WHERE id = $1',
  [productId]
);

// ❌ Bad - SQL Injection vulnerability!
const result = await db.query(
  `SELECT * FROM products WHERE id = ${productId}`
);

// Always verify JWT tokens
const user = await verifyJWT(token);

// Use HTTPS in production
// Check NODE_ENV before sensitive operations
```

---

## 🎨 Styling Guidelines

### Tailwind CSS

**✅ DO:**
```tsx
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-2xl font-bold text-gray-800">Title</h2>
  <button className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600">
    Click Me
  </button>
</div>

// Use responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Extract repeated styles to components
<Button variant="primary" size="lg">Submit</Button>
```

**Theme Colors:**
```css
/* Primary colors (defined in globals.css) */
--primary: #FF6B9D (Pink)
--secondary: #FF8FAB (Light Pink)
--accent: #FF9966 (Orange)
--coral: #FFE5ED (Light Coral)
```

---

## 🗄️ Database Guidelines

### PostgreSQL Queries

**✅ DO:**
```typescript
// Use parameterized queries
const { rows } = await db.query(
  'SELECT * FROM products WHERE category = $1 AND price <= $2',
  [category, maxPrice]
);

// Use transactions for multiple operations
await db.query('BEGIN');
try {
  await db.query('INSERT INTO orders (user_id, total) VALUES ($1, $2)', [userId, total]);
  await db.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [productId]);
  await db.query('COMMIT');
} catch (error) {
  await db.query('ROLLBACK');
  throw error;
}

// Close connections properly
client.release();
```

### Schema Migrations

Khi thay đổi database schema, tạo migration file:

```sql
-- migrations/001_add_products_table.sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
```

---

## 🔒 Security Best Practices

### 1. Authentication

```typescript
// Always hash passwords
import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash(password, 10);

// Verify passwords
const isValid = await bcrypt.compare(password, hashedPassword);

// Use secure JWT secrets (minimum 32 characters)
JWT_SECRET=very-long-random-string-at-least-32-characters

// Set secure cookie options
cookies().set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60, // 7 days
});
```

### 2. Input Validation

```typescript
// Validate all user inputs
import { sanitizeInput } from '@/lib/sanitize';

const email = sanitizeInput(userEmail);
if (!isValidEmail(email)) {
  return { error: 'Invalid email format' };
}

// Validate numbers
const price = parseFloat(userPrice);
if (isNaN(price) || price < 0) {
  return { error: 'Invalid price' };
}
```

### 3. CSRF Protection

```typescript
// Generate CSRF token
import { generateCSRFToken, verifyCSRFToken } from '@/lib/csrf';

// In API route
const csrfToken = request.headers.get('x-csrf-token');
if (!verifyCSRFToken(csrfToken)) {
  return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
}
```

---

## 🧪 Testing

### Manual Testing

```bash
# Test API endpoints
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test with authentication
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Import `postman_collection.json`
2. Set environment variables
3. Run collection tests
4. Check all endpoints return expected responses

---

## 🚀 Performance Optimization

### 1. Next.js Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/images/product.jpg"
  alt="Product"
  width={300}
  height={300}
  priority // For above-the-fold images
/>

// Use dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR if not needed
});

// Use Server Components (default in App Router)
// Mark as Client Component only when needed
'use client';
```

### 2. Database Optimization

```typescript
// Use connection pooling (already configured in lib/db.ts)
// Add indexes to frequently queried columns
CREATE INDEX idx_products_category ON products(category);

// Use LIMIT for large queries
SELECT * FROM products LIMIT 20 OFFSET 0;

// Select only needed columns
SELECT id, name, price FROM products; // Not SELECT *
```

### 3. Caching

```typescript
// Cache API responses (Next.js 15)
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}
```

---

## 📊 Monitoring & Debugging

### Logs

```typescript
// Use structured logging
console.log('[API] Fetching products:', { category, limit });
console.error('[DB] Query failed:', error);
console.warn('[Auth] Invalid token attempt');

// Check Docker logs
npm run docker:logs
docker-compose logs -f nextjs
docker-compose logs -f postgres
```

### Debugging

```typescript
// Use debugger in development
debugger;

// Check environment
console.log('Environment:', process.env.NODE_ENV);

// Inspect request/response
console.log('Request headers:', request.headers);
console.log('Response body:', await response.json());
```

---

## 🔄 Git Workflow

### Branch Naming

```
feature/add-product-filtering
fix/login-redirect-issue
refactor/auth-context
docs/update-readme
```

### Commit Messages

```
feat: add product filtering by category
fix: resolve login redirect issue on Safari
refactor: simplify authentication context
docs: update API documentation
style: format code with Prettier
perf: optimize database queries
test: add unit tests for auth service
```

### Pull Request Process

1. Create feature branch
2. Make changes and commit
3. Push to remote
4. Create Pull Request
5. Request code review
6. Address feedback
7. Merge when approved

---

## 📚 Resources

### Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [VS Code](https://code.visualstudio.com/) - Recommended IDE
- [DBeaver](https://dbeaver.io/) - Database management

### Extensions (VS Code)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- PostgreSQL
- Docker

---

## 🆘 Getting Help

- 📖 Read [QUICK_START.md](QUICK_START.md) for setup
- 📖 Read [README.md](README.md) for project overview
- 🐛 Check [GitHub Issues](https://github.com/haizzdungnay/WebSiteOtakuShopVer2/issues)
- 💬 Ask team: Dương - Nguyên - Lâm

**Happy Developing! 🎌**
