'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'signup'>('login')

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPw, setShowLoginPw] = useState(false)

  // Signup state
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [showSignupPw, setShowSignupPw] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Login failed.'); return }
      if (data.user?.role !== 'admin') {
        setError('Access denied. This portal is restricted to administrators only.')
        return
      }
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminUser', JSON.stringify(data.user))
      router.push('/admin/dashboard')
    } catch {
      setError('Could not connect to the server. Ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
      const res = await fetch(`${apiUrl}/auth/admin-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Signup failed.'); return }
      setSuccess('Admin account created! You can now sign in.')
      setSignupName(''); setSignupEmail(''); setSignupPassword('')
      setTimeout(() => { setTab('login'); setSuccess('') }, 2000)
    } catch {
      setError('Could not connect to the server. Ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/20 mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ShopCart Admin</h1>
          <p className="text-slate-400 mt-2 text-sm">Restricted access — Administrators only</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">

          {/* Tab Switch */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => { setTab('login'); setError(''); setSuccess('') }}
              className={`flex-1 py-3.5 text-sm font-bold transition-colors ${tab === 'login' ? 'text-white bg-slate-700/50' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); setSuccess('') }}
              className={`flex-1 py-3.5 text-sm font-bold transition-colors ${tab === 'signup' ? 'text-white bg-slate-700/50' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Create Admin
            </button>
          </div>

          <div className="p-8">
            {/* Login Form */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required autoComplete="off"
                      className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type={showLoginPw ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required autoComplete="new-password"
                      className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors" />
                    <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200">
                      {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
                <button type="submit" disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  {loading ? 'Authenticating...' : <><Shield className="w-4 h-4" /> Sign In</>}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {tab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type="text" value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="Admin Name" required autoComplete="off"
                      className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required autoComplete="off"
                      className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type={showSignupPw ? 'text' : 'password'} value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required minLength={6} autoComplete="new-password"
                      className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors" />
                    <button type="button" onClick={() => setShowSignupPw(!showSignupPw)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200">
                      {showSignupPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
                {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl">{success}</div>}
                <button type="submit" disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  {loading ? 'Creating Account...' : <><Shield className="w-4 h-4" /> Create Admin Account</>}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
              <p className="text-xs text-slate-500">🔒 This is a secure, restricted area. Unauthorized access attempts are logged.</p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          <a href="/" className="hover:text-slate-400 transition-colors">← Return to ShopCart Store</a>
        </p>
      </div>
    </div>
  )
}
