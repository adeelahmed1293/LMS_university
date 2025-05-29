import React, { useState } from 'react';
import { motion } from 'framer-motion';

const UpdateHodProfile = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    phone_number: userData?.phone_number || '',
    gender: userData?.gender || '',
    date_of_birth: userData?.date_of_birth || '',
    department_name: userData?.department_name || '',
    qualification: userData?.qualification || '',
    address: userData?.address || '',
    profile_image: null
  });

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData({...formData, profile_image: e.target.files[0]});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
    >
      <div className="flex items-center mb-6">
        <div className="bg-purple-100 p-3 rounded-lg mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Update HOD Profile</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none text-gray-600"
              placeholder="Enter your phone number"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none text-gray-600 bg-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none text-gray-600"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department Name</label>
            <input
              type="text"
              value={formData.department_name}
              onChange={(e) => setFormData({...formData, department_name: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none text-gray-600"
              placeholder="Enter department name"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({...formData, qualification: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none text-gray-600"
              placeholder="Enter your qualification"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 group"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none text-gray-600"
              placeholder="Enter your address"
            ></textarea>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 group"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image</label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-20 h-20 bg-purple-100 rounded-lg overflow-hidden">
                {formData.profile_image ? (
                  <img
                    src={URL.createObjectURL(formData.profile_image)}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none text-gray-600
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center space-x-2 mt-8"
        >
          <span>Update Profile</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UpdateHodProfile;