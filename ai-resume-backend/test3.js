const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Analysis = require('./models/Analysis');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const a1 = await Analysis.findOne({ resume: '6a29bc4162ffb28b28535153', type: 'ats_analysis' }).sort({ createdAt: -1 });
    const a2 = await Analysis.findOne({ resume: '6a29bbff62ffb28b28535151', type: 'ats_analysis' }).sort({ createdAt: -1 });
    
    console.log("Analysis 1:", JSON.stringify(a1.missingKeywords));
    console.log("Analysis 2:", JSON.stringify(a2.missingKeywords));
    console.log("Analysis 1 Strengths:", JSON.stringify(a1.strengths));
    console.log("Analysis 2 Strengths:", JSON.stringify(a2.strengths));
    
    process.exit(0);
  });
