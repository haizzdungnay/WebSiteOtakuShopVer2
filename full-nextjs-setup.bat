@echo off
setlocal enabledelayedexpansion

REM ==================================================
REM   FULL NEXT.JS CONVERSION - WINDOWS SETUP
REM   Figure Store - Modern Stack
REM ==================================================

color 0A
cls

echo.
echo ========================================
echo   FULL NEXT.JS SETUP - WINDOWS
echo   Figure Store Conversion
echo ========================================
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Please run this script from WebSiteOtakuShopVer2 directory
    pause
    exit /b 1
)

echo [OK] Found package.json
echo.

REM Step 1: Install Dependencies
echo ========================================
echo Step 1/10: Installing dependencies...
echo ========================================
echo.

echo Installing Tailwind CSS...
call npm install -D tailwindcss postcss autoprefixer

echo Installing Lucide React icons...
call npm install lucide-react

echo Installing utilities...
call npm install clsx tailwind-merge

echo.
echo [OK] Dependencies installed
echo.

REM Step 2: Initialize Tailwind
echo ========================================
echo Step 2/10: Initializing Tailwind CSS...
echo ========================================
echo.

if not exist "tailwind.config.ts" (
    call npx tailwindcss init -p --ts
)

echo [OK] Tailwind initialized
echo.

REM Step 3: Create Directory Structure
echo ========================================
echo Step 3/10: Creating directories...
echo ========================================
echo.

mkdir components 2>nul
mkdir components\sections 2>nul
mkdir hooks 2>nul
mkdir types 2>nul
mkdir public\images 2>nul
mkdir public\images\products 2>nul
mkdir public\images\characters 2>nul
mkdir public\images\news 2>nul
mkdir public\images\payment 2>nul
mkdir public\images\cskh 2>nul
mkdir public\images\banners 2>nul

echo [OK] Directories created
echo.

REM Step 4: Backup Existing Files
echo ========================================
echo Step 4/10: Backing up files...
echo ========================================
echo.

for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set backup_dir=backup_%mydate%_%mytime%

mkdir %backup_dir% 2>nul

if exist "tailwind.config.ts" copy "tailwind.config.ts" "%backup_dir%\" >nul
if exist "app\globals.css" copy "app\globals.css" "%backup_dir%\" >nul
if exist "app\layout.tsx" copy "app\layout.tsx" "%backup_dir%\" >nul
if exist "app\page.tsx" copy "app\page.tsx" "%backup_dir%\" >nul

echo [OK] Backups saved to: %backup_dir%
echo.

REM Step 5: Create Tailwind Config
echo ========================================
echo Step 5/10: Creating Tailwind config...
echo ========================================
echo.

(
echo import type { Config } from 'tailwindcss'
echo.
echo const config: Config = {
echo   content: [
echo     './pages/**/*.{js,ts,jsx,tsx,mdx}',
echo     './components/**/*.{js,ts,jsx,tsx,mdx}',
echo     './app/**/*.{js,ts,jsx,tsx,mdx}',
echo   ],
echo   theme: {
echo     extend: {
echo       colors: {
echo         primary: {
echo           DEFAULT: '#FF6B9D',
echo           light: '#FF8FAB',
echo           dark: '#FF4578',
echo           50: '#FFE5ED',
echo           100: '#FFB6C1',
echo         },
echo         accent: {
echo           orange: '#FF9966',
echo           pink: '#FFB6C1',
echo           coral: '#FFE5ED',
echo         },
echo         text: {
echo           dark: '#2C2C2C',
echo         },
echo       },
echo       container: {
echo         center: true,
echo         padding: {
echo           DEFAULT: '1rem',
echo           sm: '1rem',
echo           lg: '1.5rem',
echo           xl: '2rem',
echo         },
echo       },
echo     },
echo   },
echo   plugins: [],
echo }
echo export default config
) > tailwind.config.ts

echo [OK] Tailwind config created
echo.

REM Step 6: Create globals.css
echo ========================================
echo Step 6/10: Creating globals.css...
echo ========================================
echo.

(
echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
echo.
echo @layer components {
echo   .btn-primary {
echo     @apply bg-primary text-white px-6 py-3 rounded-full font-semibold 
echo            hover:bg-primary-light transition-all duration-300 
echo            active:scale-95 shadow-md hover:shadow-lg;
echo   }
echo.
echo   .btn-secondary {
echo     @apply border-2 border-primary text-primary px-6 py-3 rounded-full 
echo            font-semibold hover:bg-primary hover:text-white 
echo            transition-all duration-300;
echo   }
echo.
echo   .product-card {
echo     @apply bg-white rounded-2xl overflow-hidden shadow-md 
echo            hover:shadow-xl hover:-translate-y-2 transition-all duration-300 
echo            cursor-pointer;
echo   }
echo.
echo   .container-custom {
echo     @apply container mx-auto px-4 max-w-[1400px];
echo   }
echo }
echo.
echo ::-webkit-scrollbar {
echo   width: 8px;
echo   height: 8px;
echo }
echo.
echo ::-webkit-scrollbar-track {
echo   background: #f1f1f1;
echo }
echo.
echo ::-webkit-scrollbar-thumb {
echo   background: #FF6B9D;
echo   border-radius: 4px;
echo }
echo.
echo ::-webkit-scrollbar-thumb:hover {
echo   background: #FF8FAB;
echo }
) > app\globals.css

