jest.mock('../utils/fileParser', () => ({
  parseFile: jest.fn(async (filePath) => {
    if (filePath && filePath.includes('empty')) {
      return 'Short text'; // < 50 chars triggers validation failure
    }
    return 'Senior Software Engineer with 5+ years of experience in JavaScript, Node.js, Express, React, and MongoDB. Built scalable RESTful microservices, led engineering teams, and optimized database queries.';
  })
}));

jest.mock('axios', () => ({
  post: jest.fn(async () => ({ data: { messageId: 'mock-brevo-id' } })),
  get: jest.fn(async () => ({ data: { email: 'google@test.com', name: 'Google User' } }))
}));

jest.mock('../services/geminiService', () => ({
  analyzeResume: jest.fn(async (text) => {
    if (text === 'TRIGGER_MALFORMED_AI') {
      return { missingKeywords: ['Leadership'] }; // Missing atsScore and overallScore -> triggers assertShape
    }
    if (text === 'TRIGGER_AI_FAILURE') {
      const err = new Error('Gemini API 503 Service Unavailable');
      err.statusCode = 503;
      throw err;
    }
    return {
      atsScore: 88,
      overallScore: 92,
      missingKeywords: ['Leadership'],
      suggestions: ['Add more action verbs', 'Highlight measurable results'],
      grammarIssues: [],
      sectionFeedback: {
        summary: 'Good summary',
        experience: 'Strong experience section',
        education: 'Clear education section',
        skills: 'Skills section is well organized',
        projects: 'Projects section is concise'
      },
      strengths: ['Strong formatting'],
      weaknesses: ['Needs more specific accomplishments']
    };
  }),

  matchResumeWithJob: jest.fn(async () => ({
    matchScore: 80,
    skillCoverage: 75,
    keywordCoverage: 70,
    matchedSkills: ['JavaScript', 'Node.js'],
    missingSkills: ['React'],
    recommendations: ['Include React projects', 'Add more frontend examples'],
    verdict: 'Moderate Match',
    summary: 'Resume has a solid foundation but needs more direct job alignment.'
  })),

  generateCoverLetter: jest.fn(async () => ({
    coverLetter: 'Dear Hiring Manager, ...',
    wordCount: 120,
    keyHighlights: ['Strong communicator', 'Results-oriented', 'Technical proficiency']
  }))
}));

jest.mock('../services/aiHelper', () => ({
  generateContentWithFallback: jest.fn(async (prompt) => {
    if (prompt.includes('Rewrite the resume bullet') || prompt.includes('bullet point')) {
      return {
        response: {
          text: () => JSON.stringify({
            success: true,
            original: 'managed team',
            enhanced: 'Led a cross-functional engineering team of 6 engineers to deliver scalable microservices.'
          })
        }
      };
    }
    if (prompt.includes('weak verbs') || prompt.includes('weak phrase')) {
      return {
        response: {
          text: () => JSON.stringify({
            scoreImprovement: 15,
            weakPhrases: [
              { original: 'helped with', reason: 'Weak action verb', improved: 'Spearheaded' }
            ],
            recommendations: ['Replace passive verbs with active metrics.']
          })
        }
      };
    }
    if (prompt.includes('interview questions')) {
      return {
        response: {
          text: () => JSON.stringify({
            matchPercentage: 85,
            strongSkills: ['Node.js', 'React'],
            weakSkills: ['Docker'],
            questions: [
              {
                type: 'Technical',
                difficulty: 'Medium',
                question: 'Explain JWT authentication lifecycle.',
                expectedAnswer: 'JWT includes header, payload, and signature.',
                keywords: ['Bearer', 'Signature', 'Expiry'],
                followup: 'How do you handle token revocation?',
                tips: 'Mention blocklisting tokens.'
              }
            ]
          })
        }
      };
    }
    if (prompt.includes('cold outreach package')) {
      return {
        response: {
          text: () => JSON.stringify({
            emailSubject: 'Excited about Frontend Role at Acme',
            emailBody: 'Dear Hiring Manager, I noticed your opening...',
            linkedinMessage: 'Hi, I would love to connect!'
          })
        }
      };
    }
    return {
      response: {
        text: () => JSON.stringify({ success: true })
      }
    };
  }),
  extractAndCleanJSON: (text) => {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    return match ? match[0] : text.trim();
  }
}));

