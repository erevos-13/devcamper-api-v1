const express = require('express');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middlieware/advancedResult');
const Course = require('../models/Course');
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
router.post('/', addCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
module.exports = router;
