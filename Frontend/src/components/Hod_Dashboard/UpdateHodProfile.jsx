import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateHodProfile = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    phone_number: '',
    gender: '',
    date_of_birth: '',
    department_name: '',
    qualification: '',
    address: '',
    profile_image: null
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingProfileImage, setExistingProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Function to get authentication token from localStorage or context
  const getAuthToken = () => {
    // Try to get token from localStorage first
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    
    // You might also get it from a context or prop
    // const token = userData?.token;
    
    return token;
  };

  // Function to fetch HOD profile data
  const fetchHodProfile = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        toast.error('No authentication token found. Please login again.');
        throw new Error('No authentication token found. Please login again.');
      }
      
      const apiUrl = `http://localhost:3000/hod_profile/${userId}`;
      console.log('Fetching HOD profile from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error(`Expected JSON response but received: ${contentType}. Check if API endpoint exists.`);
      }

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('HOD profile not found for this user');
          throw new Error('HOD profile not found for this user');
        } else if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          throw new Error('Session expired. Please login again.');
        } else if (response.status === 403) {
          toast.error('You do not have permission to view this profile.');
          throw new Error('You do not have permission to view this profile.');
        }
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || `HTTP error! status: ${response.status}`);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const hodData = await response.json();
      
      // Format date for input field (convert from ISO to YYYY-MM-DD)
      const formattedDate = hodData.date_of_birth 
        ? new Date(hodData.date_of_birth).toISOString().split('T')[0] 
        : '';

      // Populate form data
      setFormData({
        phone_number: hodData.phone_number || '',
        gender: hodData.gender || '',
        date_of_birth: formattedDate,
        department_name: hodData.department_name || '',
        qualification: hodData.qualification || '',
        address: hodData.address || '',
        profile_image: null // Keep this null for new uploads
      });

      // Set existing profile image if available
      if (hodData.profile_image) {
        setExistingProfileImage(hodData.profile_image);
      }

    } catch (err) {
      console.error('Error fetching HOD profile:', err);
      toast.error(err.message || 'Failed to load profile data');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to update HOD profile
  const updateHodProfile = async (userId, formDataToSend) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSubmitSuccess(false);

      const token = getAuthToken();
      if (!token) {
        toast.error('No authentication token found. Please login again.');
        throw new Error('No authentication token found. Please login again.');
      }

      const apiUrl = `http://localhost:3000/hod_profile/${userId}`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          // Don't set Content-Type for FormData, let the browser set it
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('HOD profile not found for this user');
          throw new Error('HOD profile not found for this user');
        } else if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          throw new Error('Session expired. Please login again.');
        } else if (response.status === 403) {
          toast.error('You do not have permission to update this profile.');
          throw new Error('You do not have permission to update this profile.');
        }
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || `Failed to update profile`);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedData = await response.json();
      console.log('Profile updated successfully:', updatedData);

      // Show success message
      setSubmitSuccess(true);
      toast.success('Profile updated successfully!');
      
      // Update existing profile image if a new one was uploaded
      if (updatedData.profile_image) {
        setExistingProfileImage(updatedData.profile_image);
      }

      // Clear the file input since we've successfully uploaded
      setFormData(prev => ({
        ...prev,
        profile_image: null
      }));

      // Call the parent's onUpdate function if provided
      if (onUpdate) {
        onUpdate(updatedData);
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Error updating HOD profile:', err);
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // useEffect to automatically load data when component mounts
  useEffect(() => {
    if (userData?.id) {
      fetchHodProfile(userData.id);
    } else {
      setLoading(false);
      setError('User ID not provided');
    }
  }, [userData?.id]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData({...formData, profile_image: e.target.files[0]});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData?.id) {
      setError('User ID not available');
      return;
    }

    // Create FormData object
    const data = new FormData();
    
    // Append all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        data.append(key, value);
      }
    });

    // Log FormData contents for debugging
    console.log('FormData contents:');
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    // Call the update function
    await updateHodProfile(userData.id, data);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 flex items-center justify-center min-h-[400px]"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        </motion.div>
      </>
    );
  }

  // Error state
  if (error && !isSubmitting) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
        >
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-lg inline-flex mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Profile</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchHodProfile(userData?.id)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
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

        {/* Success Message */}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Profile updated successfully!
          </motion.div>
        )}

        {/* Error Message */}
        {error && isSubmitting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </motion.div>
        )}

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  ) : existingProfileImage ? (
                    <img
                      src={existingProfileImage}
                      alt="Current Profile"
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
                  disabled={isSubmitting}
                />
              </div>
              {existingProfileImage && !formData.profile_image && (
                <p className="text-sm text-gray-500 mt-2">Current profile image displayed. Upload a new image to replace it.</p>
              )}
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-semibold shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 mt-8 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>Update Profile</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </>
  );
};

export default UpdateHodProfile;