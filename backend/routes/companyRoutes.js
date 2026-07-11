const express = require('express');
const {
  updateCompanyProfile,
  uploadLogo,
  postInternship,
  getMyInternships,
  updateInternship,
  deleteInternship,
  getApplicants,
  updateApplicationStatus,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);
router.use(authorize('company'));

router.put('/profile', updateCompanyProfile);
router.post('/logo', upload.single('logo'), uploadLogo);
router.post('/internships', postInternship);
router.get('/internships', getMyInternships);
router.put('/internships/:id', updateInternship);
router.delete('/internships/:id', deleteInternship);
router.get('/applicants', getApplicants);
router.put('/applications/:id/status', updateApplicationStatus);

module.exports = router;
