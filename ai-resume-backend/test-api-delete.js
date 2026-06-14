const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
const Resume = require('./models/Resume');
require('dotenv').config();
const jwt = require('jsonwebtoken');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({});
    if (!user) { console.log("No user"); process.exit(0); }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // upload a dummy resume
    const newRes = await Resume.create({
      user: user._id,
      fileName: 'dummy.pdf',
      originalName: 'dummy.pdf',
      fileType: 'pdf',
      filePath: 'dummy.pdf',
      extractedText: 'dummy'
    });
    console.log("Created resume:", newRes._id);
    
    const res = await axios.delete(`http://localhost:5000/api/resume/${newRes._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Status:", res.status, res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
  process.exit(0);
})();
