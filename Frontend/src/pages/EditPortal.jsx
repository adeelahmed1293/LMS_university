import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/api";

const EditPortal = () => {
  const { portalId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchPortal = async () => {
      try {
        const res = await axios.get(`/portals/${portalId}`);
        setForm({ name: res.data.name, description: res.data.description });
      } catch (err) {
        console.error("Failed to fetch portal:", err);
      }
    };
    fetchPortal();
  }, [portalId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/portals/${portalId}`, form);
      navigate(`/portal/${portalId}`);
    } catch (err) {
      console.error("Failed to update portal:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-indigo-100 to-pink-100 px-4">
      <div className="w-full max-w-2xl bg-white bg-opacity-90 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-2xl animate-fadeIn">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 mb-6 sm:mb-8 text-center">
          ✏️ Edit Portal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
              Portal Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-indigo-300 rounded-lg px-4 py-2.5 sm:py-3 text-gray-900 placeholder-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
              placeholder="Enter portal name"
              required
            />
          </div>

          <div>
            <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-indigo-300 rounded-lg px-4 py-2.5 sm:py-3 text-gray-900 placeholder-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition resize-none"
              rows={5}
              placeholder="Describe your portal..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 sm:py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
          >
            Update Portal
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default EditPortal;
