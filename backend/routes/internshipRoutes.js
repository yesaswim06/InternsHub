const express = require('express');
const {
  getInternships,
  getInternship,
  applyInternship,
  getAppliedInternships,
  bookmarkInternship,
  unbookmarkInternship,
  getBookmarks,
} = require('../controllers/internshipController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getInternships);
router.get('/:id', getInternship);

// Protected student routes
router.post('/:id/apply', protect, authorize('student'), upload.single('resume'), applyInternship);
router.post('/:id/bookmark', protect, authorize('student'), bookmarkInternship);
router.delete('/:id/bookmark', protect, authorize('student'), unbookmarkInternship);
router.get('/student/applied', protect, authorize('student'), getAppliedInternships);
router.get('/student/bookmarks', protect, authorize('student'), getBookmarks);

module.exports = router;
