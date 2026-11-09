# Complete Repository File Inventory

**Commit SHA:** `5286307a9f384a461aeaf8b0c68342ad5f16349a`  
**Branch:** `Bug_Fixes`  
**Application:** Resume Copilot (MERN + Google Gemini Generative AI)  
**Inspection Date:** November 10, 2026  

---

## 1. Backend Source Files (`ai-resume-backend`)

| File Path | Responsibility | Reviewed | Test Coverage | Issues Found |
|:---|:---|:---:|:---|:---|
| `server.js` | Server entry point, DB connection lifecycle, SIGINT/SIGTERM shutdown | Line-by-line | Integration (`tests/app.test.js`) | A36 (Unawaited DB connect, abrupt shutdown) |
| `app.js` | Express app initialization, middleware pipeline, CORS, 413 handling | Line-by-line | Integration (`tests/app.test.js`) | A04, A05, A29, A32, A45, A49 |
| `config/db.js` | MongoDB Mongoose connection and DNS resolver configuration | Line-by-line | Integration (`tests/app.test.js`) | A37 (Host DNS override `8.8.8.8`) |
| `config/features.js` | Authoritative 17-feature registry, prompt contracts, factuality rules | Line-by-line | Unit (`tests/outputValidator.test.js`) | A17, A18, A19, A42 (Registry mismatch) |
| `config/models.js` | Truthful model definitions, distinct contestant mapping, fallback config | Line-by-line | Integration (`tests/arena.test.js`) | A06 (Model aliasing, fake claims) |
| `controllers/analysisController.js` | Unified legacy ATS, JD match, and Cover Letter adapter; dashboard stats | Line-by-line | Integration (`tests/app.test.js`) | A11, A28, A30 (Inverted scoreTrend) |
| `controllers/arenaController.js` | Multi-model Arena execution, request coalescing, caching, history | Line-by-line | Integration (`tests/arena.test.js`) | A20, A21, A27, A28, A46 |
| `controllers/authController.js` | User registration, login, OTP challenge, reset tokens, Google OAuth | Line-by-line | Integration (`tests/app.test.js`) | A01, A03, A04, A05, A07, A23, A24, A26 |
| `controllers/bulletEnhancerController.js` | Single & bulk resume bullet enhancement with batch safety | Line-by-line | Integration (`tests/app.test.js`) | A22, A44, NEW-002 (Dead code) |
| `controllers/contactController.js` | Public contact query handling, rate limiting, length checks | Line-by-line | Integration (`tests/app.test.js`) | A39 (Spam submission vulnerability) |
| `controllers/copilotController.js` | SSE streaming chat assistant, retry safety, session ownership | Line-by-line | Integration (`tests/app.test.js`) | A15, A34 (Mid-stream retry duplication) |
| `controllers/interviewPrepController.js` | Technical and behavioral interview question generator | Line-by-line | Integration (`tests/app.test.js`) | A11 (Unified arena pipeline) |
| `controllers/resumeBoostController.js` | Section-level resume improvement suggestions | Line-by-line | Integration (`tests/app.test.js`) | A11 (Unified arena pipeline) |
| `controllers/resumeController.js` | Resume file upload, authenticated streaming download, cascade delete | Line-by-line | Integration (`tests/app.test.js`) | A16, NEW-003, NEW-005, A45, A48 |
| `controllers/resumeRebuildController.js` | Long-resume rebuilder with truncation notices & history | Line-by-line | Integration (`tests/app.test.js`) | A33 (Silent 4500-char truncation) |
| `controllers/userController.js` | Profile retrieval, password policy enforcement, token invalidation | Line-by-line | Integration (`tests/app.test.js`) | A08, A25 (Short passwords allowed) |
| `controllers/weakLanguageController.js` | Action-verb and passive-voice analyzer for text and resumes | Line-by-line | Integration (`tests/app.test.js`) | A02 (Missing await returning `{}`) |
| `middleware/authMiddleware.js` | JWT verification, token blocklist verification, `isVerified` check | Line-by-line | Integration (`tests/app.test.js`) | A03, A23, A40 |
| `middleware/errorHandler.js` | Central error middleware, 413 handling, credential redaction | Line-by-line | Integration (`tests/app.test.js`) | A29, A50 (PII leaking to logs) |
| `middleware/uploadMiddleware.js` | Multer file upload setup, UUID filename generation, MIME checks | Line-by-line | Integration (`tests/fileParser.test.js`)| A48 (Predictable filenames) |
| `models/Analysis.js` | Legacy analysis database schema | Symbol & Schema | Integration (`tests/app.test.js`) | Schema consistency |
| `models/ArenaHistory.js` | Arena execution history schema with compound cache index | Symbol & Schema | Integration (`tests/arena.test.js`) | A27 (Cache key indexing) |
| `models/ContactQuery.js` | Contact query schema with 90-day Mongo TTL index | Symbol & Schema | Integration (`tests/app.test.js`) | A39 (Unbounded DB growth) |
| `models/CopilotSession.js` | Multi-turn Copilot session schema with user compound index | Symbol & Schema | Integration (`tests/app.test.js`) | A34 (Missing index & user checks) |
| `models/InterviewHistory.js` | Interview preparation session schema | Symbol & Schema | Integration (`tests/app.test.js`) | Cascade deletion targets |
| `models/InterviewPrep.js` | Legacy interview prep schema | Symbol & Schema | Indirect | Orphaned model |
| `models/OTP.js` | Purpose-bound OTP challenges with SHA-256 hash & attempt counter | Symbol & Schema | Integration (`tests/app.test.js`) | A05 (Missing purpose & attempt cap) |
| `models/Resume.js` | Resume metadata and disk storage reference schema | Symbol & Schema | Integration (`tests/app.test.js`) | Cascade deletion targets |
| `models/ResumeBoost.js` | Resume boost result schema | Symbol & Schema | Indirect | Field naming |
| `models/ResumeBoostHistory.js` | Resume boost historical runs schema | Symbol & Schema | Indirect | Field naming |
| `models/TokenBlocklist.js` | SHA-256 revoked JWT hash schema with dynamic expiration TTL | Symbol & Schema | Integration (`tests/app.test.js`) | A40 (Plaintext JWTs stored) |
| `models/User.js` | User account schema with normalized email, bcrypt pass, tokenVersion | Symbol & Schema | Integration (`tests/app.test.js`) | A25, A26 (Email case insensitivity) |
| `models/VoiceInterviewSession.js` | Voice interview session schema | Symbol & Schema | Indirect | Orphaned model |
| `models/WeakLanguage.js` | Weak language audit results schema | Symbol & Schema | Indirect | Field naming |
| `routes/analysisRoutes.js` | Legacy analysis endpoints (`/api/analysis/*`) | Line-by-line | Integration (`tests/app.test.js`) | Route mounts |
| `routes/arenaRoutes.js` | Modern 17-feature Arena endpoints (`/api/arena/*`) | Line-by-line | Integration (`tests/arena.test.js`) | Route mounts |
| `routes/authRoutes.js` | Authentication and account endpoints (`/api/auth/*`) | Line-by-line | Integration (`tests/app.test.js`) | A09, A43 (Missing rate limits) |
| `routes/bulletEnhancerRoutes.js` | Bullet enhancement endpoints (`/api/bullets/*`) | Line-by-line | Integration (`tests/app.test.js`) | Route mounts |
| `routes/contactRoutes.js` | Public contact submission endpoints (`/api/contact/*`) | Line-by-line | Integration (`tests/app.test.js`) | A39 (Missing rate limits) |
| `routes/copilotRoutes.js` | Copilot chat streaming and session endpoints | Line-by-line | Integration (`tests/app.test.js`) | Route mounts |
| `routes/interviewPrepRoutes.js` | Interview question generation endpoints | Line-by-line | Integration (`tests/app.test.js`) | Route mounts |
| `routes/outreachRoutes.js` | Cold outreach and networking email generator | Line-by-line | Integration (`tests/app.test.js`) | Route mounts |
| `routes/resumeBoostRoutes.js` | Section boost endpoints | Line-by-line | Integration (`tests/app.test.js`) | Route mounts |
| `routes/resumeRoutes.js` | Resume management and authenticated file streaming endpoints | Line-by-line | Integration (`tests/app.test.js`) | A45 (Direct /uploads access) |
| `routes/userRoutes.js` | User profile and password management endpoints | Line-by-line | Integration (`tests/app.test.js`) | Route mounts |
| `routes/weakLanguageRoutes.js` | Weak language detection endpoints | Line-by-line | Integration (`tests/app.test.js`) | Route mounts |
| `services/ComparisonEngine.js` | Core AI execution engine with retries, fallbacks, and schema parsing | Line-by-line | Integration (`tests/arena.test.js`) | A06, A11, A20 |
| `services/OutputValidator.js` | Authoritative 17-feature schema validator, metric clamping, disclaimers | Line-by-line | Unit (`tests/outputValidator.test.js`) | A10, A17, A18, A19 |
| `services/ScoringEngine.js` | Deterministic ATS score calculations and keyword weighting | Line-by-line | Integration (`tests/app.test.js`) | A10 (Arbitrary fallback scores) |
| `services/bulletEnhancerService.js` | Multi-variant bullet generator using `Promise.allSettled` | Line-by-line | Integration (`tests/app.test.js`) | A22 (Promise.all crash) |
| `services/geminiService.js` | Legacy adapter redirecting calls into `ComparisonEngine` | Line-by-line | Integration (`tests/app.test.js`) | A11 (Divergent pipelines) |
| `services/interviewQuestionsService.js` | Interview questions generator service | Line-by-line | Integration (`tests/app.test.js`) | Service logic |
| `services/outreachService.js` | Cold email and outreach message generator service | Line-by-line | Integration (`tests/app.test.js`) | Service logic |
| `services/resumeRebuildService.js` | 25,000-character resume rebuilder with truncation flags | Line-by-line | Integration (`tests/app.test.js`) | A33 (Silent truncation) |
| `services/weakLanguageService.js` | Weak word pattern matching and replacement suggestions | Line-by-line | Integration (`tests/app.test.js`) | Service logic |
| `utils/fileParser.js` | Real PDF/DOCX document text extraction engine with magic-byte checks | Line-by-line | Unit (`tests/fileParser.test.js`) | A47 (Parser memory leaks) |
| `utils/generateToken.js` | Purpose-separated JWT creation utility (access vs reset) | Line-by-line | Integration (`tests/app.test.js`) | A01 (Token confusion) |
| `utils/sendEmail.js` | Nodemailer Brevo SMTP email transport helper | Line-by-line | Integration (`tests/app.test.js`) | A14 (Unhandled async errors) |
| `utils/validationHelper.js` | Centralized string, array, and email validation guards | Line-by-line | Integration (`tests/app.test.js`) | A38 (Non-string `.trim()` crashes) |

