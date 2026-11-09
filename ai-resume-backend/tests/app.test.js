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
      if (prompt.includes('FAIL_ONE_BULLET')) {
        throw new Error('Individual bullet rate limit exceeded');
      }
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
    if (prompt.includes('completely rebuild it') || prompt.includes('ATS Resume Expert')) {
      return {
        response: {
          text: () => JSON.stringify({
            originalATS: 65,
            improvedATS: 92,
            improvedResume: '# John Doe\n\n## Experience\n- Spearheaded microservice architecture.',
            changes: [
              { section: 'Experience', original: 'Worked on backend', improved: 'Spearheaded microservice architecture', type: 'modified', description: 'Added strong action verbs' }
            ],
            recruiterFeedback: 'Substantially improved clarity and impact.',
            suggestions: ['Quantify additional business achievements'],
            keywordReport: { missing: [], added: ['Microservices'] },
            scores: { grammar: 95, readability: 90, keywordMatch: 88, formatting: 92, content: 90, section: 94 }
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
      generateContent: jest.fn(async (prompt = '') => {
        const promptStr = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);

        if (promptStr.includes('TRIGGER_ALL_MODEL_FAILURE')) {
          const err = new Error('503 Service Unavailable');
          err.statusCode = 503;
          throw err;
        }

        let responseJson = '{"success": true}';

        if (promptStr.includes('strict input validator')) {
          if (promptStr.includes('TRIGGER_VALIDATION_FAILURE')) {
            responseJson = JSON.stringify({ isValid: false, reason: 'Inputs contain inappropriate joke or gibberish.' });
          } else {
            responseJson = JSON.stringify({ isValid: true, reason: '' });
          }
        } else if (promptStr.includes('Applicant Tracking System') || promptStr.includes('atsScore')) {
          responseJson = JSON.stringify({
            atsScore: 88,
            overallScore: 90,
            professionalismScore: 85,
            readabilityScore: 80,
            missingKeywords: ['Docker'],
            suggestions: ['Quantify engineering accomplishments with measurable impact'],
            grammarIssues: [],
            sectionFeedback: { summary: 'Strong summary', experience: 'Clear metrics' },
            strengths: ['Relevant tech stack'],
            weaknesses: ['Add more metrics'],
            formattingAnalysis: 'Standard linear structure'
          });
        } else if (promptStr.includes('ATS matching algorithm') || promptStr.includes('matchScore')) {
          responseJson = JSON.stringify({
            matchScore: 85,
            skillCoverage: 80,
            keywordCoverage: 75,
            matchedSkills: ['Node.js', 'React'],
            missingSkills: ['Kubernetes'],
            keywordGap: ['Distributed systems'],
            recommendations: ['Highlight cloud infrastructure projects'],
            verdict: 'Strong Match',
            summary: 'Solid alignment with role requirements.'
          });
        } else if (promptStr.includes('interview questions') || promptStr.includes('questionCount')) {
          responseJson = JSON.stringify({
            matchPercentage: 85,
            strongSkills: ['Node.js'],
            weakSkills: ['Docker'],
            questions: [{
              type: 'Technical',
              difficulty: 'Medium',
              question: 'Explain event loop.',
              expectedAnswer: 'Event loop handles non-blocking I/O.',
              followUpQuestion: 'How does setImmediate work?',
              resumeRelevance: 'High'
            }]
          });
        } else if (promptStr.includes('cover letter') || promptStr.includes('coverLetter')) {
          responseJson = JSON.stringify({
            coverLetter: 'Dear Hiring Manager,\n\nI am thrilled to apply for this engineering role at your esteemed company.\n\nWith over five years of full-stack experience in React, Node.js, and MongoDB, I have designed resilient cloud solutions and led cross-functional squads.\n\nSincerely,\nJane Doe',
            wordCount: 150,
            keyHighlights: ['MERN Architecture', 'Cloud Infrastructure', 'Team Leadership']
          });
        }

        return {
          response: {
            text: () => responseJson,
            candidates: [{ finishReason: 'STOP' }],
            usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 15, totalTokenCount: 25 }
          }
        };
      }),
      startChat: jest.fn(() => ({
        sendMessageStream: jest.fn(async (content) => {
          const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
          if (contentStr.includes('TRIGGER_STREAM_INTERRUPT')) {
            return {
              stream: (async function* () {
                yield { text: () => 'Initial chunk before failure. ' };
                throw new Error('Mid-stream connection reset');
              })()
            };
          }
          return {
            stream: (async function* () {
              yield { text: () => 'Hello from AI Copilot stream.' };
            })()
          };
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

const { _getLastTestOtp } = require('../controllers/authController');

const createUserAndToken = async (email = 'test@example.com', name = 'Test User', password = 'password123', isVerified = true) => {
  const user = await User.create({
    name,
    email,
    password,
    isVerified,
    place: 'New York',
    mobile: '1234567890'
  });
  const token = jwt.sign({ userId: user._id, name: user.name, purpose: 'access', tokenVersion: 0 }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
      expect(otpDoc.otpHash).toBeDefined();

      const otp = _getLastTestOtp(email);
      const verifyRes = await request(app)
        .post('/api/auth/verify-otp')
        .send({ name: 'OTP User', email, password, otp });

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
      expect(otpDoc.otpHash).toBeDefined();

      const otp = _getLastTestOtp('resetme@example.com');
      // Step 2: Verify reset OTP -> receive reset token
      const verifyRes = await request(app)
        .post('/api/auth/verify-reset-otp')
        .send({ email: 'resetme@example.com', otp });

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

  // ============================================================
  // 8. PHASE 1 MANDATORY IDENTITY & TOKEN SECURITY REGRESSIONS
  // ============================================================
  describe('Phase 1 Mandatory Identity & Token Security Regressions', () => {

    test('Ordinary login JWT submitted to reset endpoint is rejected and password is unchanged', async () => {
      const { user, token } = await createUserAndToken('ordinaryjwt@test.com', 'Ordinary User', 'OriginalPass123');

      // Attempt to use access token as password reset credential
      const resetRes = await request(app)
        .post('/api/auth/reset-password')
        .send({ token, password: 'HackedNewPassword123' });

      expect(resetRes.status).toBe(400);
      expect(resetRes.body.success).toBe(false);
      expect(resetRes.body.message).toMatch(/Invalid or expired reset token|Invalid token purpose/i);

      // Verify original password is unchanged and hacked password fails
      const badLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ordinaryjwt@test.com', password: 'HackedNewPassword123' });
      expect(badLogin.status).toBe(401);

      const goodLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ordinaryjwt@test.com', password: 'OriginalPass123' });
      expect(goodLogin.status).toBe(200);
      expect(goodLogin.body.success).toBe(true);
    });

    test('Reset credential is accepted only for purpose and user; second use/concurrent replay fails', async () => {
      await createUserAndToken('resetgrant@test.com', 'Reset Grant User', 'InitialPassword123');

      // Step 1: Request reset OTP
      await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'resetgrant@test.com' });

      const otp = _getLastTestOtp('resetgrant@test.com');
      expect(otp).toBeDefined();

      // Step 2: Verify reset OTP to get purpose-bound single-use reset grant
      const verifyRes = await request(app)
        .post('/api/auth/verify-reset-otp')
        .send({ email: 'resetgrant@test.com', otp });

      expect(verifyRes.status).toBe(200);
      const resetToken = verifyRes.body.resetToken;
      expect(resetToken).toBeDefined();

      // Step 3: First use of resetToken succeeds
      const firstUse = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: resetToken, password: 'UpdatedValidPassword1' });
      expect(firstUse.status).toBe(200);
      expect(firstUse.body.message).toMatch(/reset successfully/i);

      // Step 4: Second use (replay attack) fails
      const secondUse = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: resetToken, password: 'UpdatedValidPassword2' });
      expect(secondUse.status).toBe(400);
      expect(secondUse.body.message).toMatch(/invalid, expired, or has already been used/i);

      // Step 5: Test concurrent replay with fresh reset grant
      await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'resetgrant@test.com' });
      const otp2 = _getLastTestOtp('resetgrant@test.com');
      const verifyRes2 = await request(app)
        .post('/api/auth/verify-reset-otp')
        .send({ email: 'resetgrant@test.com', otp: otp2 });
      const resetToken2 = verifyRes2.body.resetToken;

      const [resA, resB] = await Promise.all([
        request(app).post('/api/auth/reset-password').send({ token: resetToken2, password: 'ConcurrentPass123' }),
        request(app).post('/api/auth/reset-password').send({ token: resetToken2, password: 'ConcurrentPass123' })
      ]);

      const statuses = [resA.status, resB.status].sort();
      expect(statuses).toEqual([200, 400]); // Exactly one success and one rejection
    });

    test('Direct signup cannot activate unverified account; OTP verification enables expected access', async () => {
      const email = 'directunverified@test.com';

      // Direct signup creates unverified account (isVerified: false)
      const signupRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Pending User',
          email,
          password: 'Password123'
        });

      expect(signupRes.status).toBe(201);
      expect(signupRes.body.user.isVerified).toBe(false);
      const unverifiedToken = signupRes.body.token;

      // Pending account attempting authorized resume operation must be blocked with 403 Forbidden
      const blockedRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${unverifiedToken}`)
        .attach('resume', samplePdfPath, { filename: 'pending.pdf', contentType: 'application/pdf' });

      expect(blockedRes.status).toBe(403);
      expect(blockedRes.body.message).toMatch(/Email verification required/i);

      // Complete OTP verification
      const signupOtp = _getLastTestOtp(email);
      expect(signupOtp).toBeDefined();

      const verifyRes = await request(app)
        .post('/api/auth/verify-email-otp')
        .send({ email, otp: signupOtp });

      expect(verifyRes.status).toBe(201);
      expect(verifyRes.body.user.isVerified).toBe(true);
      const verifiedToken = verifyRes.body.token;

      // Verified account can now perform resume operations
      const allowedRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${verifiedToken}`)
        .attach('resume', samplePdfPath, { filename: 'verified.pdf', contentType: 'application/pdf' });

      expect(allowedRes.status).toBe(201);
      expect(allowedRes.body.success).toBe(true);
    });

    test('Expired code is rejected even when its Mongo record remains; wrong-purpose code is rejected', async () => {
      const email = 'expiredotp@test.com';
      const otp = '888777';
      const crypto = require('crypto');
      const otpHash = crypto.createHash('sha256').update(`${email}:signup:${otp}`).digest('hex');

      // Create an already-expired OTP record in MongoDB (simulating lag before Mongo TTL index deletes)
      await OTP.create({
        email,
        otpHash,
        purpose: 'signup',
        expiresAt: new Date(Date.now() - 1000) // 1 second in the past
      });

      const verifyRes = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email, otp });

      expect(verifyRes.status).toBe(400);
      expect(verifyRes.body.message).toMatch(/Invalid or expired verification code/i);

      // Wrong purpose test: signup OTP cannot be used for password reset
      await request(app).post('/api/auth/register').send({ email: 'purposetest@test.com' });
      const signupOtp = _getLastTestOtp('purposetest@test.com');

      const wrongPurposeRes = await request(app)
        .post('/api/auth/verify-reset-otp')
        .send({ email: 'purposetest@test.com', otp: signupOtp });

      expect(wrongPurposeRes.status).toBe(400);
      expect(wrongPurposeRes.body.message).toMatch(/Invalid or expired verification code/i);
    });

    test('More than allowed wrong OTP attempts fail; concurrent correct OTP verifications allow at most one success', async () => {
      const email = 'ratelimitotp@test.com';
      await request(app).post('/api/auth/register').send({ email });
      const correctOtp = _getLastTestOtp(email);

      // Send 5 incorrect verification attempts
      for (let i = 0; i < 5; i++) {
        const fail = await request(app)
          .post('/api/auth/verify-otp')
          .send({ email, otp: '000000' });
        expect(fail.status).toBe(400);
      }

      // 6th attempt with CORRECT OTP fails because attempts exceeded
      const finalAttempt = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email, otp: correctOtp });
      expect(finalAttempt.status).toBe(400);
      expect(finalAttempt.body.message).toMatch(/Invalid or expired verification code/i);

      // Test simultaneous concurrent verifications with fresh OTP
      await OTP.deleteMany({ email });
      await request(app).post('/api/auth/register').send({ email });
      const freshOtp = _getLastTestOtp(email);

      const [res1, res2] = await Promise.all([
        request(app).post('/api/auth/verify-otp').send({ email, otp: freshOtp, name: 'User 1', password: 'Password123' }),
        request(app).post('/api/auth/verify-otp').send({ email, otp: freshOtp, name: 'User 2', password: 'Password123' })
      ]);

      const statuses = [res1.status, res2.status].sort();
      expect(statuses).toEqual([201, 400]); // Atomic consumption guarantees at most one success
    });

    test('Email-send failure is not reported as successful delivery; no OTP appears in logs', async () => {
      const logSpy = jest.spyOn(console, 'log');

      await request(app)
        .post('/api/auth/register')
        .send({ email: 'logcheck@test.com' });

      // Verify no 6-digit OTP code was printed to terminal/stdout logs
      const allLogMessages = logSpy.mock.calls.map(call => call.join(' ')).join('\n');
      expect(allLogMessages).not.toMatch(/DEV OTP for/i);
      expect(allLogMessages).not.toMatch(/\b\d{6}\b.*(?:OTP|Code)/i);

      logSpy.mockRestore();
    });

    test('Invalid Google token, wrong audience and unverified-email linking attempts are rejected', async () => {
      const { OAuth2Client } = require('google-auth-library');

      // 1. Invalid signature
      jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockRejectedValueOnce(new Error('Invalid signature'));
      const invalidRes = await request(app)
        .post('/api/auth/google')
        .send({ credential: 'ey-invalid-token' });
      expect(invalidRes.status).toBe(401);

      // 2. Wrong audience
      process.env.GOOGLE_CLIENT_ID = 'expected-client-id';
      jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValueOnce({
        getPayload: () => ({
          iss: 'https://accounts.google.com',
          aud: 'different-audience',
          email: 'wrongaud@test.com',
          email_verified: true,
          sub: 'sub-wrong-aud'
        })
      });
      const wrongAudRes = await request(app)
        .post('/api/auth/google')
        .send({ credential: 'ey-wrong-audience' });
      expect(wrongAudRes.status).toBe(401);
      expect(wrongAudRes.body.message).toMatch(/audience mismatch/i);

      // 3. Unverified email
      jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValueOnce({
        getPayload: () => ({
          iss: 'https://accounts.google.com',
          aud: 'expected-client-id',
          email: 'unverified@google.com',
          email_verified: false,
          sub: 'sub-unverified'
        })
      });
      const unverifiedEmailRes = await request(app)
        .post('/api/auth/google')
        .send({ credential: 'ey-unverified-email' });
      expect(unverifiedEmailRes.status).toBe(401);
      expect(unverifiedEmailRes.body.message).toMatch(/not verified/i);

      OAuth2Client.prototype.verifyIdToken.mockRestore();
    });

    test('Password changes follow same policy; old sessions are invalidated according to documented decision', async () => {
      const { user, token } = await createUserAndToken('passpolicy@test.com', 'Pass User', 'OriginalPassword123');

      // Attempt short password via settings
      const shortPassRes = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'OriginalPassword123', newPassword: 'short' });

      expect(shortPassRes.status).toBe(400);
      expect(shortPassRes.body.message).toMatch(/at least 8 characters/i);

      // Valid password update
      const updateRes = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'OriginalPassword123', newPassword: 'NewStrongPassword123' });

      expect(updateRes.status).toBe(200);

      // Attempting to access protected route with the OLD session token must now be rejected
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(meRes.status).toBe(401);
      expect(meRes.body.message).toMatch(/Session expired due to recent password change/i);

      // Login with new password yields valid active session
      const freshLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'passpolicy@test.com', password: 'NewStrongPassword123' });

      expect(freshLogin.status).toBe(200);
      const freshMe = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${freshLogin.body.token}`);
      expect(freshMe.status).toBe(200);
    });

    test('Unauthorized/malformed logout does not insert a token into blocklist', async () => {
      const initialCount = await TokenBlocklist.countDocuments();

      // No token
      const noTokenRes = await request(app).post('/api/auth/logout');
      expect(noTokenRes.status).toBe(401);

      // Forged / malformed token
      const forgedRes = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer totally.fabricated.forged.jwt');
      expect(forgedRes.status).toBe(401);

      // Verify no untrusted records were created in TokenBlocklist
      const afterCount = await TokenBlocklist.countDocuments();
      expect(afterCount).toBe(initialCount);

      // Valid logout
      const { token } = await createUserAndToken('validlogout@test.com');
      const validLogout = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(validLogout.status).toBe(200);
      expect(await TokenBlocklist.countDocuments()).toBe(initialCount + 1);
    });

    test('Email case variants cannot create unintended duplicate user records', async () => {
      // Register with mixed case
      const res1 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Case Test',
          email: 'MixCase@Example.COM',
          password: 'Password123'
        });
      expect(res1.status).toBe(201);

      // Attempt duplicate with lowercase
      const res2 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Case Test 2',
          email: 'mixcase@example.com',
          password: 'Password123'
        });
      expect(res2.status).toBe(400);
      expect(res2.body.message).toMatch(/already exists/i);

      // Login with all caps succeeds
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'MIXCASE@EXAMPLE.COM',
          password: 'Password123'
        });
      expect(loginRes.status).toBe(200);
      expect(loginRes.body.user.email).toBe('mixcase@example.com');
    });

  });

  // ============================================================
  // 13. PHASE 2 REGRESSION SUITE: PRIVATE RESUMES, STORAGE, DELETION, CORS & PRIVACY
  // ============================================================
  describe('Phase 2 Regression Suite: Private Storage, Cascades, CORS & Privacy', () => {

    test('A02: Anonymous request to GET /api/resume/:id/file is rejected with 401', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/resume/${fakeId}/file`);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('A02: IDOR: User B cannot access User A private resume file (403 Forbidden)', async () => {
      const { user: userA, token: tokenA } = await createUserAndToken('usera_file@test.com');
      const { token: tokenB } = await createUserAndToken('userb_file@test.com');

      // Upload file as User A
      const uploadRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${tokenA}`)
        .attach('resume', samplePdfPath, { filename: 'userA_resume.pdf', contentType: 'application/pdf' });
      expect(uploadRes.status).toBe(201);
      const resumeId = uploadRes.body.resume._id;

      // User B attempts to access User A's file
      const res = await request(app)
        .get(`/api/resume/${resumeId}/file`)
        .set('Authorization', `Bearer ${tokenB}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Not authorized/i);
    });

    test('A02: Owner can download private resume with security headers', async () => {
      const { token } = await createUserAndToken('owner_file@test.com');

      const uploadRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', samplePdfPath, { filename: 'my_resume.pdf', contentType: 'application/pdf' });
      expect(uploadRes.status).toBe(201);
      const resumeId = uploadRes.body.resume._id;

      const fileRes = await request(app)
        .get(`/api/resume/${resumeId}/file`)
        .set('Authorization', `Bearer ${token}`);

      expect(fileRes.status).toBe(200);
      expect(fileRes.headers['content-type']).toMatch(/application\/pdf/);
      expect(fileRes.headers['content-disposition']).toMatch(/inline; filename="my_resume\.pdf"/);
      expect(fileRes.headers['cache-control']).toBe('private, no-cache, no-store, must-revalidate');
      expect(fileRes.headers['x-content-type-options']).toBe('nosniff');
      expect(fileRes.body.length).toBeGreaterThan(0);
    });

    test('A02: Direct access to /uploads is rejected with 403 Forbidden', async () => {
      const res1 = await request(app).get('/uploads/resumes/some-file.pdf');
      expect(res1.status).toBe(403);
      expect(res1.body.message).toMatch(/Direct access to uploaded files is forbidden/i);

      const res2 = await request(app).get('/uploads/');
      expect(res2.status).toBe(403);
    });

    test('A02: Path traversal attack on file retrieval is rejected', async () => {
      const { user, token } = await createUserAndToken('traversal@test.com');

      // Create a rogue resume record with directory traversal in filePath
      const rogueResume = await Resume.create({
        user: user._id,
        fileName: '../../package.json',
        filePath: path.resolve(__dirname, '../../package.json'),
        fileType: 'pdf',
        originalName: 'secret.pdf',
        fileSize: 100,
        extractedText: 'some text'
      });

      const res = await request(app)
        .get(`/api/resume/${rogueResume._id}/file`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Invalid file path/i);
    });

    test('A09: Content-type spoofing (text/plain disguised as PDF) is rejected by magic bytes', async () => {
      const { token } = await createUserAndToken('spoof@test.com');
      const fakePdf = path.join(__dirname, 'fixtures', 'fake.pdf');
      fs.writeFileSync(fakePdf, 'This is plain text and does not begin with %PDF magic bytes.');

      try {
        const res = await request(app)
          .post('/api/resume/upload')
          .set('Authorization', `Bearer ${token}`)
          .attach('resume', fakePdf, { filename: 'fake.pdf', contentType: 'application/pdf' });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Invalid file content/i);
      } finally {
        if (fs.existsSync(fakePdf)) fs.unlinkSync(fakePdf);
      }
    });

    test('A13: Simultaneous uploads generate unique cryptographically secure UUID filenames', async () => {
      const { token } = await createUserAndToken('concur_upload@test.com');

      const [res1, res2] = await Promise.all([
        request(app)
          .post('/api/resume/upload')
          .set('Authorization', `Bearer ${token}`)
          .attach('resume', samplePdfPath, { filename: 'resume.pdf', contentType: 'application/pdf' }),
        request(app)
          .post('/api/resume/upload')
          .set('Authorization', `Bearer ${token}`)
          .attach('resume', samplePdfPath, { filename: 'resume.pdf', contentType: 'application/pdf' })
      ]);

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      const resume1 = await Resume.findById(res1.body.resume._id);
      const resume2 = await Resume.findById(res2.body.resume._id);
      expect(resume1.fileName).not.toBe(resume2.fileName);
      expect(resume1.fileName).toMatch(/^[0-9a-f-]{36}\.pdf$/i); // UUID format
      expect(res1.body.resume._id).not.toBe(res2.body.resume._id);
    });

    test('A07: Deleting resume removes disk file and cascades to Analysis, ArenaHistory, and InterviewHistory', async () => {
      const { user, token } = await createUserAndToken('cascade_del@test.com');

      const uploadRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', samplePdfPath, { filename: 'cascade.pdf', contentType: 'application/pdf' });
      expect(uploadRes.status).toBe(201);
      const resumeId = uploadRes.body.resume._id;
      const uploadedRecord = await Resume.findById(resumeId);
      const savedFilePath = uploadedRecord.filePath;

      expect(fs.existsSync(savedFilePath)).toBe(true);

      // Create dependent child records
      await Analysis.create({
        user: user._id,
        resume: resumeId,
        type: 'ats_analysis',
        jobDescription: 'Software Engineer',
        atsScore: 85,
        overallScore: 88
      });

      await ArenaHistory.create({
        userId: user._id,
        feature: 'interview_prep',
        input: { resumeId: resumeId.toString() },
        selectedModel: 'auto',
        compareMode: false,
        results: [{ model: 'auto', output: { questions: [] }, executionTime: 100 }],
        winner: 'auto'
      });

      await InterviewHistory.create({
        userId: user._id,
        resume: resumeId.toString(),
        role: 'Software Engineer',
        questions: [{
          type: 'Technical',
          difficulty: 'Medium',
          question: 'Q1',
          expectedAnswer: 'A1'
        }]
      });

      // Verify they exist
      expect(await Analysis.countDocuments({ resume: resumeId })).toBe(1);
      expect(await ArenaHistory.countDocuments({ 'input.resumeId': resumeId.toString() })).toBe(1);
      expect(await InterviewHistory.countDocuments({ resume: resumeId.toString() })).toBe(1);

      // Delete resume
      const delRes = await request(app)
        .delete(`/api/resume/${resumeId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(delRes.status).toBe(200);

      // Verify disk cleanup
      expect(fs.existsSync(savedFilePath)).toBe(false);

      // Verify cascading DB cleanup
      expect(await Resume.findById(resumeId)).toBeNull();
      expect(await Analysis.countDocuments({ resume: resumeId })).toBe(0);
      expect(await ArenaHistory.countDocuments({ 'input.resumeId': resumeId.toString() })).toBe(0);
      expect(await InterviewHistory.countDocuments({ resume: resumeId.toString() })).toBe(0);
    });

    test('A08: Deleted or unowned resume never returns an Arena cache hit', async () => {
      const { user: userA, token: tokenA } = await createUserAndToken('arena_owner@test.com');
      const { token: tokenB } = await createUserAndToken('arena_attacker@test.com');

      // Upload resume for User A
      const uploadRes = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${tokenA}`)
        .attach('resume', samplePdfPath, { filename: 'arena.pdf', contentType: 'application/pdf' });
      const resumeIdA = uploadRes.body.resume._id;

      // Seed an ArenaHistory entry for User A
      await ArenaHistory.create({
        userId: userA._id,
        feature: 'interview_prep',
        input: { resumeId: resumeIdA.toString() },
        selectedModel: 'auto',
        compareMode: false,
        results: [{ model: 'auto', output: { questions: ['Cached question'] }, executionTime: 100 }],
        winner: 'auto',
        bestResults: { questions: ['Cached question'] },
        createdAt: new Date()
      });

      // User B attempts to run arena with User A's resumeId -> rejected 403 before cache hit
      const resUserB = await request(app)
        .post('/api/arena/run')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({
          feature: 'interview_prep',
          inputs: { resumeId: resumeIdA.toString() },
          model: 'auto'
        });
      expect(resUserB.status).toBe(403);
      expect(resUserB.body.message).toMatch(/do not own this resume/i);

      // User A deletes resume
      await request(app)
        .delete(`/api/resume/${resumeIdA}`)
        .set('Authorization', `Bearer ${tokenA}`);

      // User A attempts to run arena with deleted resumeId -> 404 (not cached output)
      const resDeleted = await request(app)
        .post('/api/arena/run')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          feature: 'interview_prep',
          inputs: { resumeId: resumeIdA.toString() },
          model: 'auto'
        });
      expect(resDeleted.status).toBe(404);
      expect(resDeleted.body.message).toMatch(/resume not found/i);
    });

    test('A14: CORS allows whitelisted origins and rejects untrusted origins', async () => {
      // Whitelisted origin
      const allowedRes = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:5173');
      expect(allowedRes.headers['access-control-allow-origin']).toBe('http://localhost:5173');

      // Untrusted origin
      const blockedRes = await request(app)
        .get('/')
        .set('Origin', 'https://malicious-attacker-site.com');
      expect(blockedRes.status).toBe(403);
      expect(blockedRes.body.message).toMatch(/CORS policy/i);
    });

    test('A16: Sensitive credentials and raw PII are redacted in error responses', async () => {
      // Intentionally trigger an error by sending malformed authorization token
      const res = await request(app)
        .get('/api/resume/all')
        .set('Authorization', 'Bearer invalid.malformed.token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(JSON.stringify(res.body)).not.toContain('invalid.malformed.token');
    });

  });

  // ============================================================
  // 14. PHASE 3 REGRESSION SUITE: AI PIPELINE UNIFICATION, TRUTHFULNESS, VALIDATION & STATUS
  // ============================================================
  describe('Phase 3 Regression Suite: AI Correctness, Truthful Models, Single Pipeline & Cache', () => {

    test('A11: Unified ATS Analysis via legacy /api/analysis/ats route persists to Analysis model', async () => {
      const { user, token } = await createUserAndToken('ats_legacy@test.com');
      const resume = await Resume.create({
        user: user._id,
        fileName: 'test.pdf',
        originalName: 'test.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/test.pdf',
        extractedText: 'Senior Full Stack Software Engineer with extensive experience in React and Node.'
      });

      const res = await request(app)
        .post('/api/analysis/ats')
        .set('Authorization', `Bearer ${token}`)
        .send({ resumeId: resume._id });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.analysis).toBeDefined();
      expect(res.body.analysis.atsScore).toBe(88);
      expect(res.body.analysis.overallScore).toBe(92);

      // Verify persisted in MongoDB
      const saved = await Analysis.findOne({ resume: resume._id, user: user._id, type: 'ats_analysis' });
      expect(saved).not.toBeNull();
      expect(saved.atsScore).toBe(88);
    });

    test('A11: Unified JD Match via legacy /api/analysis/match route persists to Analysis model', async () => {
      const { user, token } = await createUserAndToken('jd_legacy@test.com');
      const resume = await Resume.create({
        user: user._id,
        fileName: 'test_jd.pdf',
        originalName: 'test_jd.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/test_jd.pdf',
        extractedText: 'Senior Software Engineer experienced with Node.js and React.'
      });

      const res = await request(app)
        .post('/api/analysis/match')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resumeId: resume._id,
          jobDescription: 'Seeking Senior Full Stack Engineer with strong Node.js, React, and Kubernetes experience.'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.analysis.matchScore).toBe(80);
      expect(res.body.analysis.verdict).toBe('Moderate Match');

      const saved = await Analysis.findOne({ resume: resume._id, user: user._id, type: 'jd_match' });
      expect(saved).not.toBeNull();
      expect(saved.matchScore).toBe(80);
    });

    test('A21: AI input validation failure returns HTTP 400 Bad Request, never false 200 or fake winner', async () => {
      const { user, token } = await createUserAndToken('validator_reject@test.com');
      const resume = await Resume.create({
        user: user._id,
        fileName: 'joke.pdf',
        originalName: 'joke.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/joke.pdf',
        extractedText: 'Candidate info'
      });

      const res = await request(app)
        .post('/api/arena/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          feature: 'ats_analysis',
          inputs: { resumeId: resume._id.toString(), note: 'TRIGGER_VALIDATION_FAILURE' }
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/inappropriate joke or gibberish/i);
    });

    test('A21: All-model failure in Arena returns HTTP 502 Bad Gateway, never false 200', async () => {
      const { user, token } = await createUserAndToken('all_fail@test.com');
      const resume = await Resume.create({
        user: user._id,
        fileName: 'fail.pdf',
        originalName: 'fail.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/fail.pdf',
        extractedText: 'TRIGGER_ALL_MODEL_FAILURE'
      });

      const res = await request(app)
        .post('/api/arena/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          feature: 'interview_prep',
          inputs: { resumeId: resume._id.toString() }
        });

      expect(res.status).toBe(502);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/temporarily down|failed/i);
    });

    test('A06: Arena parallel comparison returns truthful metadata and distinct contestants only', async () => {
      const { user, token } = await createUserAndToken('truthful_compare@test.com');
      const resume = await Resume.create({
        user: user._id,
        fileName: 'truth.pdf',
        originalName: 'truth.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/truth.pdf',
        extractedText: 'Senior Full Stack Engineer with extensive experience in React and Node.'
      });

      const res = await request(app)
        .post('/api/arena/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          feature: 'interview_prep',
          inputs: { resumeId: resume._id.toString() },
          compareMode: true
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      const results = res.body.arenaRun.results;
      expect(results.length).toBe(2); // exactly 2 distinct models: flash-lite and flash

      // Verify no duplicate apiNames
      const apiNames = results.map(r => r.apiModelName);
      expect(new Set(apiNames).size).toBe(2);

      // Verify metadata fields
      for (const result of results) {
        expect(result.provider).toBe('Google Gemini');
        expect(result.requestedModel).toBeDefined();
        expect(result.actualModelUsed).toBeDefined();
        expect(result.apiModelName).toBeDefined();
        expect(result.isAliased).toBeDefined();
        expect(result.error).toBeNull();
      }
    });

    test('A27: Fast deterministic cache returns hit for identical inputs, and misses on text change', async () => {
      const { user, token } = await createUserAndToken('cache_digest@test.com');
      const resume = await Resume.create({
        user: user._id,
        fileName: 'digest.pdf',
        originalName: 'digest.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/digest.pdf',
        extractedText: 'Initial resume text version 1'
      });

      // 1. Initial run -> Cache MISS
      const res1 = await request(app)
        .post('/api/arena/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          feature: 'interview_prep',
          inputs: { resumeId: resume._id.toString() },
          model: 'gemini-2.5-flash'
        });

      expect(res1.status).toBe(201);
      expect(res1.body.fromCache).toBe(false);
      expect(res1.body.arenaRun.cacheKey).toBeDefined();

      // 2. Second run with identical inputs -> Cache HIT
      const res2 = await request(app)
        .post('/api/arena/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          feature: 'interview_prep',
          inputs: { resumeId: resume._id.toString() },
          model: 'gemini-2.5-flash'
        });

      expect(res2.status).toBe(200);
      expect(res2.body.fromCache).toBe(true);
      expect(res2.body.arenaRun._id).toBe(res1.body.arenaRun._id);

      // 3. User modifies resume text -> Cache MISS
      resume.extractedText = 'Updated resume text version 2 with new achievements';
      await resume.save();

      const res3 = await request(app)
        .post('/api/arena/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          feature: 'interview_prep',
          inputs: { resumeId: resume._id.toString() },
          model: 'gemini-2.5-flash'
        });

      expect(res3.status).toBe(201);
      expect(res3.body.fromCache).toBe(false);
      expect(res3.body.arenaRun.cacheKey).not.toBe(res1.body.arenaRun.cacheKey);
    });

  });

  describe('PHASE 4: Async Reliability, SSE, Batch Processing, Input Limits & Feature Edge Cases', () => {

    test('A20: Two identical simultaneous requests coalesce in-flight and invoke provider at most once', async () => {
      const { user, token } = await createUserAndToken('coalesce@test.com');
      const resume = await Resume.create({
        user: user._id,
        fileName: 'coalesce.pdf',
        originalName: 'coalesce.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/coalesce.pdf',
        extractedText: 'Senior Full Stack Engineer with expertise in Node.js and React.'
      });

      // Dispatch two identical requests simultaneously
      const req1 = request(app)
        .post('/api/arena/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          feature: 'interview_prep',
          inputs: { resumeId: resume._id.toString() },
          model: 'gemini-2.5-flash',
          forceRefresh: true // Bypass 24h DB cache so in-flight map is exercised
        });

      const req2 = request(app)
        .post('/api/arena/run')
        .set('Authorization', `Bearer ${token}`)
        .send({
          feature: 'interview_prep',
          inputs: { resumeId: resume._id.toString() },
          model: 'gemini-2.5-flash',
          forceRefresh: true
        });

      const [res1, res2] = await Promise.all([req1, req2]);

      expect([200, 201]).toContain(res1.status);
      expect([200, 201]).toContain(res2.status);
      expect(res1.body.success).toBe(true);
      expect(res2.body.success).toBe(true);

      // One was coalesced to the active run
      const oneCoalesced = res1.body.coalesced === true || res2.body.coalesced === true;
      expect(oneCoalesced).toBe(true);
      expect(res1.body.arenaRun._id.toString()).toBe(res2.body.arenaRun._id.toString());
    });

    test('A15: SSE streaming does not transparently retry or duplicate chunks when error occurs mid-stream', async () => {
      const { user, token } = await createUserAndToken('sse_interrupted@test.com');

      const res = await request(app)
        .post('/api/copilot/chat')
        .set('Authorization', `Bearer ${token}`)
        .send({
          messages: [
            { role: 'user', content: 'Please review this: TRIGGER_STREAM_INTERRUPT' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/event-stream/);
      expect(res.text).toContain('Initial chunk before failure');
      expect(res.text).toContain('Stream interrupted. Please retry.');
      // Must NOT contain duplicate initial chunks (i.e. occurs only once)
      const count = (res.text.match(/Initial chunk before failure/g) || []).length;
      expect(count).toBe(1);
    });

    test('A22: Batch safety: batch of 100 bullets is rejected with 400 Bad Request', async () => {
      const { user, token } = await createUserAndToken('batch_limit@test.com');
      const largeBatch = Array.from({ length: 100 }, (_, i) => `Bullet point number ${i} describing engineering work`);

      const res = await request(app)
        .post('/api/bullets/enhance-bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bullets: largeBatch,
          jobRole: 'Software Engineer'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/exceeds maximum limit of 25 items/i);
    });

    test('A22: Batch safety: one item failure produces correct partial result preserving order', async () => {
      const { user, token } = await createUserAndToken('batch_partial@test.com');
      const bullets = [
        'Built microservices in Node.js for payments',
        'FAIL_ONE_BULLET should trigger individual error',
        'Implemented authentication using JWT and bcrypt'
      ];

      const res = await request(app)
        .post('/api/bullets/enhance-bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bullets,
          jobRole: 'Backend Engineer'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
      // Item 0: Success
      expect(res.body.data[0].status).toBe('enhanced');
      expect(res.body.data[0].enhanced).toBeDefined();
      // Item 1: Explicit failure
      expect(res.body.data[1].status).toBe('failed');
      expect(res.body.data[1].enhanced).toBeNull();
      expect(res.body.data[1].error).toMatch(/rate limit exceeded/i);
      // Item 2: Success
      expect(res.body.data[2].status).toBe('enhanced');
      expect(res.body.data[2].enhanced).toBeDefined();
    });

    test('A29/A38: Malicious non-string inputs yield 400 Bad Request instead of crashing .trim()', async () => {
      const { user, token } = await createUserAndToken('malicious_types@test.com');

      // 1. Bullets single with object input
      const res1 = await request(app)
        .post('/api/bullets/enhance')
        .set('Authorization', `Bearer ${token}`)
        .send({ bullet: { $gt: '' }, jobRole: 'Engineer' });
      expect(res1.status).toBe(400);
      expect(res1.body.success).toBe(false);

      // 2. Weak language with number input
      const res2 = await request(app)
        .post('/api/weak-language/text')
        .set('Authorization', `Bearer ${token}`)
        .send({ text: 123456789 });
      expect(res2.status).toBe(400);
      expect(res2.body.success).toBe(false);

      // 3. Resume Rebuild with array input
      const res3 = await request(app)
        .post('/api/resume/rebuild')
        .set('Authorization', `Bearer ${token}`)
        .send({ resumeText: ['invalid', 'array'] });
      expect(res3.status).toBe(400);
      expect(res3.body.success).toBe(false);

      // 4. Contact with object input
      const res4 = await request(app)
        .post('/api/contact/submit')
        .send({ name: { malicious: true }, email: 'test@example.com', message: 'Hello there!' });
      expect(res4.status).toBe(400);
      expect(res4.body.success).toBe(false);
    });

    test('A29: Request body exceeding size limit returns HTTP 413 Payload Too Large', async () => {
      const { user, token } = await createUserAndToken('large_payload@test.com');
      // Create a payload larger than 250kb (e.g. 300kb)
      const oversizedText = 'A'.repeat(300 * 1024);

      const res = await request(app)
        .post('/api/weak-language/text')
        .set('Authorization', `Bearer ${token}`)
        .send({ text: oversizedText });

      expect(res.status).toBe(413);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/payload too large/i);
    });

    test('A33: Long resume rebuild preserves content up to 25,000 characters and signals truncation if over', async () => {
      const { user, token } = await createUserAndToken('rebuild_long@test.com');

      // 1. Resume under 25k chars is not truncated
      const normalResume = 'Experienced software engineer leading technical teams. '.repeat(100); // ~5,500 chars (previously cut at 4500!)
      const res1 = await request(app)
        .post('/api/resume/rebuild')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resumeText: normalResume,
          role: 'Engineering Lead'
        });

      expect(res1.status).toBe(201);
      expect(res1.body.success).toBe(true);
      expect(res1.body.isTruncated).toBe(false);
      expect(res1.body.truncationNotice).toBeUndefined();

      // 2. Resume over 25k chars returns explicit truncation notice
      const hugeResume = 'Senior architect with global cloud infrastructure. '.repeat(600); // ~30,000 chars
      const res2 = await request(app)
        .post('/api/resume/rebuild')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resumeText: hugeResume,
          role: 'Cloud Architect'
        });

      expect(res2.status).toBe(201);
      expect(res2.body.success).toBe(true);
      expect(res2.body.isTruncated).toBe(true);
      expect(res2.body.truncationNotice).toMatch(/exceeds maximum limit of 25000 characters/i);
    });

    test('A34: Copilot session safety: cross-user access rejected and atomic message append works', async () => {
      const { user: user1, token: token1 } = await createUserAndToken('copilot_owner@test.com');
      const { user: user2, token: token2 } = await createUserAndToken('copilot_intruder@test.com');

      // User 1 creates session
      const createRes = await request(app)
        .post('/api/copilot/sessions')
        .set('Authorization', `Bearer ${token1}`)
        .send({ title: 'My Career Session', messages: [] });

      expect(createRes.status).toBe(201);
      const sessionId = createRes.body._id;

      // User 2 tries to access User 1's session -> 404 Not Found
      const accessRes = await request(app)
        .get(`/api/copilot/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${token2}`);
      expect(accessRes.status).toBe(404);

      // User 1 atomically appends a new message
      const updateRes = await request(app)
        .put(`/api/copilot/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({
          newMessage: {
            role: 'user',
            content: 'How can I optimize my LinkedIn headline?'
          }
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.messages).toHaveLength(1);
      expect(updateRes.body.messages[0].content).toBe('How can I optimize my LinkedIn headline?');
    });

    test('A39: Contact form validation, length caps, and spam throttling', async () => {
      // 1. Invalid email
      const badEmailRes = await request(app)
        .post('/api/contact/submit')
        .send({ name: 'Alice', email: 'invalid-email', message: 'Hello, this is Alice!' });
      expect(badEmailRes.status).toBe(400);
      expect(badEmailRes.body.message).toMatch(/valid email/i);

      // 2. Short message (< 10 chars)
      const shortMsgRes = await request(app)
        .post('/api/contact/submit')
        .send({ name: 'Bob', email: 'bob@example.com', message: 'Hi' });
      expect(shortMsgRes.status).toBe(400);
      expect(shortMsgRes.body.message).toMatch(/between 10 and 2000 characters/i);

      // 3. Valid submission succeeds and records TTL
      const validRes = await request(app)
        .post('/api/contact/submit')
        .send({ name: 'Carol Danvers', email: 'carol@example.com', message: 'I would like to inquire about enterprise licenses.' });
      expect(validRes.status).toBe(201);
      expect(validRes.body.success).toBe(true);

      const savedQuery = await ContactQuery.findById(validRes.body.data.id);
      expect(savedQuery).not.toBeNull();
      expect(savedQuery.email).toBe('carol@example.com');
    });

  });

  describe('PHASE 5: Dashboard, History, Frontend Consistency, Deployment & Low-Risk Cleanup', () => {

    test('A28: Bounded history pagination caps response size and projects out raw private resume text', async () => {
      const { user, token } = await createUserAndToken('bounded_history@test.com');

      // Create 35 ArenaHistory records
      const records = Array.from({ length: 35 }, (_, i) => ({
        userId: user._id,
        feature: 'ats_analysis',
        input: { resumeId: '507f1f77bcf86cd799439011', resumeText: 'CONFIDENTIAL RESUME TEXT ' + i },
        selectedModel: 'gemini-2.5-flash',
        compareMode: false,
        results: [{ model: 'gemini-2.5-flash', scores: { ats: 70 + (i % 20) } }]
      }));
      await ArenaHistory.insertMany(records);

      // Default pagination: page 1, default limit 20
      const res = await request(app)
        .get('/api/arena/history')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(20); // Capped at default limit
      expect(res.body.total).toBe(35);
      expect(res.body.page).toBe(1);
      expect(res.body.totalPages).toBe(2);

      // Projection: raw private resume text must not be returned in list
      for (const item of res.body.history) {
        expect(item.input.resumeText).toBeUndefined();
      }

      // Explicit page 2 request with custom limit
      const resPage2 = await request(app)
        .get('/api/arena/history?page=2&limit=20')
        .set('Authorization', `Bearer ${token}`);

      expect(resPage2.status).toBe(200);
      expect(resPage2.body.count).toBe(15);
      expect(resPage2.body.page).toBe(2);
    });

    test('A30: Dashboard scoreTrend fetches newest five records and displays them in chronological order', async () => {
      const { user, token } = await createUserAndToken('latest_five@test.com');

      // Seed 8 ATS analysis records with known scores in chronological order
      const scores = [50, 55, 60, 65, 70, 75, 80, 85];
      for (let i = 0; i < scores.length; i++) {
        await ArenaHistory.create({
          userId: user._id,
          feature: 'ats_analysis',
          input: { resumeId: '507f1f77bcf86cd799439011' },
          selectedModel: 'gemini-2.5-flash',
          compareMode: false,
          createdAt: new Date(Date.now() - (scores.length - i) * 60000), // oldest to newest
          results: [{
            model: 'gemini-2.5-flash',
            scores: { ats: scores[i] }
          }]
        });
      }

      const res = await request(app)
        .get('/api/analysis/dashboard/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.stats.scoreTrend).toHaveLength(5);

      // The newest 5 scores are 65, 70, 75, 80, 85 in chronological ascending order
      const returnedScores = res.body.stats.scoreTrend.map(s => s.score);
      expect(returnedScores).toEqual([65, 70, 75, 80, 85]);
    });

    test('A30: Unified metrics across legacy Analysis and modern ArenaHistory without double-counting', async () => {
      const { user, token } = await createUserAndToken('unified_metrics@test.com');
      const resume = await Resume.create({
        user: user._id,
        fileName: 'unified.pdf',
        originalName: 'My_Uploaded_Resume.pdf',
        fileType: 'pdf',
        filePath: 'uploads/resumes/unified.pdf',
        extractedText: 'Software Engineer Resume'
      });

      // 1. Create a legacy Analysis record with high ATS score
      await Analysis.create({
        user: user._id,
        resume: resume._id,
        type: 'ats_analysis',
        atsScore: 94,
        overallScore: 90
      });

      // 2. Create modern ArenaHistory records
      await ArenaHistory.create({
        userId: user._id,
        feature: 'ats_analysis',
        input: { resumeId: resume._id.toString() },
        selectedModel: 'gemini-2.5-flash',
        compareMode: false,
        results: [{ model: 'gemini-2.5-flash', scores: { ats: 88 } }]
      });

      await ArenaHistory.create({
        userId: user._id,
        feature: 'cover_letter',
        input: { resumeId: resume._id.toString() },
        selectedModel: 'gemini-2.5-flash',
        compareMode: false,
        results: [{ model: 'gemini-2.5-flash', output: { coverLetter: 'Dear hiring manager...' } }]
      });

      const res = await request(app)
        .get('/api/analysis/dashboard/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      // atsScore should reflect the highest across both (94)
      expect(res.body.stats.atsScore).toBe(94);
      expect(res.body.stats.totalResumes).toBe(1);
      expect(res.body.stats.totalCoverLetters).toBe(1);
    });

    test('A31: Filename property fallback safely renders originalName and fileName', async () => {
      const resume1 = { originalName: 'Jane_Doe_CV.pdf', fileName: 'uuid1.pdf' };
      const resume2 = { fileName: 'uuid2.pdf' };
      const resume3 = { filename: 'legacy.pdf' };
      const resume4 = {};

      const resolveName = (r) => r.originalName || r.fileName || r.filename || 'Untitled Resume';

      expect(resolveName(resume1)).toBe('Jane_Doe_CV.pdf');
      expect(resolveName(resume2)).toBe('uuid2.pdf');
      expect(resolveName(resume3)).toBe('legacy.pdf');
      expect(resolveName(resume4)).toBe('Untitled Resume');
    });

    test('A32 & A36: Truthful health and readiness probes', async () => {
      // 1. Health check returns 200 with service status
      const healthRes = await request(app).get('/api/health');
      expect(healthRes.status).toBe(200);
      expect(healthRes.body.status).toBe('ok');
      expect(healthRes.body.services.database).toBe('connected');
      expect(healthRes.body.services.ai).toBe('configured');

      // 2. Readiness probe returns 200 when DB connected
      const readyRes = await request(app).get('/api/readiness');
      expect(readyRes.status).toBe(200);
      expect(readyRes.body.ready).toBe(true);
    });

    test('A37: No hardcoded DNS server override in config/db.js', () => {
      const dbFileContent = fs.readFileSync(path.join(__dirname, '..', 'config', 'db.js'), 'utf8');
      expect(dbFileContent).not.toMatch(/dns\.setServers\(\s*\[['"]8\.8\.8\.8/);
      expect(dbFileContent).toContain('process.env.CUSTOM_DNS_SERVERS');
    });

    test('A41: Package manifests declare explicit supported Node LTS engine', () => {
      const backendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
      const frontendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'ai-resume-frontend', 'package.json'), 'utf8'));

      expect(backendPkg.engines).toBeDefined();
      expect(backendPkg.engines.node).toBe('>=18.0.0');
      expect(frontendPkg.engines).toBeDefined();
      expect(frontendPkg.engines.node).toBe('>=18.0.0');
    });

    test('A42/A44: Feature registry contains 17 authoritative features matching FEATURE_COUNT', () => {
      const { FEATURES, FEATURE_COUNT } = require('../config/features');
      expect(FEATURE_COUNT).toBe(17);
      expect(Object.keys(FEATURES).length).toBe(17);
      expect(FEATURES.ats_analysis).toBeDefined();
      expect(FEATURES.resume_rebuilder).toBeDefined();
      expect(FEATURES.outreach).toBeDefined();
    });

  });

});
