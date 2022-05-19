const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlieware/async');

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }
  const courses = await query;
  if (!courses) {
    return next(new ErrorResponse(`Course not found `, 404));
  }
  res.status(201).json({
    count: courses.length,
    success: true,
    data: courses,
  });
});
