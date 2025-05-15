import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Import dashboard content components
import { StudentDashboard, TeacherDashboard, HODDashboard } from "../components/Dashboard/DashboardContent";
import CoursesPage from "../components/Dashboard/CoursesPage";
import TeachersPage from "../components/Dashboard/TeachersPage";
import StudentsPage from "../components/Dashboard/StudentsPage";
import SettingsPage from "../components/Dashboard/SettingsPage";

const DashboardPage = () => {
  const [userRole, setUserRole] = useState("STUDENT");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      
      // Set role based on user data
      if (user.role) {
        setUserRole(user.role);
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            {renderDashboard()}
          </div>
        );
      case "courses":
        return <CoursesPage />;
      case "teachers":
        return <TeachersPage />;
      case "students":
        return <StudentsPage />;
      case "settings":
        return <SettingsPage />;
      case "profile":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 overflow-hidden">
                  {userData?.profileImage ? (
                    <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-4xl font-bold">
                      {userData?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{userData?.name || "User Name"}</h3>
                <p className="text-gray-500">{userData?.email || "user@example.com"}</p>
                <p className="text-blue-600 capitalize mt-1">{userData?.role || userRole}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                  <p className="text-gray-600"><span className="font-medium">Email:</span> {userData?.email || "user@example.com"}</p>
                  <p className="text-gray-600"><span className="font-medium">Phone:</span> {userData?.phoneNumber || "Not provided"}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Academic Information</h4>
                  <p className="text-gray-600"><span className="font-medium">Department:</span> {userData?.departmentName || "Not provided"}</p>
                  <p className="text-gray-600"><span className="font-medium">Qualification:</span> {userData?.qualification || "Not provided"}</p>
                </div>
              </div>
              
              <Link to="/profile" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Edit Profile
              </Link>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };
  
  const renderDashboard = () => {
    switch (userRole) {
      case "HOD":
        return <HODDashboard />;
      case "TEACHER":
        return <TeacherDashboard />;
      case "STUDENT":
      default:
        return <StudentDashboard />;
    }
  };

  const NavItem = ({ icon, label, section }) => (
    <button
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
        activeSection === section
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
      }`}
      onClick={() => {
        setActiveSection(section);
        setIsMobileSidebarOpen(false);
      }}
    >
      {icon}
      <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{label}</span>
    </button>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar - visible on all screens */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md px-4 py-3 flex justify-between items-center h-16">
        <div className="flex items-center">
          {/* Mobile menu toggle */}
          <button 
            className="lg:hidden text-gray-700 focus:outline-none mr-4 hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Desktop sidebar toggle */}
          <button 
            className="hidden lg:block text-gray-700 focus:outline-none mr-4 hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isSidebarCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h7" />
              )}
            </svg>
          </button>
          
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-2 font-bold text-xl">
              U
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-700">University</h1>
              <p className="text-xs text-gray-500 hidden md:block">Learning Platform</p>
            </div>
          </div>
        </div>
        
        {/* Logout button */}
        <div>
          <button 
            onClick={handleLogout}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm9 7a1 1 0 11-2 0V6.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L12 6.414V10z" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      
      {/* Sidebar - dynamic width based on collapsed state */}
      <div className={`fixed top-16 left-0 bottom-0 z-30 bg-white shadow-lg transform ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col ${
        isSidebarCollapsed ? "lg:w-20" : "w-3/4 md:w-1/4 lg:w-1/5"
      }`}>
        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            } 
            label="Dashboard" 
            section="dashboard" 
          />
          
          <NavItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            } 
            label="Courses" 
            section="courses" 
          />
          
          <NavItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            } 
            label="Teachers" 
            section="teachers" 
          />
          
          <NavItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            } 
            label="Students" 
            section="students" 
          />
          
          <NavItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            } 
            label="Settings" 
            section="settings" 
          />
        </nav>
        
        {/* Profile at bottom of sidebar */}
        <div className="p-4 border-t mt-auto">
          <button
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
              activeSection === "profile"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
            onClick={() => {
              setActiveSection("profile");
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
              {userData?.name ? (
                <span className="text-blue-600 font-bold">{userData.name.charAt(0)}</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className={`flex-1 text-left ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
              <p className="font-medium">{userData?.name || "User Name"}</p>
              <p className="text-xs opacity-75">View Profile</p>
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main content area - adjusts based on sidebar state */}
      <div 
        className={`min-h-screen transition-all duration-300 pt-16 ${
          isSidebarCollapsed 
            ? "lg:pl-20" 
            : "lg:pl-[20%]"
        }`}
      >
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 