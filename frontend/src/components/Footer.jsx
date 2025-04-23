import React from 'react'

const Footer = () => {
  return (
    <div>
<footer className="flex-grow mt-auto bg-[#042538] text-white py-10 mt-10">
  <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    
    {/* Job Board Info */}
    <div>
      <h3 className="text-xl font-semibold mb-2">HireNest</h3>
      <p className="text-sm text-white/80">
        Find your dream job or the perfect candidate with our AI-powered job matching platform.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
      <ul className="space-y-1 text-sm">
        <li><a href="/" className="hover:text-[#146edb]">Home</a></li>
        <li><a href="/jobs" className="hover:text-[#146edb]">Jobs</a></li>
        <li><a href="/companies" className="hover:text-[#146edb]">Companies</a></li>
        <li><a href="/about" className="hover:text-[#146edb]">About</a></li>
      </ul>
    </div>

    {/* Resources */}
    <div>
      <h3 className="text-xl font-semibold mb-2">Resources</h3>
      <ul className="space-y-1 text-sm">
        <li><a href="/blog" className="hover:text-[#146edb]">Blog</a></li>
        <li><a href="/faq" className="hover:text-[#146edb]">FAQ</a></li>
        <li><a href="/privacy" className="hover:text-[#146edb]">Privacy Policy</a></li>
        <li><a href="/terms" className="hover:text-[#146edb]">Terms of Service</a></li>
      </ul>
    </div>

    {/* Contact Info */}
    <div>
      <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
      <ul className="text-sm space-y-1 text-white/80">
        <li>Email: support@hirenest.com</li>
        <li>Phone: (555) 123-4567</li>
        <li>Address: 123 Job Street</li>
      </ul>
    </div>

  </div>

  {/* Footer Bottom */}
  <div className="text-center text-sm text-white/70 mt-10 border-t border-white/20 pt-4">
    &copy; {new Date().getFullYear()} Job Board. All rights reserved.
  </div>
</footer>


      
    </div>
  )
}

export default Footer
