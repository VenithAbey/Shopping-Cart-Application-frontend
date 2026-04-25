import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { auth, googleProvider, facebookProvider } from '@/lib/firebase'
import { signInWithPopup } from 'firebase/auth'

const API_URL = '/api'

export const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  loginWithFirebase: async () => {},
  signup: async () => {},
  logout: () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthContext provider')
  return context
}

export function AuthProvider({ children, onAuthChange }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
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

  const applyAuth = useCallback((newUser, newToken) => {
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('authUser', JSON.stringify(newUser))
    setUser(newUser)
    setToken(newToken)
    onAuthChange?.({ user: newUser, token: newToken, isLoading: false })
  }, [onAuthChange])

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')
    applyAuth(data.user, data.token)
  }, [applyAuth])

  const loginWithFirebase = useCallback(async (provider) => {
    try {
      const authProvider = provider === 'google' ? googleProvider : facebookProvider
      const result = await signInWithPopup(auth, authProvider)
      const firebaseToken = await result.user.getIdToken()
      const res = await fetch(`${API_URL}/auth/firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: firebaseToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Firebase Backend sync failed')
      applyAuth(data.user, data.token)
    } catch (e) {
      console.error(e)
      throw new Error(e.message || 'Third-party login failed')
    }
  }, [applyAuth])

  const signup = useCallback(async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
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
    <AuthContext.Provider value={{ user, token, isLoading, login, loginWithFirebase, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
