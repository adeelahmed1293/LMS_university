import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "male",
    dateOfBirth: "",
    profileImage: null,
    departmentName: "",
    qualification: "",
    address: ""
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      const user = JSON.parse(userData);
      
      // If profile is already complete, redirect to dashboard
      if (user.profileComplete) {
        navigate("/dashboard");
      }
      
      // Pre-fill form with existing user data
      setFormData(prevState => ({
        ...prevState,
        // Use the fullName from login response if available
        name: user.fullName || prevState.name,
        // Use the email from login response
        email: user.email || prevState.email,
        // Keep other fields as they are or add more from user object if available
      }));
      
      console.log("User data loaded:", user);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone_number", formData.phoneNumber);
    data.append("gender", formData.gender);
    data.append("date_of_birth", formData.dateOfBirth);
    data.append("department_name", formData.departmentName);
    data.append("qualification", formData.qualification);
    data.append("address", formData.address);
    if (formData.profileImage) {
      data.append("profile_image", formData.profileImage);
    }

    try {
      // Use user.id instead of _id to match the login response structure
      const response = await fetch(`http://localhost:3000/user/update-profile/${userData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Profile update failed");
      }

      const updatedUser = {
        ...userData,
        profileComplete: true
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
        {[1, 2, 3].map((step) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                step === currentStep 
                  ? 'bg-blue-600 ring-4 ring-blue-100' 
                  : step < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
            <div className={`mt-2 text-sm ${step === currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              {step === 1 ? 'Personal Info' : step === 2 ? 'Education & Contact' : 'Profile Picture'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPersonalInfoStep = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <div className="flex space-x-4">
            {['male', 'female', 'other'].map((gender) => (
              <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-800 capitalize">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next Step
          </button>
        </div>
      </motion.div>
    );
  };

  const renderEducationContactStep = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Education & Contact Details</h3>

        {/* Department Name */}
        <div>
          <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-1">
            Department Name
          </label>
          <input
            id="departmentName"
            type="text"
            name="departmentName"
            value={formData.departmentName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        {/* Qualification */}
        <div>
          <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
            Qualification
          </label>
          <input
            id="qualification"
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">+</span>
            </div>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 pl-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="1234567890"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          ></textarea>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next Step
          </button>
        </div>
      </motion.div>
    );
  };

  const renderProfileImageStep = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Profile Picture</h3>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
            {previewImage ? (
              <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
          
          <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="text-sm font-medium text-gray-700">Choose a profile picture</span>
            <input
              id="profileImage"
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required={!previewImage}
            />
          </label>
          
          <p className="text-sm text-gray-500 text-center max-w-xs">
            Upload a professional profile picture. This will be visible to other users on the platform.
          </p>
        </div>
        
        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Complete Profile
          </button>
        </div>
      </motion.div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderEducationContactStep();
      case 3:
        return renderProfileImageStep();
      default:
        return renderPersonalInfoStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-center text-gray-500 mb-8">Fill out your information to get started with University LMS</p>

          {renderProgressBar()}
          
          <form onSubmit={handleSubmit} className="mt-8" encType="multipart/form-data">
            {renderCurrentStep()}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;