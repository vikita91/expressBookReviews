const config = require('../../config/config');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // PostgreSQL duplicate key error
  if (err.code === '23505') {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    const message = 'Referenced resource not found';
    error = { message, statusCode: 404 };
  }

  // PostgreSQL not null violation
  if (err.code === '23502') {
    const message = 'Required field is missing';
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Validation errors from express-validator
  if (err.array && typeof err.array === 'function') {
    const message = err.array().map(e => e.msg).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(config.env === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;



