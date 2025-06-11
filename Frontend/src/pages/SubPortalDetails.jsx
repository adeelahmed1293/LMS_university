import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/api";

export default function SubPortalDetails() {
  const { subPortalId } = useParams();
  const [subPortal, setSubPortal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubPortal = async () => {
      try {
        const res = await axios.get(`/subportals/${subPortalId}`);
        setSubPortal(res.data);
      } catch (err) {
        setError("Failed to fetch sub-portal.");
      } finally {
        setLoading(false);
      }
    };

    if (subPortalId) {
      fetchSubPortal();
    }
  }, [subPortalId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-indigo-600 font-semibold text-lg animate-pulse">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-500 font-semibold text-lg">
        {error}
      </div>
    );

  if (!subPortal)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-semibold text-lg">
        SubPortal not found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-2xl shadow-lg border-l-8 border-indigo-600 animate-fadeIn">
      {/* Header with gradient and shadow */}
      <header className="mb-6 pb-4 border-b border-indigo-300">
        <h2 className="text-4xl font-extrabold text-indigo-800 tracking-wide drop-shadow-md">
          {subPortal.title}
        </h2>
        <p className="text-indigo-600 font-semibold mt-1 uppercase tracking-wide text-sm">
          {subPortal.type}
        </p>
      </header>

      {/* Description */}
      <section className="mb-8 text-gray-700 leading-relaxed text-lg">
        {subPortal.description || (
          <span className="italic text-gray-400">
            No description available.
          </span>
        )}
      </section>

      {/* Files Section */}
      <section>
        <h3 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 8h10M7 12h8m-6 8h6a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Files</span>
        </h3>
        {subPortal.files && subPortal.files.length > 0 ? (
          <ul className="space-y-3">
            {subPortal.files.map((file, index) => (
              <li key={file._id || index}>
                <a
                  href={`http://localhost:5000/api/subportals/${subPortalId}/file/${file._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-medium transition-transform transform hover:scale-105 hover:bg-indigo-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                  title={`Download ${file.filename}`}
                >
                  {file.filename}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-indigo-400 italic">No files uploaded.</p>
        )}
      </section>
    </div>
  );
}
