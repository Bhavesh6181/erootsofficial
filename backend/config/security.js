const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is required. Create E:\\Work\\Eroots\\erootsofficial\\backend\\.env or E:\\Work\\Eroots\\erootsofficial\\.env with JWT_SECRET=<your-secret> and restart the server.'
    );
  }

  return process.env.JWT_SECRET;
};

const getSessionSecret = () => {
  return process.env.SESSION_SECRET || getJwtSecret();
};

const signToken = (payload, options = {}) => {
  return jwt.sign(payload, getJwtSecret(), options);
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

module.exports = {
  getJwtSecret,
  getSessionSecret,
  signToken,
  verifyToken,
};
