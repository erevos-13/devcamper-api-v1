const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCourses } = require('../controllers/course');

router.get('/', getCourses);

module.exports = router;
