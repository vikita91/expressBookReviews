const books = require('../router/booksdb');

class Book {
  async findAll() {
    return new Promise((resolve) => {
      resolve(books);
    });
  }

  async findByIsbn(isbn) {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (!book) {
        reject(new Error('Book not found'));
      } else {
        resolve(book);
      }
    });
  }

  async findByAuthor(author) {
    return new Promise((resolve) => {
      const authorLower = author.toLowerCase();
      const matching = Object.values(books).filter(
        (book) => book.author.toLowerCase() === authorLower
      );
      resolve(matching);
    });
  }

  async findByTitle(title) {
    return new Promise((resolve) => {
      const titleLower = title.toLowerCase();
      const matching = Object.values(books).filter(
        (book) => book.title.toLowerCase() === titleLower
      );
      resolve(matching);
    });
  }

  async getReviews(isbn) {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (!book) {
        reject(new Error('Book not found'));
      } else {
        resolve(book.reviews || {});
      }
    });
  }

  async addReview(isbn, username, review) {
    return new Promise(async (resolve, reject) => {
      try {
        const book = await this.findByIsbn(isbn);
        
        // Ensure reviews is an object
        if (typeof book.reviews !== 'object' || book.reviews === null || Array.isArray(book.reviews)) {
          book.reviews = {};
        }

        book.reviews[username] = review;
        resolve({ message: 'Review added successfully' });
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteReview(isbn, username) {
    return new Promise(async (resolve, reject) => {
      try {
        const book = await this.findByIsbn(isbn);
        delete book.reviews[username];
        resolve({ message: 'Review deleted successfully' });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new Book();



