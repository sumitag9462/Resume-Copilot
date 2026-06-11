// =============================================================
// src/pages/LoginPage.jsx — LOGIN PAGE
//
// Clean centered-card login form.
// On submit → calls loginUser() API → saves token → redirects to /dashboard.
// Shows error message if login fails (wrong password, etc.)
// =============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, FileSearch, ArrowRight, AlertCircle } from 'lucide-react'
import { loginUser } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const { login } = useAuth()
  const navigate  = useNavigate()

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const data = await loginUser(form)
      login(data.token, data.user)
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 grid-bg flex items-center justify-center px-4">
      {/* Background orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full bg-brand-200/30 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full bg-purple-200/30 blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative w-full max-w-md page-enter">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-slate-900">Resume Copilot</span>
          </Link>

          <div className="mb-7">
            <h1 className="font-heading text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                className="input-base"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <button type="button" className="text-xs text-brand-600 hover:text-brand-800">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  className="input-base pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-800">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage