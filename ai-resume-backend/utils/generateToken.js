const jwt = require('jsonwebtoken');

const generateToken = (userId, name = '', tokenVersion = 0) => {
  return jwt.sign(
    { 
      userId, 
      name, 
      purpose: 'access',
      tokenVersion
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

module.exports = generateToken;
