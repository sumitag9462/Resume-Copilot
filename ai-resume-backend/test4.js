const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Analysis = require('./models/Analysis');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const a1 = await Analysis.findOne({ resume: '6a29bc4162ffb28b28535153', type: 'ats_analysis' }).sort({ createdAt: -1 });
    const a2 = await Analysis.findOne({ resume: '6a29bbff62ffb28b28535151', type: 'ats_analysis' }).sort({ createdAt: -1 });
    
    console.log("Analysis 1 CreatedAt:", a1.createdAt);
    console.log("Analysis 2 CreatedAt:", a2.createdAt);
    
    process.exit(0);
  });
