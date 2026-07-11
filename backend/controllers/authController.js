const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const sendEmail = require('../utils/email');

// Helper to sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_internship_key_123_abc', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, companyName, description, location, website } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }

    // Role specific validation
    if (role === 'company') {
      if (!companyName || !description || !location) {
        return res.status(400).json({
          success: false,
          error: 'Please provide companyName, description, and location for company registration',
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    // Create company profile if role is company
    if (role === 'company') {
      try {
        await Company.create({
          user: user._id,
          companyName,
          description,
          location,
          website: website || '',
          status: 'pending', // Requires admin approval
        });
      } catch (err) {
        // Rollback user creation on company creation failure
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ success: false, error: err.message });
      }
    }

    // Create token
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Send Welcome Email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to InternsHub',
        message: `Hello ${user.name},\n\nWelcome to InternsHub! Your account has been created successfully. ${
          role === 'company'
            ? 'Your company profile is under review by our administrators and will be active once approved.'
            : 'You can now log in, build your profile, upload your resume, and apply to internships.'
        }\n\nBest regards,\nThe InternsHub Team`,
      });
    } catch (mailErr) {
      console.error('Welcome email failed to send:', mailErr.message);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if company is approved/rejected/pending
    let companyStatus = null;
    if (user.role === 'company') {
      const company = await Company.findOne({ user: user._id });
      if (company) {
        companyStatus = company.status;
      }
    }

    // Create token
    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current user profile details
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    let profileData = null;

    if (req.user.role === 'company') {
      profileData = await Company.findOne({ user: req.user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profile: req.user.role === 'student' ? req.user.profile : undefined,
        companyProfile: profileData || undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update Password
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Please provide current and new password' });
    }

    // Get user from database with password selected
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, error: 'Incorrect current password' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Forgot Password (Mock)
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'There is no user with that email' });
    }

    // Send password reset notification (mock reset token link)
    const resetUrl = `http://localhost:5173/reset-password-mock?token=mock_reset_token_${user._id}`;
    
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request (Mock)',
      message: `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to update your password, or use this mock link:\n\n${resetUrl}\n\nThis is a local testing reset notification.`,
    });

    res.status(200).json({ success: true, message: 'Reset email sent (mock)' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