jest.mock('../services/KeyManager', () => ({
  getGenAIInstance: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn(async () => ({
        response: {
          text: () => 'Optimizing Full Stack Resume',
          candidates: [{ finishReason: 'STOP' }],
          usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 15, totalTokenCount: 25 }
        }
      })),
      startChat: jest.fn(() => ({
        sendMessageStream: jest.fn(async function* () {
          yield { text: () => 'Hello from AI Copilot stream.' };
        })
      }))
    }))
  })),
  getNextKey: jest.fn(() => 'mock-gemini-key')
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(async () => true)
  }))
}));

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_SECRET = 'test-secret';

const app = require('../app');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const OTP = require('../models/OTP');
const TokenBlocklist = require('../models/TokenBlocklist');
const CopilotSession = require('../models/CopilotSession');
const InterviewHistory = require('../models/InterviewHistory');
const ContactQuery = require('../models/ContactQuery');
const WeakLanguage = require('../models/WeakLanguage');
const ResumeBoost = require('../models/ResumeBoost');
const ResumeBoostHistory = require('../models/ResumeBoostHistory');
const ArenaHistory = require('../models/ArenaHistory');

const samplePdfPath = path.join(__dirname, 'fixtures', 'sample.pdf');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Resume.deleteMany({}),
    Analysis.deleteMany({}),
    OTP.deleteMany({}),
    TokenBlocklist.deleteMany({}),
    CopilotSession.deleteMany({}),
    InterviewHistory.deleteMany({}),
    ContactQuery.deleteMany({}),
    WeakLanguage.deleteMany({}),
    ResumeBoost.deleteMany({}),
    ResumeBoostHistory.deleteMany({}),
    ArenaHistory.deleteMany({})
  ]);

  const uploadDir = path.join(__dirname, '..', 'uploads', 'resumes');
  if (fs.existsSync(uploadDir)) {
    for (const file of fs.readdirSync(uploadDir)) {
      try {
        fs.unlinkSync(path.join(uploadDir, file));
      } catch (e) {}
    }
  }
});

const createUserAndToken = async (email = 'test@example.com', name = 'Test User', password = 'password123') => {
  const user = await User.create({
    name,
    email,
    password,
    place: 'New York',
    mobile: '1234567890'
  });
  const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '30d' });
  return { user, token };
};

