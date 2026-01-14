# Clean Start Script for OtakuShop Dev Server (PowerShell)
# This script clears cache and restarts the dev server cleanly

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OtakuShop - Clean Dev Server Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill existing process on port 3000
Write-Host "[1/4] Killing process on port 3000..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Process killed" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "  ✓ No process found on port 3000" -ForegroundColor Green
}

# Clear Next.js cache
Write-Host "[2/4] Clearing .next cache..." -ForegroundColor Yellow
@(".next", ".turbopack", "node_modules\.next") | ForEach-Object {
    if (Test-Path $_) {
        Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Removed $_" -ForegroundColor Green
    }
}

# Clear Prisma cache
Write-Host "[3/4] Clearing Prisma cache..." -ForegroundColor Yellow
if (Test-Path "prisma\.prisma") {
    Remove-Item "prisma\.prisma" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed Prisma cache" -ForegroundColor Green
}

# Start dev server
Write-Host "[4/4] Starting dev server..." -ForegroundColor Yellow
Write-Host ""
Start-Sleep -Seconds 1
npm run dev
