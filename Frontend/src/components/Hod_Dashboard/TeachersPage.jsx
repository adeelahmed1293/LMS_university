import React, { useState } from "react";

const TeachersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  
  // Mock data for teachers
  const teachers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      photo: "",
      department: "Computer Science",
      position: "Professor",
      subjects: ["Database Systems", "Data Mining"],
      email: "sarah.johnson@university.edu",
      officeHours: "Mon, Wed: 10:00 AM - 12:00 PM",
      rating: 4.8
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      photo: "",
      department: "Computer Science",
      position: "Associate Professor",
      subjects: ["Algorithms", "Data Structures"],
      email: "michael.chen@university.edu",
      officeHours: "Tue, Thu: 2:00 PM - 4:00 PM",
      rating: 4.5
    },
    {
      id: 3,
      name: "Dr. James Wilson",
      photo: "",
      department: "Information Technology",
      position: "Assistant Professor",
      subjects: ["Web Development", "Mobile Computing"],
      email: "james.wilson@university.edu",
      officeHours: "Mon, Fri: 1:00 PM - 3:00 PM",
      rating: 4.2
    },
    {
      id: 4,
      name: "Dr. Lisa Miller",
      photo: "",
      department: "Electrical Engineering",
      position: "Professor",
      subjects: ["Computer Architecture", "Digital Systems"],
      email: "lisa.miller@university.edu",
      officeHours: "Wed, Fri: 11:00 AM - 1:00 PM",
      rating: 4.7
    },
    {
      id: 5,
      name: "Prof. David Brown",
      photo: "",
      department: "Information Technology",
      position: "Associate Professor",
      subjects: ["Cybersecurity", "Network Administration"],
      email: "david.brown@university.edu",
      officeHours: "Tue, Thu: 9:00 AM - 11:00 AM",
      rating: 4.4
    },
    {
      id: 6,
      name: "Dr. Emily Roberts",
      photo: "",
      department: "Computer Science",
      position: "Professor",
      subjects: ["Artificial Intelligence", "Machine Learning"],
      email: "emily.roberts@university.edu",
      officeHours: "Mon, Wed: 3:00 PM - 5:00 PM",
      rating: 4.9
    }
  ];
  
  // Extract unique departments for filter
  const departments = ["all", ...new Set(teachers.map(teacher => teacher.department))];
  
  // Filter teachers based on search and department
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         teacher.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDepartment = selectedDepartment === "all" || teacher.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Teachers</h2>
      
      {/* Search and Filter */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="searchTeachers" className="block text-sm font-medium text-gray-700 mb-1">
              Search Teachers
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="searchTeachers"
                className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="Search by name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="departmentFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Department
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
        </div>
      </div>
      
      {/* Teachers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
      
      {filteredTeachers.length === 0 && (
        <div className="bg-blue-50 p-4 rounded-md text-center">
          <p className="text-blue-800">No teachers found matching your criteria. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

const TeacherCard = ({ teacher }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            {teacher.photo ? (
              <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-blue-600 font-bold text-xl">{teacher.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{teacher.name}</h3>
            <p className="text-gray-600 text-sm">{teacher.position}</p>
            <p className="text-blue-600 text-sm">{teacher.department}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Subjects</h4>
          <div className="flex flex-wrap gap-2">
            {teacher.subjects.map((subject, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 text-xs py-1 px-2 rounded">
                {subject}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700">Office Hours</h4>
            <p className="text-gray-600">{teacher.officeHours}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Rating</h4>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{teacher.rating}/5.0</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4 pt-4 border-t">
          <a 
            href={`mailto:${teacher.email}`} 
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            Contact
          </a>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeachersPage; 