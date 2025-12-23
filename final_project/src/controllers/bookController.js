const { Book } = require('../models');

const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.status(200).json({
      success: true,
      count: Object.keys(books).length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const getBookByIsbn = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findByIsbn(isbn);
    res.status(200).json({
      success: true,
      data: book,
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

const getBooksByAuthor = async (req, res, next) => {
  try {
    const { author } = req.params;
    const books = await Book.findByAuthor(author);

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No books found for this author',
      });
    }

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const getBooksByTitle = async (req, res, next) => {
  try {
    const { title } = req.params;
    const books = await Book.findByTitle(title);

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No books found for this title',
      });
    }

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const reviews = await Book.getReviews(isbn);
    res.status(200).json({
      success: true,
      count: Array.isArray(reviews) ? reviews.length : 0,
      data: reviews,
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
  getAllBooks,
  getBookByIsbn,
  getBooksByAuthor,
  getBooksByTitle,
  getReviews,
};



