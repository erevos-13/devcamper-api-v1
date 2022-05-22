const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course');

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', addCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
module.exports = router;
