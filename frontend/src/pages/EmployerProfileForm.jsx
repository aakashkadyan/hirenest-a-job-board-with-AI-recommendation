import React, { useState, useRef } from 'react';

const EmployerProfileForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    website: '',
    description: '',
    location: '',
    companySize: '',
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleLogoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('companyName', formData.companyName);
      data.append('industry', formData.industry);
      data.append('website', formData.website);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('companySize', formData.companySize);

      if (logo) {
        data.append('logo', logo);
      }

      const res = await fetch('http://localhost:5002/api/companies', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await res.json();
      console.log('Success:', result);
      alert('Company profile submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the form.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mt-10 mb-10 p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold text-center text-blue-600">
        Company Profile
      </h2>

      {/* Company Logo Upload */}
      <div className="flex flex-col items-center space-y-2">
        <div
          onClick={handleLogoClick}
          className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300"
        >
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="h-24 w-24 object-cover rounded-full"
            />
          ) : (
            <span className="text-gray-400 text-sm">Upload Logo</span>
          )}
        </div>
        {logoPreview && (
          <button
            type="button"
            onClick={removeLogo}
            className="text-red-500 hover:underline text-sm"
          >
            Remove Logo
          </button>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          ref={fileInputRef}
          className="hidden"
        />
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Industry
        </label>
        <select
          name="industry"
          value={formData.industry}
          onChange={handleInputChange}
          className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="">Select Industry</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Manufacturing">Manufacturing</option>
          {/* Add more industries as needed */}
        </select>
      </div>

      {/* Website URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Website URL
        </label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      {/* Company Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      {/* Company Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company Size
        </label>
        <select
          name="companySize"
          value={formData.companySize}
          onChange={handleInputChange}
          className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="">Select Size</option>
          <option value="1-10">1-10</option>
          <option value="11-50">11-50</option>
          <option value="51-200">51-200</option>
          <option value="201-500">201-500</option>
          <option value="501-1000">501-1000</option>
          <option value="1001+">1001+</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default EmployerProfileForm;
