import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, AuthContextType } from '../types'
import { api } from '../utils/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('eroots-token')
    if (token) {
      // Verify token with backend
      verifyToken()
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/verify')
      setUser(response.data.data.user)
    } catch (error) {
      localStorage.removeItem('eroots-token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })

      const { token, user: userData } = response.data.data

      localStorage.setItem('eroots-token', token)
      setUser(userData)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('eroots-token')
    setUser(null)
  }

  const loginWithGoogle = () => {
    // Redirect to Google OAuth
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`
  }

  const handleGoogleCallback = async (token: string) => {
    try {
      // Store token first
      localStorage.setItem('eroots-token', token)

      // Wait a bit to ensure localStorage is updated
      await new Promise(resolve => setTimeout(resolve, 100))

      // Get user profile with explicit token
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(response.data.data.user)
    } catch (error) {
      localStorage.removeItem('eroots-token')
      throw new Error('Authentication failed')
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    loginWithGoogle,
    handleGoogleCallback,
    isLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
