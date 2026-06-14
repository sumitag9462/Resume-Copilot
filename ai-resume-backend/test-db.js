const mongoose = require('mongoose');
const Resume = require('./models/Resume');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected");
  const resumes = await Resume.find({});
  if (resumes.length > 0) {
    const r = resumes[0];
    console.log("Found resume:", r._id, r.fileName);
    try {
      await r.deleteOne();
      console.log("Deleted successfully");
    } catch(e) {
      console.error("Delete failed:", e);
    }
  } else {
    console.log("No resumes found");
  }
  process.exit(0);
}).catch(console.error);
