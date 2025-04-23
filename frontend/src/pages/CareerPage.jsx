import React from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router";
import { Briefcase, Send, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const jobs = [
  {
    title: 'Frontend Developer',
    location: 'Remote',
    type: 'Full-time',
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
  },
  {
    title: 'Backend Developer',
    location: 'Bangalore, India',
    type: 'Full-time',
    icon: <Send className="w-5 h-5 text-green-600" />,
  },
  {
    title: 'Product Designer',
    location: 'Remote',
    type: 'Contract',
    icon: <Users className="w-5 h-5 text-pink-600" />,
  },
];

const CareerPage = ()=> {
  return (
    <div>  
      <Header />
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
     
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          className="text-4xl font-bold mb-4 text-gray-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Join Our Team
        </motion.h1>
        <p className="text-gray-600 mb-10 max-w-xl mx-auto">
          We're building products that simplify lives. Come shape the future with us.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {jobs.map((job, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              {job.icon}
              <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Location: {job.location}</p>
            <p className="text-sm text-gray-600">Type: {job.type}</p>
            <Link to ='/login'><button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition text-sm font-medium">
              Apply Now
            </button></Link>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default CareerPage;