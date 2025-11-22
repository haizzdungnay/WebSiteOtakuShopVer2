import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/jwt'
import { verifyCSRFToken } from '@/lib/csrf'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@otakushop.local'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMeNow!'
const ADMIN_DISPLAY_NAME = process.env.ADMIN_DISPLAY_NAME || 'Quản trị viên'

export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token
    const csrfToken = request.headers.get('X-CSRF-Token')
    const storedCsrfToken = request.cookies.get('csrf-token')?.value

    console.log('[Admin Login] CSRF Check:', {
      hasHeader: !!csrfToken,
      hasCookie: !!storedCsrfToken,
      match: csrfToken === storedCsrfToken
    })

    if (!verifyCSRFToken(csrfToken || '', storedCsrfToken || '')) {
      console.log('[Admin Login] CSRF verification failed')
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    console.log('[Admin Login] Attempt:', {
      email: email,
      emailLength: email?.length,
      passwordLength: password?.length,
      expectedEmail: ADMIN_USERNAME,
      expectedPasswordLength: ADMIN_PASSWORD.length
    })

    if (!email || !password) {
      console.log('[Admin Login] Missing credentials')
      return NextResponse.json(
        { error: 'Email và mật khẩu quản trị là bắt buộc' },
        { status: 400 }
      )
    }

    const emailMatch = email.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase()
    const passwordMatch = password === ADMIN_PASSWORD

    console.log('[Admin Login] Credential check:', {
      emailMatch,
      passwordMatch,
      emailProvided: email.trim().toLowerCase(),
      emailExpected: ADMIN_USERNAME.trim().toLowerCase()
    })

    const isAuthorized = emailMatch && passwordMatch

    if (!isAuthorized) {
      console.log('[Admin Login] Authorization failed')
      return NextResponse.json(
        { error: 'Thông tin quản trị không chính xác' },
        { status: 401 }
      )
    }

    console.log('[Admin Login] Success!')

    const token = generateToken({
      userId: -1,
      email: ADMIN_USERNAME,
      username: ADMIN_DISPLAY_NAME,
      role: 'admin'
    })

    return NextResponse.json({
      message: 'Đăng nhập quản trị thành công',
      user: {
        id: -1,
        email: ADMIN_USERNAME,
        username: ADMIN_DISPLAY_NAME,
        role: 'admin'
      },
      token
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Không thể đăng nhập quản trị' },
      { status: 500 }
    )
  }
}
