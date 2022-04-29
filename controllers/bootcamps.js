const Bootcamp = require("../models/Bootcamp");
exports.getBootcamps = (req, res, next) => {
  res.json({ success: true, msg: "Show all bootcamps", hello: req.hello });
};

exports.getBootcamp = (req, res, next) => {
  res.json({
    success: true,
    msg: `Get the bootcamps with id ${req.params.id}`,
  });
};

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    console.error(JSON.stringify(error, null, 4));
    res.status(400).json({
      success: false,
    });
  }
};
exports.updateBootcamp = (req, res, next) => {
  res.json({ success: true, msg: `Update a Bootcamp ${req.params.id}` });
};
exports.revomeBootcamp = (req, res, next) => {
  res.json({ success: true, msg: `Remove  Bootcamp ${req.params.id}` });
};
