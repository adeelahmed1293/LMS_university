import React, { useState } from "react";

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState("enrolled");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>
      
      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-8">
          <button
            className={`py-2 px-1 font-medium text-sm transition-colors duration-200 ${
              activeTab === "enrolled"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("enrolled")}
          >
            Enrolled Courses
          </button>
          <button
            className={`py-2 px-1 font-medium text-sm transition-colors duration-200 ${
              activeTab === "available"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("available")}
          >
            Available Courses
          </button>
          <button
            className={`py-2 px-1 font-medium text-sm transition-colors duration-200 ${
              activeTab === "completed"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Courses
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === "enrolled" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard 
            title="Introduction to Computer Science"
            code="CS-101"
            instructor="Dr. Sarah Johnson"
            progress={75}
            nextClass="Mon, 10:00 AM"
          />
          <CourseCard 
            title="Data Structures and Algorithms"
            code="CS-202"
            instructor="Prof. Michael Chen"
            progress={45}
            nextClass="Tue, 2:00 PM"
          />
          <CourseCard 
            title="Database Systems"
            code="CS-301"
            instructor="Dr. James Wilson"
            progress={60}
            nextClass="Wed, 11:00 AM"
          />
        </div>
      )}
      
      {activeTab === "available" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AvailableCourseCard 
            title="Artificial Intelligence"
            code="CS-401"
            instructor="Dr. Emily Roberts"
            credits={3}
            startDate="Feb 10, 2024"
          />
          <AvailableCourseCard 
            title="Web Development"
            code="CS-305"
            instructor="Prof. David Brown"
            credits={4}
            startDate="Feb 15, 2024"
          />
          <AvailableCourseCard 
            title="Computer Networks"
            code="CS-310"
            instructor="Dr. Lisa Miller"
            credits={3}
            startDate="Feb 12, 2024"
          />
        </div>
      )}
      
      {activeTab === "completed" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CompletedCourseCard 
            title="Programming Fundamentals"
            code="CS-100"
            instructor="Dr. Alex Turner"
            grade="A"
            completionDate="Dec 15, 2023"
          />
          <CompletedCourseCard 
            title="Discrete Mathematics"
            code="MATH-201"
            instructor="Prof. Rachel Green"
            grade="B+"
            completionDate="Dec 10, 2023"
          />
          <CompletedCourseCard 
            title="Computer Architecture"
            code="CS-210"
            instructor="Dr. Mark Davis"
            grade="A-"
            completionDate="Dec 20, 2023"
          />
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ title, code, instructor, progress, nextClass }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{code}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Enrolled</span>
      </div>
      
      <p className="text-sm text-gray-600 mt-2">Instructor: {instructor}</p>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className="flex justify-between mt-5">
        <span className="text-xs text-gray-500">Next class: {nextClass}</span>
        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Course</a>
      </div>
    </div>
  );
};

const AvailableCourseCard = ({ title, code, instructor, credits, startDate }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{code}</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Available</span>
      </div>
      
      <p className="text-sm text-gray-600 mt-2">Instructor: {instructor}</p>
      <p className="text-sm text-gray-600 mt-1">Credits: {credits}</p>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Starts on:</span> {startDate}
        </p>
      </div>
      
      <div className="flex justify-end mt-5">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition">
          Enroll Now
        </button>
      </div>
    </div>
  );
};

const CompletedCourseCard = ({ title, code, instructor, grade, completionDate }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{code}</p>
        </div>
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span>
      </div>
      
      <p className="text-sm text-gray-600 mt-2">Instructor: {instructor}</p>
      
      <div className="flex justify-between mt-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-800">
            <span className="font-medium">Final Grade:</span> {grade}
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-800">
            <span className="font-medium">Completed:</span> {completionDate}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between mt-5">
        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Certificate</a>
        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Course</a>
      </div>
    </div>
  );
};

export default CoursesPage; 