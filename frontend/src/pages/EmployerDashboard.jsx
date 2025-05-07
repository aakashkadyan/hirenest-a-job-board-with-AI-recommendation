import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CitySelect from '../components/CitySelect';
import JobTitleSelect from '../components/JobTitleSelect';
import Pagination from '../components/Pagination';
import UserProfile from '../components/UserProfile';


const EmployerDashboard = () => {
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('post-jobs');
  const [postedJobs, setPostedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const jobsPerPage = 5;
  const [message, setMessage] = useState('');

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
    postedBy: '',
  });

  const handleCityChange = (selectedOption) => {
    if (selectedOption) {
      setJobForm((prev) => ({
        ...prev,
        location: selectedOption.value,
      }));
    }
  };

  const handleJobTitleChange = (selectedOption) => {
    setJobForm((prev) => ({
      ...prev,
      title: selectedOption ? selectedOption.value : '',
    }));
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setJobForm((prev) => ({
        ...prev,
        postedBy: userId,
      }));
    } else {
      alert('User ID not found. Please log in again.');
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'posted-jobs') {
      fetchPostedJobs();
      setCurrentPage(0); // Reset to first page when tab changes
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (['min', 'max', 'currency'].includes(name)) {
      setJobForm((prev) => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [name]: value,
        },
      }));
    } else {
      setJobForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5002/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobForm),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Job posted successfully!');
        setTimeout(() => {
          setMessage('');
        }, 5000);
        setJobForm({
          title: '',
          description: '',
          location: '',
          requirements: '',
          salaryRange: { min: '', max: '', currency: 'INR' },
          type: 'full-time',
          postedBy: localStorage.getItem('userId'),
        });
      } else {
        alert(data.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred while posting the job');
    }
  };

  const fetchPostedJobs = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:5002/api/jobs?postedBy=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setPostedJobs(data.jobs);
      } else {
        alert(data.message || 'Failed to fetch posted jobs');
      }
    } catch (error) {
      console.error('Error fetching posted jobs:', error);
      alert('An error occurred while fetching jobs');
    }
  };

  const handleJobDelete = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/jobs/${jobId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        setPostedJobs((prev) => prev.filter((job) => job._id !== jobId));
        alert('Job deleted successfully');
      } else {
        alert(data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('An error occurred while deleting the job');
    }
  };

  const indexOfLastJob = (currentPage + 1) * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = postedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const tabs = [
    { id: 'post-jobs', label: 'Post Jobs →' },
    { id: 'posted-jobs', label: 'Posted Jobs →' },
    { id: 'applications', label: 'Applications →' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
            <img
          src="/images/hirenest-logo-new.png" // Path to your logo image
          alt="HireNest Logo"
          className="h-auto max-h-10 w-auto object-contain" // Adjust the height as needed
        />
              <div className="flex items-end ml-50"><UserProfile /></div>
            </header>

      {/* <section className="bg-white shadow p-4 flex items-center gap-4 m-4 rounded">
        <img
          src="/images/avatar.png"
          alt="Profile"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <p className="font-semibold text-lg">
            Welcome, {userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()}
          </p>
          <button
            onClick={() => navigate('/employer/profile')}
            className="text-blue-500 hover:underline text-sm"
          >
            Edit Company Profile
          </button>
        </div>
      </section> */}

      <main className="grid grid-cols-12 gap-4 m-4">
        <aside className="col-span-3 bg-white p-4 rounded shadow h-fit">
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-3 py-2 rounded ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="col-span-9 bg-white p-6 rounded shadow">
                {activeTab === 'post-jobs' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-600">Post a New Job</h2>
              {message && (
                <div className="text-green-600 font-semibold ml-1">
                  {message}
                </div>
              )}
            </div>
            <form onSubmit={handleJobSubmit} className="space-y-4 p-4 border border-blue-400 bg-blue-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Job Title</label>
                <JobTitleSelect
                  onChange={handleJobTitleChange}
                  defaultValue={jobForm.title}
                  className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Job Description</label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Describe the job role and responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Requirements</label>
                <textarea
                  name="requirements"
                  value={jobForm.requirements}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="List key skills or qualifications"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Min Salary (INR)</label>
                  <input
                    type="number"
                    name="min"
                    value={jobForm.salaryRange.min}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Max Salary (INR)</label>
                  <input
                    type="number"
                    name="max"
                    value={jobForm.salaryRange.max}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Currency</label>
                  <select
                    name="currency"
                    value={jobForm.salaryRange.currency}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                <CitySelect
                  onChange={handleCityChange}
                  defaultValue={
                    jobForm.location
                      ? { label: jobForm.location, value: jobForm.location }
                      : null
                  }
                  className="w-full p-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Job Type</label>
                <select
                  name="type"
                  value={jobForm.type}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                Post Job
              </button>
            </form>
          </div>
        )}

          {activeTab === 'posted-jobs' && (
            <div>
              <h2 className="text-xl text-blue-600 font-bold mb-4">Your Posted Jobs</h2>

              {postedJobs.length === 0 ? (
                <p>No posted jobs available.</p>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-2">
                    Showing {indexOfFirstJob + 1}–{Math.min(indexOfLastJob, postedJobs.length)} of {postedJobs.length} jobs
                  </p>
                  <div className="space-y-6">
                  {currentJobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white p-6 rounded-lg border-2 border-blue-400 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-blue-700">{job.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => navigate(`/job/edit/${job._id}`)}
                          className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleJobDelete(job._id)}
                          className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>


                  <Pagination
                    pageCount={Math.ceil(postedJobs.length / jobsPerPage)}
                    onPageChange={({ selected }) => setCurrentPage(selected)}
                    currentPage={currentPage}
                  />
                </>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default EmployerDashboard;
