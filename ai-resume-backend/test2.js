const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Resume = require('./models/Resume');
const Analysis = require('./models/Analysis');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const resumes = await Resume.find().sort({ createdAt: -1 }).limit(2);
    resumes.forEach(r => {
      console.log(`Resume ID: ${r._id}, Name: ${r.originalName}`);
      console.log(`Extracted Text Length: ${r.extractedText.length}`);
      console.log(`Text preview: ${r.extractedText.substring(0, 100)}...`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
