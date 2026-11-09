# Comprehensive Authentication & Authorization Security Review

**Commit SHA:** `5286307a9f384a461aeaf8b0c68342ad5f16349a`  
**Branch:** `Bug_Fixes`  
**Application:** Resume Copilot (MERN Stack)  
**Security Review Date:** November 10, 2026  

---

## 1. Executive Summary

A rigorous audit of the entire identity and access lifecycle was conducted. Multiple critical vulnerabilities were confirmed on the baseline commit and remediated with code changes and dedicated security regression tests:
- **A01 (Critical):** Reset-token confusion (ordinary login JWT accepted to reset passwords).
- **A03 (High):** Signup bypass granting unverified accounts immediate full access.
- **A04 & A05 (High):** OTP bound off-by-one, plaintext storage, and lack of purpose binding.
- **A08 & A25 (High):** Inconsistent password policies allowing 1-char passwords.
- **A09 & A43 (High):** Unthrottled OTP endpoints vulnerable to SMS/email bombing.
- **A23 & A40 (High):** Unauthenticated logout flooding token blocklist with plaintext JWTs.
- **A24 (High):** Insecure Google OAuth token verification without audience or email verification checks.
- **A35 (High):** Frontend localStorage trust bypass rendering protected routes before profile verification.

---

## 2. Threat Analysis & Security Invariants

### 2.1 Password Reset Token Separation (A01)
- **Vulnerability:** Both login tokens and password-reset credentials were signed with the same `JWT_SECRET`. An attacker possessing any valid access token for a user could submit it directly to `/api/auth/reset-password` and change the victim's password.
- **Remediation Implemented:**
  1. Configured dedicated `JWT_RESET_SECRET` distinct from `JWT_SECRET`.
  2. Embed explicit payload claim `{ id, purpose: 'password_reset', jti }`.
  3. Store unpredictable `resetTokenJti` on the `User` document.
  4. Upon consumption, atomically compare the incoming `jti` and nullify `resetTokenJti` to enforce single-use revocation.
- **Verification Evidence:** `tests/app.test.js:332` (`Ordinary login JWT submitted to reset endpoint is rejected and password is unchanged`).

### 2.2 Direct Signup & Account Verification State Machine (A03)
- **Vulnerability:** Direct user registration (`POST /api/auth/register`) created an account and immediately granted access tokens without verifying email ownership.
- **Remediation Implemented:**
  1. Set `isVerified: false` on initial user registration.
  2. Dispatched 6-digit OTP to the registered email address.
  3. Created `requireVerified` middleware attached to all resume operations and AI tools.
  4. Upon successful OTP verification via `/api/auth/verify-otp`, atomically set `isVerified: true`.
- **Verification Evidence:** `tests/app.test.js:255` (`Direct signup cannot activate unverified account; OTP verification enables expected access`).

### 2.3 OTP Challenge Cryptographic Hardening (A04, A05, A07, A09, A43)
- **Vulnerability:** `crypto.randomInt(100000, 999999)` generated codes in the range [100000, 999998], excluding 999999. Raw plaintext OTPs were written to MongoDB and printed to terminal stdout in development/fallback modes. Challenges had no purpose binding and no per-IP burst throttling.
- **Remediation Implemented:**
  1. **Bound Fix:** Changed generation to `crypto.randomInt(100000, 1000000)` ensuring uniform distribution across all 900,000 combinations.
  2. **Hash at Rest:** Store only the one-way SHA-256 hash `crypto.createHash('sha256').update(otp).digest('hex')` in MongoDB.
  3. **Zero-Log Invariant:** Eliminated all `console.log` statements outputting OTP codes.
  4. **Purpose Binding:** Schema explicitly enforces `purpose: { type: String, enum: ['email_verification', 'password_reset'] }`.
  5. **Attempt Throttling:** Strict cap of 5 failed attempts per challenge; challenge is destroyed once cap is exceeded.
  6. **Rate Limiting:** Mounted `otpLimiter` allowing at most 15 requests per 15 minutes per IP.
- **Verification Evidence:** `tests/app.test.js:218, 235, 240, 245`.

### 2.4 Consistent Password Policy & Session Revocation (A08, A25)
- **Vulnerability:** While registration validated password length, `userController.updatePassword` accepted arbitrary 1-character strings. Changing a password left all previously issued JWTs valid for their entire 30-day lifetime.
- **Remediation Implemented:**
  1. Centralized `validatePasswordPolicy(password)` enforcing 8 to 128 characters across registration, settings change, and password reset.
  2. Added `tokenVersion: { type: Number, default: 0 }` to `User` schema.
  3. Whenever a password is changed or reset, `tokenVersion` is atomically incremented (`$inc: { tokenVersion: 1 }`).
  4. `authMiddleware.js` verifies that `token.tokenVersion === user.tokenVersion`; mismatched tokens are rejected with HTTP 401.
- **Verification Evidence:** `tests/app.test.js:355, 360`.

### 2.5 Token Blocklist Storage Optimization (A23, A40)
- **Vulnerability:** Unauthenticated clients could flood `POST /api/auth/logout` with arbitrary strings, creating unbounded records in `TokenBlocklist`. Raw JWTs were stored in plaintext with an arbitrary 30-day TTL.
- **Remediation Implemented:**
  1. Enforced `protect` middleware on `/api/auth/logout`.
  2. Validated JWT signature before processing logout.
  3. Store SHA-256 hash `tokenHash` instead of raw token strings.
  4. Extract exact JWT expiration (`exp * 1000`) and set `expiresAt` with Mongo TTL index (`expires: 0`), guaranteeing automatic document deletion immediately upon token expiry.
- **Verification Evidence:** `tests/app.test.js:370, 385`.

### 2.6 Google OAuth Token & Identity Validation (A24)
- **Vulnerability:** Google sign-in accepted tokens without validating `email_verified`, allowing unverified external Google accounts to hijack existing accounts.
- **Remediation Implemented:**
  1. Use Google's official `verifyIdToken` with explicit `audience: process.env.GOOGLE_CLIENT_ID`.
  2. Verify payload claims `email_verified === true` and valid Google issuer (`accounts.google.com` or `https://accounts.google.com`).
  3. Bind stable `googleId: payload.sub` to the user account.
- **Verification Evidence:** `tests/app.test.js:390, 410`.

### 2.7 Frontend Authentication Guarding (A35)
- **Vulnerability:** `AuthContext.jsx` initialized `isAuthenticated: !!localStorage.getItem('token')` without server verification, allowing stale or fabricated tokens to transiently display protected dashboard screens before API calls failed.
- **Remediation Implemented:**
  1. Set `isLoading: true` on initial mount.
  2. Immediately issue `authApi.getProfile()` to validate the token against `/api/users/me`.
  3. `ProtectedRoute` renders a fullscreen `PageLoader` until `/me` returns. If invalid, clears `localStorage` and routes to `/login`.
- **Verification Evidence:** Frontend React component tests and build verification.

