const express = require('express');
const {
  register,
  login,
  getProfile,
  updatePassword,
  forgotPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/password', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);

module.exports = router;
