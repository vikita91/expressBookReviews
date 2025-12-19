const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/sequelize');

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
  const books = await _findAllBooks();
  
  // Convert to object format with ISBN as key (for backward compatibility)
  const booksObj = {};
  books.forEach(book => {
    const reviews = {};
    if (book.reviews) {
      book.reviews.forEach(review => {
        reviews[review.username] = review.review;
      });
    }
    booksObj[book.isbn] = {
      author: book.author,
      title: book.title,
      reviews: reviews,
    };
  });
  
  return booksObj;
};

Book.findByIsbn = async function (isbn) {
  const book = await _findOneBook({
    where: { isbn },
    include: [
      {
        association: 'reviews',
        attributes: ['username', 'review'],
      },
    ],
  });
  
  if (!book) {
    throw new Error('Book not found');
  }
  
  const reviews = {};
  if (book.reviews) {
    book.reviews.forEach(review => {
      reviews[review.username] = review.review;
    });
  }
  
  return {
    isbn: book.isbn,
    author: book.author,
    title: book.title,
    reviews: reviews,
  };
};

Book.findByAuthor = async function (author) {
  const books = await Model.findAll.call(Book, {
    where: sequelize.where(
      sequelize.fn('LOWER', sequelize.col('author')),
      sequelize.fn('LOWER', author)
    ),
    include: [
      {
        association: 'reviews',
        attributes: ['username', 'review'],
      },
    ],
  });
  
  return books.map(book => {
    const reviews = {};
    if (book.reviews) {
      book.reviews.forEach(review => {
        reviews[review.username] = review.review;
      });
    }
    return {
      isbn: book.isbn,
      author: book.author,
      title: book.title,
      reviews: reviews,
    };
  });
};

Book.findByTitle = async function (title) {
  const books = await Model.findAll.call(Book, {
    where: sequelize.where(
      sequelize.fn('LOWER', sequelize.col('title')),
      sequelize.fn('LOWER', title)
    ),
    include: [
      {
        association: 'reviews',
        attributes: ['username', 'review'],
      },
    ],
  });
  
  return books.map(book => {
    const reviews = {};
    if (book.reviews) {
      book.reviews.forEach(review => {
        reviews[review.username] = review.review;
      });
    }
    return {
      isbn: book.isbn,
      author: book.author,
      title: book.title,
      reviews: reviews,
    };
  });
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
      'SELECT username, review FROM reviews WHERE book_id = :book_id',
      {
        replacements: { book_id: book.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    
    const reviewsObj = {};
    reviews.forEach(review => {
      reviewsObj[review.username] = review.review;
    });
    
    return reviewsObj;
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
    
    // Upsert the review
    await sequelize.query(
      `INSERT INTO reviews (book_id, user_id, username, review, created_at, updated_at)
       VALUES (:book_id, :user_id, :username, :review, NOW(), NOW())
       ON CONFLICT (book_id, username)
       DO UPDATE SET review = :review, updated_at = NOW()`,
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

Book.deleteReview = async function (isbn, username) {
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
    
    // Delete the review
    const [results] = await sequelize.query(
      'DELETE FROM reviews WHERE book_id = :book_id AND username = :username',
      {
        replacements: {
          book_id: book.id,
          username: username,
        },
      }
    );
    
    if (results.rowCount === 0) {
      throw new Error('Review not found');
    }
    
    return { message: 'Review deleted successfully' };
  } catch (error) {
    if (error.message === 'Book not found' || error.message === 'Review not found') {
      throw error;
    }
    throw error;
  }
};

module.exports = Book;
