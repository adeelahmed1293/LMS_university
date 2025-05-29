import React, { useState } from "react";

const StudentsPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  
  // Mock data for students
  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      photo: "",
      email: "alex.johnson@university.edu",
      department: "Computer Science",
      enrollmentYear: 2021,
      currentSemester: 5,
      status: "active",
      gpa: 3.8
    },
    {
      id: 2,
      name: "Emma Williams",
      photo: "",
      email: "emma.williams@university.edu",
      department: "Electrical Engineering",
      enrollmentYear: 2022,
      currentSemester: 3,
      status: "active",
      gpa: 3.6
    },
    {
      id: 3,
      name: "Michael Brown",
      photo: "",
      email: "michael.brown@university.edu",
      department: "Computer Science",
      enrollmentYear: 2020,
      currentSemester: 7,
      status: "active",
      gpa: 3.9
    },
    {
      id: 4,
      name: "Sophia Garcia",
      photo: "",
      email: "sophia.garcia@university.edu",
      department: "Information Technology",
      enrollmentYear: 2021,
      currentSemester: 5,
      status: "active",
      gpa: 3.7
    },
    {
      id: 5,
      name: "James Wilson",
      photo: "",
      email: "james.wilson@university.edu",
      department: "Computer Science",
      enrollmentYear: 2019,
      currentSemester: 9,
      status: "active",
      gpa: 3.5
    },
    {
      id: 6,
      name: "Olivia Davis",
      photo: "",
      email: "olivia.davis@university.edu",
      department: "Information Technology",
      enrollmentYear: 2022,
      currentSemester: 3,
      status: "active",
      gpa: 4.0
    },
    {
      id: 7,
      name: "David Miller",
      photo: "",
      email: "david.miller@university.edu",
      department: "Electrical Engineering",
      enrollmentYear: 2020,
      currentSemester: 7,
      status: "active",
      gpa: 3.4
    },
    {
      id: 8,
      name: "Emily Martinez",
      photo: "",
      email: "emily.martinez@university.edu",
      department: "Computer Science",
      enrollmentYear: 2021,
      currentSemester: 5,
      status: "active",
      gpa: 3.8
    }
  ];
  
  // Extract unique departments and years for filter
  const departments = ["all", ...new Set(students.map(student => student.department))];
  const years = ["all", ...new Set(students.map(student => student.enrollmentYear))].sort();
  
  // Filter students based on search, department, and year
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || student.department === selectedDepartment;
    const matchesYear = selectedYear === "all" || student.enrollmentYear === parseInt(selectedYear);
    
    return matchesSearch && matchesDepartment && matchesYear;
  });
  
  // Department statistics
  const departmentStats = departments
    .filter(dept => dept !== "all")
    .map(dept => {
      const studentsInDept = students.filter(student => student.department === dept);
      const avgGpa = studentsInDept.reduce((sum, student) => sum + student.gpa, 0) / studentsInDept.length;
      
      return {
        name: dept,
        count: studentsInDept.length,
        avgGpa: avgGpa.toFixed(2)
      };
    });
  
  // Year statistics
  const yearStats = years
    .filter(year => year !== "all")
    .map(year => {
      const studentsInYear = students.filter(student => student.enrollmentYear === parseInt(year));
      
      return {
        year,
        count: studentsInYear.length
      };
    });
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Students</h2>
      
      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-8">
          <button
            className={`py-2 px-1 font-medium text-sm transition-colors duration-200 ${
              activeTab === "list"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("list")}
          >
            Student List
          </button>
          <button
            className={`py-2 px-1 font-medium text-sm transition-colors duration-200 ${
              activeTab === "statistics"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("statistics")}
          >
            Statistics
          </button>
        </div>
      </div>
      
      {/* Student List Tab */}
      {activeTab === "list" && (
        <>
          {/* Search and Filter */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="searchStudents" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Students
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="searchStudents"
                    className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="departmentFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="departmentFilter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="yearFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment Year
                </label>
                <select
                  id="yearFilter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year === "all" ? "All Years" : year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Students List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {student.photo ? (
                            <img className="h-10 w-10 rounded-full" src={student.photo} alt="" />
                          ) : (
                            <span className="text-blue-600 font-bold">{student.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.enrollmentYear}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.currentSemester}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.gpa >= 3.7 ? "bg-green-100 text-green-800" : 
                        student.gpa >= 3.0 ? "bg-blue-100 text-blue-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {student.gpa}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredStudents.length === 0 && (
              <div className="bg-blue-50 p-4 m-4 rounded-md text-center">
                <p className="text-blue-800">No students found matching your criteria. Try adjusting your search.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Statistics Tab */}
      {activeTab === "statistics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Students by Department</h3>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <span className="text-sm text-gray-500">{dept.count} students</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(dept.count / students.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Avg. GPA: {dept.avgGpa}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Year Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Students by Enrollment Year</h3>
            <div className="space-y-4">
              {yearStats.map((year, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{year.year}</span>
                    <span className="text-sm text-gray-500">{year.count} students</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(year.count / students.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* GPA Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">GPA Distribution</h3>
            <div className="space-y-4">
              {[
                { range: "3.7-4.0", label: "Excellent", color: "bg-green-600" },
                { range: "3.3-3.7", label: "Very Good", color: "bg-blue-600" },
                { range: "3.0-3.3", label: "Good", color: "bg-yellow-600" },
                { range: "2.7-3.0", label: "Satisfactory", color: "bg-orange-500" },
                { range: "Below 2.7", label: "Needs Improvement", color: "bg-red-500" }
              ].map((category, index) => {
                let count = 0;
                
                if (category.range === "3.7-4.0") {
                  count = students.filter(s => s.gpa >= 3.7 && s.gpa <= 4.0).length;
                } else if (category.range === "3.3-3.7") {
                  count = students.filter(s => s.gpa >= 3.3 && s.gpa < 3.7).length;
                } else if (category.range === "3.0-3.3") {
                  count = students.filter(s => s.gpa >= 3.0 && s.gpa < 3.3).length;
                } else if (category.range === "2.7-3.0") {
                  count = students.filter(s => s.gpa >= 2.7 && s.gpa < 3.0).length;
                } else {
                  count = students.filter(s => s.gpa < 2.7).length;
                }
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{category.range} ({category.label})</span>
                      <span className="text-sm text-gray-500">{count} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${category.color} h-2.5 rounded-full`} 
                        style={{ width: `${(count / students.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Overall Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Overall Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{students.length}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {(students.reduce((sum, student) => sum + student.gpa, 0) / students.length).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Average GPA</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">{departments.length - 1}</p>
                <p className="text-sm text-gray-600">Departments</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {years.length - 1}
                </p>
                <p className="text-sm text-gray-600">Academic Years</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage; 