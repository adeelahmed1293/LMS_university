import { useEffect, useState } from "react";
import axios from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

const ViewPortals = () => {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortals = async () => {
      try {
        const res = await axios.get("/portals");
        setPortals(res.data);
      } catch (err) {
        console.error("Error fetching portals:", err);
        setError("Failed to load portals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortals();
  }, []);

  const handleDelete = async (portalId) => {
    if (!window.confirm("Are you sure you want to delete this portal?")) return;
    try {
      await axios.delete(`/portals/${portalId}`);
      setPortals((prev) => prev.filter((p) => p._id !== portalId));
    } catch (err) {
      console.error("Error deleting portal:", err);
      alert("Failed to delete portal. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-pink-100 to-purple-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-indigo-800">
              🎨 Portal Palace
            </h2>
            <p className="text-gray-700 mt-2 max-w-2xl">
              Centralized system to manage all your academic or creative project
              portals. Find documentation, assets, and more in each portal.
            </p>
            <span className="text-sm text-gray-500 mt-1 block">
              Last updated {new Date().toLocaleDateString()}
            </span>
          </div>

          <Link
            to="/create-portal"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition hover:-translate-y-1"
          >
            + Add New Portal
          </Link>
        </header>

        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Your Portals
          </h3>
          <p className="text-gray-600 mb-6">
            Explore and manage your active portals.
          </p>

          {loading ? (
            <div className="text-center text-gray-500 mt-16 text-lg">
              Loading portals...
            </div>
          ) : error ? (
            <div className="text-center text-red-600 mt-16 font-medium">
              {error}
            </div>
          ) : portals.length === 0 ? (
            <div className="text-center text-gray-500 mt-20 text-lg">
              <p>
                No portals created yet. Hit the button above to create one 🚀
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portals.map((portal) => (
                <div
                  key={portal._id}
                  className="relative bg-white rounded-2xl border border-purple-100 p-6 shadow-md hover:shadow-xl transition hover:scale-[1.02]"
                >
                  <div className="absolute top-3 right-3 flex space-x-2 text-sm">
                    <button
                      onClick={() => navigate(`/portal/${portal._id}/edit`)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(portal._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {portal.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {portal.description}
                  </p>
                  <Link
                    to={`/portal/${portal._id}`}
                    className="inline-block text-purple-600 hover:underline text-sm font-medium"
                  >
                    Show More →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ViewPortals;
