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
  console.error('Usage: node cleanup-user.js <email>');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    const resultUser = await User.deleteMany({ email });
    const resultOtp = await OTP.deleteMany({ email });
    console.log(`CLEANUP_SUCCESS: Deleted ${resultUser.deletedCount} users and ${resultOtp.deletedCount} OTPs for ${email}`);
  } catch (err) {
    console.error('Error during cleanup:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
