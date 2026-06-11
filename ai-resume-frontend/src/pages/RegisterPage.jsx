// =============================================================
// src/pages/RegisterPage.jsx — REGISTER PAGE
//
// CHANGES FROM ORIGINAL:
//   1. Removed OTP/email verification step entirely.
//      The backend returns a token immediately on register, so
//      the OTP flow was dead code that could never run.
//      (Email verification can be added later as a separate feature)
//
//   2. Fixed password validation: minimum is now 8 characters
//      to match the StrengthBar which starts counting at 8 chars.
//      Before it was 6 chars — confusing because you could submit
//      a "Weak" password that didn't fill the first bar segment.
//
//   3. Removed unused imports: verifyEmail, resendVerificationEmail
//      from authApi (were only used by the OTP step)
// =============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye, EyeOff, FileSearch,
  ArrowRight, AlertCircle, CheckCircle
} from 'lucide-react'
import { registerUser } from '../api/authApi'
import { useAuth }      from '../context/AuthContext'
import toast            from 'react-hot-toast'

// ── PASSWORD STRENGTH METER ───────────────────────────────────
// Scores the password from 0–4 based on four rules.
// Each rule adds 1 point:
//   length ≥ 8, has uppercase, has number, has special char
const getStrength = (pwd) => {
  let score = 0
  if (pwd.length >= 8)           score++ // at least 8 chars
  if (/[A-Z]/.test(pwd))         score++ // has uppercase letter
  if (/[0-9]/.test(pwd))         score++ // has a number
  if (/[^A-Za-z0-9]/.test(pwd))  score++ // has special character
  return score
}

const StrengthBar = ({ password }) => {
  if (!password) return null
  const score  = getStrength(password)
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500']
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all ${
              s <= score ? colors[score] : 'bg-slate-100'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        ['', 'text-red-500', 'text-amber-500', 'text-blue-600', 'text-emerald-600'][score]
      }`}>
        {labels[score]}
      </p>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────
const RegisterPage = () => {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' })
  const [show,    setShow]    = useState({ password: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const { login } = useAuth()
  const navigate  = useNavigate()

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  // ── VALIDATION ────────────────────────────────────────────────
  // Returns error string if invalid, null if all good.
  // FIX: password minimum is now 8 to match the StrengthBar
  const validate = () => {
    if (!form.name.trim())              return 'Please enter your name.'
    if (!form.email.trim())             return 'Please enter your email.'
    if (form.password.length < 8)       return 'Password must be at least 8 characters.'
    if (form.password !== form.confirm) return 'Passwords do not match.'
    return null
  }

  // ── SUBMIT HANDLER ────────────────────────────────────────────
  // Backend always returns { token, user } on success.
  // We call login() from AuthContext to save the token, then redirect.
  const handleRegister = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    try {
      const data = await registerUser({
        name:     form.name,
        email:    form.email,
        password: form.password,
      })

      // login() saves token + user to localStorage and updates React state
      login(data.token, data.user)
      toast.success('Account created! Redirecting to your dashboard...')
      navigate('/dashboard')

    } catch (err) {
      // err.response.data.message comes from the backend JSON response
      // e.g. 'An account with this email already exists'
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // true when confirm field has input AND it matches the password field
  const passwordMatch = form.confirm && form.password === form.confirm

  return (
    <div className="min-h-screen bg-surface-50 grid-bg flex items-center justify-center px-4 py-10">
      {/* Background decorative orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full bg-brand-200/30 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full bg-purple-200/30 blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative w-full max-w-md page-enter">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-slate-900">Resume Copilot</span>
          </Link>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="font-heading text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-slate-500 text-sm mt-1">Free forever. No credit card required.</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Rahul Sharma"
                className="input-base"
                autoComplete="name"
              />
            </div>

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

            {/* Password + Strength Bar */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show.password ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Create a password (min 8 chars)"
                  className="input-base pr-11"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, password: !p.password }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show.password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Shows 4-segment color bar as user types */}
              <StrengthBar password={form.password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={show.confirm ? 'text' : 'password'}
                  name="confirm"
                  value={form.confirm}
                  onChange={onChange}
                  placeholder="Repeat your password"
                  className={`input-base pr-11 ${
                    form.confirm
                      ? passwordMatch
                        ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200'
                        : 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : ''
                  }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {/* Green/red checkmark icon when confirm field has input */}
                {form.confirm && (
                  <div className={`absolute right-10 top-1/2 -translate-y-1/2 ${
                    passwordMatch ? 'text-emerald-500' : 'text-red-400'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-800">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default RegisterPage