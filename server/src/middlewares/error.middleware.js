/**
 * Error Middleware
 * Global error handler — must be registered LAST in app.js.
 */
const errorHandler = (err, req, res, next) => {
  console.error("[SERVER ERROR]:", err);

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;

