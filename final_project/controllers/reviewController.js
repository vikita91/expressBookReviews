const Book = require('../models/Book');

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

const deleteReview = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const username = req.user.username;

    await Book.deleteReview(isbn, username);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
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

module.exports = {
  addReview,
  deleteReview,
};



