import React, { useState, useEffect, useCallback } from 'react'

export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
})

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthContext provider')
  }
  return context
}

export function AuthProvider({ children, onAuthChange }: {
  children: React.ReactNode
  onAuthChange?: (state: { user: User | null; token: string | null; isLoading: boolean }) => void
}) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('authUser')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const applyAuth = useCallback((newUser: User, newToken: string) => {
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('authUser', JSON.stringify(newUser))
    setUser(newUser)
    setToken(newToken)
    onAuthChange?.({ user: newUser, token: newToken, isLoading: false })
  }, [onAuthChange])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')
    applyAuth(data.user, data.token)
  }, [applyAuth])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Signup failed')
    applyAuth(data.user, data.token)
  }, [applyAuth])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setUser(null)
    setToken(null)
    onAuthChange?.({ user: null, token: null, isLoading: false })
  }, [onAuthChange])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
