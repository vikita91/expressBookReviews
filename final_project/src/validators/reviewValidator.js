const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

const reviewValidator = [
  param('isbn')
    .notEmpty()
    .withMessage('ISBN is required')
    .isInt({ min: 1 })
    .withMessage('ISBN must be a valid number'),
  body('review')
    .trim()
    .notEmpty()
    .withMessage('Review is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Review must be between 1 and 1000 characters'),
  handleValidationErrors,
];

const isbnParamValidator = [
  param('isbn')
    .notEmpty()
    .withMessage('ISBN is required')
    .isInt({ min: 1 })
    .withMessage('ISBN must be a valid number'),
  handleValidationErrors,
];

module.exports = {
  reviewValidator,
  isbnParamValidator,
};



