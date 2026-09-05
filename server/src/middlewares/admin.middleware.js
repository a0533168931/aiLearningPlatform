/**
 * Requires req.user.role === 'ADMIN'.
 * Must run after auth middleware.
 * Unauthenticated requests are rejected by auth (401).
 * Authenticated non-admins receive 403.
 */
module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin only.',
    });
  }

  next();
};
