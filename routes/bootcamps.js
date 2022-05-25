const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlieware/auth');

const {
  createBootcamp,
  getBootcamp,
  getBootcamps,
  revomeBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middlieware/advancedResult');

const courseRouter = require('./courses');

router.use(`/:bootcampId/course`, courseRouter);
// routes
router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router.get('/', advancedResults(Bootcamp, 'courses'), getBootcamps);
router.post('/', protect, authorize('publisher', 'admin'), createBootcamp);
router.put('/:id', protect, authorize('publisher', 'admin'), updateBootcamp);
router.get('/:id', getBootcamp);
router.delete('/:id', protect, authorize('publisher', 'admin'), revomeBootcamp);
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;
