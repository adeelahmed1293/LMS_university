import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../utils/api";

const PortalDetail = () => {
  const { portalId } = useParams();
  const navigate = useNavigate();
  const [portal, setPortal] = useState(null);

  const fetchPortal = async () => {
    try {
      const res = await axios.get(`/portals/${portalId}`);
      setPortal(res.data);
    } catch (err) {
      console.error("Failed to fetch portal", err);
    }
  };

  useEffect(() => {
    fetchPortal();
  }, [portalId]);

  const handleDelete = async (subPortalId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sub-portal?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/subportals/${subPortalId}`);
      fetchPortal(); // Refresh portal details after deletion
    } catch (err) {
      console.error("Failed to delete sub-portal", err);
      alert("Error deleting sub-portal.");
    }
  };

  if (!portal) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{portal.name}</h1>
        <p className="text-gray-600 mt-2">{portal.description}</p>
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => navigate(`/portal/${portalId}/subportal/create`)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow"
          >
            + Add Sub-Portal
          </button>
          <p className="text-sm text-gray-500">
            Last updated {new Date(portal.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Sub-Portals */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Sub Portals</h2>
        {portal.subPortals && portal.subPortals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portal.subPortals.map((sub, index) => {
              const borderColors = [
                "border-purple-400",
                "border-pink-400",
                "border-green-400",
              ];
              return (
                <div
                  key={sub._id}
                  className={`bg-white rounded-xl p-5 shadow hover:shadow-md border-t-4 ${borderColors[index % 3]}`}
                >
                  <h3 className="font-semibold text-lg text-gray-800">
                    {sub.title}
                  </h3>
                  <p className="text-gray-500 text-sm capitalize">{sub.type}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Created {new Date(sub.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-3 flex flex-col gap-2">
                    <Link
                      to={`/subportal/${sub._id}`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Show More →
                    </Link>

                    {sub.files && sub.files.length > 0 && (
                      <a
                        href={`http://localhost:5000/api/subportals/${sub._id}/file/${sub.files[0]._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View File
                      </a>
                    )}

                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => navigate(`/subportal/${sub._id}/edit`)}
                        className="text-sm text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No sub-portals created yet.</p>
        )}
      </div>
    </div>
  );
};

export default PortalDetail;
