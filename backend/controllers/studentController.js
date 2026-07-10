const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private/Student
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('name email profile');
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private/Student
exports.updateStudentProfile = async (req, res) => {
  try {
    const { bio, skills, education, github, linkedin } = req.body;

    const fieldsToUpdate = {};
    if (bio !== undefined) fieldsToUpdate['profile.bio'] = bio;
    if (skills !== undefined) fieldsToUpdate['profile.skills'] = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (education !== undefined) fieldsToUpdate['profile.education'] = education;
    if (github !== undefined) fieldsToUpdate['profile.github'] = github;
    if (linkedin !== undefined) fieldsToUpdate['profile.linkedin'] = linkedin;

    const student = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).select('name email profile');

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Upload student resume PDF
// @route   POST /api/students/resume
// @access  Private/Student
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file' });
    }

    // Relative path to store in DB
    const resumePath = `/uploads/resumes/${req.file.filename}`;

    // Update user resume field
    const student = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'profile.resume': resumePath } },
      { new: true }
    ).select('name email profile');

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumePath,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
