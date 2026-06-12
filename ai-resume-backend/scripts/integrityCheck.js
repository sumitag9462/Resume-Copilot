require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const outreachService = require('../services/outreachService');

// Initialize Gemini directly for basic test
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const runIntegrityCheck = async () => {
  console.log('Starting System Integrity Check...\n');
  
  let successCount = 0;
  let failCount = 0;

  const testCases = [
    {
      name: 'ATS Analysis Engine',
      run: async () => {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = 'Act as an ATS. Analyze this resume: "Software Engineer with 5 years experience in React." Return a JSON with an atsScore (0-100).';
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return text.includes('atsScore');
      }
    },
    {
      name: 'JD Match Engine',
      run: async () => {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = 'Compare this resume "React Developer" with this JD "Looking for a React Developer". Return a JSON with matchScore (0-100).';
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return text.includes('matchScore');
      }
    },
    {
      name: 'Resume Boost (Bullet Enhancer)',
      run: async () => {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = 'Enhance this resume bullet: "fixed bugs". Return a JSON array of strings.';
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return text.length > 10;
      }
    },
    {
      name: 'Mock Interviews',
      run: async () => {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = 'Generate 1 technical interview question for a Frontend Engineer. Return JSON with "question" key.';
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return text.includes('question');
      }
    },
    {
      name: 'Outreach Generator (New Feature)',
      run: async () => {
        // Use the actual service
        const data = await outreachService.generateOutreachContent({ name: 'Test User' }, {
          targetRole: 'Software Engineer',
          companyName: 'Tech Corp',
          tone: 'professional'
        });
        return data.emailSubject && data.emailBody && data.linkedinMessage;
      }
    }
  ];

  for (const test of testCases) {
    process.stdout.write(`Testing [${test.name}]... `);
    try {
      const isSuccess = await test.run();
      if (isSuccess) {
        console.log('✅ PASS');
        successCount++;
      } else {
        console.log('❌ FAIL (Invalid response format)');
        failCount++;
      }
    } catch (error) {
      console.log(`❌ FAIL (${error.message})`);
      failCount++;
    }
  }

  console.log('\n--- Integrity Check Complete ---');
  console.log(`Passed: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runIntegrityCheck();
