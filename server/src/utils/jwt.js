const jwt = require('jsonwebtoken');

const TOKEN_EXPIRES_IN = '7d';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.jwt_secret;
  if (!secret) {
    const error = new Error('JWT_SECRET is not configured');
    error.statusCode = 500;
    throw error;
  }
  return secret;
};

const signAuthToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: TOKEN_EXPIRES_IN }
  );

const verifyAuthToken = (token) => jwt.verify(token, getJwtSecret());

module.exports = {
  getJwtSecret,
  signAuthToken,
  verifyAuthToken,
};
