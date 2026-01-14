# 🚀 OtakuShop - Clean Start Guide

## Problem
When restarting `npm run dev`, the server sometimes throws continuous logs and errors, making development frustrating.

## Solution

### Option 1: Clean Start Script (Recommended)
Use the provided clean start scripts to automatically clear cache and kill old processes:

**For Command Prompt (cmd):**
```bash
clean-start.bat
```

**For PowerShell:**
```powershell
.\clean-start.ps1
```

### Option 2: Manual Clean Start
If scripts don't work, manually run these commands:

```bash
# Kill port 3000 process
netstat -ano | findstr ":3000"
taskkill /PID <PID> /F

# Clear caches
rmdir /s /q .next
rmdir /s /q .turbopack
rmdir /s /q node_modules\.next

# Start clean
npm run dev
```

### Option 3: Use npm scripts
Add these to your `package.json` scripts:
```json
"dev:clean": "rmdir /s /q .next && npm run dev"
```

Then run:
```bash
npm run dev:clean
```

## Changes Made to Fix Logs

1. **`.env.local`** - Disabled Console Ninja extension to reduce log spam
2. **`clean-start.bat`** - Batch script for Windows Command Prompt
3. **`clean-start.ps1`** - PowerShell script for Windows PowerShell
4. **`.npmrc`** - Optimized npm configuration for better caching

## What Gets Cleaned?

- `.next/` - Next.js build cache
- `.turbopack/` - Turbo bundler cache  
- `node_modules\.next/` - Module cache
- `prisma\.prisma/` - Prisma cache
- Old process on port 3000 - Kills hanging Node process

## After First Use

The server should restart cleanly without continuous logs. If issues persist:

1. Check if database is running (`docker ps`)
2. Verify `.env.local` has correct `DATABASE_URL`
3. Restart Docker: `docker-compose restart`
4. Clear npm cache: `npm cache clean --force`

## Tips

✅ Always use `clean-start` script after stopping the server  
✅ Check database connection with `npm run db:push` first  
✅ Keep `.turbopack` in `.gitignore` to avoid git conflicts  
✅ Use `Ctrl+C` to properly stop the dev server (don't force-kill)

---

**Need help?** Check the main README.md for more information.
