const express = require('express');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middlieware/advancedResult');
const User = require('../models/User');
const { protect, authorize } = require('../middlieware/auth');
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/users');

router.use(protect); //INFO all the above route will use the protect

router.get('/', authorize('admin'), advancedResults(User), getUsers);
router.post('/', authorize('admin'), createUser);
router.get('/:id', authorize('admin'), getUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
