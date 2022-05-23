const express = require('express');
const router = express.Router();
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
router.route('/').post(createBootcamp);
router.route('/:id/photo').put(bootcampPhotoUpload);

router.get('/', advancedResults(Bootcamp, 'courses'), getBootcamps);
router.post('/', createBootcamp);
router.put('/:id', updateBootcamp);
router.get('/:id', getBootcamp);
router.delete('/:id', revomeBootcamp);
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;
