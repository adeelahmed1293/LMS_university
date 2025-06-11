// src/pages/StudentList.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students");
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        👨‍🎓 Enrolled Students
      </h2>

      {students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border-b">{s.name}</td>
                  <td className="px-4 py-3 border-b">{s.email}</td>
                  <td className="px-4 py-3 border-b">{s.address}</td>
                  <td className="px-4 py-3 border-b">
                    {s.attendance?.length || 0} day
                    {(s.attendance?.length || 0) === 1 ? "" : "s"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No students enrolled yet.</p>
      )}
    </div>
  );
};

export default StudentList;
