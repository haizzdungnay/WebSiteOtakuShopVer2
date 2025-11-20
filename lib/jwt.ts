import jwt from 'jsonwebtoken'

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
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
