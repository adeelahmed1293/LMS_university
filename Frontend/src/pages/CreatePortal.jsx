import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";

export default function CreatePortal() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("/portals", { name, description });
      const portalId = response.data._id;
      navigate(`/portal/${portalId}`);
    } catch (error) {
      console.error("Error creating portal:", error);
      alert("Failed to create portal");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7f2] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {" "}
      {/* Lighter crystal peach */}
      <div className="max-w-lg w-full bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-10 animate-fadeIn">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mb-6 sm:mb-8 text-center tracking-wide">
          Create Your Portal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2"
            >
              Portal Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-indigo-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-gray-900 placeholder-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
              placeholder="Enter portal name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              className="w-full border border-indigo-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-gray-900 placeholder-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition resize-none"
              placeholder="Describe your portal..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 sm:py-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
          >
            Create Portal
          </button>
        </form>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0; transform: translateY(20px);}
            to {opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease forwards;
          }
        `}
      </style>
    </div>
  );
}
