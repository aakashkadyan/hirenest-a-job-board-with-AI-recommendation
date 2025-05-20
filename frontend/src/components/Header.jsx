import React, { useState } from 'react';
import { Link } from "react-router";
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
    
    <header className="bg-[#042538] text-white">
  <div className="container mx-auto flex items-center justify-between">
    {/* Logo or Brand on the left */}
    <div className="text-3xl font-bold">
     <Link to="/">HireNest</Link> 
    </div>

    
    <div className="flex items-center space-x-6 ml-auto">
     
      <nav className="flex space-x-6">
        <Link to="/" className="hover:text-[#146edb] hover:scale-105 text-lg font-semibold">Home</Link>
        <Link to="/about" className="hover:text-[#146edb] hover:scale-105 text-lg font-semibold">About Us</Link>
        <Link to="/career" className="hover:text-[#146edb] hover:scale-105 text-lg font-semibold">Career</Link>
        <Link to="/contact" className="hover:text-[#146edb] hover:scale-105 text-lg font-semibold">Contact Us</Link>
      </nav>
      <div>
  <Link to="/login"
    className="text-white-500 text-lg font-semibold rounded px-4 py-2 hover:border hover:border-blue-500 transition-all duration-200"
  >
    Login
  </Link>
</div>
      <div>
      <Link to ="/signup" className='hover:scale-110 cursor-pointer bg-blue-500 text-white font-semibold rounded px-4 py-2'>Signup</Link>
      </div>
    </div>
  </div>
</header>
    </>
  );
};

export default Header;
