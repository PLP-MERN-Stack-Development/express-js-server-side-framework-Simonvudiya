// utils/asyncHandler.js
// wrapper to catch async errors and forward to express error handler
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
