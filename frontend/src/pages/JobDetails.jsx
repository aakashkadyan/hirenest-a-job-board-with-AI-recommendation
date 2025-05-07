import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5002/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data) => setJob(data.job))
      .catch((err) => console.error('Error fetching job:', err));
  }, [jobId]);

  useEffect(() => {
    const applied = JSON.parse(localStorage.getItem('appliedJobs')) || [];
    if (applied.find((j) => j._id === jobId)) {
      setAlreadyApplied(true);
    }
  }, [jobId]);

  const handleApply = () => {
    const applied = JSON.parse(localStorage.getItem('appliedJobs')) || [];

    if (!applied.find((j) => j._id === job._id)) {
      const updatedApplied = [...applied, { ...job, status: 'pending' }];
      localStorage.setItem('appliedJobs', JSON.stringify(updatedApplied));
      setAlreadyApplied(true);
      navigate('/jobseekerdashboard');
    }
  };

  if (!job) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="relative max-w-6xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      {/* Close Button */}
      <button
        onClick={() => navigate('/jobseekerdashboard')}
        className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 shadow-sm transition"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Job Title and Location */}
      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
        <p className="text-gray-600 mt-1">📍 {job.location}</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Description & Requirements */}
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800">Description</h2>
            <p className="text-gray-700 mt-2">{job.description}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800">Requirements</h2>
            <p className="text-gray-700 mt-2">{job.requirements}</p>
          </section>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            disabled={alreadyApplied}
            className={`mt-4 px-2 py-2 rounded text-white font-semibold transition ${
              alreadyApplied
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {alreadyApplied ? 'Already Applied' : 'Apply for this Job'}
          </button>
        </div>

        {/* Right Column - Company Info */}
        <div className="bg-gray-50 p-4 rounded-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">About Company</h3>
          <p className="text-gray-600 text-sm">
            <strong>Name:</strong> {job.company?.name || 'N/A'}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            <strong>Website:</strong>{' '}
            {job.company?.website ? (
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {job.company.website}
              </a>
            ) : (
              'N/A'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
