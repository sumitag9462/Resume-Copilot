const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = require('../app');
const User = require('../models/User');
const OTP = require('../models/OTP');
const Resume = require('../models/Resume');
const ArenaHistory = require('../models/ArenaHistory');
const TokenBlocklist = require('../models/TokenBlocklist');

const TEST_EMAIL = 'production_smoketest@example.com';
const TEST_PASSWORD = 'Password123!';
const NEW_PASSWORD = 'NewPassword123!';
const sampleFilePath = path.join(__dirname, '../tests/fixtures/sample.pdf');

const results = [];
let passedAll = true;

function logTest(name, success, error = null) {
  results.push({ name, success, error });
  if (success) {
    console.log(`✅ PASS: ${name}`);
  } else {
    passedAll = false;
    console.log(`❌ FAIL: ${name}`);
    if (error) {
      console.error(error);
    }
  }
}

async function runTests() {
  console.log('🏁 Starting production integration smoke test...');

  // 1. Establish Database Connection
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    console.log('🔌 Connected to MongoDB successfully.');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  // 2. Generate a valid sample PDF file dynamically using pdfkit
  try {
    const dir = path.dirname(sampleFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(sampleFilePath);
    doc.pipe(writeStream);
    doc.fontSize(12).text(
      'Jane Doe\n' +
      'Email: jane.doe@example.com\n' +
      'Phone: 123-456-7890\n\n' +
      'Summary:\n' +
      'Experienced Software Engineer with a strong background in developing scalable web applications. ' +
      'Proficient in JavaScript, Node.js, React, Express, and MongoDB. Experience deploying to Render and Vercel.\n\n' +
      'Experience:\n' +
      'Software Engineer at Tech Solutions (2022 - Present)\n' +
      '- Designed and implemented RESTful APIs using Node.js and Express, improving server response times by 20%.\n' +
      '- Developed responsive and interactive user interfaces using React and Tailwind CSS.\n' +
      '- Managed MongoDB databases and designed schemas for efficient data retrieval.\n\n' +
      'Skills:\n' +
      'JavaScript, Node.js, Express, React, HTML, CSS, MongoDB, RESTful APIs, Git, Docker, AWS.\n\n' +
      'Education:\n' +
      'Bachelor of Science in Computer Science, State University (2018 - 2022)'
    );
    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    console.log('📄 Generated a valid, text-extractable sample PDF resume at tests/fixtures/sample.pdf');
  } catch (err) {
    console.error('❌ Failed to generate sample PDF:', err.message);
    process.exit(1);
  }

  // Cleanup pre-existing smoke test data
  try {
    const existingUsers = await User.find({ email: TEST_EMAIL });
    const userIds = existingUsers.map(u => u._id);

    await Resume.deleteMany({ user: { $in: userIds } });
    await ArenaHistory.deleteMany({ userId: { $in: userIds } });
    await User.deleteMany({ email: TEST_EMAIL });
    await OTP.deleteMany({ email: TEST_EMAIL });
    console.log('🧹 Cleaned up existing test data.');
  } catch (err) {
    console.warn('⚠️  Warning during test cleanup:', err.message);
  }

  // Test 1: GET / (Root Health Check)
  try {
    const res = await request(app).get('/');
    if ([200, 201].includes(res.status) && res.body.message === 'Resume Copilot API is running') {
      logTest('GET / (Root Health Check)', true);
    } else {
      logTest('GET / (Root Health Check)', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('GET / (Root Health Check)', false, err.message);
  }

  // Test 2: Request Registration OTP
  try {
    const res = await request(app)
      .post('/api/auth/request-email-otp')
      .send({ email: TEST_EMAIL });
    if ([200, 201].includes(res.status)) {
      logTest('Send Registration OTP', true);
    } else {
      logTest('Send Registration OTP', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Send Registration OTP', false, err.message);
  }

  // Retrieve OTP from DB
  let registrationOtp = '';
  try {
    const otpDoc = await OTP.findOne({ email: TEST_EMAIL }).sort({ createdAt: -1 });
    if (otpDoc) {
      registrationOtp = otpDoc.otp;
      console.log(`🔑 Fetched Registration OTP: ${registrationOtp}`);
    } else {
      throw new Error('OTP document not found in database.');
    }
  } catch (err) {
    console.error('❌ Failed to retrieve Registration OTP:', err.message);
    passedAll = false;
  }

  // Test 3: Verify Registration OTP and Create User
  try {
    const res = await request(app)
      .post('/api/auth/verify-email-otp')
      .send({
        name: 'Smoke Test User',
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        mobile: '1234567890',
        place: 'San Francisco',
        otp: registrationOtp
      });
    if (res.status === 201 && res.body.success) {
      logTest('Verify Registration OTP / Create User', true);
    } else {
      logTest('Verify Registration OTP / Create User', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Verify Registration OTP / Create User', false, err.message);
  }

  // Test 4: Login User (Initial Password)
  let authToken = '';
  try {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    if ([200, 201].includes(res.status) && res.body.success && res.body.token) {
      authToken = res.body.token;
      logTest('Login User (Initial)', true);
    } else {
      logTest('Login User (Initial)', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Login User (Initial)', false, err.message);
  }

  // Test 5: Forgot Password (Request Reset OTP)
  try {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: TEST_EMAIL });
    if ([200, 201].includes(res.status)) {
      logTest('Forgot Password (Request Reset OTP)', true);
    } else {
      logTest('Forgot Password (Request Reset OTP)', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Forgot Password (Request Reset OTP)', false, err.message);
  }

  // Retrieve Reset OTP from DB
  let resetOtp = '';
  try {
    const otpDoc = await OTP.findOne({ email: TEST_EMAIL }).sort({ createdAt: -1 });
    if (otpDoc) {
      resetOtp = otpDoc.otp;
      console.log(`🔑 Fetched Password Reset OTP: ${resetOtp}`);
    } else {
      throw new Error('Password Reset OTP document not found in database.');
    }
  } catch (err) {
    console.error('❌ Failed to retrieve Password Reset OTP:', err.message);
    passedAll = false;
  }

  // Test 6: Verify Password Reset OTP
  let resetToken = '';
  try {
    const res = await request(app)
      .post('/api/auth/verify-reset-otp')
      .send({ email: TEST_EMAIL, otp: resetOtp });
    if ([200, 201].includes(res.status) && res.body.success && res.body.resetToken) {
      resetToken = res.body.resetToken;
      logTest('Verify Password Reset OTP', true);
    } else {
      logTest('Verify Password Reset OTP', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Verify Password Reset OTP', false, err.message);
  }

  // Test 7: Reset Password
  try {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: resetToken, password: NEW_PASSWORD });
    if ([200, 201].includes(res.status)) {
      logTest('Reset Password', true);
    } else {
      logTest('Reset Password', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Reset Password', false, err.message);
  }

  // Test 8: Login with New Password
  try {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: NEW_PASSWORD });
    if ([200, 201].includes(res.status) && res.body.success && res.body.token) {
      authToken = res.body.token; // update active auth token
      logTest('Login User (New Password)', true);
    } else {
      logTest('Login User (New Password)', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Login User (New Password)', false, err.message);
  }

  // Test 9: Get Profile (Auth Middleware Check)
  try {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    if ([200, 201].includes(res.status) && res.body.email === TEST_EMAIL) {
      logTest('Get Profile (Auth Verification)', true);
    } else {
      logTest('Get Profile (Auth Verification)', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Get Profile (Auth Verification)', false, err.message);
  }

  // Check rate limiting proxy behavior by sending a proxy header
  try {
    const res = await request(app)
      .get('/')
      .set('X-Forwarded-For', '192.168.1.100');
    if ([200, 201].includes(res.status)) {
      logTest('Rate Limiter Proxy Configuration', true);
    } else {
      logTest('Rate Limiter Proxy Configuration', false, `Status: ${res.status}`);
    }
  } catch (err) {
    logTest('Rate Limiter Proxy Configuration', false, err.message);
  }

  // Test 10: Resume Upload
  let resumeId = '';
  try {
    if (!fs.existsSync(sampleFilePath)) {
      throw new Error(`Sample fixture not found at path: ${sampleFilePath}`);
    }

    const res = await request(app)
      .post('/api/resume/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('resume', sampleFilePath);

    if (res.status === 201 && res.body.resume && res.body.resume._id) {
      resumeId = res.body.resume._id;
      logTest('Resume Upload', true);
    } else {
      logTest('Resume Upload', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Resume Upload', false, err.message);
  }

  // Test 11: ATS Analysis
  try {
    const res = await request(app)
      .post('/api/analysis/ats')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ resumeId });
    if ([200, 201].includes(res.status)) {
      logTest('ATS Analysis', true);
    } else {
      logTest('ATS Analysis', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('ATS Analysis', false, err.message);
  }

  // Test 12: JD Match
  try {
    const res = await request(app)
      .post('/api/analysis/match')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        resumeId,
        jobDescription: 'Seeking a developer with expertise in Node.js, Express, MongoDB, and React.'
      });
    if ([200, 201].includes(res.status)) {
      logTest('JD Match Analysis', true);
    } else {
      logTest('JD Match Analysis', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('JD Match Analysis', false, err.message);
  }

  // Test 13: Cover Letter
  try {
    const res = await request(app)
      .post('/api/analysis/cover-letter')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        resumeId,
        companyName: 'Tech Innovators',
        jobDescription: 'Software Engineer',
        style: 'professional'
      });
    if ([200, 201].includes(res.status)) {
      logTest('Cover Letter Generation', true);
    } else {
      logTest('Cover Letter Generation', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Cover Letter Generation', false, err.message);
  }

  // Test 14: Bullet Enhancement
  try {
    const res = await request(app)
      .post('/api/resume/enhance')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ bullet: 'Responsible for writing APIs in node js.' }); // enhanced single expects 'bullet'
    if ([200, 201].includes(res.status)) {
      logTest('Bullet Enhancement', true);
    } else {
      logTest('Bullet Enhancement', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Bullet Enhancement', false, err.message);
  }

  // Test 15: Interview Preparation
  try {
    const res = await request(app)
      .post('/api/interview/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ resumeId, role: 'Software Engineer', jobDescription: 'React Developer' });
    if (res.status === 201) {
      logTest('Interview Preparation', true);
    } else {
      logTest('Interview Preparation', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Interview Preparation', false, err.message);
  }

  // Test 16: Weak Language Analysis
  try {
    const res = await request(app)
      .post('/api/resume/scan')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ text: 'This is a lazy sample resume text. I just did stuff. It is very passive and vague.' });
    if ([200, 201].includes(res.status)) {
      logTest('Weak Language Analysis', true);
    } else {
      logTest('Weak Language Analysis', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Weak Language Analysis', false, err.message);
  }

  // Test 17: Arena Module
  try {
    const res = await request(app)
      .post('/api/arena/run')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        feature: 'ats_analysis',
        inputs: { resumeId },
        model: 'gemini-2.5-flash',
        compareMode: false,
        forceRefresh: true
      });
    if (res.status === 201) {
      logTest('Arena Module Endpoint', true);
    } else {
      logTest('Arena Module Endpoint', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Arena Module Endpoint', false, err.message);
  }

  // Test 18: Outreach Module
  try {
    const res = await request(app)
      .post('/api/outreach/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        targetRole: 'Software Engineer',
        companyName: 'Tech Corp',
        tone: 'Professional',
        resumeId
      });
    if ([200, 201].includes(res.status)) {
      logTest('Outreach Module Endpoint', true);
    } else {
      logTest('Outreach Module Endpoint', false, `Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    logTest('Outreach Module Endpoint', false, err.message);
  }

  // Final Database Cleanup of test user & data
  try {
    const userDoc = await User.findOne({ email: TEST_EMAIL });
    if (userDoc) {
      await Resume.deleteMany({ user: userDoc._id });
      await ArenaHistory.deleteMany({ userId: userDoc._id });
      await User.deleteOne({ _id: userDoc._id });
    }
    await OTP.deleteMany({ email: TEST_EMAIL });
    console.log('🧹 Final database test data cleaned up successfully.');
  } catch (err) {
    console.warn('⚠️  Warning during final cleanup:', err.message);
  }

  // Print results
  console.log('\n==================================================');
  console.log('📊 INTEGRATION SMOKE TEST REPORT:');
  console.log('==================================================');
  results.forEach(r => {
    console.log(`${r.success ? '✅ PASS' : '❌ FAIL'}: ${r.name}`);
  });
  console.log('==================================================');

  // Disconnect from Mongoose
  await mongoose.disconnect();

  if (passedAll) {
    console.log('🎉 All production smoke tests passed successfully!');
    process.exit(0);
  } else {
    console.error('💥 One or more smoke tests failed.');
    process.exit(1);
  }
}

runTests();
