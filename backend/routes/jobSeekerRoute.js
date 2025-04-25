const express = require('express');
const JobSeekerRoute = express.Router();
const JobSeeker = require('../models/Jobseeker');
const multer = require('multer');
const upload = multer();

// POST - Create Job Seeker Profile
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

    // For now, use a test URL or handle actual file upload
    const resume = req.file ? req.file.originalname : 'https://myresume.com/jobseeker123.pdf';

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

// GET - Fetch Job Seeker Profile by User ID
JobSeekerRoute.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find job seeker profile by user ID and populate user details
      const profile = await JobSeeker.findOne({ user: userId }).populate('user', 'name email location');
  
      if (!profile) {
        return res.status(404).json({ message: 'Job Seeker profile not found' });
      }
  
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  JobSeekerRoute.put('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
  
      // Find and update job seeker's profile
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
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

module.exports = JobSeekerRoute;
