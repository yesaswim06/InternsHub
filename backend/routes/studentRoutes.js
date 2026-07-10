const express = require('express');
const {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.post('/resume', upload.single('resume'), uploadResume);

module.exports = router;
