import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // at the top
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const navigate = useNavigate(); // hook for navigation

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "STUDENT",
  });
  const roles = ["HOD", "TEACHER", "STUDENT"];
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [captchaInput, setCaptchaInput] = useState("");
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (parseInt(captchaInput) !== captcha.answer) {
    generateCaptcha(); // Regenerate captcha first
    setCaptchaInput(""); // Clear input
    toast.error("Captcha answer is incorrect. Please try again.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        role: formData.role, // Include role for role validation
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed!");
    }

    // Save token in localStorage or context
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    toast.success("Login successful!");
    setTimeout(() => {
      if (data.user.profileComplete) {
         if (data.user.role === "HOD") {
          navigate("/Hoddashboard");
        } else if (data.user.role === "TEACHER") {
          navigate("/Teacherdashboard");
        }
        else  {
          navigate("/Studentdashboard");
        }
      } else {
        if (data.user.role === "HOD") {
          navigate("/Hodprofile");
        } else if (data.user.role === "TEACHER") {
          navigate("/Teacherprofile");
        } else {
          navigate("/Studentprofile");
        }
      }
    }, 1200);
  } catch (error) {
    toast.error(error.message);
  }
};

const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  setCaptcha({
    question: `${num1} + ${num2}`,
    answer: num1 + num2,
  });
};

useEffect(() => {
  generateCaptcha();
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 py-12">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Log in to University LMS
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your.email@university.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {/* Eye button for toggling password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none"
                  tabIndex={0}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye with slash (hide)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .523-.133 1.016-.366 1.44m-1.617 1.617A3 3 0 019 12c0-.523.133-1.016.366-1.44" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5.25 12 5.25c1.772 0 3.432.457 4.825 1.25m2.36 1.86A9.015 9.015 0 0121.542 12c-1.274 4.057-5.065 6.75-9.542 6.75-1.772 0-3.432-.457-4.825-1.25m-2.36-1.86A9.015 9.015 0 012.458 12z" />
                    </svg>
                  ) : (
                    // Eye (show)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5.25 12 5.25c4.477 0 8.268 2.693 9.542 6.75-1.274 4.057-5.065 6.75-9.542 6.75-4.477 0-8.268-2.693-9.542-6.75z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Solve: <span className="font-semibold text-blue-700">{captcha.question} = ?</span>
              </label>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition duration-300 font-medium"
            >
              Log In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage; 