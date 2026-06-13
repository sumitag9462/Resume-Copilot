const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not configured in .env');
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node get-otp.js <email>');
  process.exit(1);
}

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    const latest = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (latest) {
      console.log(`OTP_FOUND:${latest.otp}`);
    } else {
      console.log('OTP_NOT_FOUND');
    }
  } catch (err) {
    console.error('Error fetching OTP:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
