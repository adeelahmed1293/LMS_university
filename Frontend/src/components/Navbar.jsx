import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if user is on the home page
  const isHomePage = location.pathname === "/";
  
  // Sample auth state - in a real app, this would come from your auth context/provider
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`px-4 py-3 ${isHomePage ? "bg-transparent absolute w-full z-10" : "bg-white shadow-md"}`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${isHomePage ? "text-white" : "text-blue-700"}`}>
              University LMS
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${isHomePage ? "text-white" : "text-gray-700"} hover:text-blue-500 transition`}>
              Home
            </Link>
            <Link to="/about" className={`${isHomePage ? "text-white" : "text-gray-700"} hover:text-blue-500 transition`}>
              About
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className={`${isHomePage ? "text-white" : "text-gray-700"} hover:text-blue-500 transition`}>
                  Dashboard
                </Link>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className={`px-4 py-2 rounded-lg ${isHomePage 
                    ? "bg-white text-blue-600" 
                    : "bg-blue-600 text-white"} hover:bg-blue-700 hover:text-white transition`}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-lg ${isHomePage 
                    ? "bg-white text-blue-600" 
                    : "bg-blue-600 text-white"} hover:bg-blue-700 hover:text-white transition`}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className={`px-4 py-2 rounded-lg ${isHomePage 
                    ? "border-2 border-white text-white hover:bg-white hover:text-blue-600" 
                    : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"} transition`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`${isHomePage ? "text-white" : "text-gray-800"}`}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
            <Link to="/" className="block py-2 text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/about" className="block py-2 text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
              About
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    setIsLoggedIn(false);
                    toggleMenu();
                  }}
                  className="block w-full text-left py-2 text-gray-800 hover:text-blue-600"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
                  Log In
                </Link>
                <Link to="/signup" className="block py-2 text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
