@echo off
REM Clean Start Script for OtakuShop Dev Server
REM This script clears cache and restarts the dev server cleanly

echo.
echo ========================================
echo  OtakuShop - Clean Dev Server Start
echo ========================================
echo.

REM Kill existing process on port 3000
echo [1/4] Killing process on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    taskkill /PID %%a /F 2>nul
)
timeout /t 2 /nobreak >nul 2>&1

REM Clear Next.js cache
echo [2/4] Clearing .next cache...
if exist .next rmdir /s /q .next 2>nul
if exist .turbopack rmdir /s /q .turbopack 2>nul
if exist node_modules\.next rmdir /s /q node_modules\.next 2>nul

REM Clear Prisma cache
echo [3/4] Clearing Prisma cache...
if exist prisma\.prisma rmdir /s /q prisma\.prisma 2>nul

REM Start dev server
echo [4/4] Starting dev server...
echo.
timeout /t 1 /nobreak >nul 2>&1
npm run dev

pause
