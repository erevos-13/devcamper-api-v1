const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  forgotPassword,
} = require('../controllers/auth');
const { protect } = require('../middlieware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUser);
router.post('/forgotpassword', forgotPassword);

module.exports = router;
