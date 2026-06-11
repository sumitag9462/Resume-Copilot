// =============================================================
// src/components/auth/ProtectedRoute.jsx
//
// Wraps any route that requires login.
// While auth is loading → shows a full-page spinner (avoids flash)
// If not authenticated → redirects to /login
// If authenticated → renders the child component normally
// =============================================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
          <p className="text-sm text-slate-500 font-body">Loading your workspace…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute