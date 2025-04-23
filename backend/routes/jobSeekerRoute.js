const express = require('express');
const JobSeekerRoute = express.Router();
const JobSeeker = require('../models/Jobseeker');

// POST - Create Job Seeker Profile
JobSeekerRoute.post('/', async (req, res) => {
  try {
    const { user, bio, skills, experience, education, resume, jobPreferences } = req.body;

    // Check if profile already exists
    const existingProfile = await JobSeeker.findOne({ user });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    // Create new profile
    const newProfile = new JobSeeker({
      user,
      bio,
      skills,
      experience,
      education,
      resume,
      jobPreferences
    });

    await newProfile.save();
    res.status(201).json({ message: "Your Profile is Created at this Job Board!!" });
  } catch (error) {
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
