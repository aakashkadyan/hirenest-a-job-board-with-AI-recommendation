import { useState } from 'react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';

const JobSeekerForm = () => {
  const [formData, setFormData] = useState({
    user: localStorage.getItem('userId'),
    bio: '',
    skills: [],
    experience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    education: [{ institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }],
    resume: null,
    jobPreferences: {
      preferredJobType: 'full-time',
      preferredLocation: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = (e) => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  const updateNestedArray = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const data = new FormData();
  
      let skillsArray = formData.skills;
      if (typeof formData.skills === 'string') {
        skillsArray = formData.skills.split(',').map(skill => skill.trim());
      }


      data.append('user', formData.user);
      data.append('bio', formData.bio);
      data.append('skills', JSON.stringify(skillsArray));
      data.append('experience', JSON.stringify(formData.experience));
      data.append('education', JSON.stringify(formData.education));
      data.append('jobPreferences', JSON.stringify(formData.jobPreferences));
  
      if (formData.resume) {
        data.append('resume', formData.resume);
      }
  
      const res = await fetch('http://localhost:5002/api/jobseekers', {
        method: 'POST',
        body: data
      });
  
      if (!res.ok) {
        throw new Error('Failed to submit form');
      }
  
      const result = await res.json();
      console.log('Success:', result);
      alert('Job seeker profile submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the form.');
    }
  };
  
  

  return (
    <>
      {/* <Header /> */}
      <form onSubmit={handleSubmit} className="space-y-6 mt-10 mb-10 p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-center text-blue-600">Job Seeker Profile</h2>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills.join(', ')}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })
            }
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          {formData.experience.map((exp, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Company" value={exp.company}
                onChange={(e) => updateNestedArray("experience", idx, "company", e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500" />
              <input type="text" placeholder="Role" value={exp.role}
                onChange={(e) => updateNestedArray("experience", idx, "role", e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500" />
              <input type="date" placeholder="Start Date" value={exp.startDate}
                onChange={(e) => updateNestedArray("experience", idx, "startDate", e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500" />
              <input type="date" placeholder="End Date" value={exp.endDate}
                onChange={(e) => updateNestedArray("experience", idx, "endDate", e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500" />
              <textarea placeholder="Description" value={exp.description}
                onChange={(e) => updateNestedArray("experience", idx, "description", e.target.value)}
                className="col-span-2 p-2 border rounded focus:outline-none focus:ring focus:border-blue-500" />
            </div>
          ))}
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
          {formData.education.map((edu, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Institution" value={edu.institution}
                onChange={(e) => updateNestedArray("education", idx, "institution", e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500" />
              <input type="text" placeholder="Degree" value={edu.degree}
                onChange={(e) => updateNestedArray("education", idx, "degree", e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500" />
              <input type="text" placeholder="Field of Study" value={edu.fieldOfStudy}
                onChange={(e) => updateNestedArray("education", idx, "fieldOfStudy", e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500" />
              <input type="number" placeholder="Start Year" value={edu.startYear}
                onChange={(e) => updateNestedArray("education", idx, "startYear", e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500" />
              <input type="number" placeholder="End Year" value={edu.endYear}
                onChange={(e) => updateNestedArray("education", idx, "endYear", e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500" />
            </div>
          ))}
        </div>

        {/* Resume */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
          />
          {formData.resume && (
            <p className="text-sm text-gray-600 mt-1">
              Selected file: <strong>{formData.resume.name}</strong>
            </p>
          )}
        </div>

        {/* Job Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Job Type</label>
          <select
            name="preferredJobType"
            value={formData.jobPreferences.preferredJobType}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                jobPreferences: { ...prev.jobPreferences, preferredJobType: e.target.value }
              }))
            }
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="remote">Remote</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Location</label>
          <input
            type="text"
            name="preferredLocation"
            value={formData.jobPreferences.preferredLocation}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                jobPreferences: { ...prev.jobPreferences, preferredLocation: e.target.value }
              }))
            }
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Submit
        </button>
      </form>
      {/* <Footer /> */}
    </>
  );
};

export default JobSeekerForm;
