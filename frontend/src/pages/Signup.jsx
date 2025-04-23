import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from "react-router";
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5002/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    
      });

      const data = await res.json();
      if (res.ok) {
        alert('Signup successful! Please login.');
        
        navigate('/login');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during signup');
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
     
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Sign Up for HireNest</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              required
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              minLength="6"
              required
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium">Role</label>
            <select
              name="role"
              required
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="">Select a role</option>
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              required
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        <div className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    
    </div>
    <Footer />
    </>
  );
};

export default Signup;
