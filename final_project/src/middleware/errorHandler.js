const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error (in production, use proper logging service)
  if (config.env === 'development') {
    console.error('Error:', err);
  } else {
    console.error('Error:', err.message);
  }

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    error = { message: messages.join(', '), statusCode: 400 };
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'field';
    error = { message: `${field} already exists`, statusCode: 409 };
  }

  // Sequelize Foreign Key Constraint Error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = { message: 'Referenced resource not found', statusCode: 404 };
  }

  // Sequelize Database Error
  if (err.name === 'SequelizeDatabaseError') {
    error = { message: 'Database error occurred', statusCode: 500 };
  }

  // Sequelize Connection Error
  if (err.name === 'SequelizeConnectionError') {
    error = { message: 'Database connection error', statusCode: 503 };
  }

  // Sequelize Timeout Error
  if (err.name === 'SequelizeConnectionTimedOutError') {
    error = { message: 'Database connection timeout', statusCode: 503 };
  }

  // PostgreSQL duplicate key error (raw)
  if (err.code === '23505') {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 409 };
  }

  // PostgreSQL foreign key violation (raw)
  if (err.code === '23503') {
    const message = 'Referenced resource not found';
    error = { message, statusCode: 404 };
  }

  // PostgreSQL not null violation (raw)
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



