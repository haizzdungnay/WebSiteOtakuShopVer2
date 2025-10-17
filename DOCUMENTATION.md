# Otaku Shop - Full Documentation

## 📚 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [API Documentation](#api-documentation)
5. [Security Features](#security-features)
6. [Testing](#testing)
7. [Deployment](#deployment)

## 🎯 Overview

Otaku Shop is a full-stack web application built with modern technologies for selling anime and manga products. It features JWT authentication, CSRF/XSS protection, PostgreSQL backend, Next.js frontend with Context API for state management, PHP legacy page integration, and complete Docker setup.

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **Authentication**: JWT, bcryptjs
- **Security**: CSRF tokens, XSS protection, Security headers
- **State Management**: React Context API
- **Containerization**: Docker, Docker Compose
- **Legacy Integration**: PHP 8.2

## 🏗️ Architecture

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── products/      # Products endpoints
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── products/          # Products listing page
│   └── layout.tsx         # Root layout with AuthProvider
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility libraries
│   ├── db.ts             # Database connection
│   ├── jwt.ts            # JWT utilities
│   ├── csrf.ts           # CSRF protection
│   └── sanitize.ts       # XSS protection
├── public/                # Static files
│   └── php/              # PHP legacy pages
├── Dockerfile            # Next.js container
├── Dockerfile.php        # PHP container
├── docker-compose.yml    # Docker orchestration
└── init.sql              # Database initialization
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL 15+ (if running locally)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start PostgreSQL** (using Docker)
```bash
docker-compose up postgres -d
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Docker Setup

1. **Build and start all services**
```bash
npm run docker:build
npm run docker:up
```

2. **View logs**
```bash
npm run docker:logs
```

3. **Stop services**
```bash
npm run docker:down
```

Services will be available at:
- Next.js App: http://localhost:3000
- PHP Legacy: http://localhost:8080
- PostgreSQL: localhost:5432

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username"
  },
  "token": "jwt_token_here"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username"
  },
  "token": "jwt_token_here"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

Response:
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username"
  }
}
```

### Products Endpoints

#### Get All Products
```http
GET /api/products
```

Response:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "price": 29.99,
      "image_url": "https://...",
      "category": "Manga",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Product (Authenticated)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 29.99,
  "image_url": "https://...",
  "category": "Manga"
}
```

## 🔐 Security Features

### JWT Authentication
- Tokens expire after 7 days (configurable)
- Stored in httpOnly cookies
- Bearer token authentication for API requests

### CSRF Protection
- CSRF tokens generated for each session
- Validated on all state-changing requests
- Tokens stored in cookies and sent via headers

### XSS Protection
- All user inputs are sanitized
- HTML special characters are escaped
- Content Security Policy headers

### SQL Injection Prevention
- Parameterized queries throughout the application
- Input validation on all endpoints

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 🧪 Testing

### Manual Testing with Postman

1. Import the Postman collection: `postman_collection.json`
2. Set the `base_url` variable to `http://localhost:3000`
3. Run the authentication requests first
4. Copy the token from the response and set it in the `token` variable
5. Test other endpoints with authentication

### Testing Authentication Flow

1. **Register a new user**
   - Use the Register endpoint
   - Verify you receive a token

2. **Login with credentials**
   - Use the Login endpoint
   - Verify you receive a token

3. **Access protected endpoints**
   - Use the token in Authorization header
   - Test products creation

### Testing Security

1. **Test XSS Protection**
   - Try to register with `<script>alert('xss')</script>` as username
   - Verify it's sanitized

2. **Test SQL Injection**
   - Try `' OR '1'='1` as email in login
   - Verify it's handled safely

3. **Test Unauthorized Access**
   - Try to create a product without token
   - Verify you get 401 Unauthorized

## 🚢 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=otakushop
DB_USER=your-db-user
DB_PASSWORD=strong-password-here
JWT_SECRET=very-strong-random-secret-key
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### Docker Production Deployment

1. Update environment variables in docker-compose.yml
2. Build production images:
```bash
docker-compose build
```

3. Start services:
```bash
docker-compose up -d
```

4. Check service health:
```bash
docker-compose ps
```

### Best Practices for Production

1. **Security**
   - Change all default passwords
   - Use strong JWT secret
   - Enable HTTPS with SSL certificates
   - Configure firewall rules

2. **Performance**
   - Enable caching
   - Use CDN for static assets
   - Configure database connection pooling
   - Set up load balancing

3. **Monitoring**
   - Set up logging with ELK stack
   - Monitor with Prometheus/Grafana
   - Configure alerts for errors
   - Regular backup schedule

4. **Maintenance**
   - Regular security updates
   - Database backups
   - Monitor disk space
   - Review access logs

## 📝 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

- Dương
- Nguyên
- Lâm

## 📞 Support

For issues and questions, please use the GitHub issue tracker.
