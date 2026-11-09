# Feature-to-Code Architecture Map

**Commit:** `5286307a9f384a461aeaf8b0c68342ad5f16349a`  
**Branch:** `Bug_Fixes` (based on `main`)  
**Date:** November 9, 2026

---

## System Overview

```
React Frontend (Vite + Tailwind)
      │
      │  HTTP REST + SSE (via Vite proxy → localhost:5001)
      ▼
Express 5 Backend (ai-resume-backend)
  ├─ Helmet, CORS (currently open), Rate Limiting
  ├─ JWT Auth Middleware (Bearer + TokenBlocklist)
  ├─ 12 route modules → controllers → services
  ├─ Gemini AI (KeyManager round-robin, ModelRouter auto-routing)
  └─ MongoDB Atlas (Mongoose ODM, 14 models)
```

---

## Feature Routing Matrix

### CRITICAL FINDING: Dual API Architecture

The frontend has **migrated** most features from `/api/analysis/*` to `/api/arena/run`.  
The `/api/analysis/*` routes are now **mostly dead code** (only `GET /api/analysis/dashboard/stats` is actively used by `DashboardPage.jsx`).

| Feature | React Page | Frontend API | Backend Route | Controller | Service | Status |
|---------|-----------|-------------|---------------|------------|---------|--------|
| **Registration (Direct)** | `Auth/Register.jsx` | `authApi.js` → `POST /auth/register` | `authRoutes.js` | `authController.registerUser` | — | Active |
| **Registration (OTP)** | `Auth/Register.jsx` | `authApi.js` → `POST /auth/request-email-otp` + `POST /auth/verify-email-otp` | `authRoutes.js` | `authController.requestEmailOtp/verifyEmailOtp` | Brevo/Nodemailer | Active |
| **Google OAuth** | `Auth/Login.jsx` | `authApi.js` → `POST /auth/google` | `authRoutes.js` | `authController.googleLogin` | google-auth-library | Active |
| **Login** | `Auth/Login.jsx` | `authApi.js` → `POST /auth/login` | `authRoutes.js` | `authController.loginUser` | bcryptjs | Active |
| **Logout** | Navbar/Sidebar | `authApi.js` → `POST /auth/logout` | `authRoutes.js` | `authController.logoutUser` | TokenBlocklist | Active |
| **Forgot Password** | `Auth/ForgotPassword.jsx` | `authApi.js` → `POST /auth/forgot-password` | `authRoutes.js` | `authController.requestPasswordResetOtp` | OTP + email | Active |
| **Reset Password** | `Auth/ResetPasswordPage.jsx` | `authApi.js` → `POST /auth/verify-reset-otp` + `POST /auth/reset-password` | `authRoutes.js` | `authController.verifyPasswordResetOtp/resetPassword` | JWT (10m) | Active |
| **Profile** | `Auth/Login.jsx` (on load) | `authApi.js` → `GET /auth/me` | `authRoutes.js` | `authController.getProfile` | User.select('-password') | Active |
| **Resume Upload** | `ResumesPage.jsx` | `resumeApi.js` → `POST /resume/upload` (FormData) | `resumeRoutes.js` | `resumeController.uploadResume` | fileParser (pdf-parse/mammoth) | Active |
| **Resume List** | `ResumesPage.jsx` | `resumeApi.js` → `GET /resume/all` | `resumeRoutes.js` | `resumeController.getAllResumes` | — | Active |
| **Resume Get** | Various pages | `resumeApi.js` → `GET /resume/:id` | `resumeRoutes.js` | `resumeController.getResume` | — | Active |
| **Resume Delete** | `ResumesPage.jsx` | `resumeApi.js` → `DELETE /resume/:id` | `resumeRoutes.js` | `resumeController.deleteResume` | Cascade deletes Analysis+ArenaHistory | Active |
| **ATS Analysis** | `AnalyzerPage.jsx` | `ArenaContext.executeRun` → `POST /arena/run` `{feature:'ats_analysis'}` | `arenaRoutes.js` | `arenaController.runArena` → `ComparisonEngine` → `features.js` prompt | Gemini via KeyManager | **Active (via Arena)** |
| **JD Match** | `JDMatchPage.jsx` | `ArenaContext.executeRun` → `POST /arena/run` `{feature:'jd_match'}` | `arenaRoutes.js` | `arenaController.runArena` | Gemini | **Active (via Arena)** |
| **Cover Letter** | `CoverLetterPage.jsx` | `ArenaContext.executeRun` → `POST /arena/run` `{feature:'cover_letter'}` | `arenaRoutes.js` | `arenaController.runArena` | Gemini | **Active (via Arena)** |
| **Outreach** | `OutreachPage.jsx` | `ArenaContext.executeRun` → `POST /arena/run` `{feature:'outreach'}` | `arenaRoutes.js` | `arenaController.runArena` | Gemini | **Active (via Arena)** |
| **Resume Comparison** | `ResumeComparisonPage.jsx` | `ArenaContext.executeRun` → `POST /arena/run` `{feature:'resume_comparison'}` | `arenaRoutes.js` | `arenaController.runArena` | Gemini | **Active (via Arena)** |
| **Version Compare** | `VersionComparePage.jsx` (redirects to `/resume-comparison`) | `ArenaContext.executeRun` → `POST /arena/run` `{feature:'version_compare'}` | `arenaRoutes.js` | `arenaController.runArena` | Gemini | **Active (via Arena)** |
| **Resume Boost (Enhance + Scan)** | `ResumeBoostPage.jsx` | `ArenaContext.executeRun` for boost; also `POST /resume/enhance`, `POST /resume/scan`, `POST /resume/rebuild` | `resumeRoutes.js` | `resumeBoostController` + `resumeRebuildController` | bulletEnhancerService / weakLanguageService / resumeRebuildService | Active (mixed) |
| **Interview Prep** | `InterviewPrepPage.jsx` | `POST /interview/generate`, `POST /interview/regenerate`, `GET /interview/history`, `DELETE /interview/history/:id` | `interviewPrepRoutes.js` | `interviewPrepController` | interviewQuestionsService | Active |
| **Copilot Chat (SSE)** | `CopilotPage.jsx` | `copilotApi.js` → `POST /copilot/chat` (SSE) + session CRUD | `copilotRoutes.js` | `copilotController.streamChat` | Gemini streaming | Active |
| **Dashboard Stats** | `DashboardPage.jsx` | `analysisApi.js` → `GET /analysis/dashboard/stats` | `analysisRoutes.js` | `analysisController.getDashboardStats` | ArenaHistory queries | Active |
| **Bullet Enhance (standalone)** | — | `POST /bullets/enhance`, `POST /bullets/enhance-bulk` | `bulletEnhancerRoutes.js` | `bulletEnhancerController` | bulletEnhancerService | Active (API) |
| **Weak Language (standalone)** | — | `POST /weak-language/text`, `GET /weak-language/resume/:resumeId` | `weakLanguageRoutes.js` | `weakLanguageController` | weakLanguageService | Active (API) |
| **Settings** | `SettingsPage.jsx` | `userApi.js` → `PUT /user/profile`, `PUT /user/password`, `PUT /user/settings/ai`, `PUT /user/settings/notifications` | `userRoutes.js` | `userController` | User model | Active |
| **Contact Form** | `LandingPage.jsx` → `ContactForm` | `POST /contact/submit` | `contactRoutes.js` | `contactController.submitQuery` | ContactQuery model | Active (Public) |

