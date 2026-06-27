// =============================================================
// src/App.jsx — ROUTER CONFIGURATION
//
// Defines every URL → component mapping.
//
// Route types:
//   Public    → Anyone can visit (landing, login, register)
//   Protected → Must be logged in. ProtectedRoute redirects
//               to /login if no token exists.
//
// URL structure:
//   /               → Landing page
//   /login          → Login
//   /register       → Register
//   /dashboard      → Dashboard home      [protected]
//   /resumes        → My Resumes          [protected]
//   /analyzer       → ATS Analyzer        [protected]
//   /jd-match       → JD Match            [protected]
//   /cover-letter   → Cover Letter        [protected]
//   *               → 404 redirect to /
// =============================================================

import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CursorGlow from './components/ui/CursorGlow'
import ScrollProgress from './components/ui/ScrollProgress'

// Public pages
const LandingPage          = lazy(() => import('./pages/LandingPage'))
const LoginPage            = lazy(() => import('./pages/Auth/Login'))
const RegisterPage         = lazy(() => import('./pages/Auth/Register'))
const ForgotPasswordPage   = lazy(() => import('./pages/Auth/ForgotPassword'))
const ResetPasswordPage    = lazy(() => import('./pages/Auth/ResetPasswordPage'))

// Protected pages
const DashboardPage        = lazy(() => import('./pages/DashboardPage'))
const ResumesPage          = lazy(() => import('./pages/ResumesPage'))
const ResumeBoostPage      = lazy(() => import('./pages/ResumeBoostPage'))
const InterviewPrepPage    = lazy(() => import('./pages/InterviewPrepPage'))
const AnalyzerPage         = lazy(() => import('./pages/AnalyzerPage'))
const JDMatchPage          = lazy(() => import('./pages/JDMatchPage'))
const CoverLetterPage      = lazy(() => import('./pages/CoverLetterPage'))
const VersionComparePage   = lazy(() => import('./pages/VersionComparePage'))
const SettingsPage         = lazy(() => import('./pages/SettingsPage'))
const OutreachPage         = lazy(() => import('./pages/OutreachPage'))
const ResumeComparisonPage = lazy(() => import('./pages/ResumeComparisonPage'))
const CopilotPage          = lazy(() => import('./pages/CopilotPage'))
const VoiceInterviewPage   = lazy(() => import('./pages/VoiceInterviewPage'))

const App = () => {
  const location = useLocation();
  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      <AnimatePresence mode="wait">
        <Suspense fallback={
          <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          <Routes location={location} key={location.pathname}>
            {/* ── PUBLIC ROUTES ─────────────────────────────────── */}
            <Route path="/"                 element={<LandingPage />} />
            <Route path="/login"            element={<LoginPage />} />
            <Route path="/register"         element={<RegisterPage />} />
            <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* ── PROTECTED ROUTES ──────────────────────────────── */}
            <Route
              path="/copilot"
              element={<ProtectedRoute><CopilotPage /></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/resumes"
              element={<ProtectedRoute><ResumesPage /></ProtectedRoute>}
            />
            <Route
              path="/resume-boost"
              element={<ProtectedRoute><ResumeBoostPage /></ProtectedRoute>}
            />
            <Route
              path="/interview-prep"
              element={<ProtectedRoute><InterviewPrepPage /></ProtectedRoute>}
            />
            <Route
              path="/analyzer"
              element={<ProtectedRoute><AnalyzerPage /></ProtectedRoute>}
            />
            
            <Route
              path="/jd-match"
              element={<ProtectedRoute><JDMatchPage /></ProtectedRoute>}
            />
            <Route
              path="/cover-letter"
              element={<ProtectedRoute><CoverLetterPage /></ProtectedRoute>}
            />
            <Route
              path="/version-compare"
              element={<ProtectedRoute><VersionComparePage /></ProtectedRoute>}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
            />
            <Route
              path="/outreach"
              element={<ProtectedRoute><OutreachPage /></ProtectedRoute>}
            />
            <Route
              path="/resume-comparison"
              element={<ProtectedRoute><ResumeComparisonPage /></ProtectedRoute>}
            />
            <Route
              path="/voice-interview"
              element={<ProtectedRoute><VoiceInterviewPage /></ProtectedRoute>}
            />


            {/* ── 404 FALLBACK ──────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default App