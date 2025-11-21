import jwt from 'jsonwebtoken'

// Require JWT_SECRET from environment - fail fast if not set
const JWT_SECRET: string = process.env.JWT_SECRET as string
if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
  throw new Error(
    'JWT_SECRET environment variable is required and must be a strong secret. ' +
    'Generate one with: openssl rand -base64 32'
  )
}

const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

export interface JwtPayload {
  userId: number
  email: string
  username: string
  role?: 'admin' | 'user'
}

export const generateToken = (payload: JwtPayload): string => {
  // @ts-expect-error - jwt.sign has complex overloads
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    if (!decoded) {
      throw new Error('Invalid token payload')
    }
    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    throw error
  }
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload
  } catch (error) {
    console.error('JWT decode failed:', error)
    return null
  }
}
