const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an internship title'],
    trim: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true,
  },
  workMode: {
    type: String,
    enum: ['Remote', 'Hybrid', 'Onsite'],
    default: 'Onsite',
  },
  duration: {
    type: String, // e.g., '3 Months', '6 Months'
    required: [true, 'Please specify the duration'],
  },
  stipend: {
    type: Number, // monthly amount in local currency (e.g. INR/USD)
    required: [true, 'Please specify the stipend amount'],
    default: 0,
  },
  skills: {
    type: [String],
    required: [true, 'Please specify the required skills'],
  },
  eligibility: {
    type: String,
    required: [true, 'Please specify eligibility criteria'],
  },
  deadline: {
    type: Date,
    required: [true, 'Please specify the last date to apply'],
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index fields for searching
InternshipSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Internship', InternshipSchema);
