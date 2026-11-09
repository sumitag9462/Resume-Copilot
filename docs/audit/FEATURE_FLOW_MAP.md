# Comprehensive Feature Flow Map

**Application:** Resume Copilot  
**Commit SHA:** `5286307a9f384a461aeaf8b0c68342ad5f16349a`  
**Branch:** `Bug_Fixes`  
**Verification Date:** November 10, 2026  

---

## 1. Flow Methodology

For each feature, the full execution journey is mapped end-to-end:  
**Frontend Component → API Route → Controller → Service → Prompt/Contract → Model → Validation → Database → Frontend UI**

---

## 2. Feature Trace Matrix

### 2.1 User Registration & Email Verification
- **Frontend Component:** `src/pages/Auth/Register.jsx` (Modal tab)
- **API Route:** `POST /api/auth/register` → `POST /api/auth/verify-otp`
- **Controller:** `controllers/authController.js` (`registerUser`, `verifyEmailOtp`)
- **Service:** `utils/sendEmail.js` (Nodemailer Brevo SMTP)
- **Prompt / Logic:** Generates 6-digit cryptographic OTP (`crypto.randomInt(100000, 1000000)`).
- **Model / Crypto:** Stores SHA-256 hash in MongoDB (`OTP` collection) with `purpose: 'email_verification'`, `expiresAt` (10 min TTL), `attempts: 0`.
- **Validation:** Normalized lowercase/trimmed email; password policy (8–128 chars); max 5 wrong OTP attempts.
- **Database:** Creates `User` with `isVerified: false`; upon OTP verification sets `isVerified: true` atomically.
- **Frontend Result:** Dispatches login tokens, closes auth modal, redirects to `/dashboard`.

### 2.2 User Login (Password & Google OAuth)
- **Frontend Component:** `src/pages/Auth/Login.jsx` & `GoogleLoginButton.jsx`
- **API Route:** `POST /api/auth/login` / `POST /api/auth/google`
- **Controller:** `controllers/authController.js` (`loginUser`, `googleAuth`)
- **Service / External:** Google OAuth2 API (`oauth2Client.verifyIdToken`)
- **Validation:** Verifies Google token signature, `audience`, and `email_verified: true`. For password login, verifies bcrypt hash. Checks `TokenBlocklist` and `isVerified`.
- **Database:** Reads `User`; binds stable `googleId` on Google login.
- **Token Generation:** Issues access JWT signed with `JWT_SECRET` containing `{ id, email, tokenVersion }`.
- **Frontend Result:** Stores token in `localStorage`, updates `AuthContext` state, navigates to `/dashboard`.

### 2.3 Password Reset Lifecycle
- **Frontend Component:** `src/pages/Auth/ForgotPassword.jsx` → `src/pages/Auth/ResetPasswordPage.jsx`
- **API Route:** `POST /api/auth/forgot-password` → `POST /api/auth/reset-password`
- **Controller:** `controllers/authController.js` (`forgotPassword`, `resetPassword`)
- **Service:** Generates dedicated reset token signed with `JWT_RESET_SECRET` carrying `purpose: 'password_reset'` and unique random `jti`.
- **Validation:** Rejects ordinary login JWTs; checks `purpose === 'password_reset'`; matches stored single-use `resetTokenJti`. Enforces 8–128 char password policy.
- **Database:** Atomically updates `password` (bcrypt hash), increments `tokenVersion` (invalidates old sessions), clears `resetTokenJti`.
- **Frontend Result:** Toast notification "Password reset successfully", redirects to login.

### 2.4 Resume Upload & Document Extraction
- **Frontend Component:** `src/components/resume/ResumeUploadZone.jsx` (Inside `ResumesPage.jsx` / `UploadModal.jsx`)
- **API Route:** `POST /api/resume/upload` (`multipart/form-data`)
- **Controller:** `controllers/resumeController.js` (`uploadResume`)
- **Middleware:** `middleware/uploadMiddleware.js` (Multer disk storage with `crypto.randomUUID()` filename).
- **Service:** `utils/fileParser.js` (`extractTextFromDocument`)
- **Document Engines:** Real `pdf-parse` v2 (with explicit `parser.destroy()`) and `mammoth` for DOCX.
- **Validation:** Magic-byte validation (`%PDF` / `PK\x03\x04`), 10MB size limit, minimum 50 characters extractable text.
- **Database:** Inserts into `Resume` collection `{ user: req.user._id, originalName, fileName, filePath, extractedText, fileSize }`.
- **Frontend Result:** Resume table refreshes immediately; user can click to run audits.

