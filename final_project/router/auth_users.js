const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; //in memory storage

// Promise-based helper functions
const isValid = (username) => { 
  return new Promise((resolve) => {
    const result = users.some(user => user.username === username);
    resolve(result);
  });
};

const authenticatedUser = (username, password) => { 
  return new Promise((resolve) => {
    const result = users.some(user => user.username === username && user.password === password);
    resolve(result);
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

const createJWT = (username) => {
  return new Promise((resolve, reject) => {
    try {
      const accessToken = jwt.sign(
        { username: username },
        'access',
        { expiresIn: '1hr' }
      );
      resolve(accessToken);
    } catch (error) {
      reject(error);
    }
  });
};

//only registered users can login
regd_users.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({message: "Error logging in. Username and password required"});
    }

    // Authenticate user using Promises
    const userExists = await isValid(username);
    const isAuthenticated = await authenticatedUser(username, password);

    if (userExists && isAuthenticated) {
      // Create JWT token using Promise
      const accessToken = await createJWT(username);
      
      // Store token in session
      req.session.authorization = {
        accessToken,
        username
      };
      
      return res.status(200).json({
        message: "User successfully logged in",
        accessToken: accessToken
      });
    } else {
      return res.status(401).json({message: "Invalid Login. Check username and password"});
    }
  } catch (error) {
    return res.status(500).json({message: "Internal server error", error: error.message});
  }
});

// CREATE/UPDATE: Add or modify a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username;

    // Validate review field exists and is not empty
    if (review === undefined || review === null) {
      return res.status(400).json({message: "Review field is required"});
    }
    
    if (typeof review === 'string' && review.trim() === '') {
      return res.status(400).json({message: "Review cannot be empty"});
    }

    // Get book using Promise
    const book = await getBookByIsbn(isbn);

    // Ensure reviews is an object
    if (typeof book.reviews !== 'object' || book.reviews === null || Array.isArray(book.reviews)) {
      book.reviews = {};
    }

    // Update review
    book.reviews[username] = review;

    return res.status(200).json({message: "Review added successfully"});
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({message: "Book not found"});
    }
    return res.status(500).json({message: "Internal server error", error: error.message});
  }
});

// DELETE: Delete a book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = req.user.username;

    // Get book using Promise
    const book = await getBookByIsbn(isbn);

    // Delete review
    delete book.reviews[username];

    return res.status(200).json({message: "Your review has been deleted successfully"});
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({message: "Book not found"});
    }
    return res.status(500).json({message: "Internal server error", error: error.message});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
