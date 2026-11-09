# Regression Test Matrix

**Commit SHA:** `5286307a9f384a461aeaf8b0c68342ad5f16349a`  
**Branch:** `Bug_Fixes`  
**Application:** Resume Copilot  
**Date:** November 10, 2026  

---

## 1. Automated Security & Correctness Regression Tests

| Test Identifier | Regression Target | Test Description / Assertion | Location | Result |
|:---|:---|:---|:---|:---:|
| `REG-AUTH-001` | Reset-Token Confusion (A01) | Submitting an ordinary login JWT to `/api/auth/reset-password` fails with 400 and does not change password | `tests/app.test.js:332` | **PASS** |
| `REG-AUTH-002` | Reset-Token Single-Use Replay (A01) | Submitting the same reset token twice is rejected on second attempt with 400 | `tests/app.test.js:338` | **PASS** |
| `REG-AUTH-003` | Unverified Account Gate (A03) | Direct registered account without OTP verification is rejected with 403 on resume upload | `tests/app.test.js:255` | **PASS** |
| `REG-AUTH-004` | OTP Bound & Hash at Rest (A04) | OTP generation bound allows 999999; database stores one-way SHA-256 hash | `tests/app.test.js:218` | **PASS** |
| `REG-AUTH-005` | OTP Purpose Binding (A05) | Signup OTP submitted to password-reset verify endpoint is rejected with 400 | `tests/app.test.js:235` | **PASS** |
| `REG-AUTH-006` | OTP Attempt Exhaustion (A43) | Submitting 5 consecutive wrong OTP codes invalidates challenge and rejects subsequent attempts | `tests/app.test.js:240` | **PASS** |
| `REG-AUTH-007` | OTP Rate Limiting (A09) | Burst of >15 OTP requests within 15 minutes is blocked with HTTP 429 Too Many Requests | `tests/app.test.js:245` | **PASS** |
| `REG-AUTH-008` | Password Change Policy (A08) | `PUT /api/users/password` with <8 characters is rejected with 400 Bad Request | `tests/app.test.js:360` | **PASS** |
| `REG-AUTH-009` | Session Invalidation on Password Change (A25) | Changing password increments `tokenVersion`; tokens issued prior to change return 401 | `tests/app.test.js:355` | **PASS** |
| `REG-AUTH-010` | Unauthenticated Logout Blocklist (A23) | Anonymous or invalid token submitted to `/api/auth/logout` does not insert a record into `TokenBlocklist` | `tests/app.test.js:375` | **PASS** |
| `REG-AUTH-011` | Google OAuth Identity Check (A24) | Google tokens with `email_verified: false` or wrong audience are rejected with 401 | `tests/app.test.js:410` | **PASS** |
| `REG-FILE-001` | Predictable Filename Elimination (A48) | Simultaneous uploads generate cryptographically secure UUID filenames without collisions | `tests/app.test.js:425` | **PASS** |
| `REG-FILE-002` | Static Upload Access Prohibition (A45) | Anonymous direct GET request to `/uploads/` returns HTTP 403 Forbidden | `tests/app.test.js:445` | **PASS** |
| `REG-FILE-003` | IDOR File Streaming (A45) | User A attempting `GET /api/resume/:id/file` for User B's resume receives HTTP 404 Not Found | `tests/app.test.js:450` | **PASS** |
| `REG-FILE-004` | Cascade Deletion Integrity (A16) | Deleting a resume removes disk file and deletes associated records in `Analysis`, `ArenaHistory`, and `InterviewHistory` | `tests/app.test.js:475` | **PASS** |
| `REG-FILE-005` | Deleted Resume Cache Invalidation (A46) | Querying Arena cache for a deleted or unowned resume returns HTTP 404 immediately | `tests/app.test.js:745` | **PASS** |
| `REG-FILE-006` | Real PDF Document Extraction (A47) | Genuine PDF binary parsed accurately with `pdf-parse` v2; parser destroyed in `finally` | `tests/fileParser.test.js:15` | **PASS** |
| `REG-FILE-007` | Real DOCX Document Extraction (A47) | Genuine DOCX archive parsed accurately with `mammoth` | `tests/fileParser.test.js:40` | **PASS** |
| `REG-FILE-008` | Magic Byte Enforcement (A47) | Files with spoofed extensions lacking PDF/DOCX magic signatures are rejected with 400 | `tests/fileParser.test.js:65` | **PASS** |
| `REG-AI-001` | Truthful Arena Contestants (A06) | Arena compare mode runs distinct backend models; aliased models marked `isAlias: true` | `tests/arena.test.js:25` | **PASS** |
| `REG-AI-002` | In-Flight Promise Coalescing (A20) | Two identical simultaneous requests coalesce in memory; AI provider invoked at most once | `tests/app.test.js:710` | **PASS** |
| `REG-AI-003` | Truthful Validation HTTP Status (A21) | Invalid AI input returns HTTP 400 Bad Request, never a 200 with fake winner | `tests/app.test.js:685` | **PASS** |
| `REG-AI-004` | Hash-Indexed Cache Hit & Staleness (A27) | Identical input hits O(1) cache; modifying resume text creates cache miss | `tests/app.test.js:735` | **PASS** |
| `REG-AI-005` | Output Score Clamping [0, 100] (A10) | Output validator clamps out-of-range scores to [0, 100]; 0 score fallback on parse fail | `tests/outputValidator.test.js:20` | **PASS** |
| `REG-AI-006` | ATS Visual Disclaimer (A17) | ATS audit prompt injects text structure disclaimer; clarifies layout limitations | `tests/outputValidator.test.js:45` | **PASS** |
| `REG-AI-007` | Metric Grounding & Placeholder (A18) | Ungrounded metrics in Resume Boost replaced with `[$ metrics]` / `[X%]` and flagged | `tests/outputValidator.test.js:65` | **PASS** |
| `REG-AI-008` | Salary & Placement Disclaimers (A19) | Salary estimator and placement predictor inject illustrative disclaimers | `tests/outputValidator.test.js:85` | **PASS** |
| `REG-AI-009` | Batch Bullet Enhancement Safety (A22) | Array capped at 25 items; `Promise.allSettled` returns partial results preserving order | `tests/app.test.js:985` | **PASS** |
| `REG-AI-010` | Resume Rebuild 25k & Truncation (A33) | Preserves up to 25,000 characters; flags `isTruncated: true` & `truncationNotice` if over | `tests/app.test.js:1065` | **PASS** |
| `REG-AI-011` | SSE Mid-Stream Interruption (A15) | Interrupted SSE stream emits `event: error` without transparent retry or chunk duplication | `tests/app.test.js:1135` | **PASS** |
| `REG-AI-012` | Copilot Session Ownership & Append (A34) | Cross-user session access rejected; atomic `$push` appends messages without loss | `tests/app.test.js:1115` | **PASS** |
| `REG-SYS-001` | Non-String Input Protection (A38) | Malicious non-string inputs (objects, arrays, numbers) to `.trim()` return 400 Bad Request | `tests/app.test.js:135` | **PASS** |
| `REG-SYS-002` | Payload Too Large 413 Handling (A29) | JSON payloads exceeding 250KB return clean HTTP 413 Payload Too Large | `tests/app.test.js:125` | **PASS** |
| `REG-SYS-003` | Contact Form Rate Limit & TTL (A39) | Rapid contact submissions blocked by `contactLimiter`; schema has 90-day TTL index | `tests/app.test.js:1165` | **PASS** |
| `REG-SYS-004` | Truthful Health Probes (A32, A36) | `/api/health` and `/api/readiness` accurately reflect DB connection state | `tests/app.test.js:75` | **PASS** |
| `REG-SYS-005` | Dashboard Score Trend Order (A30) | Score trend fetches newest 5 records and returns them in chronological order | `tests/app.test.js:875` | **PASS** |

