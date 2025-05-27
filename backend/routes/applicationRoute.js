const express = require('express');
const applicationRoute = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job'); // Add this import

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
    if (!['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
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

// DELETE: Delete an application by ID
applicationRoute.delete('/:id', async (req, res) => {
  try {
    const applicationId = req.params.id;

    const deleted = await Application.findByIdAndDelete(applicationId);

    if (!deleted) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// SUGGESTIONS ROUTES

// GET: Suggest applicants based on applications for jobs posted by employer
applicationRoute.get('/suggestions/applicants', async (req, res) => {
  try {
    const query = req.query.q || '';
    const employerId = req.query.employerId; // You might need to pass this from frontend

    // Get all jobs posted by this employer
    const jobs = await Job.find({ postedBy: employerId });
    const jobIds = jobs.map(job => job._id);

    // Get applications for these jobs and populate applicant details
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate({
        path: 'applicant',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    // Extract unique applicant names that match the query
    const applicantNames = applications
      .map(app => app.applicant?.user?.name)
      .filter(name => name && name.toLowerCase().includes(query.toLowerCase()))
      .filter((name, index, arr) => arr.indexOf(name) === index) // Remove duplicates
      .slice(0, 10);

    // Return in the format expected by AutoSuggestInput
    const suggestions = applicantNames.map(name => ({ name }));
    
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching applicant suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch applicant suggestions', details: error.message });
  }
});

// GET: Suggest job titles based on jobs posted by employer
applicationRoute.get('/suggestions/jobs', async (req, res) => {
  try {
    const query = req.query.q || '';
    const employerId = req.query.employerId; // You might need to pass this from frontend

    const jobs = await Job.find({ 
      postedBy: employerId,
      title: { $regex: query, $options: 'i' } 
    })
      .limit(10)
      .select('title')
      .lean();

    // Return in the format expected by AutoSuggestInput
    const suggestions = jobs.map(job => ({ title: job.title }));
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching job title suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch job title suggestions', details: error.message });
  }
});

// GET: Suggest locations based on jobs posted by employer
applicationRoute.get('/suggestions/locations', async (req, res) => {
  try {
    const query = req.query.q || '';
    const employerId = req.query.employerId; // You might need to pass this from frontend

    const jobs = await Job.find({ 
      postedBy: employerId,
      location: { $regex: query, $options: 'i' } 
    })
      .limit(20)
      .select('location')
      .lean();

    // Get unique locations
    const uniqueLocations = [...new Set(jobs.map(job => job.location))];
    
    // Return in the format expected by AutoSuggestInput
    const suggestions = uniqueLocations.map(location => ({ location }));
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch location suggestions', details: error.message });
  }
});

module.exports = applicationRoute;