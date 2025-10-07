// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  // Default
  const status = err.statusCode || 500;
  const payload = {
    error: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong'
  };

  // Optional: include validation details
  if (err.details) payload.details = err.details;

  if (process.env.NODE_ENV === 'development') {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};
