import { NextResponse } from 'next/server'

// This is a temporary debug endpoint - remove in production
export async function GET() {
  const adminUsername = process.env.ADMIN_USERNAME || 'NOT_SET'
  const adminPassword = process.env.ADMIN_PASSWORD || 'NOT_SET'
  const adminDisplayName = process.env.ADMIN_DISPLAY_NAME || 'NOT_SET'

  return NextResponse.json({
    message: 'Admin configuration debug info',
    config: {
      ADMIN_USERNAME: adminUsername,
      ADMIN_PASSWORD_SET: adminPassword !== 'NOT_SET' ? 'YES (length: ' + adminPassword.length + ')' : 'NO',
      ADMIN_DISPLAY_NAME: adminDisplayName,
      NODE_ENV: process.env.NODE_ENV,
    },
    note: 'IMPORTANT: Remove this debug endpoint before deploying to production!'
  })
}
