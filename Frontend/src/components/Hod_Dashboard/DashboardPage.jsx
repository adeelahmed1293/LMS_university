import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Import dashboard content components
import { StudentDashboard, TeacherDashboard, HODDashboard } from "./DashboardContent";
import CoursesPage from "./CoursesPage";
import TeachersPage from "./TeachersPage";
import StudentsPage from "./StudentsPage";
import SettingsPage from "./SettingsPage";
import UpdateLoginCredentials from './UpdateLoginCredentials';
import UpdateHodProfile from './UpdateHodProfile';

const DashboardPage = () => {
  const [userRole, setUserRole] = useState("STUDENT");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // New state for profile image
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeProfileSection, setActiveProfileSection] = useState('credentials');
  
  // Helper function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Function to fetch profile image
  const fetchProfileImage = async (userId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const apiUrl = `http://localhost:3000/hod_profile/${userId}`;
      console.log('Fetching profile image from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch profile:', response.status);
        return;
      }

      const hodData = await response.json();
      
      // Set the profile image if available
      if (hodData.profile_image) {
        setProfileImage(hodData.profile_image);
      }

    } catch (err) {
      console.error('Error fetching profile image:', err);
    }
  };
  
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

      // Fetch profile image if user has an ID and is HOD
      if (user.id && user.role === 'HOD') {
        fetchProfileImage(user.id);
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
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            
            {/* Profile Summary */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-3 overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Error loading profile image:', e);
                        // Fallback to initials if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-2xl font-bold ${profileImage ? 'hidden' : ''}`}>
                    {userData?.name?.charAt(0) || userData?.fullName?.charAt(0) || "U"}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-1">{userData?.fullName || "User Name"}</h3>
                  <p className="text-gray-500 text-sm mb-1">{userData?.email}</p>
                  <p className="text-blue-600 capitalize text-sm font-medium">{userData?.role || userRole}</p>
                </div>
              </div>
            </div>
        
            {/* Update Options */}
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveProfileSection('credentials')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                  activeProfileSection === 'credentials'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Update Login Credentials
              </button>
              <button
                onClick={() => setActiveProfileSection('profile')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                  activeProfileSection === 'profile'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Update HOD Profile
              </button>
            </div>
        
            {/* Forms */}
            {activeProfileSection === 'credentials' ? (
              <UpdateLoginCredentials
                userData={userData}
                onUpdate={(data) => {
                  // Handle login credentials update
                  console.log('Updating credentials:', data);
                }}
              />
            ) : (
              <UpdateHodProfile
                userData={userData}
                onUpdate={(data) => {
                  // Handle HOD profile update
                  console.log('Updating HOD profile:', data);
                  // Refresh profile image after update
                  if (userData?.id) {
                    fetchProfileImage(userData.id);
                  }
                }}
              />
            )}
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
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm px-4 py-2 flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <button 
            className="lg:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-blue-600">University</h1>
              <p className="text-xs text-gray-500">Learning Platform</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <span>Logout</span>
        </button>
      </nav>

      {/* Sidebar */}
      <div className={`fixed top-16 left-0 bottom-0 z-30 bg-white w-64 shadow-sm transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out flex flex-col`}>
        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-1">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeSection === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
          >
            <span className="text-xl">🏠</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveSection('courses')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeSection === 'courses' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
          >
            <span className="text-xl">📚</span>
            <span>Courses</span>
          </button>

          <button
            onClick={() => setActiveSection('teachers')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeSection === 'teachers' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
          >
            <span className="text-xl">👨‍🏫</span>
            <span>Teachers</span>
          </button>

          <button
            onClick={() => setActiveSection('students')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeSection === 'students' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
          >
            <span className="text-xl">👨‍🎓</span>
            <span>Students</span>
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeSection === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
          >
            <span className="text-xl">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        {/* Profile Section at Bottom */}
        <div className="p-4 border-t">
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full rounded-lg transition-colors ${activeSection === 'profile' ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-center gap-3 p-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex-shrink-0">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                    onError={(e) => {
                      console.error('Error loading profile image:', e);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-600 text-xl font-semibold">
                    {userData?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="text-left flex-grow min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{userData?.fullName || 'User Name'}</h3>
                <p className="text-sm text-gray-500 truncate">View profle </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6">
          {/* Welcome Section */}
          {activeSection === 'dashboard' && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-blue-600 mb-2">
                Welcome back, {userData?.fullName?.split(' ')[0] || 'User'}! ✨
              </h1>
              <p className="text-gray-600">Here's what's happening with your learning journey today.</p>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="text-blue-600 text-4xl mb-2">12</div>
                  <div className="text-gray-700 font-medium">Active Courses</div>
                  <div className="text-gray-500 text-sm">Currently enrolled</div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="text-green-600 text-4xl mb-2">89%</div>
                  <div className="text-gray-700 font-medium">Average Grade</div>
                  <div className="text-gray-500 text-sm">This semester</div>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl">
                  <div className="text-purple-600 text-4xl mb-2">3</div>
                  <div className="text-gray-700 font-medium">Pending Tasks</div>
                  <div className="text-gray-500 text-sm">Due this week</div>
                </div>
              </div>
            </div>
          )}

          {/* Render Other Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;