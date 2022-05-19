const express = require('express');
const router = express.Router();
const {
  createBootcamp,
  getBootcamp,
  getBootcamps,
  revomeBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
} = require('../controllers/bootcamps');

const courseRouter = require('./courses');

router.use(`/:bootcampId/course`, courseRouter);
// routes
router.route('/').get(getBootcamps).post(createBootcamp);

router.get('/', getBootcamps);
router.post('/', createBootcamp);
router.put('/:id', updateBootcamp);
router.get('/:id', getBootcamp);
router.delete('/:id', revomeBootcamp);
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;
