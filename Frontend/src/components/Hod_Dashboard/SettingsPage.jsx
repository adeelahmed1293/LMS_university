import React, { useState, useEffect } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    department: "",
    role: "",
    theme: "light",
    emailNotifications: true,
    twoFactorAuth: false,
    language: "english"
  });
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(prevData => ({
        ...prevData,
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        department: user.departmentName || "",
        role: user.role || ""
      }));
    }
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update the user data via an API
    alert("Settings updated successfully!");
    
    // For demo purposes, we're updating localStorage
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      localStorage.setItem("user", JSON.stringify({
        ...user,
        name: userData.name,
        phoneNumber: userData.phoneNumber
      }));
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-8">
          <button
            className={`py-2 px-1 font-medium text-sm transition-colors duration-200 ${
              activeTab === "account"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
          <button
            className={`py-2 px-1 font-medium text-sm transition-colors duration-200 ${
              activeTab === "preferences"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
          <button
            className={`py-2 px-1 font-medium text-sm transition-colors duration-200 ${
              activeTab === "security"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>
      </div>
      
      {/* Account Settings */}
      {activeTab === "account" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={userData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm p-2 border"
                  value={userData.email}
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm p-2 border"
                  value={userData.department}
                  disabled
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm p-2 border"
                  value={userData.role}
                  disabled
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Preferences Settings */}
      {activeTab === "preferences" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Application Preferences</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 mb-6">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  id="theme"
                  name="theme"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={userData.theme}
                  onChange={handleInputChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={userData.language}
                  onChange={handleInputChange}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="chinese">Chinese</option>
                </select>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={userData.emailNotifications}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-gray-500">Receive email notifications for assignments, grades, and announcements</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 mb-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Change Password</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="twoFactorAuth"
                      name="twoFactorAuth"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={userData.twoFactorAuth}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">
                      Two-Factor Authentication
                    </label>
                    <p className="text-gray-500">Enable two-factor authentication for an extra layer of security</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">Login Sessions</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Current Session</p>
                      <p className="text-xs text-gray-500">Windows - Chrome - Started 2 hours ago</p>
                    </div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Previous Session</p>
                      <p className="text-xs text-gray-500">Mac - Safari - Ended 2 days ago</p>
                    </div>
                    <button className="text-xs text-red-600 hover:text-red-800">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-red-300 bg-white py-2 px-4 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Sign Out All Devices
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Security Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingsPage; 