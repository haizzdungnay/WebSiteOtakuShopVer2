import { NextResponse } from 'next/server'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('token', '', { ...COOKIE_OPTIONS, maxAge: 0 })
  response.cookies.set('refresh_token', '', { ...COOKIE_OPTIONS, maxAge: 0 })
  return response
}
