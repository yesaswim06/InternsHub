const Internship = require('../models/Internship');
const Company = require('../models/Company');
const Application = require('../models/Application');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// @desc    Get all internships with advanced filtering and search
// @route   GET /api/internships
// @access  Public
exports.getInternships = async (req, res) => {
  try {
    const query = { status: 'active' };

    // Search by Keyword (title or description)
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by Company Name
    if (req.query.company) {
      const companies = await Company.find({
        companyName: { $regex: req.query.company, $options: 'i' },
      });
      const companyIds = companies.map(c => c._id);
      query.company = { $in: companyIds };
    }

    // Filter by Location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    // Filter by Work Mode (Remote/Hybrid/Onsite)
    if (req.query.workMode) {
      query.workMode = req.query.workMode;
    }

    // Filter by Minimum Stipend
    if (req.query.minStipend) {
      query.stipend = { $gte: Number(req.query.minStipend) };
    }

    // Filter by Duration (in months, exact or partial regex match)
    if (req.query.duration) {
      query.duration = { $regex: req.query.duration, $options: 'i' };
    }

    // Filter by Skills (comma-separated list, match any)
    if (req.query.skills) {
      const skillList = req.query.skills.split(',').map(s => s.trim());
      query.skills = { $in: skillList.map(s => new RegExp(s, 'i')) };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Internship.countDocuments(query);

    const internships = await Internship.find(query)
      .populate('company', 'companyName logo description location website')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: internships,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single internship details
// @route   GET /api/internships/:id
// @access  Public
exports.getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('company', 'companyName logo description location website status');

    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship posting not found' });
    }

    res.status(200).json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Apply for an internship
// @route   POST /api/internships/:id/apply
// @access  Private/Student
exports.applyInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate('company', 'companyName');
    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }

    if (internship.status === 'closed') {
      return res.status(400).json({ success: false, error: 'This internship application deadline has closed' });
    }

    // Check if user has already applied
    const alreadyApplied = await Application.findOne({
      student: req.user.id,
      internship: req.params.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ success: false, error: 'You have already applied for this internship' });
    }

    let resumePath = '';
    
    // Check if student wants to use profile resume
    if (req.body.useProfileResume === 'true' || req.body.useProfileResume === true) {
      if (!req.user.profile.resume) {
        return res.status(400).json({
          success: false,
          error: 'No resume found in your profile. Please upload a resume first or upload a custom one.',
        });
      }
      resumePath = req.user.profile.resume;
    } else {
      // Custom resume uploaded in this form submission
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Please upload a resume PDF or select "Use Profile Resume"' });
      }
      resumePath = `/uploads/resumes/${req.file.filename}`;
    }

    const application = await Application.create({
      student: req.user.id,
      internship: req.params.id,
      resume: resumePath,
      coverLetter: req.body.coverLetter || '',
    });

    res.status(201).json({ success: true, data: application });

    // Send confirmation email to student
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Application Submitted: ${internship.title}`,
        message: `Hello ${req.user.name},\n\nYour application for the **${internship.title}** internship at **${internship.company.companyName}** has been successfully submitted!\n\nYou can track the progress of your application and view any scheduled interviews directly on your InternsHub dashboard.\n\nBest of luck,\nThe InternsHub Team`,
      });
    } catch (mailErr) {
      console.error('Application submission email failed to send:', mailErr.message);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get internships student has applied to
// @route   GET /api/internships/applied
// @access  Private/Student
exports.getAppliedInternships = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate({
        path: 'internship',
        populate: { path: 'company', select: 'companyName logo location' },
      })
      .sort({ appliedDate: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Bookmark/Save an internship
// @route   POST /api/internships/:id/bookmark
// @access  Private/Student
exports.bookmarkInternship = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.profile.savedInternships.includes(req.params.id)) {
      user.profile.savedInternships.push(req.params.id);
      await user.save();
    }

    res.status(200).json({ success: true, message: 'Internship bookmarked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Remove saved internship bookmark
// @route   DELETE /api/internships/:id/bookmark
// @access  Private/Student
exports.unbookmarkInternship = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.profile.savedInternships = user.profile.savedInternships.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();

    res.status(200).json({ success: true, message: 'Internship removed from bookmarks' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get bookmarked internships
// @route   GET /api/internships/bookmarks
// @access  Private/Student
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'profile.savedInternships',
      populate: { path: 'company', select: 'companyName logo location' },
    });

    res.status(200).json({ success: true, data: user.profile.savedInternships });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
