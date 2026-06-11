// =============================================================
// src/context/AuthContext.jsx — GLOBAL AUTH STATE
//
// React Context provides auth state to every component in the app
// without prop drilling. Any component can call useAuth() to get:
//   - user      → { _id, name, email } or null
//   - token     → JWT string or null
//   - isLoading → true while checking if user is logged in
//   - login()   → saves token + user, updates state
//   - logout()  → clears everything, redirects to /login
//
// On mount, we check localStorage for a saved token and verify
// it's still valid by calling GET /api/auth/me.
// =============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe } from '../api/authApi'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]         = useState(null)
  const [token, setToken]       = useState(null)
  const [isLoading, setIsLoading] = useState(true)  // true while verifying stored token

  // ── CHECK STORED TOKEN ON APP LOAD ──────────────────────
  // When the page loads, check if there's a saved token.
  // If yes, verify it with the server. If the token is expired
  // or invalid, the interceptor in axiosConfig.js will auto-clear it.
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token')
      const savedUser  = localStorage.getItem('user')

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))

        // Verify token is still valid with the server
        try {
          const data = await getMe()
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        } catch {
          // Token is invalid or expired — clear everything
          setToken(null)
          setUser(null)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  // ── LOGIN ────────────────────────────────────────────────
  // Called after successful register or login API response.
  // Saves token + user to both state and localStorage.
  const login = useCallback((newToken, userData) => {
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  // ── LOGOUT ───────────────────────────────────────────────
  // Clears all auth data. The redirect happens in ProtectedRoute.
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  const value = { user, token, isLoading, login, logout, isAuthenticated: !!token }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook — import this everywhere instead of useContext(AuthContext)
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}