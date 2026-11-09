# Authoritative Backend API Route Matrix

**Commit SHA:** `5286307a9f384a461aeaf8b0c68342ad5f16349a`  
**Branch:** `Bug_Fixes`  
**Verification Date:** November 10, 2026  

---

## Complete Registered Endpoints

| HTTP Method | Route | Authentication | Authorization | Input Validation | Response Shape | Responsible Test |
|:---|:---|:---:|:---:|:---|:---|:---|
| `POST` | `/api/auth/register` | None | Public | Email format, password 8–128 chars, name required | `{ success: true, message: string, user: object }` | `tests/app.test.js:150` |
| `POST` | `/api/auth/login` | None | Public | Email & password required, string type guards | `{ success: true, token: string, user: object }` | `tests/app.test.js:180` |
| `POST` | `/api/auth/send-otp` | None | Public (Rate Limited) | Valid email format, purpose enum | `{ success: true, message: string }` | `tests/app.test.js:210` |
| `POST` | `/api/auth/verify-otp` | None | Public (Rate Limited) | Email, 6-digit OTP string, purpose enum | `{ success: true, message: string, token?: string }` | `tests/app.test.js:230` |
| `POST` | `/api/auth/forgot-password` | None | Public (Rate Limited) | Valid email format | `{ success: true, message: string }` | `tests/app.test.js:315` |
| `POST` | `/api/auth/reset-password` | Bearer (Reset Token) | Valid JTI & Purpose | Reset token, password 8–128 chars | `{ success: true, message: string }` | `tests/app.test.js:330` |
| `POST` | `/api/auth/google` | None | Public | Google credential ID token or access token | `{ success: true, token: string, user: object }` | `tests/app.test.js:390` |
| `POST` | `/api/auth/logout` | Bearer Token | User Own Session | Valid JWT signature | `{ success: true, message: string }` | `tests/app.test.js:370` |
| `GET` | `/api/users/me` | Bearer Token | User Own Record | None | `{ success: true, user: object }` | `tests/app.test.js:345` |
| `PUT` | `/api/users/password` | Bearer Token | User Own Record | Current password, new password (min 8 chars) | `{ success: true, message: string }` | `tests/app.test.js:360` |
| `PUT` | `/api/users/profile` | Bearer Token | User Own Record | Name string (max 100 chars) | `{ success: true, user: object }` | `tests/app.test.js:348` |
| `POST` | `/api/resume/upload` | Bearer Token | Verified User (`requireVerified`) | File format (PDF/DOCX), max 10MB, magic bytes | `{ success: true, resume: object }` | `tests/app.test.js:420` |
| `GET` | `/api/resume` | Bearer Token | User Own Resumes | None | `{ success: true, resumes: array }` | `tests/app.test.js:435` |
| `GET` | `/api/resume/:id` | Bearer Token | IDOR Verification | Valid Mongo ObjectId | `{ success: true, resume: object }` | `tests/app.test.js:438` |
| `GET` | `/api/resume/:id/file` | Bearer Token | IDOR Verification | Valid Mongo ObjectId | Stream (PDF/DOCX binary) | `tests/app.test.js:440` |
| `DELETE`| `/api/resume/:id` | Bearer Token | IDOR Verification | Valid Mongo ObjectId | `{ success: true, message: string }` | `tests/app.test.js:475` |
| `POST` | `/api/analysis/ats` | Bearer Token | Verified User | ResumeId or direct text (min 50 chars) | `{ success: true, analysis: object }` | `tests/app.test.js:845` |
| `POST` | `/api/analysis/job-match` | Bearer Token | Verified User | ResumeId/text + Job description (min 20 chars) | `{ success: true, analysis: object }` | `tests/app.test.js:920` |
| `POST` | `/api/analysis/cover-letter`| Bearer Token | Verified User | ResumeId/text + Company name + Job description | `{ success: true, coverLetter: string }` | `tests/app.test.js:940` |
| `GET` | `/api/analysis/history` | Bearer Token | User Own History | Page & limit bounds (max 100) | `{ success: true, history: array, total: number }` | `tests/app.test.js:860` |
| `GET` | `/api/analysis/dashboard-stats`| Bearer Token | User Own Stats | None | `{ success: true, stats: object }` | `tests/app.test.js:875` |
| `POST` | `/api/arena/run` | Bearer Token | Verified User | `featureId` in registry, input object | `{ success: true, runId: string, results: object }` | `tests/arena.test.js:1` |
| `GET` | `/api/arena/history` | Bearer Token | User Own History | Page & limit bounds (max 100) | `{ success: true, history: array }` | `tests/app.test.js:765` |
| `GET` | `/api/arena/history/:id` | Bearer Token | IDOR Verification | Valid Mongo ObjectId | `{ success: true, entry: object }` | `tests/arena.test.js:15` |
| `POST` | `/api/copilot/chat` | Bearer Token | Verified User | Messages array (max 50 items, max 4k chars each) | `text/event-stream` (SSE tokens) | `tests/app.test.js:1120` |
| `GET` | `/api/copilot/sessions` | Bearer Token | User Own Sessions | None | `{ success: true, sessions: array }` | `tests/app.test.js:1100` |
| `GET` | `/api/copilot/sessions/:id` | Bearer Token | IDOR Verification | Valid Mongo ObjectId | `{ success: true, session: object }` | `tests/app.test.js:1115` |
| `POST` | `/api/bullets/enhance` | Bearer Token | Verified User | Bullet string (5–1000 chars), optional jobRole | `{ success: true, data: object }` | `tests/app.test.js:960` |
| `POST` | `/api/bullets/enhance-bulk`| Bearer Token | Verified User | Array of strings (1–25 items, 5–1000 chars each) | `{ success: true, data: array, count: number }` | `tests/app.test.js:980` |
| `POST` | `/api/weak-language/text` | Bearer Token | Verified User | Text string (min 10 chars, max 20,000 chars) | `{ success: true, data: object }` | `tests/app.test.js:1010` |
| `POST` | `/api/weak-language/resume`| Bearer Token | Verified User | Valid resume ObjectId | `{ success: true, data: object }` | `tests/app.test.js:1020` |
| `POST` | `/api/rebuild/preview` | Bearer Token | Verified User | ResumeId or text (max 25,000 chars) | `{ success: true, data: object }` | `tests/app.test.js:1060` |
| `POST` | `/api/rebuild/save` | Bearer Token | Verified User | ResumeId, title, restructuredText | `{ success: true, rebuild: object }` | `tests/app.test.js:1075` |
| `POST` | `/api/boost/section` | Bearer Token | Verified User | Section name & content string | `{ success: true, data: object }` | `tests/app.test.js:1030` |
| `POST` | `/api/interview/generate` | Bearer Token | Verified User | ResumeId or text + targetRole | `{ success: true, questions: array }` | `tests/app.test.js:1085` |
| `POST` | `/api/outreach/generate` | Bearer Token | Verified User | ResumeId/text + targetPerson + company | `{ success: true, outreach: object }` | `tests/app.test.js:1095` |
| `POST` | `/api/contact/submit` | None | Public (Rate Limited) | Name, valid email, message (10–2000 chars) | `{ success: true, message: string }` | `tests/app.test.js:1165` |
| `GET` | `/api/health` | None | Public | None | `{ status: "ok", uptime: number, timestamp: string }` | `tests/app.test.js:75` |
| `GET` | `/api/readiness` | None | Public | Verifies DB connection state | `{ status: "ready", database: "connected" }` | `tests/app.test.js:80` |

