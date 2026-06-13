// =============================================================
// src/main.jsx — APP ENTRY POINT
//
// React 18 uses createRoot() instead of the old ReactDOM.render().
// We wrap the entire app in:
//   - <AuthProvider>  → makes auth state available everywhere
//   - <BrowserRouter> → enables React Router
//   - <Toaster>       → react-hot-toast notification container
// =============================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ModelProvider } from './context/ModelContext'
import { ArenaProvider } from './context/ArenaContext'
import GlobalErrorBoundary from './components/layout/GlobalErrorBoundary'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModelProvider>
          <ArenaProvider>
            <GlobalErrorBoundary>
              <App />
            </GlobalErrorBoundary>
          </ArenaProvider>
        </ModelProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.12)',
              color: '#1e293b',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)// trigger reload
