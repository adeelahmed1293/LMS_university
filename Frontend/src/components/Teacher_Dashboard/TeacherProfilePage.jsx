import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "Male",
    dateOfBirth: "",
    profileImage: null,
    dept_name: "",
    qualification: "",
    address: "",
    dateOfHire: "",
    subjects: []
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
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("Please login to access this page.");
      navigate("/login");
    } else {
      try {
        const user = JSON.parse(userData);
        
        if (user.profileComplete) {
          if (user.role === "TEACHER") {
            navigate("/Teacherdashboard");
          } else {
            navigate("/login");
          }
        }
        
        setFormData(prevState => ({
          ...prevState,
          name: user.fullName || prevState.name,
          email: user.email || prevState.email,
        }));
        
        if (user.fullName || user.email) {
          toast.success("Profile partially filled with your account information!");
        }
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
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 21) {
          toast.error("You must be at least 21 years old to be a teacher");
          return false;
        }
        break;
      
      case 2:
        if (!formData.dept_name.trim()) {
          toast.error("Please enter your department name");
          return false;
        }
        if (!formData.qualification.trim()) {
          toast.error("Please enter your qualification");
          return false;
        }
        if (!formData.subjects || formData.subjects.length === 0) {
          toast.error("Please enter at least one subject");
          return false;
        }
        if (!formData.dateOfHire) {
          toast.error("Please enter your date of hire");
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
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Profile image must be smaller than 5MB");
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          toast.error("Please select a valid image file");
          return;
        }

        setFormData(prev => ({
          ...prev,
          profileImage: file
        }));

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
    } else if (name === "subjects") {
      const subjectsArray = value.split(",").map(subject => subject.trim());
      setFormData(prev => ({
        ...prev,
        subjects: subjectsArray
      }));
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
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    const formDataToSend = new FormData();

    // Append all form fields to FormData
    Object.keys(formData).forEach(key => {
      if (key === 'subjects') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'profileImage' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('/api/teacher/create-profile', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile created successfully!");
        const updatedUser = { ...user, profileComplete: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        navigate("/Teacherdashboard");
      } else {
        throw new Error(data.message || 'Failed to create profile');
      }
    } catch (error) {
      toast.error(error.message);
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Teacher Profile Setup
          </h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${currentStep > index ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department Name
                  </label>
                  <input
                    type="text"
                    name="dept_name"
                    value={formData.dept_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subjects (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="subjects"
                    value={formData.subjects.join(", ")}
                    onChange={handleChange}
                    placeholder="Math, Physics, Chemistry"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Hire
                  </label>
                  <input
                    type="date"
                    name="dateOfHire"
                    value={formData.dateOfHire}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleChange}
                    accept="image/*"
                    className="mt-1 block w-full"
                  />
                  {previewImage && (
                    <div className="mt-4">
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-32 h-32 object-cover rounded-full mx-auto"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Review Your Information
                  </h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Department:</strong> {formData.dept_name}</p>
                    <p><strong>Subjects:</strong> {formData.subjects.join(", ")}</p>
                    <p><strong>Qualification:</strong> {formData.qualification}</p>
                    <p><strong>Date of Hire:</strong> {formData.dateOfHire}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors ml-auto"
                >
                  {isSubmitting ? "Creating Profile..." : "Create Profile"}
                </button>
              )}
            </div>
          </form>

          {message && (
            <div className="mt-4 text-center text-sm text-red-600">
              {message}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TeacherProfilePage;