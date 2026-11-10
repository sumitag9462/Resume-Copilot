# Resume Copilot 🚀

**Resume Copilot** is a modern, full-stack MERN application powered by Google Gemini AI designed to help job seekers optimize resumes, benchmark against job descriptions, draft tailored cover letters, prepare for interviews, and compare multi-model outputs in an AI Arena.

The application has been stabilized, security-hardened, and redesigned with a clean, human-made UI featuring full **Light & Dark Mode** support.

---

## 🌟 Key Features

### 1. ATS & Resume Intelligence
- **📊 ATS Compatibility Audit**: Deep analysis of resume text structure, heading hierarchy, keyword density, and role alignment with honest layout disclaimers.
- **🎯 Job Description Match**: Compare resume experience against job requirements to identify matching qualifications and critical skill gaps.
- **✉️ Tailored Cover Letter Generator**: Generate professional, role-specific cover letter drafts utilizing verified resume projects and achievements.
- **🎙️ Interview Preparation**: Practice with custom technical and behavioral interview questions tailored to your experience and target role.
- **✍️ Bullet Enhancer & Weak Language Audit**: Detect passive voice, clichés, and vague phrases; transform bullet points into high-impact, action-driven statements.
- **🔄 Structured Resume Rebuilder**: Reconstruct and format extensive resumes (up to 25,000 characters) into clean markdown with explicit truncation notices.

### 2. Modern 17-Feature AI Arena
- **⚔️ Multi-Model Comparison**: Side-by-side evaluation between distinct Gemini models (`gemini-2.5-flash` vs `gemini-2.5-flash-lite`).
- **🛡️ Deterministic Schema Validation (`OutputValidator.js`)**: All 17 features enforce authoritative JSON schemas, clamp scores strictly between `0` and `100`, replace ungrounded metrics with placeholders (`[$ metrics]`), and inject calibration disclaimers.
- **⚡ In-Flight Request Coalescing**: Concurrent identical requests for the same user and inputs share a single active execution promise, eliminating duplicate billing and provider stampedes.
- **📦 Hash-Indexed Caching**: SHA-256 cache indexing over normalized inputs provides instant O(1) retrieval and invalidates automatically on resume text edits.

### 3. AI Copilot (SSE Streaming Chat)
- Real-time Server-Sent Events (SSE) streaming with client disconnect abort handling.
- Mid-stream fault detection that prevents transparent retry text duplication.
- Multi-turn chat session history with strict user ownership isolation.

### 4. Human-Made, Accessible UI with Light & Dark Mode
- Built on conventional UI principles: clean borders, readable typography, and deliberate whitespace with zero generic AI startup tropes (no 3D canvas, no glowing blobs, no fake live statistics counters).
- **Light Theme**: Clean neutral surface (`#FFFFFF` / `#F8FAFC`, `#111827` text, `#2563EB` accent).
- **Dark Theme**: Restrained slate surface (`#0F172A` / `#172033`, `#F8FAFC` text, `#60A5FA` accent).
- Complete authentication suite: **Login**, **Sign Up**, **Email Verification**, **Forgot Password**, and **Reset Password**.

---

## 🛡️ Security & Reliability Architecture

- **Password-Reset Token Separation (A01)**: Dedicated `JWT_RESET_SECRET` distinct from access tokens, purpose claims (`purpose: 'password_reset'`), and single-use random JTI revocation.
- **Cryptographic OTP Hardening (A04, A05)**: Codes stored as one-way SHA-256 hashes at rest, purpose-bound (`email_verification` vs `password_reset`), capped at 5 failed attempts, and rate-limited. Zero plaintext OTP logging.
- **Secure File Storage & IDOR Protection (A45)**: Direct public access to `/uploads` is strictly blocked (HTTP 403). Files stream through authenticated `GET /api/resume/:id/file` with ownership verification.
- **Cascade Deletion Integrity (A16)**: Deleting a resume cascades cleanly across `Analysis`, `ArenaHistory`, and `InterviewHistory` collections, followed by guarded asynchronous disk file removal.
- **Payload & Input Guards (A29, A38)**: 250KB body limit with explicit HTTP 413 handling, type validation guards rejecting non-string inputs to `.trim()`, and sensitive credential redaction in logs.
- **Reliable Server Lifecycle (A36, A37)**: Awaits MongoDB connection before binding network sockets; handles SIGINT/SIGTERM with graceful connection drains; preserves host DNS configuration.

---

## 🛠️ Technology Stack

### Frontend (`ai-resume-frontend`)
- **React 18** with **Vite 5**
- **Tailwind CSS** (Utility-first styling with `darkMode: 'class'`)
- **Lucide React** (Icons)
- **Recharts** (Visualizing ATS scores and trends)
- **React Router 6** (Client-side routing)
- **React Hot Toast** (Accessible notifications)

