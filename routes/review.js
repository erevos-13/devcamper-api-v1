const express = require('express');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middlieware/advancedResult');
const Review = require('../models/Review');
const { protect, authorize } = require('../middlieware/auth');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review');

router.get(
  '/',
  advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getReviews
);
router.get('/:id', getReview);
router.post('/', protect, authorize('user', 'admin'), createReview);
router.put('/:id', protect, authorize('user', 'admin'), updateReview);
router.delete('/:id', protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