echo [OK] globals.css created
echo.

REM Step 7: Create Types
echo ========================================
echo Step 7/10: Creating TypeScript types...
echo ========================================
echo.

(
echo export interface Product {
echo   id: string
echo   name: string
echo   slug: string
echo   description?: string
echo   price: number
echo   discountPrice?: number
echo   image: string
echo   images?: string[]
echo   category: string
echo   stock: number
echo   badge?: {
echo     text: string
echo     type: 'sale' ^| 'hot' ^| 'preorder' ^| 'new'
echo   }
echo }
echo.
echo export interface Category {
echo   id: string
echo   name: string
echo   slug: string
echo   image?: string
echo }
) > types\product.ts

echo [OK] Types created
echo.

REM Step 8: Create README files
echo ========================================
echo Step 8/10: Creating documentation...
echo ========================================
echo.

(
echo # Components Directory
echo.
echo Place your React components here.
echo.
echo ## Structure:
echo - components/          - Reusable components
echo - components/sections/ - Page section components
) > components\README.md

(
echo # Images Directory
echo.
echo Add your product images here.
echo.
echo ## Structure:
echo - products/    - Product images
echo - characters/  - Character category images
echo - news/        - News/blog images
echo - payment/     - Payment method logos
echo - cskh/        - Customer service images
echo - banners/     - Banner images
echo.
echo ## Recommended sizes:
echo - Products: 800x1000px ^(4:5 ratio^)
echo - Characters: 400x400px ^(square^)
echo - Banners: 1920x600px
) > public\images\README.md

echo [OK] Documentation created
echo.

REM Step 9: Create Basic Layout
echo ========================================
echo Step 9/10: Creating layout...
echo ========================================
echo.

(
echo import type { Metadata } from 'next'
echo import { Inter } from 'next/font/google'
echo import './globals.css'
echo.
echo const inter = Inter^({ subsets: ['latin', 'vietnamese'] }^)
echo.
echo export const metadata: Metadata = {
echo   title: 'Figure Store - Anime ^& Manga Collectibles',
echo   description: 'Shop for authentic anime figures',
echo }
echo.
echo export default function RootLayout^({
echo   children,
echo }: {
echo   children: React.ReactNode
echo }^) {
echo   return ^(
echo     ^<html lang="vi"^>
echo       ^<body className={inter.className}^>
echo         {children}
echo       ^</body^>
echo     ^</html^>
echo   ^)
echo }
) > app\layout.tsx

echo [OK] Layout created
echo.

REM Step 10: Create Homepage
echo ========================================
echo Step 10/10: Creating homepage...
echo ========================================
echo.

(
echo export default function Home^(^) {
echo   return ^(
echo     ^<main className="min-h-screen"^>
echo       ^<section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20"^>
echo         ^<div className="container mx-auto px-4 text-center"^>
echo           ^<div className="flex justify-center gap-2 mb-6"^>
echo             {[...Array^(9^)].map^(^(_, i^) =^> ^(
echo               ^<span 
echo                 key={i} 
echo                 className="w-3 h-3 bg-primary rounded-full animate-pulse"
echo               /^>
echo             ^)^)}
echo           ^</div^>
echo           
echo           ^<h1 className="text-6xl md:text-8xl font-bold text-[#8B4C6B] mb-8"^>
echo             JOIN US
echo           ^</h1^>
echo           
echo           ^<p className="text-xl text-gray-600 mb-4"^>
echo             Figure Store - Anime ^& Manga Collectibles
echo           ^</p^>
echo           
echo           ^<p className="text-sm text-gray-500"^>
echo             Setup complete! Now add your components.
echo           ^</p^>
echo         ^</div^>
echo       ^</section^>
echo     ^</main^>
echo   ^)
echo }
) > app\page.tsx

echo [OK] Homepage created
echo.

REM Summary
echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo [OK] What was created:
echo   - tailwind.config.ts
echo   - app\globals.css
echo   - app\layout.tsx
echo   - app\page.tsx
echo   - types\product.ts
echo   - components\ directory
echo   - hooks\ directory
echo   - public\images\ directory
echo.
echo [BACKUP] Saved to: %backup_dir%
echo.
echo [NEXT STEPS]
echo   1. Copy component files from downloaded package
echo   2. Add images to public\images\
echo   3. Run: npm run dev
echo   4. Open: http://localhost:3000
echo.
echo [DOCS]
echo   - FULL-NEXTJS-QUICK-START.md
echo   - FULL-NEXTJS-GUIDE-PART1.md
echo   - FULL-NEXTJS-GUIDE-PART2.md
echo.
echo Press any key to exit...
pause >nul
