// Basic 404 and error handlers
module.exports.notFound = (req, res, next) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
};

module.exports.errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
};