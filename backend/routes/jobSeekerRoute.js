const express = require('express');
const JobSeekerRoute = express.Router();
const JobSeeker = require('../models/Jobseeker');
const multer = require('multer');
const path = require('path');

// 1. Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 16894738392-resume.pdf
  }
});

const upload = multer({ storage: storage });

// 2. POST - Create Job Seeker Profile
JobSeekerRoute.post('/', upload.single('resume'), async (req, res) => {
  try {
    const {
      user,
      bio,
      skills,
      experience,
      education,
      jobPreferences
    } = req.body;

    const parsedSkills = JSON.parse(skills);
    const parsedExperience = JSON.parse(experience);
    const parsedEducation = JSON.parse(education);
    const parsedJobPreferences = JSON.parse(jobPreferences);

    const resume = req.file ? req.file.filename : null;

    const existingProfile = await JobSeeker.findOne({ user });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const newProfile = new JobSeeker({
      user,
      bio,
      skills: parsedSkills,
      experience: parsedExperience,
      education: parsedEducation,
      resume,
      jobPreferences: parsedJobPreferences
    });

    console.log('New Job Seeker Profile:', newProfile);

    await newProfile.save();

    res.status(201).json({ message: 'Your Profile is Created at this Job Board!!' });
  } catch (error) {
    console.error('Error in POST /jobseekers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 3. GET - Fetch Job Seeker Profile by User ID
JobSeekerRoute.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await JobSeeker.findOne({ user: userId }).populate('user', 'name email location');

    if (!profile) {
      return res.status(404).json({ message: 'Job Seeker profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 4. PUT - Update Job Seeker Profile
JobSeekerRoute.put('/:userId', upload.single('resume'), async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Parse stringified JSON fields
    ['skills', 'experience', 'education', 'jobPreferences'].forEach(field => {
      if (typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (err) {
          console.error(`Failed to parse ${field}:`, err.message);
        }
      }
    });

    // Handle resume file upload
    if (req.file) {
      updateData.resume = req.file.filename;
    }

    const updatedProfile = await JobSeeker.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('user', 'name email location');

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Job Seeker profile not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = JobSeekerRoute;
