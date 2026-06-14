// =============================================================
// src/api/axiosConfig.js — AXIOS INSTANCE
//
// This creates ONE shared axios instance for the entire app.
// Every API call goes through this, so:
//   - The base URL is configured once here
//   - The auth token is attached to EVERY request automatically
//   - 401 errors (expired token) are caught here and user is
//     logged out automatically — no manual handling needed
// =============================================================

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── REQUEST INTERCEPTOR ─────────────────────────────────────
// Runs before every request. Reads the token from localStorage
// and adds it as the Authorization header.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── RESPONSE INTERCEPTOR ────────────────────────────────────
// Runs after every response.
// If we get a 401 (unauthorized/expired token):
//   → Clear storage and redirect to login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Only redirect if not already on an auth page
      const authPages = ['/login', '/register', '/forgot-password', '/reset-password']
      const isAuthPage = authPages.some(p => window.location.pathname.includes(p))
      if (!isAuthPage) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api