describe('Resume Copilot Backend API - Comprehensive Test Suite', () => {

  // ============================================================
  // 1. HEALTH & ROOT ENDPOINT
  // ============================================================
  describe('Health & Root Endpoint', () => {
    test('GET / responds with API running message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Resume Copilot API is running' });
    });
  });

  // ============================================================
  // 2. AUTHENTICATION & AUTHORIZATION
  // ============================================================
  describe('Authentication & Authorization', () => {
    test('POST /api/auth/register returns 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Email is required/);
    });

    test('POST /api/auth/register returns 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'not-an-email' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Invalid email format/);
    });

    test('POST /api/auth/register returns 400 for password shorter than 8 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Short Pass User', email: 'short@example.com', password: '123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/at least 8 characters/);
    });

    test('POST /api/auth/register returns 400 for missing name in direct registration', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'noname@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Name is required/);
    });

    test('POST /api/auth/register returns 400 for duplicate email', async () => {
      await createUserAndToken('existing@example.com');

      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'existing@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/already exists/);
    });

    test('POST /api/auth/register directly registers user with complete profile', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Direct Register',
          email: 'direct@example.com',
          password: 'password123',
          careerStage: 'Professional',
          desiredRole: 'SDE'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('direct@example.com');
    });

    test('POST /api/auth/register initiates OTP and /api/auth/verify-otp completes registration', async () => {
      const email = 'otpflow@example.com';
      const password = 'password123';

      const otpReqRes = await request(app)
        .post('/api/auth/register')
        .send({ email });

      expect(otpReqRes.status).toBe(200);
      expect(otpReqRes.body.success).toBe(true);

      const otpDoc = await OTP.findOne({ email }).sort({ createdAt: -1 });
      expect(otpDoc).toBeDefined();

      const verifyRes = await request(app)
        .post('/api/auth/verify-otp')
        .send({ name: 'OTP User', email, password, otp: otpDoc.otp });

      expect(verifyRes.status).toBe(201);
      expect(verifyRes.body.success).toBe(true);
      expect(verifyRes.body.token).toBeDefined();

      // Verify OTP records for this email were cleared after verification
      const remainingOtp = await OTP.findOne({ email });
      expect(remainingOtp).toBeNull();
    });

    test('POST /api/auth/verify-otp rejects invalid or expired OTP', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ name: 'Bad OTP', email: 'none@example.com', password: 'password123', otp: '000000' });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Invalid or expired/);
    });

    test('POST /api/auth/login returns 200 with JWT for valid credentials', async () => {
      await createUserAndToken('login@example.com', 'Login User', 'password123');

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('login@example.com');
    });

    test('POST /api/auth/login returns 401 for incorrect password', async () => {
      await createUserAndToken('login2@example.com', 'Login User 2', 'password123');

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login2@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Invalid email or password/);
    });

    test('POST /api/auth/login returns 401 for non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Invalid email or password/);
    });

    test('GET /api/auth/me returns profile for authenticated user', async () => {
      const { token, user } = await createUserAndToken('me@example.com', 'Me User');

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('me@example.com');
      expect(response.body.password).toBeUndefined(); // Password must never be leaked
    });

    test('Protected route rejects missing Authorization header with 401', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Not authorized, no token/);
    });

    test('Protected route rejects invalid JWT token with 401', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.tampered.jwt');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Invalid token or has expired/);
    });

    test('Protected route rejects expired JWT token with 401', async () => {
      const user = await User.create({ name: 'Expired User', email: 'expired@test.com', password: 'password123' });
      const expiredToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '0s' });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Invalid token or has expired/);
    });

    test('POST /api/auth/logout revokes JWT via TokenBlocklist', async () => {
      const { token } = await createUserAndToken('logout@example.com');

      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      // Verify token is in blocklist
      const blocked = await TokenBlocklist.findOne({ token });
      expect(blocked).toBeDefined();

      // Subsequent access using revoked token must be rejected
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(meRes.status).toBe(401);
      expect(meRes.body.message).toMatch(/token revoked/);
    });
  });

  // ============================================================
  // 3. PASSWORD RESET FLOW & USER SETTINGS
  // ============================================================
  describe('Password Reset & User Settings', () => {
    test('Password reset flow: request OTP -> verify OTP -> reset password with short-lived token', async () => {
      const { user } = await createUserAndToken('resetme@example.com', 'Reset User', 'oldPassword123');

      // Step 1: Request password reset OTP
      const forgotRes = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'resetme@example.com' });

      expect(forgotRes.status).toBe(200);

      const otpDoc = await OTP.findOne({ email: 'resetme@example.com' }).sort({ createdAt: -1 });
      expect(otpDoc).toBeDefined();

      // Step 2: Verify reset OTP -> receive reset token
      const verifyRes = await request(app)
        .post('/api/auth/verify-reset-otp')
        .send({ email: 'resetme@example.com', otp: otpDoc.otp });

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.success).toBe(true);
      expect(verifyRes.body.resetToken).toBeDefined();

      // Step 3: Reset password
      const resetRes = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: verifyRes.body.resetToken, password: 'newBrandNewPassword123' });

      expect(resetRes.status).toBe(200);
      expect(resetRes.body.message).toMatch(/reset successfully/);

      // Step 4: Verify login succeeds with NEW password and fails with OLD password
      const failLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'resetme@example.com', password: 'oldPassword123' });
      expect(failLogin.status).toBe(401);

      const successLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'resetme@example.com', password: 'newBrandNewPassword123' });
      expect(successLogin.status).toBe(200);
    });

    test('POST /api/auth/forgot-password returns 200 without revealing if non-existent user exists', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/If an account with this email exists/);
    });

    test('PUT /api/user/profile updates user name', async () => {
      const { token } = await createUserAndToken('updateprofile@test.com', 'Initial Name');

      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Full Name' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.name).toBe('Updated Full Name');
    });

    test('PUT /api/user/password verifies old password and updates to new password', async () => {
      const { token } = await createUserAndToken('updatepass@test.com', 'Pass User', 'currentPassword123');

      // Incorrect current password
      const badRes = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'wrongPassword', newPassword: 'newValidPassword123' });

      expect(badRes.status).toBe(401);
      expect(badRes.body.error).toMatch(/Incorrect current password/);

      // Correct current password
      const goodRes = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'currentPassword123', newPassword: 'newValidPassword123' });

      expect(goodRes.status).toBe(200);
      expect(goodRes.body.success).toBe(true);
    });

    test('PUT /api/user/settings/ai and /notifications update user preferences', async () => {
      const { token } = await createUserAndToken('settings@test.com');

      const aiRes = await request(app)
        .put('/api/user/settings/ai')
        .set('Authorization', `Bearer ${token}`)
        .send({ coverTone: 'startup', autoSuggest: false });

      expect(aiRes.status).toBe(200);
      expect(aiRes.body.settings.ai.coverTone).toBe('startup');
      expect(aiRes.body.settings.ai.autoSuggest).toBe(false);

      const notifRes = await request(app)
        .put('/api/user/settings/notifications')
        .set('Authorization', `Bearer ${token}`)
        .send({ weeklyDigest: true });

      expect(notifRes.status).toBe(200);
      expect(notifRes.body.settings.notifications.weeklyDigest).toBe(true);
    });
  });

  // ============================================================
  // 4. RESUME MANAGEMENT & ACCESS CONTROL (IDOR)
  // ============================================================
  describe('Resume Uploads & Access Control (IDOR Security)', () => {
    test('POST /api/resume/upload uploads PDF successfully and stores extractedText', async () => {
      const { token } = await createUserAndToken('resumeup@test.com');

      const response = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.resume).toHaveProperty('_id');
      expect(response.body.resume.originalName).toBe('sample.pdf');
    });

    test('POST /api/resume/upload returns 400 when no file is attached', async () => {
      const { token } = await createUserAndToken('nofile@test.com');

      const response = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/No file uploaded/);
    });

    test('POST /api/resume/upload rejects unsupported file formats (.txt)', async () => {
      const { token } = await createUserAndToken('txtup@test.com');
      const tempTxt = path.join(__dirname, 'fixtures', 'dummy.txt');
      fs.writeFileSync(tempTxt, 'Hello plain text file');

      const response = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', tempTxt, { filename: 'dummy.txt', contentType: 'text/plain' });

      expect(response.status).toBe(500);
      expect(response.body.message).toMatch(/Invalid file type/);

      fs.unlinkSync(tempTxt);
    });

    test('POST /api/resume/upload rejects unreadable / empty resume text (< 50 characters)', async () => {
      const { token } = await createUserAndToken('emptyfile@test.com');
      const { parseFile } = require('../utils/fileParser');
      parseFile.mockResolvedValueOnce('Short'); // < 50 chars triggers validation error

      const response = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', samplePdfPath, { filename: 'empty-sample.pdf', contentType: 'application/pdf' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Could not extract readable text/);
    });

    test('GET /api/resume/:id returns 404 for non-existent resume ID', async () => {
      const { token } = await createUserAndToken('nonexistres@test.com');
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/resume/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/Resume not found/);
    });

    test('GET /api/resume/:id returns 400 for malformed MongoDB ObjectId', async () => {
      const { token } = await createUserAndToken('castres@test.com');

      const response = await request(app)
        .get('/api/resume/not-a-valid-object-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Invalid _id/);
    });

    test('IDOR Protection: User B cannot view User A resume (403 Forbidden)', async () => {
      const userA = await createUserAndToken('userA@test.com');
      const userB = await createUserAndToken('userB@test.com');

      // User A uploads resume
      const uploadRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${userA.token}`)
        .attach('resume', samplePdfPath, { filename: 'userA.pdf', contentType: 'application/pdf' });

      const resumeId = uploadRes.body.resume._id;

      // User B attempts to access User A's resume
      const attackRes = await request(app)
        .get(`/api/resume/${resumeId}`)
        .set('Authorization', `Bearer ${userB.token}`);

      expect(attackRes.status).toBe(403);
      expect(attackRes.body.success).toBe(false);
      expect(attackRes.body.message).toMatch(/not authorized to access this resume/i);
    });

    test('IDOR Protection: User B cannot delete User A resume (403 Forbidden)', async () => {
      const userA = await createUserAndToken('userA-del@test.com');
      const userB = await createUserAndToken('userB-del@test.com');

      const uploadRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${userA.token}`)
        .attach('resume', samplePdfPath, { filename: 'userA.pdf', contentType: 'application/pdf' });

      const resumeId = uploadRes.body.resume._id;

      const deleteRes = await request(app)
        .delete(`/api/resume/${resumeId}`)
        .set('Authorization', `Bearer ${userB.token}`);

      expect(deleteRes.status).toBe(403);
      expect(deleteRes.body.success).toBe(false);

      // Verify resume still exists in database
      const resumeInDb = await Resume.findById(resumeId);
      expect(resumeInDb).not.toBeNull();
    });

    test('DELETE /api/resume/:id cascade-deletes resume, dependent analyses and arena records', async () => {
      const { user, token } = await createUserAndToken('cascade@test.com');

      const uploadRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

      const resumeId = uploadRes.body.resume._id;

      // Create dependent analysis
      await Analysis.create({
        resume: resumeId,
        user: user._id,
        type: 'ats_analysis',
        atsScore: 90
      });

      // User deletes resume
      const deleteRes = await request(app)
        .delete(`/api/resume/${resumeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toMatch(/deleted successfully/);

      // Verify resume and cascade records deleted
      expect(await Resume.findById(resumeId)).toBeNull();
      const dependentAnalyses = await Analysis.find({ resume: resumeId });
      expect(dependentAnalyses.length).toBe(0);
    });
  });

  // ============================================================
  // 5. AI RESUME ANALYSIS & CACHING & STATS
  // ============================================================
  describe('AI Analysis, Caching & Resilience', () => {
    test('POST /api/analysis/ats creates analysis and subsequent call returns cached result', async () => {
      const { token } = await createUserAndToken('analysis@test.com');

      const uploadRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

      const resumeId = uploadRes.body.resume._id;

      // First run: Creates new analysis
      const run1 = await request(app)
        .post('/api/analysis/ats')
        .set('Authorization', `Bearer ${token}`)
        .send({ resumeId });

      expect(run1.status).toBe(201);
      expect(run1.body.analysis.atsScore).toBe(88);

      // Second run: Serves from cache
      const run2 = await request(app)
        .post('/api/analysis/ats')
        .set('Authorization', `Bearer ${token}`)
        .send({ resumeId });

      expect(run2.status).toBe(200);
      expect(run2.body.message).toMatch(/Using cached ATS analysis/);
      expect(run2.body.analysis.cached).toBe(true);

      // Third run with forceRefresh: Bypasses cache
      const run3 = await request(app)
        .post('/api/analysis/ats')
        .set('Authorization', `Bearer ${token}`)
        .send({ resumeId, forceRefresh: true });

      expect(run3.status).toBe(201);
    });

    test('POST /api/analysis/match validates JD length and calculates match score', async () => {
      const { token } = await createUserAndToken('jdmatch@test.com');

      const uploadRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

      const resumeId = uploadRes.body.resume._id;

      // Short JD validation failure
      const shortRes = await request(app)
        .post('/api/analysis/match')
        .set('Authorization', `Bearer ${token}`)
        .send({ resumeId, jobDescription: 'Too short JD' });

      expect(shortRes.status).toBe(400);
      expect(shortRes.body.message).toMatch(/Job description is too short/);

      // Valid JD match
      const validRes = await request(app)
        .post('/api/analysis/match')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resumeId,
          jobDescription: 'Seeking an experienced Senior Software Engineer proficient in Node.js, Express, React, and MongoDB architecture with microservices expertise.'
        });

      expect(validRes.status).toBe(201);
      expect(validRes.body.analysis.matchScore).toBe(80);
      expect(validRes.body.analysis.verdict).toBe('Moderate Match');
    });

    test('POST /api/analysis/cover-letter returns generated letter and validates required fields', async () => {
      const { token } = await createUserAndToken('coverlet@test.com');

      const uploadRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

      const resumeId = uploadRes.body.resume._id;

      // Missing required parameters
      const missingRes = await request(app)
        .post('/api/analysis/cover-letter')
        .set('Authorization', `Bearer ${token}`)
        .send({ resumeId });

      expect(missingRes.status).toBe(400);
      expect(missingRes.body.message).toMatch(/resumeId, companyName, and jobDescription are required/);

      // Valid cover letter request
      const validRes = await request(app)
        .post('/api/analysis/cover-letter')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resumeId,
          companyName: 'Google',
          jobDescription: 'Full Stack Engineer with strong systems design background.',
          style: 'professional'
        });

      expect(validRes.status).toBe(201);
      expect(validRes.body.analysis).toHaveProperty('coverLetterContent');
    });

    test('GET /api/analysis/dashboard/stats returns aggregate analysis statistics', async () => {
      const { user, token } = await createUserAndToken('stats@test.com');

      const resume = await Resume.create({
        user: user._id,
        fileName: 'file.pdf',
        originalName: 'resume.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/dummy.pdf',
        extractedText: 'Software Engineer'
      });

      await Analysis.create({
        resume: resume._id,
        user: user._id,
        type: 'ats_analysis',
        atsScore: 85,
        overallScore: 90
      });

      await ArenaHistory.create({
        userId: user._id,
        feature: 'ats_analysis',
        selectedModel: 'auto',
        compareMode: false,
        input: {},
        results: [{ model: 'gemini-2.5-flash', scores: { ats: 88 } }]
      });

      const response = await request(app)
        .get('/api/analysis/dashboard/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stats.totalResumes).toBe(1);
      expect(response.body.stats.atsScore).toBe(88);
    });

    test('AI Schema Validation: assertShape rejects malformed AI responses with 502', async () => {
      const { user, token } = await createUserAndToken('malformed@test.com');

      // Create resume with special trigger text
      const resume = await Resume.create({
        user: user._id,
        fileName: 'badai.pdf',
        originalName: 'badai.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/badai.pdf',
        extractedText: 'TRIGGER_MALFORMED_AI'
      });

      const response = await request(app)
        .post('/api/analysis/ats')
        .set('Authorization', `Bearer ${token}`)
        .send({ resumeId: resume._id });

      expect(response.status).toBe(502);
      expect(response.body.message).toMatch(/AI response missing expected fields/);
    });

    test('AI Resilience: Controller handles external Gemini service outage gracefully', async () => {
      const { user, token } = await createUserAndToken('outage@test.com');

      const resume = await Resume.create({
        user: user._id,
        fileName: 'outage.pdf',
        originalName: 'outage.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/outage.pdf',
        extractedText: 'TRIGGER_AI_FAILURE'
      });

      const response = await request(app)
        .post('/api/analysis/ats')
        .set('Authorization', `Bearer ${token}`)
        .send({ resumeId: resume._id });

      expect(response.status).toBe(503);
      expect(response.body.message).toMatch(/Gemini API 503/);
    });
  });

  // ============================================================
  // 6. COPILOT SESSIONS & CHAT CRUD
  // ============================================================
  describe('AI Career Copilot Chat Sessions (CRUD & IDOR)', () => {
    test('Copilot Session lifecycle: Create, List, Retrieve, Update, and Delete', async () => {
      const { token } = await createUserAndToken('copilot@test.com');

      // Create session
      const createRes = await request(app)
        .post('/api/copilot/sessions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Initial Career Chat',
          messages: [{ role: 'user', content: 'Help me improve my resume', id: 'msg-1' }]
        });

      expect(createRes.status).toBe(201);
      const sessionId = createRes.body._id;

      // List sessions
      const listRes = await request(app)
        .get('/api/copilot/sessions')
        .set('Authorization', `Bearer ${token}`);

      expect(listRes.status).toBe(200);
      expect(listRes.body.length).toBe(1);

      // Get single session
      const getRes = await request(app)
        .get(`/api/copilot/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.title).toBe('Initial Career Chat');

      // Update session
      const updateRes = await request(app)
        .put(`/api/copilot/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Interview Coaching' });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.title).toBe('Updated Interview Coaching');

      // Delete session
      const delRes = await request(app)
        .delete(`/api/copilot/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(delRes.status).toBe(200);
      expect(await CopilotSession.findById(sessionId)).toBeNull();
    });

    test('IDOR Protection: User B cannot access User A copilot session (404/Not Found)', async () => {
      const userA = await createUserAndToken('copilotA@test.com');
      const userB = await createUserAndToken('copilotB@test.com');

      const session = await CopilotSession.create({
        userId: userA.user._id,
        title: 'User A Private Session',
        messages: [{ role: 'user', content: 'Secret plans', id: '1' }]
      });

      const attackRes = await request(app)
        .get(`/api/copilot/sessions/${session._id}`)
        .set('Authorization', `Bearer ${userB.token}`);

      expect(attackRes.status).toBe(404);
      expect(attackRes.body.message).toMatch(/Session not found/);
    });

    test('POST /api/copilot/title generates title for conversation', async () => {
      const { token } = await createUserAndToken('title@test.com');

      const response = await request(app)
        .post('/api/copilot/title')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstMessage: 'How do I pass Google systems design interview?' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBeDefined();
    });

    test('POST /api/copilot/chat returns 400 when messages array is empty', async () => {
      const { token } = await createUserAndToken('streamempty@test.com');

      const response = await request(app)
        .post('/api/copilot/chat')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [] });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/No messages provided/);
    });
  });

  // ============================================================
  // 7. BULLET ENHANCER & WEAK LANGUAGE & INTERVIEW & OUTREACH & CONTACT
  // ============================================================
  describe('Bullet Enhancer, Weak Language, Interview, Outreach & Contact APIs', () => {
    test('POST /api/bullets/enhance enhances single bullet and validates length', async () => {
      const { token } = await createUserAndToken('bullet@test.com');

      // Validation failure for short input
      const shortRes = await request(app)
        .post('/api/bullets/enhance')
        .set('Authorization', `Bearer ${token}`)
        .send({ bullet: 'a' });

      expect(shortRes.status).toBe(400);

      // Valid bullet enhancement
      const validRes = await request(app)
        .post('/api/bullets/enhance')
        .set('Authorization', `Bearer ${token}`)
        .send({ bullet: 'Managed frontend app performance', jobRole: 'Frontend Developer' });

      expect(validRes.status).toBe(200);
      expect(validRes.body.success).toBe(true);
      expect(validRes.body.data).toHaveProperty('enhanced');
    });

    test('POST /api/bullets/enhance-bulk processes multiple bullets', async () => {
      const { token } = await createUserAndToken('bulk@test.com');

      const response = await request(app)
        .post('/api/bullets/enhance-bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bullets: ['Built auth system with JWT', 'Optimized database queries'],
          jobRole: 'Backend Engineer'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test('POST /api/weak-language/text analyzes weak language in text', async () => {
      const { token } = await createUserAndToken('weaktext@test.com');

      const response = await request(app)
        .post('/api/weak-language/text')
        .set('Authorization', `Bearer ${token}`)
        .send({ text: 'I helped with various tasks and was responsible for managing customer relations.' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('weakPhrases');
    });

    test('GET /api/weak-language/resume/:resumeId analyzes uploaded resume', async () => {
      const { user, token } = await createUserAndToken('weakres@test.com');

      const resume = await Resume.create({
        user: user._id,
        fileName: 'weak.pdf',
        originalName: 'weak.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/weak.pdf',
        extractedText: 'I helped with several key projects and was responsible for website maintenance.'
      });

      const response = await request(app)
        .get(`/api/weak-language/resume/${resume._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('weakPhrases');
    });

    test('POST /api/interview/generate and GET/DELETE /api/interview/history', async () => {
      const { user, token } = await createUserAndToken('interview@test.com');

      // Missing role validation
      const missingRoleRes = await request(app)
        .post('/api/interview/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ resume: 'Sample resume text with sufficient length for testing...', role: '' });

      expect(missingRoleRes.status).toBe(400);

      // Generate interview questions
      const genRes = await request(app)
        .post('/api/interview/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resume: 'Experienced Full Stack Engineer with Node.js and React background designing microservices.',
          role: 'Full Stack Engineer',
          jobDescription: 'Build high-scale REST APIs.'
        });

      expect(genRes.status).toBe(201);
      expect(genRes.body.success).toBe(true);
      expect(genRes.body.questions.length).toBeGreaterThan(0);

      const historyId = genRes.body.historyId;

      // Fetch history
      const listRes = await request(app)
        .get('/api/interview/history')
        .set('Authorization', `Bearer ${token}`);

      expect(listRes.status).toBe(200);
      expect(listRes.body.history.length).toBe(1);

      // Delete history item
      const delRes = await request(app)
        .delete(`/api/interview/history/${historyId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(delRes.status).toBe(200);
      expect(await InterviewHistory.findById(historyId)).toBeNull();
    });

    test('POST /api/outreach/generate generates cold email and validates resume ownership', async () => {
      const { user, token } = await createUserAndToken('outreach@test.com');

      const resume = await Resume.create({
        user: user._id,
        fileName: 'outreach.pdf',
        originalName: 'outreach.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/outreach.pdf',
        extractedText: 'Senior Backend Developer with experience in AWS, Docker, and Node.js.'
      });

      const response = await request(app)
        .post('/api/outreach/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({
          targetRole: 'Backend Engineer',
          companyName: 'Stripe',
          tone: 'professional',
          resumeId: resume._id
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('emailSubject');
      expect(response.body.data).toHaveProperty('emailBody');
      expect(response.body.data).toHaveProperty('linkedinMessage');
    });

    test('POST /api/contact/submit accepts valid contact inquiries and validates missing fields', async () => {
      // Missing fields
      const badRes = await request(app)
        .post('/api/contact/submit')
        .send({ email: 'test@contact.com' });

      expect(badRes.status).toBe(400);

      // Valid contact submission
      const goodRes = await request(app)
        .post('/api/contact/submit')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          message: 'Interested in partnering with Resume Copilot.'
        });

      expect(goodRes.status).toBe(201);
      expect(goodRes.body.message).toMatch(/submitted successfully/);
      expect(await ContactQuery.findOne({ email: 'jane@example.com' })).toBeDefined();
    });
  });

});
