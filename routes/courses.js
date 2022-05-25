const express = require('express');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middlieware/advancedResult');
const Course = require('../models/Course');
const { protect, authorize } = require('../middlieware/auth');

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course');

router.get(
  '/',
  advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getCourses
);
router.get('/:id', getCourse);
router.post('/', protect, authorize('publisher', 'admin'), addCourse);
router.put('/:id', protect, authorize('publisher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteCourse);
module.exports = router;
