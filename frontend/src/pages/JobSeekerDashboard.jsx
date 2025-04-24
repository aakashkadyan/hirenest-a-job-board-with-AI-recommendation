import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReadMore from '../components/ReadMore';
import ReactPaginate from 'react-paginate';
import UserProfile from '../components/UserProfile';



const JobSeekerDashboard = () => {
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search-jobs');
  const [jobs, setJobs] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [limit] = useState(5);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const tabs = [
    { id: 'apply-jobs', label: 'Apply for Jobs' },
    { id: 'past-applications', label: 'Past Applications' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'saved-jobs', label: 'Saved Jobs' },
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
      setAppliedJobs((prev) => [...prev, { ...job, status: 'pending' }]);
    }
  };

  const handleSaveJob = (job) => {
    if (!savedJobs.find((j) => j._id === job._id)) {
      setSavedJobs((prev) => [...prev, job]);
    }
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
        <h1 className="text-xl font-bold text-blue-600">Job Seeker Dashboard</h1>
        <div className='flex items-end ml-50'><UserProfile /></div>
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        > Logout 
        </button>
      </header>

      {/* Profile Summary */}
      <section className="bg-white shadow p-4 flex items-center gap-4 m-4 rounded">
        <img
          src="/images/avatar.png"
          alt="Profile"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <p className="font-semibold text-lg">Welcome, {userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()}</p>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-500 hover:underline text-sm"
          >
            Edit Profile 
          </button>
        </div>
      </section>

      {/* Dashboard */}
      <main className="grid grid-cols-12 gap-4 m-4">
        {/* Sidebar */}
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

        {/* Main Content */}
        <section className="col-span-9 bg-white p-6 rounded shadow">
          
          {activeTab === 'apply-jobs' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Apply for Jobs</h2>
              {jobs.length > 0 ? (
                <>
                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="Search by title, skills, or company"
                      className="border p-2 flex-1 rounded"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                      className="border p-2 rounded"
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
                      onClick={() => setItemOffset(0)} // just refetch with new search
                    >
                      Search
                    </button>
                  </div>
                  <ul className="space-y-4">
                    {jobs.map((job) => (
                      <li key={job._id} className="border p-4 rounded shadow-sm">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <ReadMore text={job.description} />
                        <p className="text-gray-700 text-sm mb-2">{job.requirements}</p>
                        <div className="text-sm text-gray-600">
                          📍 {job.location} &nbsp;&nbsp;
                          💰 {job.salaryRange
                            ? `${job.salaryRange.currency} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
                            : 'Salary not specified'}
                        </div>
                        <button
                          className="mt-2 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          onClick={() => handleApply(job)}
                        >
                          Apply
                        </button>{' '}
                        &nbsp; &nbsp;
                        <button
                          className="mt-2 text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          onClick={() => handleSaveJob(job)}
                        >
                          Save
                        </button>
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
              <select className="border p-2 rounded mb-4">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="interviewed">Interviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="space-y-4">
                {appliedJobs.map((job) => (
                  <div key={job._id} className="border p-4 rounded shadow-sm">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-700 text-sm mb-2">{job.requirements}</p>
                    <p className="text-sm text-gray-600">
                      Status: <span className="font-medium">{job.status}</span>
                    </p>
                  </div>
                ))}
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
              <div className="space-y-4">
                {savedJobs.length > 0 ? (
                  savedJobs.map((job) => (
                    <div key={job._id} className="border p-4 rounded shadow-sm">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <ReadMore text={job.description} />
                      <p className="text-gray-700 text-sm mb-2">{job.requirements}</p>
                      <div className="text-sm text-gray-600">
                        📍 {job.location} &nbsp;&nbsp;
                        💰 {job.salaryRange
                          ? `${job.salaryRange.currency} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
                          : 'Salary not specified'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>You haven't saved any jobs yet.</p>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;