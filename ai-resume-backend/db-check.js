const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Analysis = require('./models/Analysis');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const analyses = await Analysis.find({ type: 'ats_analysis' }).sort({ createdAt: -1 }).limit(10);
    analyses.forEach(a => {
      console.log(`ID: ${a._id}, Resume: ${a.resume}, ATS Score: ${a.atsScore}, Overall Score: ${a.overallScore}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
