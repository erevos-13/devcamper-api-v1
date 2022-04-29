const express = require("express");
const router = express.Router();
const {
  createBootcamp,
  getBootcamp,
  getBootcamps,
  revomeBootcamp,
  updateBootcamp,
} = require("../controllers/bootcamps");
// routes
router.route("/").get(getBootcamps).post(createBootcamp);

router.get("/", getBootcamps);
router.post("/", createBootcamp);
router.put("/:id", updateBootcamp);
router.get("/:id", getBootcamp);
router.delete("/:id", revomeBootcamp);

module.exports = router;
