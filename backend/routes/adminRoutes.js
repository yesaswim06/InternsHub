const express = require('express');
const {
  getDashboardStats,
  getUsers,
  getCompanies,
  updateCompanyApprovalStatus,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/companies', getCompanies);
router.put('/companies/:id/status', updateCompanyApprovalStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
