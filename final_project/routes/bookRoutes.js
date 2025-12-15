const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { isbnParamValidator } = require('../validators/reviewValidator');

router.get('/books', bookController.getAllBooks);
router.get('/isbn/:isbn', isbnParamValidator, bookController.getBookByIsbn);
router.get('/author/:author', bookController.getBooksByAuthor);
router.get('/title/:title', bookController.getBooksByTitle);
router.get('/review/:isbn', isbnParamValidator, bookController.getReviews);

module.exports = router;