### Backend (`ai-resume-backend`)
- **Node.js** (v18.0.0 or higher) with **Express 5**
- **MongoDB** with **Mongoose**
- **Google Generative AI SDK** (`@google/generative-ai`)
- **Document Extractors**: Real unmocked `pdf-parse` v2 and `mammoth` (DOCX)
- **Security**: `helmet`, `bcryptjs`, `jsonwebtoken`, `express-rate-limit`, `google-auth-library`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `>=18.0.0`
- **npm** `>=9.0.0`
- **MongoDB** instance (local or Atlas)
- **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/sumitag9462/Resume-Copilot.git
cd Resume-Copilot

# Install root dependencies
npm install

# Install Frontend dependencies
cd ai-resume-frontend
npm install

# Install Backend dependencies
cd ../ai-resume-backend
npm install
```

### 2. Environment Configuration

#### Backend Configuration
Create a `.env` file in `ai-resume-backend/`:

```bash
cd ai-resume-backend
cp .env.example .env
```

Configure the environment variables:
```env
# Required Database & Auth Secrets
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_primary_access_jwt_secret_key
JWT_RESET_SECRET=your_dedicated_password_reset_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key

# Client & CORS
CLIENT_URL=http://localhost:3000

# Optional Email Delivery (Brevo)
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=your_verified_email@example.com

# Optional Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Server Port (Default: 5000)
PORT=5000
```

#### Frontend Configuration
Create a `.env` file in `ai-resume-frontend/`:

```bash
cd ../ai-resume-frontend
cp .env.example .env
```

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000/api
```

### 3. Running Locally

From the root project directory:

```bash
# Start frontend development server (runs on http://localhost:3000)
npm run dev:frontend

# Start backend API server (runs on http://localhost:5000)
npm run dev:backend
```

Or run both concurrently:
```bash
npm run dev
```

---

## 🧪 Testing & Quality Gates

The codebase enforces strict quality gates across both frontend and backend.

### Backend Automated Test Suite
The backend includes 114 automated unit, integration, and security regression tests:

```bash
cd ai-resume-backend
npm test
```

Test suite coverage:
- `tests/app.test.js`: 71 integration & security tests (Auth, OTP, cascades, timeouts, streaming, contact spam).
- `tests/arena.test.js`: 18 tests (Contestant truthfulness, in-flight coalescing, cache staleness, HTTP 400 validation).
- `tests/outputValidator.test.js`: 15 tests (Score clamping [0–100], visual disclaimers, metric placeholder grounding).
- `tests/fileParser.test.js`: 10 tests (Real unmocked PDF/DOCX binary extraction, magic bytes, parser memory destruction).

**Result:** `114 passed, 0 failed, 0 skipped`.

### Frontend Quality Gates
```bash
cd ai-resume-frontend

# Run ESLint (0 errors, 0 warnings enforced)
npm run lint

# Run production build
npm run build
```

**Result:** Production build compiles cleanly in ~3.0s into `dist/`.

---

## 📚 Audit & Stabilization Documentation

For detailed technical findings, architecture diagrams, and verification reports, explore the [`docs/`](docs/) directory:

- [`docs/audit/FILE_INVENTORY.md`](docs/audit/FILE_INVENTORY.md): Comprehensive 86-file first-party codebase inventory and inspection depth.
- [`docs/audit/FEATURE_FLOW_MAP.md`](docs/audit/FEATURE_FLOW_MAP.md): Complete end-to-end trace from React components to Express, Gemini AI, and MongoDB.
- [`docs/audit/API_ROUTE_MATRIX.md`](docs/audit/API_ROUTE_MATRIX.md): Detailed endpoint inventory, authentication, input validation, and responsible tests.
- [`docs/audit/AUTHENTICATION_SECURITY_REVIEW.md`](docs/audit/AUTHENTICATION_SECURITY_REVIEW.md): In-depth security analysis of JWT reset separation, OTP hashing, and session management.
- [`docs/audit/COMPLETE_FINDINGS.md`](docs/audit/COMPLETE_FINDINGS.md): Authoritative log of all 50 resolved defects (**A01–A44** and **NEW-001–NEW-006**).
- [`docs/audit/REGRESSION_TEST_MATRIX.md`](docs/audit/REGRESSION_TEST_MATRIX.md): Traceability matrix mapping every resolved defect to automated test assertions.
- [`docs/audit/FINAL_VERIFICATION_REPORT.md`](docs/audit/FINAL_VERIFICATION_REPORT.md): Final engineering sign-off report against quality gates.
- [`docs/audit/UNRESOLVED_ISSUES.md`](docs/audit/UNRESOLVED_ISSUES.md): Analysis of residual risks and dependency roadmap.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
