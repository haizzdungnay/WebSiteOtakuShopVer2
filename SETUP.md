# Setup Guide - Otaku Shop

This guide will walk you through setting up and running the Otaku Shop application locally or with Docker.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Setup](#docker-setup)
4. [Database Initialization](#database-initialization)
5. [Testing the Application](#testing-the-application)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Docker** and **Docker Compose** (for containerized setup)
- **PostgreSQL** 15.x (for local non-Docker setup)
- **Git** for version control

### Check Prerequisites
```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
docker --version  # Should be 20.x or higher
docker-compose --version
```

## Local Development Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/haizzdungnay/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- PostgreSQL driver
- JWT libraries
- Tailwind CSS
- TypeScript

### Step 3: Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local  # or use your preferred editor
```

**Required Environment Variables:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=otakushop
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT Configuration (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 4: Set Up PostgreSQL Database

#### Option A: Using Docker for PostgreSQL Only
```bash
docker-compose up postgres -d
```

#### Option B: Using Local PostgreSQL
If you have PostgreSQL installed locally:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE otakushop;

# Exit psql
\q

# Initialize database schema
psql -U postgres -d otakushop -f init.sql
```

### Step 5: Run Development Server
```bash
npm run dev
```

The application will be available at:
- **Main App**: http://localhost:3000
- **Login Page**: http://localhost:3000/login
- **Register Page**: http://localhost:3000/register
- **Products Page**: http://localhost:3000/products
- **API**: http://localhost:3000/api

## Docker Setup

Docker provides the easiest way to run the entire application stack with all dependencies.

### Step 1: Ensure Docker is Running
```bash
docker ps
```

### Step 2: Build Docker Images
```bash
npm run docker:build
```

This builds:
- Next.js application container
- PHP legacy page container
- Uses official PostgreSQL container

### Step 3: Start All Services
```bash
npm run docker:up
```

This starts:
- PostgreSQL database on port 5432
- Next.js app on port 3000
- PHP legacy server on port 8080

### Step 4: Verify Services
```bash
docker-compose ps
```

You should see:
```
NAME                IMAGE              STATUS
otakushop-db        postgres:15-alpine Up
otakushop-app       websiteotakushop   Up
otakushop-php       websiteotakushop-php Up
```

### Step 5: View Logs
```bash
# View all logs
npm run docker:logs

# View specific service logs
docker-compose logs -f nextjs
docker-compose logs -f postgres
docker-compose logs -f php
```

### Step 6: Access the Application
- **Next.js App**: http://localhost:3000
- **PHP Legacy**: http://localhost:8080
- **PostgreSQL**: localhost:5432

### Stop Services
```bash
npm run docker:down
```

## Database Initialization

The database is automatically initialized with the schema and sample data when PostgreSQL container starts for the first time.

### Manual Database Initialization

If you need to reinitialize the database:

```bash
# Connect to the database container
docker exec -it otakushop-db psql -U postgres -d otakushop

# Or connect locally
psql -U postgres -d otakushop -f init.sql
```

### Database Schema

The database includes:
- **users** table: User authentication
- **products** table: Product catalog
- Sample data with 8 pre-loaded products

## Testing the Application

### 1. Test with Postman

**Import Collection:**
1. Open Postman
2. Import `postman_collection.json`
3. Set variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (will be set after login)

**Test Flow:**
1. Register a new user
2. Login with credentials
3. Copy the token from response
4. Set token in Postman environment
5. Test protected endpoints

### 2. Manual Browser Testing

**Test Authentication:**
1. Navigate to http://localhost:3000
2. Click "Register"
3. Fill in registration form
4. You should be redirected to home page
5. Click "Logout"
6. Click "Login"
7. Enter credentials
8. Verify successful login

**Test Products:**
1. Navigate to http://localhost:3000/products
2. Verify products are displayed
3. Check sample products load correctly

**Test PHP Legacy:**
1. Navigate to http://localhost:8080 (or http://localhost:3000/php/legacy.php)
2. Verify PHP page displays correctly
3. Check sample products in PHP page

### 3. Test API Endpoints

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

**Login User:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Products:**
```bash
curl http://localhost:3000/api/products
```

**Create Product (requires authentication):**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "New Anime Product",
    "description": "Amazing merchandise",
    "price": 29.99,
    "category": "Manga"
  }'
```

## Troubleshooting

### Port Already in Use

If port 3000 or 5432 is already in use:

**Option 1: Stop conflicting services**
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Find process using port 5432
lsof -ti:5432 | xargs kill -9
```

**Option 2: Change ports in docker-compose.yml**
```yaml
services:
  nextjs:
    ports:
      - "3001:3000"  # Change to different port
  postgres:
    ports:
      - "5433:5432"  # Change to different port
```

### Database Connection Error

**Check PostgreSQL is running:**
```bash
docker-compose ps postgres
```

**Check database credentials:**
Ensure `.env.local` has correct credentials matching docker-compose.yml

**Reset database:**
```bash
docker-compose down -v
docker-compose up postgres -d
```

### Build Errors

**Clear build cache:**
```bash
rm -rf .next
npm run build
```

**Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

**Reset Docker containers:**
```bash
docker-compose down -v
docker system prune -a
npm run docker:build
npm run docker:up
```

**Check Docker logs:**
```bash
docker-compose logs
```

### JWT Token Issues

If getting "Invalid token" errors:
1. Clear browser cookies
2. Logout and login again
3. Check JWT_SECRET is set correctly
4. Verify token hasn't expired

### TypeScript Errors

**Run type check:**
```bash
npx tsc --noEmit
```

**Fix common issues:**
```bash
npm install @types/node @types/react @types/react-dom -D
```

## Production Deployment

### Before Deploying to Production:

1. **Change all secrets:**
   - Generate strong JWT_SECRET (minimum 32 characters)
   - Use strong database passwords
   - Update all default credentials

2. **Enable HTTPS:**
   - Set up SSL certificates
   - Configure reverse proxy (nginx/Apache)
   - Update CORS settings

3. **Environment variables:**
   ```bash
   NODE_ENV=production
   JWT_SECRET=very-strong-random-secret-key
   DB_PASSWORD=very-strong-database-password
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

5. **Use Docker for production:**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

## Next Steps

- Read [SECURITY.md](SECURITY.md) for security best practices
- Check [DOCUMENTATION.md](DOCUMENTATION.md) for detailed API documentation
- Review [README.md](README.md) for project overview
- Explore the codebase and customize for your needs

## Support

For issues or questions:
1. Check this setup guide
2. Review troubleshooting section
3. Check GitHub issues
4. Create a new issue with detailed information

---

**Happy coding! 🎌**
