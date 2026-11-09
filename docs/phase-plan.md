# Stabilization Phase Plan & Sequencing Strategy

**Application:** Resume Copilot (MERN + Google Gemini AI)  
**Target Branch:** `Bug_Fixes`  
**Base Commit:** `5286307a9f384a461aeaf8b0c68342ad5f16349a`  
**Date:** November 9, 2026

---

## 1. Sequencing Principles & Invariants

To eliminate regression risks and prevent breaking production user flows:
1. **Never break existing API contracts** for active frontend components.
2. **Prioritize critical security boundaries first** (CORS, file uploads, authentication boundaries) before modifying data structures.
3. **Database schema migrations must be idempotent, backwards-compatible, and non-destructive.**
4. **All critical security fixes must be paired with automated regression tests.**
5. **No commit/push without explicit user authorization.**

---

## 2. Phase Breakdown

### Phase 1: Critical Security & Authentication Hardening
- **Objective:** Close severe remote attack surfaces without modifying internal schema structures.
- **Scope & Items:**
  - `A04`: Enforce CORS whitelist in `app.js` (reject unlisted origins; support local dev ports `5173`, `3000`).
  - `A05`: Secure `/uploads` static route. Disallow unauthenticated public file access; route downloads through authenticated endpoint or verify bearer token.
  - `A06` & `A07`: Secure OTP handling: hash OTP values in MongoDB with `bcrypt`, eliminate terminal plaintext OTP leakage in production/dev fallback.
  - `A08`: Enforce minimum password length (>= 8 characters) and complexity in `userController.updatePassword`.
  - `A09` & `A10`: Implement strict rate limiters on `requestEmailOtp`, `requestPasswordResetOtp` (5 req / 15 min), and public `submitQuery` contact endpoint (5 req / hour).
  - `A11` & `A12`: Sanitize user inputs in prompt construction (`features.js` and `copilotController.js`) using explicit delimiters to mitigate prompt injection.
  - `A13`: Address critical vulnerability (`proxy-addr`) via dependency update / npm resolution.
- **Verification Gate:**
  - Run `npm test` in `ai-resume-backend` ensuring all 51 baseline tests pass.
  - Add new security regression tests for CORS rejection, unauthorized static file access, password validation, and OTP hashing.

---

### Phase 2: Data Integrity, Cascades & Model Reliability
- **Objective:** Fix broken relational cascade deletions and schema inconsistencies.
- **Scope & Items:**
  - `A16` & `A44`: Correct `ArenaHistory` cascade deletion in `resumeController.deleteResume`:
    - Target: `ArenaHistory.deleteMany({ userId: req.user._id, 'input.resumeId': resume._id.toString() })`.
    - Fix test in `app.test.js` to create an `ArenaHistory` record and assert its deletion.
  - `A17`: Standardize cross-model user referencing: add virtuals or backward-compatible query getters for `user` vs `userId`.
  - `A18`: Update Mongoose options: replace deprecated `{ new: true }` with `{ returnDocument: 'after' }` in `userController.js`.
  - `A19`: Ensure atomic operations for user usage updates in `arenaController.js`.
  - `A20` & `A21`: Ensure standalone bullet and weak language controllers persist data consistently to `ResumeBoost` and `WeakLanguage`.
  - `NEW-003` & `NEW-005`: Guard disk file unlinking with `fs.existsSync` to prevent unhandled sync crashes.
- **Verification Gate:**
  - Run full backend test suite with cascade deletion verification.
  - 0 Mongoose deprecation warnings.

---

### Phase 3: Backend Architecture & Dead Code Cleanup
- **Objective:** Clean up unused routes, services, and models without affecting existing clients.
- **Scope & Items:**
  - `A22`: Deprecate orphaned models `InterviewPrep.js` and `VoiceInterviewSession.js`.
  - `A23`: Document dual API routing (`/api/analysis/*` vs `/api/arena/run`); maintain backward-compatible proxy/adapter for legacy clients.
  - `A24`: Remove or mount unmounted `resumeBoostRoutes.js`.
  - `A25`: Clarify model aliasing in `config/models.js` (`gemini-pro`).
  - `A26` & `A27`: Consolidate `generateToken` and `sendEmail` into centralized utilities; remove duplicate inline implementations in `authController.js`.
  - `A28`, `A29`, `A30`: Remove unused service methods, expand JSON body limit to `500kb`, standardize on `req.user._id`.
  - `NEW-002`, `NEW-004`: Remove commented code; standardize error payload envelopes.
- **Verification Gate:**
  - Run backend test suite and measure code coverage increase.

---

### Phase 4: Frontend Routing, UX & API Alignment
- **Objective:** Fix broken UI navigation, align API client URLs, and eliminate dead frontend files.
- **Scope & Items:**
  - `A31`: Align Vite proxy port (`5001`) with backend default (`5001` or `5000`).
  - `A32`: Fix Copilot API fallback URL in `copilotApi.js` to use relative `/api`.
  - `A33`: Mount Resume Builder route (`/builder`) in `App.jsx` under `DashboardLayout`.
  - `A34` & `A35`: Remove obsolete duplicate files (`LoginPage.jsx`, `RegisterPage.jsx`) and clean up `VersionComparePage.jsx`.
  - `A36`: Move out-of-order import in `BillingDashboard.jsx` to file top.
  - `A37`: Populate `resumeText` properly when an existing resume is selected in `AnalyzerPage.jsx`.
  - `A38`: Deprecate unused methods in `analysisApi.js`.
  - `A39`: Check JWT token expiration on app launch and before long runs in `AuthContext.jsx`.
  - `A40`: Add localized route error boundaries around tool screens.
  - `NEW-001`: Remove committed Google Client ID from tracked `.env`; place in `.env.example`.
- **Verification Gate:**
  - `npm run build` succeeds in `ai-resume-frontend`.
  - `npm run lint` passes with 0 warnings.
  - Manual browser / contract verification of routes.

---

### Phase 5: Performance, Tests & Production Readiness
- **Objective:** Bundle optimization, frontend testing baseline, and full regression sign-off.
- **Scope & Items:**
  - `A41`: Implement code-splitting (`React.lazy` + `Suspense`) in `App.jsx` to reduce the 2.4MB vendor bundle.
  - `A42`: Consolidate conflicting ESLint configurations into single format.
  - `A43`: Set up Vitest smoke test suite for frontend critical paths (Auth, Dashboard, Analyzer).
  - Run full end-to-end integration test suite across backend and frontend.
- **Verification Gate:**
  - All backend tests PASS (including new security tests).
  - All frontend tests PASS.
  - Frontend bundle split into manageable chunks (< 500KB per vendor chunk).
  - Clean `git status`.

---

## 3. Database Migration & Rollback Strategy

1. **Idempotency Guarantee:**
   - Any script updating user schemas or owner references (`user` vs `userId`) will check field presence before writing:
     ```javascript
     // Safe migration pattern:
     db.arenahistories.updateMany(
       { user: { $exists: false }, userId: { $exists: true } },
       [{ $set: { user: "$userId" } }]
     );
     ```
2. **Reversibility:**
   - Retain both fields during transition; avoid dropping existing fields until all active deployments confirm stability.
3. **Rollback Procedures:**
   - Every phase is committed as an isolated, reviewable Git commit.
   - Reverting a phase requires only `git revert <commit-sha>` with zero database schema drops.