### 2.5 Authenticated Resume File Download
- **Frontend Component:** `src/pages/ResumesPage.jsx` (`ResumeCard.jsx`)
- **API Route:** `GET /api/resume/:id/file`
- **Controller:** `controllers/resumeController.js` (`downloadResumeFile`)
- **Validation:** `protect` middleware + IDOR check `{ _id: id, user: req.user._id }`.
- **Security Guard:** Rejects anonymous access; direct `/uploads` static serving disabled (returns 403 Forbidden).
- **Service / Stream:** Safe `res.sendFile(path.resolve(resume.filePath))`.
- **Frontend Result:** Browser streams original PDF/DOCX file safely with correct `Content-Disposition`.

### 2.6 Cascade Resume Deletion
- **Frontend Component:** `src/pages/ResumesPage.jsx` (Delete button confirmation modal)
- **API Route:** `DELETE /api/resume/:id`
- **Controller:** `controllers/resumeController.js` (`deleteResume`)
- **Validation:** IDOR verification `{ _id: id, user: req.user._id }`.
- **Database Operations (Atomic Cascade):**
  1. `Resume.findOneAndDelete({ _id: id, user: req.user._id })`
  2. `Analysis.deleteMany({ resume: id, user: req.user._id })`
  3. `ArenaHistory.deleteMany({ userId: req.user._id, $or: [{ 'input.resumeId': id.toString() }, { 'input.resumeId': id }] })`
  4. `InterviewHistory.deleteMany({ resumeId: id, userId: req.user._id })`
- **Filesystem Cleanup:** `fs.existsSync(filePath)` guarded safe async `unlink`.
- **Frontend Result:** Resume row unmounts with smooth fade; dashboard stats decrement automatically.

### 2.7 ATS Resume Audit (Legacy & Arena Engine)
- **Frontend Component:** `src/pages/AnalyzerPage.jsx`
- **API Route:** `POST /api/analysis/ats` or `POST /api/arena/run` with `{ featureId: 'ats_audit' }`
- **Controller:** `controllers/analysisController.js` → delegates to `services/ComparisonEngine.js`
- **Service:** `ComparisonEngine.js` (`executeArenaRun`)
- **Prompt:** Authoritative ATS prompt from `config/features.js`: analyzes keywords, heading integrity, role alignment. Visual layout claims replaced with honest text structure audit.
- **Model:** Default `gemini-2.5-flash` with circuit-breaker fallback to `gemini-2.5-flash-lite`.
- **Validation:** `OutputValidator.js` validates JSON schema, clamps score `[0, 100]`, injects visual disclaimer note.
- **Cache & Storage:** SHA-256 hash cache lookup; persisted to `Analysis` and `ArenaHistory`.
- **Frontend Result:** ATS radial score circle animates, categorized strengths/weaknesses and missing keywords rendered.

### 2.8 Job Description Match
- **Frontend Component:** `src/pages/JDMatchPage.jsx` & `AnalyzerPage.jsx`
- **API Route:** `POST /api/analysis/job-match` or `POST /api/arena/run` with `{ featureId: 'jd_match' }`
- **Controller:** `controllers/analysisController.js` / `arenaController.js`
- **Service:** `ComparisonEngine.js` (`executeArenaRun`)
- **Prompt:** Compares extracted resume text against job description requirements, technical stack, and years of experience.
- **Validation:** `OutputValidator.js` guarantees `matchScore` [0, 100], `matchingSkills` array, `missingSkills` array.
- **Frontend Result:** Match percentage gauge, color-coded skill pill badges, tailored resume adjustment recommendations.

### 2.9 Cover Letter Generator
- **Frontend Component:** `src/pages/CoverLetterPage.jsx`
- **API Route:** `POST /api/analysis/cover-letter` or `POST /api/arena/run` with `{ featureId: 'cover_letter' }`
- **Controller:** `controllers/analysisController.js` / `arenaController.js`
- **Service:** `ComparisonEngine.js` (`executeArenaRun`)
- **Prompt:** Tailors professional cover letter using candidate's actual projects, aligning with company tone and target job description.
- **Validation:** Validates non-empty markdown string; prevents invented contact details.
- **Frontend Result:** Interactive markdown preview with copy-to-clipboard and export-to-PDF buttons.

### 2.10 AI Arena (All 17 Features & Multi-Model Comparison)
- **Frontend Component:** `src/pages/ArenaPage.jsx` (`ArenaWorkspace.jsx`)
- **API Route:** `POST /api/arena/run`
- **Payload:** `{ featureId, input: { resumeId, resumeText, jobDescription }, modelA, modelB, compareMode }`
- **Controller:** `controllers/arenaController.js` (`runArena`)
- **In-Flight Coalescing:** Hashes input via SHA-256; deduplicates concurrent identical runs in memory via `inFlightRuns`.
- **Model Contestants:** Truthful contestants (`gemini-2.5-flash` vs `gemini-2.5-flash-lite`).
- **Engine:** `ComparisonEngine.js` executes models in parallel, scores outputs, calculates winner objectively without mock data.
- **Database:** Saves execution record into `ArenaHistory` with compound cache key `{ userId, cacheKey }`.
- **Frontend Result:** Side-by-side comparison cards with winning model badge, response metrics, and token counts.

