const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logoutUser,
} = require('../controllers/auth');
const { protect } = require('../middlieware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/updatedetails', protect, updateDetails);
router.post('/updatepassword', protect, updatePassword);
router.get('/logout', logoutUser);

module.exports = router;
