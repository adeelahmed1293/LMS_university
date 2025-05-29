import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentProfilePage = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        toast.info("Welcome back! Please complete your profile.", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Error loading user data. Please login again.");
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("Please login to access this page.");
      navigate("/login");
    } else {
      try {
        const user = JSON.parse(userData);
        
        // If profile is already complete, redirect to dashboard
        if (user.profileComplete) {
         if (user.role === "HOD") {
            navigate("/Hoddashboard");
          }
          else if (user.role === "STUDENT") {
            navigate("/Studentdashboard");
          }
          else{
            navigate("/Teacherdashboard");
          }
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
        
        // Show toast for pre-filled data
        if (user.fullName || user.email) {
          toast.success("Profile partially filled with your account information!");
        }
        
        console.log("User data loaded:", user);
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Error loading user data. Please login again.");
        navigate("/login");
      }
    }
  }, [navigate]);

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          toast.error("Please enter your full name");
          return false;
        }
        if (!formData.email.trim()) {
          toast.error("Please enter your email address");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        if (!formData.dateOfBirth) {
          toast.error("Please select your date of birth");
          return false;
        }
        // Check if user is at least 18 years old
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
          toast.error("You must be at least 18 years old");
          return false;
        }
        break;
      
      case 2:
        if (!formData.departmentName.trim()) {
          toast.error("Please enter your department name");
          return false;
        }
        if (!formData.qualification.trim()) {
          toast.error("Please enter your qualification");
          return false;
        }
        if (!formData.phoneNumber.trim()) {
          toast.error("Please enter your phone number");
          return false;
        }
        if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
          toast.error("Please enter a valid 10-digit phone number");
          return false;
        }
        if (!formData.address.trim()) {
          toast.error("Please enter your address");
          return false;
        }
        break;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      const file = files[0];
      if (file) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Profile image must be smaller than 5MB");
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error("Please select a valid image file");
          return;
        }

        setFormData(prev => ({
          ...prev,
          profileImage: file
        }));

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
          toast.success("Profile image selected successfully!");
        };
        reader.onerror = () => {
          toast.error("Error reading the image file");
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      toast.success(`Step ${currentStep} completed! Moving to next step.`);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    toast.info("Moved to previous step");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage("User not found in localStorage.");
      toast.error("User not found. Please login again.");
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      navigate("/login");
      return;
    }

    // Validate final step
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToast = toast.loading("Creating your profile...", {
      position: "top-center"
    });

    try {
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

      // IMPORTANT FIX: Change the endpoint to match your API routes
      const res = await fetch("http://localhost:3000/hod_profile", {
        method: "POST",
        headers: {
          // Only set Authorization header, Content-Type is automatically set by FormData
          Authorization: `Bearer ${token}`
        },
        body: data
      });
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
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
        
        // Success toast with custom styling
        toast.success("🎉 Profile created successfully! Welcome to the platform!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Delay navigation to show success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
        
      } else {
        // Get the error message from the backend
        let errorText;
        try {
          const errorData = await res.json();
          errorText = errorData.message || "Unknown error occurred";
        } catch (e) {
          errorText = await res.text() || "Server error occurred";
        }
        
        console.error("Backend error response:", errorText);
        console.log("Debug info - User ID:", user.id);
        setMessage("Failed to create profile. Please try again.");
        
        // Specific error handling
        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else if (res.status === 400) {
          toast.error("Invalid data provided. Please check your information.");
        } else if (res.status === 409) {
          toast.error("Profile already exists or duplicate data found.");
        } else if (res.status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(`Error: ${errorText}`);
        }
      }
    } catch (err) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      setMessage("Network error occurred. Please check your connection.");
      
      // Network error handling
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        toast.error("Network error. Please check your internet connection.");
      } else if (err.name === 'AbortError') {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error(`Unexpected error: ${err.message}`);
      }
      
      console.error("Network error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
        {[1, 2, 3].map((step) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                step === currentStep 
                  ? 'bg-blue-600 ring-4 ring-blue-100 transform scale-110' 
                  : step < currentStep 
                    ? 'bg-green-500 transform scale-105' 
                    : 'bg-gray-300'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
            <div className={`mt-2 text-sm transition-colors duration-300 ${
              step === currentStep ? 'text-blue-600 font-medium' : 
              step < currentStep ? 'text-green-600 font-medium' : 'text-gray-500'
            }`}>
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
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            placeholder="Enter your email address"
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
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
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next Step →
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
            Department Name <span className="text-red-500">*</span>
          </label>
          <input
            id="departmentName"
            type="text"
            name="departmentName"
            value={formData.departmentName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            placeholder="Enter your department name"
          />
        </div>

        {/* Qualification */}
        <div>
          <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
            Qualification <span className="text-red-500">*</span>
          </label>
          <input
            id="qualification"
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            placeholder="e.g., PhD in Computer Science, M.Tech, etc."
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
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
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            required
            placeholder="Enter your complete address"
          ></textarea>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next Step →
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
          <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 hover:shadow-xl">
            {previewImage ? (
              <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
          
          <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {previewImage ? 'Change Picture' : 'Choose Profile Picture'}
            </span>
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
            Upload a professional profile picture (Max 5MB). This will be visible to other users on the platform.
          </p>
        </div>
        
        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Profile...
              </>
            ) : (
              '✓ Complete Profile'
            )}
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
          
          {message && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-green-600 mt-4 font-medium"
            >
              {message}
            </motion.p>
          )}
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
              fontSize: '14px',
              borderRadius: '8px'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfilePage;