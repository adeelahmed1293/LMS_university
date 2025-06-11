// src/pages/ProfileSettings.jsx
import React, { useState } from "react";

export default function ProfileSettings({ onSave, initialName }) {
  const [username, setUsername] = useState(initialName || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === "") {
      return alert("Please enter your name");
    }
    onSave(username.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          ✏️ Profile Settings
        </h1>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            💾 Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
