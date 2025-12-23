const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { reviewValidator, isbnParamValidator } = require('../validators/reviewValidator');

router.put('/review/:isbn', authenticate, reviewValidator, reviewController.addReview);
router.patch('/review/:isbn', authenticate, reviewValidator, isbnParamValidator, reviewController.updateReview);
router.delete('/review/:isbn', authenticate, isbnParamValidator, reviewController.deleteReview);

module.exports = router;

