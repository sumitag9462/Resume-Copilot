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

import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ScrollProgress from './components/ui/ScrollProgress'

// Public pages
import LandingPage          from './pages/LandingPage'
import LoginPage            from './pages/Auth/Login'
import RegisterPage         from './pages/Auth/Register'
import ForgotPasswordPage   from './pages/Auth/ForgotPassword'
import ResetPasswordPage    from './pages/Auth/ResetPasswordPage'

// Protected pages
import DashboardPage        from './pages/DashboardPage'
import ResumesPage          from './pages/ResumesPage'
import ResumeBoostPage      from './pages/ResumeBoostPage'
import InterviewPrepPage    from './pages/InterviewPrepPage'
import AnalyzerPage         from './pages/AnalyzerPage'
import JDMatchPage          from './pages/JDMatchPage'
import CoverLetterPage      from './pages/CoverLetterPage'
import VersionComparePage   from './pages/VersionComparePage'
import SettingsPage         from './pages/SettingsPage'
import OutreachPage         from './pages/OutreachPage'
import ResumeComparisonPage from './pages/ResumeComparisonPage'
import CopilotPage          from './pages/CopilotPage'
import VoiceInterviewPage  from './pages/VoiceInterviewPage'

const App = () => {
  const location = useLocation();
  return (
    <>
      <ScrollProgress />
      <AnimatePresence mode="wait">
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
      </AnimatePresence>
    </>
  )
}

export default App