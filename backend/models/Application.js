const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
  resume: {
    type: String, // Path to PDF
    required: true,
  },
  coverLetter: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected'],
    default: 'applied',
  },
  interview: {
    date: {
      type: Date,
    },
    link: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a student can only apply to an internship once
ApplicationSchema.index({ student: 1, internship: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
