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
    { id: 'post-jobs', label: 'Post Jobs' },
    { id: 'posted-jobs', label: 'Posted Jobs' },
    { id: 'applications', label: 'Applications' },
    { id: 'candidates', label: 'Candidates' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Employer Dashboard</h1>
        <UserProfile />
        {/* <button
          onClick={handleLogout}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          Logout
        </button> */}
      </header>

      <section className="bg-white shadow p-4 flex items-center gap-4 m-4 rounded">
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
      </section>

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
              <h2 className="text-xl font-bold">Post a New Job</h2>
              {message && (
                <div className="text-green-600 font-semibold ml-1">
                  {message}
                </div>
              )}
              </div>
              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Job Title</label>
                  <JobTitleSelect
                    onChange={handleJobTitleChange}
                    defaultValue={jobForm.title}
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
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <CitySelect
                    onChange={handleCityChange}
                    defaultValue={
                      jobForm.location
                        ? { label: jobForm.location, value: jobForm.location }
                        : null
                    }
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
                  Post Job
                </button>

              </form>
            </div>
          )}

          {activeTab === 'posted-jobs' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Your Posted Jobs</h2>

              {postedJobs.length === 0 ? (
                <p>No posted jobs available.</p>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-2">
                    Showing {indexOfFirstJob + 1}–{Math.min(indexOfLastJob, postedJobs.length)} of {postedJobs.length} jobs
                  </p>

                  <div className="space-y-4">
                    {currentJobs.map((job) => (
                      <div key={job._id} className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-sm">{job.location}</p>
                        <p className="text-gray-600">{job.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <button
                            onClick={() => navigate(`/job/edit/${job._id}`)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleJobDelete(job._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
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
