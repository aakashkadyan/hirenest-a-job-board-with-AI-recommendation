const express = require('express');
const applicationRoute = express.Router();
const Application = require('../models/Application'); // Import Application model

// POST: Submit a job application
applicationRoute.post('/', async (req, res) => {
  try {
    const { job, applicant, resume, coverLetter } = req.body;

    // Validate required fields
    if (!job || !applicant || !resume || !coverLetter) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new application
    const newApplication = new Application({
      job,
      applicant,
      resume,
      coverLetter,
    });

    // Save to MongoDB
    await newApplication.save();

    res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

applicationRoute.get('/:id', async (req, res) => {
    try {
      const jobId = req.params.id;
  
      // Find applications for the given job ID & populate applicant and resume details
      const applications = await Application.find({ job: jobId })
        .populate('applicant', 'name email') // Fetch applicant's name & email
        .populate('resume', 'url') // Fetch resume URL if stored
  
      
      if (!applications || applications.length === 0) {
        return res.status(404).json({ message: 'No applications found for this job' });
      }
  
      res.status(200).json({ applications });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  });

module.exports = applicationRoute;