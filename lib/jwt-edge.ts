import { SignJWT, jwtVerify } from 'jose'

// JWT configuration for Edge Runtime
const JWT_SECRET = process.env.JWT_SECRET as string
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.CI === 'true'

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET environment variable is required. ' +
    'Generate one with: openssl rand -base64 32'
  )
}

// Only enforce strong secrets in production/development
if (!isTestEnv && JWT_SECRET === 'your-secret-key-change-in-production') {
  throw new Error(
    'JWT_SECRET must be a strong secret. Default value not allowed. ' +
    'Generate one with: openssl rand -base64 32'
  )
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Convert secret to Uint8Array for jose
const secretKey = new TextEncoder().encode(JWT_SECRET)

export interface JwtPayload {
  userId: number
  email: string
  username: string
  role?: 'admin' | 'user'
}

/**
 * Generate JWT token using jose (Edge Runtime compatible)
 */
export async function generateTokenEdge(payload: JwtPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey)

  return token
}

/**
 * Verify JWT token using jose (Edge Runtime compatible)
 */
export async function verifyTokenEdge(token: string): Promise<JwtPayload> {
  try {
    const { payload } = await jwtVerify(token, secretKey)

    if (!payload) {
      throw new Error('Invalid token payload')
    }

    return payload as unknown as JwtPayload
  } catch (error) {
    console.error('JWT verification failed (Edge):', error)
    throw error
  }
}
