import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/api";

const SubPortalForm = () => {
  const { portalId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    type: "quiz",
    description: "", // <-- added description field
    files: [], // multiple files
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      setFormData((prev) => ({ ...prev, files: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("description", formData.description); // <-- append description
      data.append("portalId", portalId);

      formData.files.forEach((file) => {
        data.append("files", file);
      });

      await axios.post("/subportals", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/portal/${portalId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create sub-portal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Create Sub-Portal
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            placeholder="e.g. Chapter 1 Quiz"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="description"
          >
            Description (optional)
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Add a description for this sub-portal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="type">
            Type
          </label>
          <select
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
          >
            <option value="quiz">Quiz</option>
            <option value="assignment">Assignment</option>
            <option value="lecture">Lecture</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="files">
            Upload Files (optional)
          </label>
          <input
            type="file"
            name="files"
            id="files"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip"
            onChange={handleChange}
            className="block w-full text-sm text-gray-700"
            multiple
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded transition-colors duration-200 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Sub-Portal"}
        </button>
      </form>
    </div>
  );
};

export default SubPortalForm;
