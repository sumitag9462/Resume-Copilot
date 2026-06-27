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
import CommandPalette from './components/ui/CommandPalette'
import PageWrapper from './components/layout/PageWrapper'

// Public pages
import LandingPage          from './pages/LandingPage'
import LoginPage            from './pages/Auth/Login'
import RegisterPage         from './pages/Auth/Register'
import ForgotPasswordPage   from './pages/Auth/ForgotPassword'
import ResetPasswordPage    from './pages/Auth/ResetPasswordPage'

// Protected pages
import DashboardPage        from './pages/DashboardPage'
import ResumesPage          from './pages/ResumesPage'
import BuilderPage          from './pages/BuilderPage'
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
      <CommandPalette />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ── PUBLIC ROUTES ─────────────────────────────────── */}
          <Route path="/"                 element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/login"            element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/register"         element={<PageWrapper><RegisterPage /></PageWrapper>} />
          <Route path="/forgot-password"  element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
          <Route path="/reset-password/:token" element={<PageWrapper><ResetPasswordPage /></PageWrapper>} />

          {/* ── PROTECTED ROUTES ──────────────────────────────── */}
          <Route
            path="/copilot"
            element={<ProtectedRoute><PageWrapper><CopilotPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><PageWrapper><DashboardPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/resumes"
            element={<ProtectedRoute><PageWrapper><ResumesPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/builder"
            element={<ProtectedRoute><PageWrapper><BuilderPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/resume-boost"
            element={<ProtectedRoute><PageWrapper><ResumeBoostPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/interview-prep"
            element={<ProtectedRoute><PageWrapper><InterviewPrepPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/analyzer"
            element={<ProtectedRoute><PageWrapper><AnalyzerPage /></PageWrapper></ProtectedRoute>}
          />
          
          <Route
            path="/jd-match"
            element={<ProtectedRoute><PageWrapper><JDMatchPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/cover-letter"
            element={<ProtectedRoute><PageWrapper><CoverLetterPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/version-compare"
            element={<ProtectedRoute><PageWrapper><VersionComparePage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute><PageWrapper><SettingsPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/outreach"
            element={<ProtectedRoute><PageWrapper><OutreachPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/resume-comparison"
            element={<ProtectedRoute><PageWrapper><ResumeComparisonPage /></PageWrapper></ProtectedRoute>}
          />
          <Route
            path="/voice-interview"
            element={<ProtectedRoute><PageWrapper><VoiceInterviewPage /></PageWrapper></ProtectedRoute>}
          />


          {/* ── 404 FALLBACK ──────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App