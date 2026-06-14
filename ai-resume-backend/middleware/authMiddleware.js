const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlocklist = require('../models/TokenBlocklist');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Check if token has been revoked (logged out)
      const isBlocked = await TokenBlocklist.findOne({ token });
      if (isBlocked) {
          return res.status(401).json({ success: false, message: 'Not authorized, token revoked' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid token or has expired' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };