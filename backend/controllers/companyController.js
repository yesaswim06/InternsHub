const Internship = require('../models/Internship');
const Company = require('../models/Company');
const Application = require('../models/Application');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// Helper to get company by user ID
const getCompanyProfile = async (userId) => {
  const company = await Company.findOne({ user: userId });
  if (!company) {
    throw new Error('Company profile not found');
  }
  return company;
};

// @desc    Update company profile
// @route   PUT /api/company/profile
// @access  Private/Company
exports.updateCompanyProfile = async (req, res) => {
  try {
    const { companyName, description, website, location } = req.body;
    
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company profile not found' });
    }

    if (companyName) company.companyName = companyName;
    if (description) company.description = description;
    if (website) company.website = website;
    if (location) company.location = location;

    await company.save();

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Upload company logo
// @route   POST /api/company/logo
// @access  Private/Company
exports.uploadLogo = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company profile not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload an image file' });
    }

    company.logo = `/uploads/logos/${req.file.filename}`;
    await company.save();

    res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      logoPath: company.logo,
      data: company,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Post a new internship
// @route   POST /api/company/internships
// @access  Private/Company
exports.postInternship = async (req, res) => {
  try {
    const company = await getCompanyProfile(req.user.id);
    
    if (company.status !== 'approved') {
      return res.status(403).json({
        success: false,
        error: `Your company registration status is '${company.status}'. You can only post internships once approved by an administrator.`,
      });
    }

    const { title, description, location, workMode, duration, stipend, skills, eligibility, deadline } = req.body;

    const internship = await Internship.create({
      title,
      company: company._id,
      description,
      location,
      workMode,
      duration,
      stipend: Number(stipend),
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      eligibility,
      deadline,
    });

    res.status(201).json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all internships posted by company
// @route   GET /api/company/internships
// @access  Private/Company
exports.getMyInternships = async (req, res) => {
  try {
    const company = await getCompanyProfile(req.user.id);
    const internships = await Internship.find({ company: company._id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: internships.length, data: internships });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update an internship
// @route   PUT /api/company/internships/:id
// @access  Private/Company
exports.updateInternship = async (req, res) => {
  try {
    const company = await getCompanyProfile(req.user.id);
    let internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship posting not found' });
    }

    // Verify company owns internship
    if (internship.company.toString() !== company._id.toString()) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this posting' });
    }

    const { title, description, location, workMode, duration, stipend, skills, eligibility, deadline, status } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (location) updates.location = location;
    if (workMode) updates.workMode = workMode;
    if (duration) updates.duration = duration;
    if (stipend !== undefined) updates.stipend = Number(stipend);
    if (skills) updates.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (eligibility) updates.eligibility = eligibility;
    if (deadline) updates.deadline = deadline;
    if (status) updates.status = status;

    internship = await Internship.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete an internship
// @route   DELETE /api/company/internships/:id
// @access  Private/Company
exports.deleteInternship = async (req, res) => {
  try {
    const company = await getCompanyProfile(req.user.id);
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship posting not found' });
    }

    // Verify company owns internship
    if (internship.company.toString() !== company._id.toString()) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this posting' });
    }

    // Remove applications related to this internship
    await Application.deleteMany({ internship: internship._id });
    await Internship.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Internship posting removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    View applications received for posted internships
// @route   GET /api/company/applicants
// @access  Private/Company
exports.getApplicants = async (req, res) => {
  try {
    const company = await getCompanyProfile(req.user.id);
    
    // Find all internships posted by company
    const internships = await Internship.find({ company: company._id });
    const internshipIds = internships.map(i => i._id);

    // Get applications with student and internship populated
    const applications = await Application.find({ internship: { $in: internshipIds } })
      .populate('student', 'name email profile')
      .populate('internship', 'title stipend location workMode')
      .sort({ appliedDate: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const company = await getCompanyProfile(req.user.id);
    let { status, interviewDate, interviewLink, interviewNotes } = req.body;

    // Support nested interview object from mobile client
    if (req.body.interview) {
      interviewDate = req.body.interview.date;
      interviewLink = req.body.interview.link;
      interviewNotes = req.body.interview.notes;
    }

    const application = await Application.findById(req.params.id)
      .populate('student', 'name email')
      .populate({
        path: 'internship',
        populate: { path: 'company', select: 'companyName' }
      });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Verify company owns internship
    if (application.internship.company._id.toString() !== company._id.toString()) {
      return res.status(401).json({ success: false, error: 'Not authorized to manage this application' });
    }

    application.status = status;

    if (status === 'interview_scheduled') {
      if (!interviewDate || !interviewLink) {
        return res.status(400).json({
          success: false,
          error: 'Please provide interviewDate and interviewLink for scheduling',
        });
      }
      application.interview = {
        date: interviewDate,
        link: interviewLink,
        notes: interviewNotes || '',
      };
    }

    await application.save();

    res.status(200).json({ success: true, data: application });

    // Send email notification to student
    try {
      let emailSubject = `Application Update: ${application.internship.title}`;
      let emailBody = `Hello ${application.student.name},\n\nYour application status for the ${application.internship.title} internship at ${application.internship.company.companyName} has been updated to: **${status.toUpperCase()}**.`;

      if (status === 'interview_scheduled') {
        emailSubject = `Interview Scheduled: ${application.internship.title}`;
        emailBody += `\n\nHere are the details for your interview:\n- **Date & Time**: ${new Date(interviewDate).toLocaleString()}\n- **Interview Link**: ${interviewLink}\n- **Notes**: ${interviewNotes || 'None'}\n\nPlease be on time!`;
      } else if (status === 'accepted') {
        emailSubject = `Congratulations! Internship Offer Received for ${application.internship.title}`;
        emailBody = `Hello ${application.student.name},\n\nCongratulations! ${application.internship.company.companyName} has extended an offer to you for the **${application.internship.title}** internship.\n\nLog in to your portal to review and accept the offer.`;
      } else if (status === 'rejected') {
        emailBody = `Hello ${application.student.name},\n\nThank you for your interest in the **${application.internship.title}** role. Unfortunately, the company decided to move forward with other candidates at this time.\n\nKeep applying and we wish you the best of luck in your search!`;
      }

      await sendEmail({
        email: application.student.email,
        subject: emailSubject,
        message: emailBody,
      });
    } catch (mailErr) {
      console.error('Application status email failed to send:', mailErr.message);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
