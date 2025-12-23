const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/sequelize');

class Book extends Model {}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isbn: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'ISBN already exists',
      },
      validate: {
        notEmpty: {
          msg: 'ISBN cannot be empty',
        },
      },
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty',
        },
      },
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Author cannot be empty',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'Book',
    tableName: 'books',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['isbn'] },
      { fields: ['author'] },
      { fields: ['title'] },
    ],
  }
);

// Helper methods that use the original Sequelize methods
const _findAllBooks = async function () {
  return await Model.findAll.call(Book, {
    include: [
      {
        association: 'reviews',
        attributes: ['username', 'review'],
      },
    ],
  });
};

const _findOneBook = async function (options) {
  return await Model.findOne.call(Book, options);
};

// Static methods for compatibility with existing controllers
Book.findAll = async function () {
  try {
    // Get all books using raw SQL
    const books = await sequelize.query(
      'SELECT id, isbn, title, author FROM books ORDER BY id',
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    
    // Get all reviews with full details
    const allReviews = await sequelize.query(
      'SELECT id, book_id, username, review, created_at FROM reviews ORDER BY created_at DESC',
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    
    // Group reviews by book_id as arrays
    const reviewsByBookId = {};
    allReviews.forEach(review => {
      if (!reviewsByBookId[review.book_id]) {
        reviewsByBookId[review.book_id] = [];
      }
      reviewsByBookId[review.book_id].push({
        id: review.id,
        username: review.username,
        review: review.review,
        created_at: review.created_at,
      });
    });
    
    // Convert to object format with ISBN as key (for backward compatibility)
    const booksObj = {};
    books.forEach(book => {
      booksObj[book.isbn] = {
        author: book.author,
        title: book.title,
        reviews: reviewsByBookId[book.id] || [],
      };
    });
    
    return booksObj;
  } catch (error) {
    throw error;
  }
};

Book.findByIsbn = async function (isbn) {
  try {
    // Find book using raw SQL
    const book = await sequelize.query(
      'SELECT id, isbn, title, author FROM books WHERE isbn = :isbn',
      {
        replacements: { isbn },
        type: sequelize.QueryTypes.SELECT,
        plain: true,
      }
    );
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    // Get reviews for this book
    const reviews = await sequelize.query(
      'SELECT id, username, review, created_at FROM reviews WHERE book_id = :book_id ORDER BY created_at DESC',
      {
        replacements: { book_id: book.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    
    const reviewsArray = reviews.map(review => ({
      id: review.id,
      username: review.username,
      review: review.review,
      created_at: review.created_at,
    }));
    
    return {
      isbn: book.isbn,
      author: book.author,
      title: book.title,
      reviews: reviewsArray,
    };
  } catch (error) {
    if (error.message === 'Book not found') {
      throw error;
    }
    throw error;
  }
};

Book.findByAuthor = async function (author) {
  try {
    // Find books by author using raw SQL
    const books = await sequelize.query(
      'SELECT id, isbn, title, author FROM books WHERE LOWER(author) = LOWER(:author)',
      {
        replacements: { author },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    
    // Get reviews for each book
    const booksWithReviews = await Promise.all(
      books.map(async (book) => {
        const reviews = await sequelize.query(
          'SELECT id, username, review, created_at FROM reviews WHERE book_id = :book_id ORDER BY created_at DESC',
          {
            replacements: { book_id: book.id },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        
        const reviewsArray = reviews.map(review => ({
          id: review.id,
          username: review.username,
          review: review.review,
          created_at: review.created_at,
        }));
        
        return {
          isbn: book.isbn,
          author: book.author,
          title: book.title,
          reviews: reviewsArray,
        };
      })
    );
    
    return booksWithReviews;
  } catch (error) {
    throw error;
  }
};

Book.findByTitle = async function (title) {
  try {
    // Find books by title using raw SQL
    const books = await sequelize.query(
      'SELECT id, isbn, title, author FROM books WHERE LOWER(title) = LOWER(:title)',
      {
        replacements: { title },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    
    // Get reviews for each book
    const booksWithReviews = await Promise.all(
      books.map(async (book) => {
        const reviews = await sequelize.query(
          'SELECT id, username, review, created_at FROM reviews WHERE book_id = :book_id ORDER BY created_at DESC',
          {
            replacements: { book_id: book.id },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        
        const reviewsArray = reviews.map(review => ({
          id: review.id,
          username: review.username,
          review: review.review,
          created_at: review.created_at,
        }));
        
        return {
          isbn: book.isbn,
          author: book.author,
          title: book.title,
          reviews: reviewsArray,
        };
      })
    );
    
    return booksWithReviews;
  } catch (error) {
    throw error;
  }
};

Book.getReviews = async function (isbn) {
  try {
    // Find book using raw Sequelize query
    const book = await sequelize.query(
      'SELECT id FROM books WHERE isbn = :isbn',
      {
        replacements: { isbn },
        type: sequelize.QueryTypes.SELECT,
        plain: true,
      }
    );
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    // Get reviews
    const reviews = await sequelize.query(
      'SELECT id, username, review, created_at FROM reviews WHERE book_id = :book_id ORDER BY created_at DESC',
      {
        replacements: { book_id: book.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    
    const reviewsArray = reviews.map(review => ({
      id: review.id,
      username: review.username,
      review: review.review,
      created_at: review.created_at,
    }));
    
    return reviewsArray;
  } catch (error) {
    if (error.message === 'Book not found') {
      throw error;
    }
    throw error;
  }
};

Book.addReview = async function (isbn, username, review) {
  try {
    // Get models from sequelize
    const Review = sequelize.models.Review;
    const User = sequelize.models.User;
    
    // Find book using raw Sequelize query to ensure we get the id
    const book = await sequelize.query(
      'SELECT id, isbn, title, author FROM books WHERE isbn = :isbn',
      {
        replacements: { isbn },
        type: sequelize.QueryTypes.SELECT,
        plain: true,
      }
    );
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    // Find user by username
    const user = await sequelize.query(
      'SELECT id FROM users WHERE username = :username',
      {
        replacements: { username },
        type: sequelize.QueryTypes.SELECT,
        plain: true,
      }
    );
    
    const userId = user ? user.id : null;
    
    // Insert new review (users can add multiple reviews per book)
    await sequelize.query(
      `INSERT INTO reviews (book_id, user_id, username, review, created_at, updated_at)
       VALUES (:book_id, :user_id, :username, :review, NOW(), NOW())`,
      {
        replacements: {
          book_id: book.id,
          user_id: userId,
          username: username,
          review: review,
        },
      }
    );
    
    return { message: 'Review added successfully' };
  } catch (error) {
    if (error.message === 'Book not found') {
      throw error;
    }
    console.error('Error in addReview:', error);
    throw error;
  }
};

Book.updateReview = async function (isbn, username, reviewId, newReview) {
  try {
    // Find book using raw Sequelize query
    const book = await sequelize.query(
      'SELECT id FROM books WHERE isbn = :isbn',
      {
        replacements: { isbn },
        type: sequelize.QueryTypes.SELECT,
        plain: true,
      }
    );
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    // Convert reviewId to integer to ensure proper type matching
    const reviewIdInt = parseInt(reviewId, 10);
    if (isNaN(reviewIdInt)) {
      throw new Error('Invalid reviewId');
    }
    
    // Update the specific review (must belong to the user)
    const [results] = await sequelize.query(
      `UPDATE reviews 
       SET review = :new_review, updated_at = NOW() 
       WHERE book_id = :book_id AND username = :username AND id = :review_id
       RETURNING id, username, review, updated_at`,
      {
        replacements: {
          book_id: book.id,
          username: username,
          review_id: reviewIdInt,
          new_review: newReview,
        },
      }
    );
    
    if (results.length === 0) {
      throw new Error('Review not found');
    }
    
    return { 
      message: 'Review updated successfully',
      review: results[0]
    };
  } catch (error) {
    if (error.message === 'Book not found' || error.message === 'Review not found') {
      throw error;
    }
    throw error;
  }
};

Book.deleteReview = async function (isbn, username, reviewId = null) {
  try {
    // Find book using raw Sequelize query
    const book = await sequelize.query(
      'SELECT id FROM books WHERE isbn = :isbn',
      {
        replacements: { isbn },
        type: sequelize.QueryTypes.SELECT,
        plain: true,
      }
    );
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    // Delete the review(s)
    // If reviewId is provided, delete that specific review
    // Otherwise, delete all reviews by that username for this book
    let query, replacements;
    
    if (reviewId) {
      // Convert reviewId to integer to ensure proper type matching
      const reviewIdInt = parseInt(reviewId, 10);
      if (isNaN(reviewIdInt)) {
        throw new Error('Invalid reviewId');
      }
      
      // First verify the review exists and belongs to the user
      const existingReview = await sequelize.query(
        'SELECT id FROM reviews WHERE book_id = :book_id AND username = :username AND id = :review_id',
        {
          replacements: {
            book_id: book.id,
            username: username,
            review_id: reviewIdInt,
          },
          type: sequelize.QueryTypes.SELECT,
          plain: true,
        }
      );
      
      if (!existingReview) {
        throw new Error('Review not found');
      }
      
      // Delete the specific review
      const deleteResult = await sequelize.query(
        'DELETE FROM reviews WHERE book_id = :book_id AND username = :username AND id = :review_id',
        {
          replacements: {
            book_id: book.id,
            username: username,
            review_id: reviewIdInt,
          },
        }
      );
      
      // Check if deletion was successful
      // Sequelize returns [results, metadata] for DELETE queries
      let rowCount = 0;
      if (Array.isArray(deleteResult) && deleteResult.length >= 2) {
        rowCount = deleteResult[1]?.rowCount || 0;
      } else if (deleteResult?.rowCount !== undefined) {
        rowCount = deleteResult.rowCount;
      }
      
      if (rowCount === 0) {
        throw new Error('Review not found or could not be deleted');
      }
      
      return { 
        message: 'Review deleted successfully',
        deletedCount: rowCount 
      };
    } else {
      // Delete all reviews by that username for this book
      const deleteResult = await sequelize.query(
        'DELETE FROM reviews WHERE book_id = :book_id AND username = :username',
        {
          replacements: {
            book_id: book.id,
            username: username,
          },
        }
      );
      
      // Get rowCount from the result
      // Sequelize returns [results, metadata] for DELETE queries
      let rowCount = 0;
      if (Array.isArray(deleteResult) && deleteResult.length >= 2) {
        rowCount = deleteResult[1]?.rowCount || 0;
      } else if (deleteResult?.rowCount !== undefined) {
        rowCount = deleteResult.rowCount;
      }
      
      if (rowCount === 0) {
        throw new Error('Review not found');
      }
      
      return { 
        message: 'Review deleted successfully',
        deletedCount: rowCount 
      };
    }
  } catch (error) {
    if (error.message === 'Book not found' || error.message === 'Review not found' || error.message === 'Invalid reviewId') {
      throw error;
    }
    throw error;
  }
};

module.exports = Book;