---

## 2. Frontend Source Files (`ai-resume-frontend`)

| File Path | Responsibility | Reviewed | Test Coverage | Issues Found |
|:---|:---|:---:|:---|:---|
| `src/main.jsx` | React root mounting, Router setup, Google OAuth provider | Line-by-line | Vite Build | Root configuration |
| `src/App.jsx` | Top-level routing, lazy-loaded page routes, Auth provider | Line-by-line | Vite Build | A33 (Mounted BuilderPage) |
| `src/api/axiosConfig.js` | Global Axios instance with 15s REST vs 90s AI timeout separation | Line-by-line | Unit / Integration | A12 (Premature timeouts) |
| `src/api/authApi.js` | Auth API endpoints (login, register, OTP, reset, profile) | Line-by-line | Integration | Endpoint contracts |
| `src/api/resumeApi.js` | Resume CRUD and authenticated file blob download client | Line-by-line | Integration | A45 (File streaming client) |
| `src/api/analysisApi.js` | Legacy analysis API client and dashboard stats fetcher | Line-by-line | Integration | Endpoint contracts |
| `src/api/arenaApi.js` | Modern 17-feature Arena execution and history client | Line-by-line | Integration | Payload contracts |
| `src/api/copilotApi.js` | Copilot SSE streaming handler and session history client | Line-by-line | Integration | Stream handling |
| `src/api/featureApi.js` | Standalone bullet enhancer and weak language API client | Line-by-line | Integration | Payload contracts |
| `src/api/outreachApi.js` | Networking and recruiter outreach API client | Line-by-line | Integration | Payload contracts |
| `src/api/userApi.js` | User password update and settings client | Line-by-line | Integration | Payload contracts |
| `src/context/AuthContext.jsx` | Auth state machine, `/me` profile verification, storage sync | Line-by-line | Unit / Integration | A35 (Storage trust bypass) |
| `src/context/ArenaContext.jsx` | Arena active session, model selection, and compare state | Line-by-line | React State | State management |
| `src/context/ModelContext.jsx` | Model configuration and tier metadata provider | Line-by-line | React State | State management |
| `src/pages/LandingPage.jsx` | Public marketing landing page with 3D canvas and feature demo | Line-by-line | ESLint & Build | Preserved design |
| `src/pages/DashboardPage.jsx` | User workspace dashboard, score trend chart, safe filename fallback | Line-by-line | ESLint & Build | A30, A31 (Score order, filename) |
| `src/pages/AnalyzerPage.jsx` | Resume ATS audit and JD match interface | Line-by-line | ESLint & Build | API contract alignment |
| `src/pages/JDMatchPage.jsx` | Specialized Job Description comparison screen | Line-by-line | ESLint & Build | API contract alignment |
| `src/pages/CoverLetterPage.jsx`| Cover letter generator interface | Line-by-line | ESLint & Build | API contract alignment |
| `src/pages/CopilotPage.jsx` | Multi-turn AI Copilot chat workspace with SSE stream rendering | Line-by-line | ESLint & Build | Stream safety |
| `src/pages/BuilderPage.jsx` | Resume builder and rebuilder interface | Line-by-line | ESLint & Build | Route mount |
| `src/pages/ResumeBoostPage.jsx`| Targeted resume section enhancer | Line-by-line | ESLint & Build | API contract alignment |
| `src/pages/InterviewPrepPage.jsx`| Interview preparation question practice workspace | Line-by-line | ESLint & Build | API contract alignment |
| `src/pages/OutreachPage.jsx` | Cold outreach and networking email generator screen | Line-by-line | ESLint & Build | API contract alignment |
| `src/pages/ResumesPage.jsx` | Resume document management and upload modal | Line-by-line | ESLint & Build | API contract alignment |
| `src/pages/SettingsPage.jsx` | Account settings, password change, and security preferences | Line-by-line | ESLint & Build | A08, A25 |
| `src/pages/Auth/Login.jsx` | Authentication modal login tab with Google OAuth | Line-by-line | ESLint & Build | Form validation |
| `src/pages/Auth/Register.jsx` | Authentication modal registration tab with OTP flow | Line-by-line | ESLint & Build | Form validation |
| `src/pages/Auth/ForgotPassword.jsx` | Password reset request and OTP entry form | Line-by-line | ESLint & Build | Form validation |
| `src/pages/Auth/ResetPasswordPage.jsx` | Dedicated reset password page with reset-token validation | Line-by-line | ESLint & Build | Form validation |
| `src/components/layout/Navbar.jsx` | Top navigation bar with auth triggers and user dropdown | Line-by-line | ESLint & Build | Preserved design |
| `src/components/layout/Sidebar.jsx` | Workspace sidebar with route links and active badges | Line-by-line | ESLint & Build | Preserved design |
| `src/components/layout/DashboardLayout.jsx` | Protected layout wrapper with Sidebar and Topbar | Line-by-line | ESLint & Build | Layout consistency |
| `src/components/layout/GlobalErrorBoundary.jsx` | Top-level React error boundary preventing blank screens | Line-by-line | ESLint & Build | Error handling |
| `src/components/resume/ResumeUploadZone.jsx` | Drag-and-drop resume upload zone with client size/type guards | Line-by-line | ESLint & Build | File validation |
| `src/components/ui/AIStreamingOutput.jsx` | Markdown stream renderer with typewriter effect | Line-by-line | ESLint & Build | Stream rendering |
| `src/components/ui/ATSScoreCircle.jsx` | Radial SVG score indicator | Line-by-line | ESLint & Build | Visual rendering |
| `src/components/ui/ArenaWorkspace.jsx` | Side-by-side multi-model comparison view | Line-by-line | ESLint & Build | UI layout |
| `src/components/settings/BillingDashboard.jsx` | Billing and subscription status panel | Line-by-line | ESLint & Build | Layout consistency |
| `src/components/settings/SecurityCenter.jsx` | Security overview and active session management | Line-by-line | ESLint & Build | Password controls |

