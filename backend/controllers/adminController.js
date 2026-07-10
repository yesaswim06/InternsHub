const User = require('../models/User');
const Company = require('../models/Company');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const sendEmail = require('../utils/email');

// @desc    Get dashboard metrics & charts
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await Company.countDocuments();
    const activeInternships = await Internship.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();

    // Aggregations for monthly analytics (mocking some growth if collection is small)
    // We group by month to get application counts
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: { $month: '$appliedDate' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format months
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedStats = applicationStats.map(stat => ({
      name: monthNames[stat._id - 1] || `Month ${stat._id}`,
      applications: stat.count,
    }));

    // If there is no data, generate default items for the chart so it renders nicely
    const mockCharts = formattedStats.length > 0 ? formattedStats : [
      { name: 'Jan', applications: 5 },
      { name: 'Feb', applications: 12 },
      { name: 'Mar', applications: 25 },
      { name: 'Apr', applications: 38 },
      { name: 'May', applications: 45 },
      { name: 'Jun', applications: totalApplications || 50 }
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalCompanies,
        activeInternships,
        totalApplications,
      },
      chartData: mockCharts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all users (students and companies)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all companies & registrations
// @route   GET /api/admin/companies
// @access  Private/Admin
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Approve/Reject company registrations
// @route   PUT /api/admin/companies/:id/status
// @access  Private/Admin
exports.updateCompanyApprovalStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid approval status value' });
    }

    const company = await Company.findById(req.params.id).populate('user', 'name email');

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company profile not found' });
    }

    company.status = status;
    await company.save();

    res.status(200).json({ success: true, data: company });

    // Notify company user via email
    try {
      await sendEmail({
        email: company.user.email,
        subject: `Company Portal Registration: ${status.toUpperCase()}`,
        message: `Hello ${company.user.name},\n\nYour company account registration for '${
          company.companyName
        }' has been **${status.toUpperCase()}** by the administrator.\n\n${
          status === 'approved'
            ? 'You can now log in, set up your dashboard, and start posting internship openings.'
            : 'Unfortunately, your company details did not satisfy our verification guidelines. Please contact support if you believe this was an error.'
        }\n\nBest regards,\nThe Support Team`,
      });
    } catch (mailErr) {
      console.error('Approval status email failed to send:', mailErr.message);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Block or remove a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, error: 'Administrator accounts cannot be deleted' });
    }

    // Clean up dependent tables
    if (user.role === 'company') {
      const company = await Company.findOne({ user: user._id });
      if (company) {
        // Remove internship postings
        await Internship.deleteMany({ company: company._id });
        // Remove company profile
        await Company.findByIdAndDelete(company._id);
      }
    } else if (user.role === 'student') {
      // Remove student applications
      await Application.deleteMany({ student: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'User account and associated data removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
