// src/pages/Resources.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const Resources = () => {
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [fileRes, linkRes] = await Promise.all([
          axios.get("http://localhost:5000/api/resources/files"),
          axios.get("http://localhost:5000/api/resources/links"),
        ]);
        setFiles(fileRes.data);
        setLinks(linkRes.data);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        📚 Shared Resources
      </h2>

      {/* Files Section */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📁 Files</h3>
        {files.length > 0 ? (
          <ul className="space-y-3">
            {files.map((file) => (
              <li key={file._id}>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {file.title}
                </a>
                <span className="ml-2 text-sm text-gray-500">
                  ({file.type})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No files shared yet.</p>
        )}
      </section>

      {/* Links Section */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🔗 Links</h3>
        {links.length > 0 ? (
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link._id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No links shared yet.</p>
        )}
      </section>
    </div>
  );
};

export default Resources;
