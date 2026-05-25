const User = require('../models/User');
const { verifyToken } = require('../config/security');

const extractBearerToken = (req) => {
  return req.header('Authorization')?.replace('Bearer ', '').trim();
};

const getUserFromToken = async (token) => {
  const decoded = verifyToken(token);
  return User.findById(decoded.userId);
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      req.user = null;
      return next();
    }

    const user = await getUserFromToken(token);
    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

const auth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const user = await getUserFromToken(token);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Token verification failed.' 
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. Admin privileges required.' 
        });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Authorization failed.' 
    });
  }
};

module.exports = { auth, adminAuth, optionalAuth };
