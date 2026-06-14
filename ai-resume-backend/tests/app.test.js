jest.mock('../utils/fileParser', () => ({
  parseFile: jest.fn(async () => 'Parsed resume text for testing that is intentionally long enough to pass validation and upload successfully.')
}));

jest.mock('../services/geminiService', () => ({
  analyzeResume: jest.fn(async () => ({
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
  })),

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

const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_SECRET = 'test-secret';

const app = require('../app');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const OTP = require('../models/OTP');

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
    OTP.deleteMany({})
  ]);

  const uploadDir = path.join(__dirname, '..', 'uploads', 'resumes');
  if (fs.existsSync(uploadDir)) {
    for (const file of fs.readdirSync(uploadDir)) {
      fs.unlinkSync(path.join(uploadDir, file));
    }
  }
});

const registerAndLogin = async () => {
  const email = 'test@example.com';
  const password = 'password';

  // Step 1: Send registration OTP
  await request(app)
    .post('/api/auth/register')
    .send({ email });

  // Fetch generated OTP from database
  const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
  const otp = otpRecord.otp;

  // Step 2: Verify OTP to create account
  await request(app)
    .post('/api/auth/verify-otp')
    .send({ name: 'Test User', email, password, otp });

  // Step 3: Login to obtain token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return loginRes.body.token;
};

describe('AI Resume Backend', () => {
  test('GET / responds with API running message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Resume Copilot API is running' });
  });

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
      .send({ email: 'invalid-email' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/Invalid email format/);
  });

  test('POST /api/auth/register returns 400 for duplicate email', async () => {
    // Manually create a user first
    await User.create({ name: 'Test User', email: 'test@example.com', password: 'password' });

    const duplicateRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' });

    expect(duplicateRes.status).toBe(400);
    expect(duplicateRes.body.success).toBe(false);
    expect(duplicateRes.body.message).toMatch(/An account with this email already exists/);
  });

  test('POST /api/auth/register sends OTP and /api/auth/verify-otp registers user', async () => {
    const email = 'test@example.com';
    const password = 'password';

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ email });

    expect(registerRes.status).toBe(200);
    expect(registerRes.body.success).toBe(true);

    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    expect(otpRecord).toBeDefined();

    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ name: 'Test User', email, password, otp: otpRecord.otp });

    expect(verifyRes.status).toBe(201);
    expect(verifyRes.body.success).toBe(true);

    // Now test login works
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.token).toBeDefined();

    const token = loginRes.body.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.email).toBe(email);
  });

  test('POST /api/auth/login returns 401 for invalid credentials', async () => {
    // Manually create a user first
    await User.create({ name: 'Test User', email: 'wrong@test.com', password: 'password' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@test.com', password: 'badpass' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('Protected resume and analysis routes return 401 without token', async () => {
    const resumeRes = await request(app).get('/api/resume/all');
    const analysisRes = await request(app).post('/api/analysis/match').send({});

    expect(resumeRes.status).toBe(401);
    expect(analysisRes.status).toBe(401);
  });

  test('Protected route rejects invalid token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.value');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/invalid or has expired|Invalid token/);
  });

  test('POST /api/resume/upload accepts valid resume upload', async () => {
    const token = await registerAndLogin();

    const uploadRes = await request(app)
      .post('/api/resume/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.success).toBe(true);
    expect(uploadRes.body.resume).toHaveProperty('_id');
    expect(uploadRes.body.resume.originalName).toBe('sample.pdf');
  });

  test('POST /api/resume/upload rejects unsupported file types', async () => {
    const token = await registerAndLogin();
    const invalidFilePath = path.join(__dirname, 'fixtures', 'invalid.txt');
    fs.writeFileSync(invalidFilePath, 'not a pdf');

    const uploadRes = await request(app)
      .post('/api/resume/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', invalidFilePath, { filename: 'invalid.txt', contentType: 'text/plain' });

    expect(uploadRes.status).toBe(500);
    expect(uploadRes.body.success).toBe(false);
    expect(uploadRes.body.message).toMatch(/Invalid file type/);

    fs.unlinkSync(invalidFilePath);
  });

  test('GET /api/resume/all returns uploaded resume list', async () => {
    const token = await registerAndLogin();

    await request(app)
      .post('/api/resume/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

    const listRes = await request(app)
      .get('/api/resume/all')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.success).toBe(true);
    expect(listRes.body.count).toBe(1);
    expect(listRes.body.resumes[0]).toHaveProperty('originalName', 'sample.pdf');
  });

  test('POST /api/analysis/ats creates ATS analysis', async () => {
    const token = await registerAndLogin();

    const uploadRes = await request(app)
      .post('/api/resume/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

    const resumeId = uploadRes.body.resume._id;

    const analysisRes = await request(app)
      .post('/api/analysis/ats')
      .set('Authorization', `Bearer ${token}`)
      .send({ resumeId });

    expect(analysisRes.status).toBe(201);
    expect(analysisRes.body.success).toBe(true);
    expect(analysisRes.body.analysis).toHaveProperty('atsScore', 88);
  });

  test('POST /api/analysis/match returns analysis for resume and job description', async () => {
    const token = await registerAndLogin();

    const uploadRes = await request(app)
      .post('/api/resume/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

    const resumeId = uploadRes.body.resume._id;

    const matchRes = await request(app)
      .post('/api/analysis/match')
      .set('Authorization', `Bearer ${token}`)
      .send({
        resumeId,
        jobDescription: 'Looking for an experienced Node.js developer to build scalable backend services, design REST APIs, and optimize application performance in a fast-paced engineering team.'
      });

    expect(matchRes.status).toBe(201);
    expect(matchRes.body.success).toBe(true);
    expect(matchRes.body.analysis).toHaveProperty('matchScore', 80);
  });

  test('POST /api/analysis/cover-letter returns generated cover letter', async () => {
    const token = await registerAndLogin();

    const uploadRes = await request(app)
      .post('/api/resume/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

    const resumeId = uploadRes.body.resume._id;

    const coverRes = await request(app)
      .post('/api/analysis/cover-letter')
      .set('Authorization', `Bearer ${token}`)
      .send({ resumeId, companyName: 'Acme Corp', jobDescription: 'Build modern resumes.', style: 'professional' });

    expect(coverRes.status).toBe(201);
    expect(coverRes.body.success).toBe(true);
    expect(coverRes.body.analysis).toHaveProperty('coverLetterContent');
  });

  test('GET /api/analysis/history/:resumeId returns analysis history', async () => {
    const token = await registerAndLogin();

    const uploadRes = await request(app)
      .post('/api/resume/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('resume', samplePdfPath, { filename: 'sample.pdf', contentType: 'application/pdf' });

    const resumeId = uploadRes.body.resume._id;

    await request(app)
      .post('/api/analysis/ats')
      .set('Authorization', `Bearer ${token}`)
      .send({ resumeId });

    const historyRes = await request(app)
      .get(`/api/analysis/history/${resumeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(historyRes.status).toBe(200);
    expect(historyRes.body.success).toBe(true);
    expect(historyRes.body.count).toBeGreaterThanOrEqual(1);
  });

  test('GET /api/analysis/history/:resumeId returns 404 for missing resume', async () => {
    const token = await registerAndLogin();
    const nonExistentResumeId = new mongoose.Types.ObjectId();

    const historyRes = await request(app)
      .get(`/api/analysis/history/${nonExistentResumeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(historyRes.status).toBe(404);
    expect(historyRes.body.success).toBe(false);
  });
});
