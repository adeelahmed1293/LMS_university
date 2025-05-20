import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData(prev => ({
        ...prev,
        profileImage: files[0]
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
    if (!user) {
      setMessage("User not found in localStorage.");
      toast.error("User not found in localStorage.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to be logged in");
      return;
    }

    // Create FormData object to send multipart/form-data
    const data = new FormData();
    
    // IMPORTANT FIX: Use user.id instead of user._id
    // The login API returns id, not _id in the user object
    data.append("user", user.id); 
    
    // Map form field names to backend expected names
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
      // IMPORTANT FIX: Change the endpoint to match your API routes
      const res = await fetch("http://localhost:3000/hod_profile", {
        method: "POST",
        headers: {
          // Only set Authorization header, Content-Type is automatically set by FormData
          Authorization: `Bearer ${token}`
        },
        body: data
      });
      
      if (res.ok) {
        const responseData = await res.json();
        console.log("Profile created successfully:", responseData);
        
        const updatedUser = {
          ...user,
          profileComplete: true,
          profileId: responseData._id // Store the profile ID
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage("Profile created successfully!");
        toast.success("Profile created successfully!");
        navigate("/dashboard");
      } else {
        // Get the error message from the backend
        let errorText;
        try {
          const errorData = await res.json();
          errorText = errorData.message || "Unknown error";
        } catch (e) {
          errorText = await res.text();
        }
        
        console.error("Backend error response:", errorText);
        console.log("Debug info - User ID:", user.id);
        setMessage("Failed to create profile: " + errorText);
        toast.error("Failed to create profile: " + errorText);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
      toast.error("Error: " + err.message);
      console.error("Network error:", err);
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
              onChange={handleChange}
              className="hidden"
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

  if (!user) return <div>Loading...</div>;

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
          {message && <p className="text-center text-green-600 mt-4">{message}</p>}
          <ToastContainer />
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;