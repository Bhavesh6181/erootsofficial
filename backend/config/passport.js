const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { signToken } = require('./security');
const {
  getRoleForEmail,
  isGoogleAuthConfigured,
  normalizeEmail,
} = require('./appConfig');

// Configure Google OAuth Strategy (only if credentials are provided)
if (isGoogleAuthConfigured()) {
  
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = normalizeEmail(profile.emails?.[0]?.value);

    // Check if user already exists with this Google ID
    let existingUser = await User.findOne({ googleId: profile.id });
    
    if (existingUser) {
      const nextRole = getRoleForEmail(existingUser.email, existingUser.role);
      if (existingUser.role !== nextRole) {
        existingUser.role = nextRole;
        await existingUser.save();
      }
      return done(null, existingUser);
    }
    
    // Check if user exists with same email
    existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Link Google account to existing user
      existingUser.googleId = profile.id;
      existingUser.authProvider = 'google';
      existingUser.name = profile.displayName;
      existingUser.profilePicture = profile.photos[0]?.value;
      existingUser.isVerified = true; // Google accounts are pre-verified
      existingUser.role = getRoleForEmail(email, existingUser.role);
      await existingUser.save();
      return done(null, existingUser);
    }
    
    // Create new user
    const newUser = new User({
      googleId: profile.id,
      email,
      name: profile.displayName,
      profilePicture: profile.photos[0]?.value,
      authProvider: 'google',
      isVerified: true,
      role: getRoleForEmail(email, 'user'),
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
  }));
  
  console.log('Google OAuth strategy configured successfully');
} else {
  console.log('Google OAuth credentials not configured. Google login will not be available.');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Generate JWT token for user
const generateToken = (user) => {
  return signToken(
    { 
      userId: user._id, 
      email: user.email, 
      role: user.role,
      authProvider: user.authProvider 
    },
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = { passport, generateToken };
