const { Book } = require('../models');

const addReview = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;

    await Book.addReview(isbn, username, review);

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
    });
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const { reviewId } = req.query; // Required query parameter for review ID
    const { review } = req.body;
    const username = req.user.username;

    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: 'reviewId query parameter is required',
      });
    }

    const result = await Book.updateReview(isbn, username, reviewId, review);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.review,
    });
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
    if (error.message === 'Review not found') {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you do not have permission to update it',
      });
    }
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const { reviewId } = req.query; // Optional query parameter to delete specific review
    const username = req.user.username;

    const result = await Book.deleteReview(isbn, username, reviewId);

    res.status(200).json({
      success: true,
      message: result.message,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
    if (error.message === 'Review not found') {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }
    next(error);
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
};



