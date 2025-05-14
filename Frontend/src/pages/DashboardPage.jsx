import React, { useState } from "react";
import { motion } from "framer-motion";

// Dashboard components for different user roles
const StudentDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">My Courses</h3>
        <ul className="space-y-2">
          <li className="p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
            <a href="#" className="flex justify-between">
              <span>Introduction to Computer Science</span>
              <span className="text-blue-600">View</span>
            </a>
          </li>
          <li className="p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
            <a href="#" className="flex justify-between">
              <span>Data Structures and Algorithms</span>
              <span className="text-blue-600">View</span>
            </a>
          </li>
          <li className="p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
            <a href="#" className="flex justify-between">
              <span>Database Systems</span>
              <span className="text-blue-600">View</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Upcoming Assignments</h3>
        <ul className="space-y-2">
          <li className="p-3 bg-red-50 rounded">
            <div className="flex justify-between">
              <span>Database Project</span>
              <span className="text-red-600">Due: Tomorrow</span>
            </div>
          </li>
          <li className="p-3 bg-yellow-50 rounded">
            <div className="flex justify-between">
              <span>Algorithms Quiz</span>
              <span className="text-yellow-600">Due: 3 days</span>
            </div>
          </li>
          <li className="p-3 bg-green-50 rounded">
            <div className="flex justify-between">
              <span>Programming Assignment</span>
              <span className="text-green-600">Due: Next week</span>
            </div>
          </li>
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Recent Grades</h3>
        <ul className="space-y-2">
          <li className="p-3 bg-gray-50 rounded flex justify-between">
            <span>Midterm Exam</span>
            <span className="font-medium">85/100</span>
          </li>
          <li className="p-3 bg-gray-50 rounded flex justify-between">
            <span>Programming Lab</span>
            <span className="font-medium">92/100</span>
          </li>
          <li className="p-3 bg-gray-50 rounded flex justify-between">
            <span>Weekly Quiz</span>
            <span className="font-medium">78/100</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">My Courses</h3>
        <ul className="space-y-2">
          <li className="p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
            <a href="#" className="flex justify-between">
              <span>Database Systems (CS-301)</span>
              <span className="text-blue-600">Manage</span>
            </a>
          </li>
          <li className="p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
            <a href="#" className="flex justify-between">
              <span>Advanced Algorithms (CS-401)</span>
              <span className="text-blue-600">Manage</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Pending Grading</h3>
        <ul className="space-y-2">
          <li className="p-3 bg-red-50 rounded">
            <div className="flex justify-between">
              <span>CS-301 Project Submissions</span>
              <span className="text-red-600">15 pending</span>
            </div>
          </li>
          <li className="p-3 bg-yellow-50 rounded">
            <div className="flex justify-between">
              <span>CS-401 Term Papers</span>
              <span className="text-yellow-600">8 pending</span>
            </div>
          </li>
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Course Calendar</h3>
        <ul className="space-y-2">
          <li className="p-3 bg-gray-50 rounded">
            <div>
              <span className="font-medium">Today 10:00 AM</span>
              <p>CS-301 Lecture</p>
            </div>
          </li>
          <li className="p-3 bg-gray-50 rounded">
            <div>
              <span className="font-medium">Tomorrow 2:00 PM</span>
              <p>CS-401 Office Hours</p>
            </div>
          </li>
          <li className="p-3 bg-gray-50 rounded">
            <div>
              <span className="font-medium">Friday 11:00 AM</span>
              <p>Department Meeting</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

const HODDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Department Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span>Total Courses</span>
            <span className="font-medium">24</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Total Faculty</span>
            <span className="font-medium">16</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Total Students</span>
            <span className="font-medium">450</span>
          </div>
          <div className="flex justify-between">
            <span>Active Semester</span>
            <span className="font-medium">Fall 2023</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Faculty Performance</h3>
        <ul className="space-y-2">
          <li className="p-3 bg-green-50 rounded flex justify-between">
            <span>Dr. Sarah Johnson</span>
            <span className="text-green-600">Excellent</span>
          </li>
          <li className="p-3 bg-green-50 rounded flex justify-between">
            <span>Prof. Michael Chen</span>
            <span className="text-green-600">Excellent</span>
          </li>
          <li className="p-3 bg-yellow-50 rounded flex justify-between">
            <span>Dr. James Wilson</span>
            <span className="text-yellow-600">Good</span>
          </li>
          <li className="p-3 bg-red-50 rounded flex justify-between">
            <span>Prof. Emily Davis</span>
            <span className="text-red-600">Needs Improvement</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Pending Approvals</h3>
        <ul className="space-y-2">
          <li className="p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
            <a href="#" className="flex justify-between">
              <span>Course Addition Request</span>
              <span className="text-blue-600">Review</span>
            </a>
          </li>
          <li className="p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
            <a href="#" className="flex justify-between">
              <span>Faculty Leave Applications</span>
              <span className="text-blue-600">Review (3)</span>
            </a>
          </li>
          <li className="p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
            <a href="#" className="flex justify-between">
              <span>Budget Proposals</span>
              <span className="text-blue-600">Review</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  // In a real app, you would get this from authentication/context
  const [userRole, setUserRole] = useState("STUDENT");
  
  // For demonstration purposes, allow switching between roles
  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          
          {/* This selector is for demo purposes only */}
          <div className="flex items-center">
            <label htmlFor="role-select" className="mr-2">View as:</label>
            <select
              id="role-select"
              value={userRole}
              onChange={handleRoleChange}
              className="p-2 border rounded-md"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="HOD">HOD</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="bg-blue-700 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
            <p>
              You're logged in as {userRole === "HOD" ? "a Head of Department" :
                userRole === "TEACHER" ? "a Teacher" : "a Student"}.
              Here's an overview of your {userRole === "HOD" ? "department" :
                userRole === "TEACHER" ? "courses" : "academic"} information.
            </p>
          </div>
        </div>
        
        {renderDashboard()}
      </motion.div>
    </div>
  );
};

export default DashboardPage; 