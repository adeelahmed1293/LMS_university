// src/pages/Announcements.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/announcements")
      .then((res) => setAnnouncements(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <div key={a._id} className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="text-gray-600">{a.message}</p>
              <p className="text-sm text-gray-400 mt-1">
                Posted on {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No announcements yet.</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
