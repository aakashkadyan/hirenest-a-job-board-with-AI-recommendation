import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ReadMore from '../components/ReadMore';
import ReactPaginate from 'react-paginate';
import UserProfile from '../components/UserProfile';

const JobSeekerDashboard = () => {
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('apply-jobs');
  const [jobs, setJobs] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [limit] = useState(5);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [appliedJobs, setAppliedJobs] = useState(() => {
    const stored = localStorage.getItem('appliedJobs');
    return stored ? JSON.parse(stored) : [];
  });
  const [savedJobs, setSavedJobs] = useState(() => {
    const stored = localStorage.getItem('savedJobs');
    return stored ? JSON.parse(stored) : [];
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const tabs = [
    { id: 'apply-jobs', label: 'Apply for Jobs →' },
    { id: 'past-applications', label: 'Past Applications →' },
    { id: 'recommendations', label: 'Recommendations →' },
    { id: 'saved-jobs', label: 'Saved Jobs →' },
  ];

  useEffect(() => {
    if (activeTab === 'apply-jobs') {
      let url = `http://localhost:5002/api/jobs?offset=${itemOffset}&limit=${limit}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (location) url += `&location=${encodeURIComponent(location)}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.jobs) {
            setJobs(data.jobs);
            setTotalJobs(data.totalCount || 0);
          }
        })
        .catch((err) => console.error('Failed to fetch jobs:', err));
    }
  }, [activeTab, itemOffset, searchTerm, location]);

  const handleApply = (job) => {
    if (!appliedJobs.find((j) => j._id === job._id)) {
      const updatedApplied = [
        ...appliedJobs,
        { ...job, status: 'pending' }, // Adding status as "pending"
      ];
      setAppliedJobs(updatedApplied);
      localStorage.setItem('appliedJobs', JSON.stringify(updatedApplied));

      // Remove from jobs list
      const updatedJobs = jobs.filter((j) => j._id !== job._id);
      setJobs(updatedJobs);
      setTotalJobs((prev) => prev - 1);
    }
  };

  const handleSaveJob = (job) => {
    if (!savedJobs.find((j) => j._id === job._id)) {
      const updatedSaved = [...savedJobs, job];
      setSavedJobs(updatedSaved);
      localStorage.setItem('savedJobs', JSON.stringify(updatedSaved));

      // Remove from jobs list
      const updatedJobs = jobs.filter((j) => j._id !== job._id);
      setJobs(updatedJobs);
      setTotalJobs((prev) => prev - 1);
    }
  };

  const handleUnsaveJob = (job) => {
    const updatedSaved = savedJobs.filter((j) => j._id !== job._id);
    setSavedJobs(updatedSaved);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSaved));

    // Add back to apply jobs
    setJobs((prevJobs) => [...prevJobs, job]);
    setTotalJobs((prev) => prev + 1);
  };

  const endOffset = itemOffset + limit;
  const pageCount = Math.ceil(totalJobs / limit);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * limit) % totalJobs;
    setItemOffset(newOffset);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
      <img
        src="/images/hirenest-logo-new.png" // Path to your logo image
        alt="HireNest Logo"
        className="h-auto max-h-10 w-auto object-contain" // Adjust the height as needed
      />
        <div className="flex items-end ml-50"><UserProfile /></div>
      </header>

      {/* Profile Summary */}
      {/* <section className="bg-white shadow p-4 flex items-center gap-4 m-4 rounded">
        <img src="/images/avatar.png" alt="Profile" className="w-16 h-16 rounded-full" />
        <div>
          <p className="font-semibold text-lg">
            Welcome, {userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()}
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-500 hover:underline text-sm"
          >
            Edit Profile
          </button>
        </div>
      </section> */}

      {/* Dashboard */}
      <main className="grid grid-cols-12 gap-4 m-4">
        {/* Sidebar */}
        <aside className="col-span-3 bg-white p-4 rounded shadow h-fit">
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => {
              let count = 0;
              if (tab.id === 'apply-jobs') count = totalJobs;
              else if (tab.id === 'past-applications') count = appliedJobs.length;
              else if (tab.id === 'saved-jobs') count = savedJobs.length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex justify-between items-center text-left px-3 py-2 rounded ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  {(tab.id === 'apply-jobs' || tab.id === 'past-applications' || tab.id === 'saved-jobs') && (
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="col-span-9 bg-white p-6 rounded shadow">
          {activeTab === 'apply-jobs' && (
            <div>
              <h2 className="text-xl text-blue-600 font-bold mb-4">Apply for Jobs</h2>

              <div className="flex flex-wrap gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by text..."
                className="border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 flex-1 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

                <select
                  className="border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => setItemOffset(0)}
                >
                  Search
                </button>
              </div>

              {jobs.length > 0 ? (
                <>
                  <ul className="space-y-6">
                    {jobs.map((job) => (
                      <li
                        key={job._id}
                        className="bg-white p-6 rounded-lg border-2 border-blue-400 shadow-md hover:shadow-lg transition-shadow"
                      >
                        
                        <Link to={`/jobs/${job._id}`} target="_blank" rel="noopener noreferrer">
                        <h3 className="text-xl font-bold text-blue-700 mb-2">{job.title}</h3>
                        <ReadMore text={job.description} />
                        <p className="text-gray-700 text-sm my-3">{job.requirements}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <span>📍 {job.location}</span>
                          <span>💰 {job.salaryRange ? `${job.salaryRange.currency} ${job.salaryRange.min} - ${job.salaryRange.max}` : 'Not specified'}</span>
                        </div>

                        <div className="flex gap-4">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-semibold"
                            onClick={() => handleApply(job)}
                          >
                            Apply
                          </button>
                          <button
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm font-semibold"
                            onClick={() => handleSaveJob(job)}
                          >
                            Save
                          </button>
                        </div>
                        </Link>
                      </li>
                      
                    ))}
                  </ul>

                  <div className="mt-6">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel="Next >"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel="< Prev"
                      containerClassName="flex justify-center space-x-2 mt-4"
                      pageClassName="px-3 py-1 border rounded hover:bg-gray-200"
                      activeClassName="bg-blue-500 text-white"
                      previousClassName="px-3 py-1 border rounded hover:bg-gray-200"
                      nextClassName="px-3 py-1 border rounded hover:bg-gray-200"
                      disabledClassName="opacity-50 cursor-not-allowed"
                    />
                  </div>
                </>
              ) : (
                <p>No available jobs found.</p>
              )}
            </div>
          )}

          {activeTab === 'past-applications' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Your Applications</h2>

              <div className="space-y-6">
                {appliedJobs.length > 0 ? appliedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white p-6 rounded-lg border-2 border-blue-400 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-blue-700 mb-2">{job.title}</h3>
                    <ReadMore text={job.description} />
                    <p className="text-gray-700 text-sm my-3">{job.requirements}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salaryRange ? `${job.salaryRange.currency} ${job.salaryRange.min} - ${job.salaryRange.max}` : 'Not specified'}</span>
                    </div>

                    {/* Show the application status */}
                    <div className="flex gap-4">
                      <span className="text-sm text-gray-500">Status: {job.status}</span>
                    </div>
                  </div>
                )) : <p>You have not applied to any jobs yet.</p>}
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Job Recommendations</h2>
              <p>Recommendations based on your skills and preferences.</p>
            </div>
          )}

          {activeTab === 'saved-jobs' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Saved Jobs</h2>

              <div className="space-y-6">
                {savedJobs.length > 0 ? savedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white p-6 rounded-lg border-2 border-blue-400 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-blue-700 mb-2">{job.title}</h3>
                    <ReadMore text={job.description} />
                    <p className="text-gray-700 text-sm my-3">{job.requirements}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salaryRange ? `${job.salaryRange.currency} ${job.salaryRange.min} - ${job.salaryRange.max}` : 'Not specified'}</span>
                    </div>

                    {/* Unsave button */}
                    <div className="flex gap-4">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1.5 mt-5 rounded-md hover:bg-red-600 text-sm font-semibold"
                        onClick={() => handleUnsaveJob(job)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )) : <p>No saved jobs yet.</p>}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;
