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
        // .populate('resume', 'url') // Fetch resume URL if stored
  
      
      if (!applications || applications.length === 0) {
        return res.status(404).json({ message: 'No applications found for this job' });
      }
  
      res.status(200).json({ applications });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  });

  applicationRoute.get('/', async (req, res) => {
    try {
      const { postedBy } = req.query;
  
      if (!postedBy) {
        return res.status(400).json({ message: 'Missing postedBy parameter' });
      }
  
      const Job = require('../models/Job'); // Make sure it's imported
      const jobs = await Job.find({ postedBy });
      const jobIds = jobs.map(job => job._id);
  
      const applications = await Application.find({ job: { $in: jobIds } })
        .populate({
          path: 'applicant',
          select: 'bio skills experience education resume user', // From JobSeeker
          populate: {
            path: 'user',
            select: 'name email' // From User model
          }
        })
        .populate({
          path: 'job',
          select: 'title description location company' // Add fields you want
        });
  
      res.status(200).json({ applications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  });
  
  
applicationRoute.patch('/:id', async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    // Validate status value
    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', application: updatedApplication });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});


module.exports = applicationRoute;