### Dead/Legacy Code

| Code | Location | Status |
|------|----------|--------|
| `analysisApi.runATSAnalysis()` | `src/api/analysisApi.js` | **Dead** — no frontend importer |
| `analysisApi.matchResumeWithJob()` | `src/api/analysisApi.js` | **Dead** — no frontend importer |
| `analysisApi.generateCoverLetter()` | `src/api/analysisApi.js` | **Dead** — no frontend importer |
| `analysisApi.getAnalysisHistory()` | `src/api/analysisApi.js` | **Dead** — no frontend importer |
| `analysisApi.getAnalysisById()` | `src/api/analysisApi.js` | **Dead** — no frontend importer |
| `POST /api/analysis/ats` | `analysisRoutes.js` | **Legacy** — kept for potential API clients |
| `POST /api/analysis/match` | `analysisRoutes.js` | **Legacy** — kept for potential API clients |
| `POST /api/analysis/cover-letter` | `analysisRoutes.js` | **Legacy** — kept for potential API clients |
| `geminiService.analyzeJobDescription()` | `services/geminiService.js` | **Dead** — not called anywhere |
| `geminiService.getQuickTips()` | `services/geminiService.js` | **Dead** — not called anywhere |
| `utils/generateToken.js` | `utils/generateToken.js` | **Dead** — authController has its own inline `generateToken` |
| `utils/sendEmail.js` | `utils/sendEmail.js` | **Dead** — authController uses inline Brevo/Nodemailer |
| `models/InterviewPrep.js` | `models/InterviewPrep.js` | **Dead** — `InterviewHistory.js` is used instead |
| `models/VoiceInterviewSession.js` | `models/VoiceInterviewSession.js` | **Unused** — no controller/route references it |
| `routes/resumeBoostRoutes.js` | Registered but overlaps with resumeRoutes.js | **Not mounted in app.js** — app.js doesn't import it |
| `LoginPage.jsx` / `RegisterPage.jsx` | `src/pages/` | **Dead** — App.jsx routes to `Auth/Login.jsx` and `Auth/Register.jsx` |
| `BuilderPage.jsx` | `src/pages/` | **Dead** — no route in App.jsx |

