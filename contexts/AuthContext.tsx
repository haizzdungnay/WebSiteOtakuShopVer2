'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

interface User {
  id: number
  email: string
  username: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth()
  }, [])

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
          setUser(data.user)
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const csrfToken = Cookies.get('csrf-token') || ''
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        Cookies.set('token', data.token, { 
          expires: 7,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      const csrfToken = Cookies.get('csrf-token') || ''
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ email, username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        Cookies.set('token', data.token, { 
          expires: 7,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('token')
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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
