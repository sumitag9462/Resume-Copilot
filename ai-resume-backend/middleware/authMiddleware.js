const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const TokenBlocklist = require('../models/TokenBlocklist');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
      }

      // Check if token has been revoked (logged out) using tokenHash or raw token
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const isBlocked = await TokenBlocklist.findOne({
        $or: [{ tokenHash }, { token }]
      });
      if (isBlocked) {
        return res.status(401).json({ success: false, message: 'Not authorized, token revoked' });
      }

      // Verify token signature and expiry
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Ensure reset tokens cannot be used as access tokens
      if (decoded.purpose && decoded.purpose !== 'access') {
        return res.status(401).json({ success: false, message: 'Invalid token purpose for authentication' });
      }

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      // Invalidate tokens if tokenVersion is behind or issued prior to password change
      if (decoded.tokenVersion !== undefined && user.tokenVersion !== undefined && decoded.tokenVersion < user.tokenVersion) {
        return res.status(401).json({ success: false, message: 'Session expired due to recent password change. Please log in again.' });
      }

      if (user.passwordChangedAt && decoded.iat) {
        const passwordChangedTime = Math.floor(user.passwordChangedAt.getTime() / 1000);
        if (decoded.iat < passwordChangedTime) {
          return res.status(401).json({ success: false, message: 'Session expired due to recent password change. Please log in again.' });
        }
      }

      req.user = user;
      req.token = token;
      req.tokenHash = tokenHash;
      next();
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Token verification failed:', error.message);
      }
      return res.status(401).json({ success: false, message: 'Invalid token or has expired' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Guard: ensures account has proven email ownership before accessing workspace data
const requireVerified = (req, res, next) => {
  if (req.user && req.user.isVerified === false) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email before accessing workspace resources.'
    });
  }
  next();
};

module.exports = { protect, requireVerified };
