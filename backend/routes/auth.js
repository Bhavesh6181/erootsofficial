const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { passport, generateToken } = require('../config/passport');
const { signToken } = require('../config/security');
const {
  getClientUrl,
  getRoleForEmail,
  isGoogleAuthConfigured,
  normalizeEmail,
} = require('../config/appConfig');

const router = express.Router();

router.get('/providers', (req, res) => {
  res.json({
    success: true,
    data: {
      google: {
        enabled: isGoogleAuthConfigured(),
      },
    },
  });
});

// Register (for creating admin user)
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    if (process.env.ENABLE_ADMIN_BOOTSTRAP !== 'true') {
      return res.status(403).json({
        success: false,
        message: 'Registration is disabled. Use the create-admin script for initial setup.'
      });
    }

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin bootstrap is no longer available after the first admin is created.'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      role: 'admin' // First user is admin
    });

    await user.save();

    // Generate JWT token
    const token = signToken(
      { userId: user._id, email: user.email, role: user.role },
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const nextRole = getRoleForEmail(user.email, user.role);
    if (user.role !== nextRole) {
      user.role = nextRole;
      await user.save();
    }

    // Generate JWT token
    const token = signToken(
      { userId: user._id, email: user.email, role: user.role },
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          profilePicture: user.profilePicture
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Verify token
router.get('/verify', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: {
        _id: req.user._id,
        email: req.user.email,
        role: req.user.role
      }
    }
  });
});

// Logout (client-side token removal)
router.post('/logout', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Google OAuth Routes (only if configured)
if (isGoogleAuthConfigured()) {
  // Initiate Google OAuth
  router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  // Google OAuth Callback
  router.get('/google/callback', 
    passport.authenticate('google', { session: false }),
    async (req, res) => {
      try {
        // Generate JWT token
        const token = generateToken(req.user);
        
        // Redirect to frontend with token
        const redirectUrl = `${getClientUrl()}/auth/callback?token=${token}`;
        res.redirect(redirectUrl);
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        const errorUrl = `${getClientUrl()}/auth/callback?error=authentication_failed`;
        res.redirect(errorUrl);
      }
    }
  );
}

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          profilePicture: user.profilePicture,
          role: user.role,
          authProvider: user.authProvider,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

module.exports = router;
