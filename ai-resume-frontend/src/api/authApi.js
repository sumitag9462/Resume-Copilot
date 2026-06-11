// =============================================================
// src/api/authApi.js — AUTH API CALLS
//
// These functions wrap the axios calls to the backend auth routes.
// They return the response.data object, so callers get the
// { success, message, token, user } shape directly.
// =============================================================

import api from './axiosConfig'

// POST /api/auth/register
// body: { name, email, password }
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

// POST /api/auth/login
// body: { email, password }
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

// GET /api/auth/me  — requires Authorization: Bearer <token>
export const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

// POST /api/auth/verify-email
export const verifyEmail = async ({ email, otp }) => {
  const response = await api.post('/auth/verify-email', { email, otp })
  return response.data
}

// POST /api/auth/resend-verification
export const resendVerificationEmail = async (email) => {
  const response = await api.post('/auth/resend-verification', { email })
  return response.data
}
