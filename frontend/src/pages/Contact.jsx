import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Contact = () => {
  return (
    <div>
        <Header />
        <div className="py-12 px-4 md:px-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-8">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Contact Info</h2>
            <p className="text-gray-700 mb-2">📍 123 Job Street, Tech City, India</p>
            <p className="text-gray-700 mb-2">📞 +91 9876543210</p>
            <p className="text-gray-700 mb-2">✉️ support@jobconnect.com</p>
            <p className="text-gray-600 mt-4">
              We usually respond within 24 hours. Feel free to ask any questions regarding jobs,
              hiring, or technical support.
            </p>
          </div>
        </div>
      </div>
    </div>
        <Footer />
      
    </div>
  )
}

export default Contact
