# Baseline Test Results

**Commit:** `5286307a9f384a461aeaf8b0c68342ad5f16349a`  
**Branch:** `Bug_Fixes`  
**Date:** November 9, 2026  
**Node.js:** v26.5.0 | **npm:** 11.17.0

---

## Backend Tests (`ai-resume-backend`)

### Command & Result

```bash
cd ai-resume-backend && npm test
```

```
Test Suites: 2 passed, 2 total
Tests:       51 passed, 51 total
Snapshots:   0 total
Time:        4.426 s
```

**All 51 tests PASS.** Tests run on MongoMemoryServer (ephemeral in-memory DB).

### Warnings Observed

1. `[MONGOOSE] Warning: mongoose: the 'new' option for findOneAndUpdate() and findOneAndReplace() is deprecated. Use returnDocument: 'after' instead.`
2. Two expected `console.error` outputs for invalid/expired token tests in authMiddleware.

### Test Infrastructure Notes

- Tests mock Gemini AI, Brevo, and Nodemailer (no external API calls)
- File parser is mocked for upload tests
- `afterEach` cleans all 12 collections
- Uses `mongodb-memory-server` v11.2.0

---

## Frontend Build (`ai-resume-frontend`)

### Command & Result

```bash
cd ai-resume-frontend && npm run build
```

```
✓ 2018 modules transformed.
✓ built in 3.46s

dist/index.html                           1.07 kB │ gzip:   0.54 kB
dist/assets/index-B5RqKgaC.css          123.34 kB │ gzip:  18.58 kB
dist/assets/vendor-react-DmpAVQNs.js    163.02 kB │ gzip:  53.22 kB
dist/assets/vendor-ui-Dah1bp0x.js       222.24 kB │ gzip:  73.00 kB
dist/assets/index-DJFYEqVf.js         2,418.19 kB │ gzip: 663.56 kB
```

**Build succeeds.** Warning about chunk size (2.4 MB main bundle) — no code-splitting.

### Static Reference Warning

```
/noise.png referenced in /noise.png didn't resolve at build time, it will remain unchanged to be resolved at runtime
```

---

## npm Audit Results

### Backend: 27 vulnerabilities

| Severity | Count |
|----------|-------|
| Low | 3 |
| Moderate | 12 |
| High | 11 |
| **Critical** | **1** |

**Critical:** `proxy-addr` — IP spoofing via IPv4-mapped IPv6 trust subnet (GHSA-jqcg-44mw-7w3h)  
**High:** `qs` — array-limit bypass, DoS via `isBuffer`, `toString` crash

### Frontend: 18 vulnerabilities

| Severity | Count |
|----------|-------|
| Moderate | 6 |
| High | 11 |
| **Critical** | **1** |

**Critical:** Not detailed in output (likely transitive dependency)  
**High:** `source-map-js` DoS, `zod` memory exhaustion

---

## Frontend Lint

### Command & Result

```bash
cd ai-resume-frontend && npm run lint
```

```
> resume-copilot-frontend@1.0.0 lint
> eslint src --ext js,jsx --max-warnings 0
```

**Status:** **PASS** (0 warnings, 0 errors). Code adheres to configured ESLint rules.
However, note that two ESLint configuration files exist (`.eslintrc.cjs` and `eslint.config.js`) which will be consolidated in Phase 4.

---

## Port Configuration

| Component | Configured Port | Source |
|-----------|----------------|--------|
| Backend server.js | `process.env.PORT` or `5000` | server.js:L36 |
| Frontend dev server | `5173` | vite.config.js |
| Vite API proxy target | `http://localhost:5001` | vite.config.js:L10 |
| Root package.json dev script | Forces `--port 3000` | package.json:L5 |

**BUG:** Vite proxy targets port `5001` but backend defaults to `5000`. Dev proxy will fail unless backend `.env` sets `PORT=5001`.

---

## Frontend Test Infrastructure

**No frontend tests exist.** No test runner, no test files, no test script in `package.json`.

