'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

interface User {
  id: string | number
  email: string
  username: string
  fullName?: string
  phone?: string | null
  role?: 'admin' | 'user'
  avatar?: string | null
}

interface LoginResult {
  success: boolean
  isAdmin?: boolean
  error?: string
}

interface RegisterResult {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<LoginResult>
  register: (email: string, fullName: string, password: string, phone?: string) => Promise<RegisterResult>
  logout: () => void
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth()
    // Generate CSRF token if not exists
    initializeCSRF()
  }, [])

  const initializeCSRF = async () => {
    try {
      const existingToken = Cookies.get('csrf-token')
      if (!existingToken) {
        await fetch('/api/csrf')
      }
    } catch (error) {
      console.error('CSRF initialization failed:', error)
    }
  }

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token')
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          const userData = data.user
          setUser({
            id: userData.id,
            email: userData.email,
            username: userData.username || userData.fullName,
            fullName: userData.fullName,
            phone: userData.phone,
            role: userData.role,
            avatar: userData.avatar
          })
        } else {
          Cookies.remove('token')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const csrfToken = Cookies.get('csrf-token') || ''

      // Try admin login first
      const adminResponse = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ email, password }),
      })

      if (adminResponse.ok) {
        const data = await adminResponse.json()
        const userData = data.user
        setUser({
          id: userData.id,
          email: userData.email,
          username: userData.username || userData.fullName,
          fullName: userData.fullName,
          role: 'admin'
        })
        Cookies.set('token', data.token, {
          expires: 7,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        })
        return { success: true, isAdmin: true }
      }

      // If admin login fails (not admin credentials), try regular user login
      const userResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ email, password }),
      })

      if (userResponse.ok) {
        const data = await userResponse.json()
        // API mới trả về data.data.user và data.data.token
        const userData = data.data?.user || data.user
        const token = data.data?.token || data.token

        setUser({
          id: userData.id,
          email: userData.email,
          username: userData.fullName,
          fullName: userData.fullName,
          phone: userData.phone,
          role: 'user'
        })
        Cookies.set('token', token, {
          expires: 7,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        })
        return { success: true, isAdmin: false }
      }

      // Both failed
      const errorData = await userResponse.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error || 'Email hoặc mật khẩu không đúng'
      }
    } catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        error: 'Không thể kết nối đến máy chủ'
      }
    }
  }

  const register = async (email: string, fullName: string, password: string, phone?: string): Promise<RegisterResult> => {
    try {
      const csrfToken = Cookies.get('csrf-token') || ''
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ email, fullName, password, phone: phone || '' }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // API mới không trả về token sau khi register
        // User cần login sau khi register
        return { success: true }
      }

      return {
        success: false,
        error: data.error || 'Đăng ký thất bại'
      }
    } catch (error) {
      console.error('Registration failed:', error)
      return {
        success: false,
        error: 'Không thể kết nối đến máy chủ'
      }
    }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('token')
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