### Models Not Mounted in app.js

- `resumeBoostRoutes.js` is **defined** but is NOT mounted in `app.js`. The routes for `/resume/enhance`, `/resume/scan`, `/resume/rebuild` are instead mounted via `resumeRoutes.js`.

---

## Vite Dev Proxy

```
Frontend dev server: localhost:5173
Proxy: /api → http://localhost:5001
Backend server.js: PORT=5000 (from .env) or default 5000
```

**BUG CONFIRMED**: Vite proxy targets port `5001` but backend defaults to port `5000`. This mismatch means the dev proxy won't work unless the backend `.env` sets `PORT=5001`.

---

## Database Models (14 total)

| Model | Collection | Fields | Owner Field | Actively Used |
|-------|-----------|--------|-------------|--------------|
| User | users | name, email, password, mobile, place, photo, careerStage, experience, desiredRole, skills, settings | — | Yes |
| Resume | resumes | user, fileName, originalName, fileType, filePath, extractedText | `user` | Yes |
| Analysis | analyses | resume, user, type, atsScore, overallScore, matchScore, coverLetterContent, ... | `user` | Yes (dashboard stats only) |
| ArenaHistory | arenahistories | userId, feature, input, selectedModel, compareMode, results, winner, bestResults | `userId` | Yes |
| OTP | otps | email, otp, createdAt (TTL 5min) | — | Yes |
| TokenBlocklist | tokenblocklists | token, createdAt (TTL 30d) | — | Yes |
| CopilotSession | copilotsessions | userId, title, messages | `userId` | Yes |
| InterviewHistory | interviewhistories | userId, resume, role, jobDescription, questions, ... | `userId` | Yes |
| ContactQuery | contactqueries | name, email, message, status | — | Yes |
| ResumeBoost | resumeboosts | userId, originalBullet, enhancedBullet | `userId` | Yes |
| ResumeBoostHistory | resumeboosthistories | userId, originalResume, improvedResume, changes, scores, ... | `userId` | Yes |
| WeakLanguage | weaklanguages | userId, weakPhrase, improvedPhrase, score | `userId` | Yes |
| InterviewPrep | interviewpreps | userId, resume, role, jd, questions | `userId` | **Dead** |
| VoiceInterviewSession | voiceinterviewsessions | userId, resumeText, jobDescription, chatHistory, evaluation, ... | `userId` | **Dead** |

### Inconsistent Owner Field Names

- `Resume`, `Analysis` use `user` as the owner field  
- `ArenaHistory`, `CopilotSession`, `InterviewHistory`, `ResumeBoost`, `ResumeBoostHistory`, `WeakLanguage` use `userId`
- This inconsistency has caused bugs (see A03 in remediation status)

