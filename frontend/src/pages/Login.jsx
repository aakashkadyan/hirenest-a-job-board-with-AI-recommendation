import React, { useState } from 'react'
import { Link } from "react-router";
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'

const Login = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
          const res = await fetch('http://localhost:5002/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
    
          const data = await res.json();

          console.log("Login response Data: ", data);
    
          if (res.ok) {
            // Save token (optional: to localStorage or cookie)
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('userName', data.user.name);

            //alert('Login successful!');
           

      // Redirect based on role
      if (data.user.role === 'employer') {
        navigate('/employerdashboard');
      } else if (data.user.role === 'jobseeker') {
        navigate('/jobseekerdashboard');
      } else {
        alert('Unknown role');
      }} else {
            alert('Error: ' + data.error);
          }
        } catch (err) {
          console.error(err);
          alert('An error occurred during login');
        }
      };
  return (
    <div>
        <Header />
                <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">Login to Job Board</h2>
            <form onSubmit={handleSubmit}>
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                type="email" 
                id="email"
                name="email"
                required
                onChange={handleChange}
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                type="password" 
                id="password"
                name="password"
                required
                onChange={handleChange}
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit"
                class="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
                Login
            </button>
            </form>
            <p class="text-sm text-center mt-4">
            Don't have an account?
            <Link to="/signup" class="text-blue-600 hover:underline">Sign up here</Link>
            </p>
        </div>
        </div>

        <Footer />
      
    </div>
  )
}

export default Login