### 2.11 AI Copilot (SSE Streaming Chat)
- **Frontend Component:** `src/pages/CopilotPage.jsx` (`AIStreamingOutput.jsx`)
- **API Route:** `POST /api/copilot/chat` (`text/event-stream`)
- **Controller:** `controllers/copilotController.js` (`chatStream`)
- **Service:** Google Generative AI streaming SDK (`model.generateContentStream`)
- **Resilience:** Tracks `chunksSent`; suppresses transparent model retries if partial chunks have already reached client. Registers `req.on('close')` to abort upstream generator on client disconnect.
- **Persistence:** Multi-turn chat session persisted atomically to `CopilotSession` with `{ userId, createdAt }` compound index.
- **Frontend Result:** Real-time token streaming with syntax highlighting and conversation session sidebar.

### 2.12 Resume Bullet Enhancer (Single & Bulk)
- **Frontend Component:** `src/pages/BulletPage.jsx`
- **API Route:** `POST /api/bullets/enhance` & `POST /api/bullets/enhance-bulk`
- **Controller:** `controllers/bulletEnhancerController.js`
- **Service:** `services/bulletEnhancerService.js`
- **Batch Safety:** Enforces max 25 items array boundary; executes items via `Promise.allSettled`.
- **Factuality Rule:** Prohibits invented numerical metrics; replaces ungrounded impact with placeholders (`[$ metric]`).
- **Frontend Result:** Carousel/grid of action-driven bullet variations (Metric-focused, Leadership-focused, Technical).

### 2.13 Weak Language Audit
- **Frontend Component:** `src/pages/WeakLanguagePage.jsx`
- **API Route:** `POST /api/weak-language/text` & `POST /api/weak-language/resume`
- **Controller:** `controllers/weakLanguageController.js`
- **Service:** `services/weakLanguageService.js`
- **Async Execution:** Fully awaited async analysis returning detected passive voice, clichés, and vague adjectives.
- **Frontend Result:** Highlighted text viewer with replacement suggestions and readability score impact.

### 2.14 Resume Rebuilder (Long Resume Support)
- **Frontend Component:** `src/pages/BuilderPage.jsx` / `RebuildPage.jsx`
- **API Route:** `POST /api/rebuild/preview` & `POST /api/rebuild/save`
- **Controller:** `controllers/resumeRebuildController.js`
- **Service:** `services/resumeRebuildService.js`
- **Capacity:** Supports up to 25,000 characters; returns explicit `isTruncated: true` and warning if exceeded.
- **Frontend Result:** Side-by-side split screen showing original parsed text vs restructured modern markdown resume.

### 2.15 Cold Outreach & Networking Email Generator
- **Frontend Component:** `src/pages/OutreachPage.jsx`
- **API Route:** `POST /api/outreach/generate`
- **Controller:** `services/outreachService.js`
- **Prompt:** Generates LinkedIn InMail, recruiter cold email, or peer networking message based on resume experience.
- **Frontend Result:** Multi-template tabbed selector with one-click copy.

### 2.16 Dashboard Analytics & Score Trend
- **Frontend Component:** `src/pages/DashboardPage.jsx`
- **API Route:** `GET /api/analysis/dashboard-stats` & `GET /api/resume`
- **Controller:** `controllers/analysisController.js` (`getDashboardStats`)
- **Query Optimization:** Sorts by `createdAt: -1` and takes top 5, reversing array so line charts render chronologically.
- **Schema Resilience:** Employs fallback property rendering `resume.originalName || resume.fileName || 'Untitled Resume'`.
- **Frontend Result:** Stat cards (Resumes, Audits Run, Average Score), Recharts line chart, and recent activity table.

### 2.17 Public Contact & Feedback
- **Frontend Component:** `src/components/landing/ContactForm.jsx`
- **API Route:** `POST /api/contact/submit`
- **Controller:** `controllers/contactController.js`
- **Security:** Governed by `contactLimiter` (max 5 submissions / 15m), regex email validation, length caps.
- **Database:** Persisted to `ContactQuery` with 90-day automatic MongoDB TTL expiration.
- **Frontend Result:** Toast confirmation "Thank you! Your message has been received."

