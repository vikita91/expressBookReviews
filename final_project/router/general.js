const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Promise-based helper functions
const getAllBooks = () => {
  return new Promise((resolve) => {
    resolve(books);
  });
};

const getBookByIsbn = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (!book) {
      reject(new Error('Book not found'));
    } else {
      resolve(book);
    }
  });
};

const getBooksByAuthor = (author) => {
  return new Promise((resolve) => {
    const authorLower = author.toLowerCase();
    const matching = Object.values(books).filter(
      (book) => book.author.toLowerCase() === authorLower
    );
    resolve(matching);
  });
};

const getBooksByTitle = (title) => {
  return new Promise((resolve) => {
    const titleLower = title.toLowerCase();
    const matching = Object.values(books).filter(
      (book) => book.title.toLowerCase() === titleLower
    );
    resolve(matching);
  });
};

const getBookReviews = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (!book) {
      reject(new Error('Book not found'));
    } else {
      resolve(book.reviews || {});
    }
  });
};

const registerUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password required');
  }

  // Check if user exists using Promise
  const userExists = await isValid(username);
  
  if (userExists) {
    throw new Error('User already exists');
  } else {
    users.push({"username": username, "password": password});
    return {message: "User successfully registered"};
  }
};

// CREATE: Register a new user
public_users.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const result = await registerUser(username, password);
    return res.status(200).json({
      message: "User successfully registered. Now you can login"
    });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).json({message: "User already exists!"});
    }
    if (error.message === 'Username and password required') {
      return res.status(400).json({message: "Unable to register user."});
    }
    return res.status(500).json({message: "Internal server error", error: error.message});
  }
});

// READ: Get the book list available in the shop
public_users.get('/books/', async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({message: "Internal server error", error: error.message});
  }
});

// READ: Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await getBookByIsbn(isbn);
    return res.status(200).json(book);
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(500).json({message: "Internal server error", error: error.message});
  }
});
  
// READ: Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const matching = await getBooksByAuthor(author);

    if (matching.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(matching);
  } catch (error) {
    return res.status(500).json({message: "Internal server error", error: error.message});
  }
});

// READ: Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const matching = await getBooksByTitle(title);

    if (matching.length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    return res.status(200).json(matching);
  } catch (error) {
    return res.status(500).json({message: "Internal server error", error: error.message});
  }
});

// READ: Get book review
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const reviews = await getBookReviews(isbn);
    return res.status(200).json(reviews);
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(500).json({message: "Internal server error", error: error.message});
  }
});

module.exports.general = public_users;
