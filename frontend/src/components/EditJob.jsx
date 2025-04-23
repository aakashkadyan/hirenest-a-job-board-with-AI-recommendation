import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditJob = () => {
  const { jobId } = useParams();  // Get jobId from the URL
  const navigate = useNavigate();
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    requirements: '',
    salaryRange: {
      min: '',
      max: '',
      currency: 'INR',
    },
    type: 'full-time',
  });

  // Fetch the job data by jobId
  useEffect(() => {
    const fetchJobData = async () => {
        try {
          const response = await fetch(`http://localhost:5002/api/jobs/${jobId}`);
          const data = await response.json();
          console.log(data);  // Log the response data
      
          if (response.ok) {
            setJobForm(data.job);
          } else {
            alert(data.message || 'Failed to fetch job details');
          }
        } catch (error) {
          console.error('Error fetching job data:', error);
          alert('An error occurred while fetching the job data');
        }
      };      

    fetchJobData();
  }, [jobId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
  
    // Handle salaryRange separately
    if (['min', 'max'].includes(name)) {
      setJobForm((prev) => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [name]: Number(value), // 👈 Convert to number
        },
      }));
    } else if (name === 'currency') {
      setJobForm((prev) => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          currency: value,
        },
      }));
    } else {
      setJobForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  // Handle job update on form submission
  const handleJobUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5002/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobForm),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Job updated successfully!');
        navigate('/employer/dashboard');  // Redirect to dashboard after successful update
      } else {
        alert(data.message || 'Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('An error occurred while updating the job');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Job</h2>
      <form onSubmit={handleJobUpdate}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Job Title</label>
            <input
              type="text"
              name="title"
              value={jobForm.title}
              onChange={handleFormChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Job Description</label>
            <textarea
              name="description"
              value={jobForm.description}
              onChange={handleFormChange}
              required
              className="w-full p-2 border rounded h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Requirements</label>
            <textarea
              name="requirements"
              value={jobForm.requirements}
              onChange={handleFormChange}
              className="w-full p-2 border rounded h-20"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Min Salary (INR)</label>
              <input
                type="number"
                name="min"
                value={jobForm.salaryRange.min}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Max Salary (INR)</label>
              <input
                type="number"
                name="max"
                value={jobForm.salaryRange.max}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Currency</label>
              <select
                name="currency"
                value={jobForm.salaryRange.currency}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={jobForm.location}
              onChange={handleFormChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Job Type</label>
            <select
              name="type"
              value={jobForm.type}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
