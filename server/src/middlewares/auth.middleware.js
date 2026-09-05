const { verifyAuthToken } = require('../utils/jwt');

/**
 * Reads a Bearer JWT, verifies it, and populates req.user
 * with { id, email, role }.
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Missing or invalid token',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAuthToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};
