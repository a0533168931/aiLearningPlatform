const jwt = require('jsonwebtoken');

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

const userToken = (overrides = {}) =>
  signToken({
    id: 2,
    email: 'user@example.com',
    role: 'USER',
    ...overrides,
  });

const adminToken = (overrides = {}) =>
  signToken({
    id: 1,
    email: 'admin@example.com',
    role: 'ADMIN',
    ...overrides,
  });

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

module.exports = {
  signToken,
  userToken,
  adminToken,
  authHeader,
};
