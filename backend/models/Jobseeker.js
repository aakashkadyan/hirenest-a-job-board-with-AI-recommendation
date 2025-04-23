const mongoose = require('mongoose');

const jobSeekerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true
  },
  bio: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    required: true
  }],
  experience: [{
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number
  }],
  resume: {
    type: String, // Store file path or cloud URL for resume
    required: true
  },
  jobPreferences: {
    preferredJobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'freelance'],
      default: 'full-time'
    },
    preferredLocation: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobSeeker', jobSeekerSchema);
