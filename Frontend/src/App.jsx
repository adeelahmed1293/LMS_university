import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import DashboardPage from "./components/Hod_Dashboard/DashboardPage";
import HodProfilePage from "./components/Hod_Dashboard/HodProfilePage";
import StudentProfilePage from "./components/Student_Dashboard/StudentProfilePage";
import TeacherProfilePage from "./components/Teacher_Dashboard/TeacherProfilePage";
import StudentDashboard from "./components/Student_Dashboard/studentDashboard";
import TeacherDashboard from "./components/Teacher_Dashboard/TeacherDashboard";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/Hodprofile" element={<HodProfilePage />} />
        <Route path="/Studentprofile" element={<StudentProfilePage />} />
        <Route path="/Teacherprofile" element={<TeacherProfilePage />} />
        <Route path="/Hoddashboard" element={<DashboardPage />} />
        <Route path="/Studentdashboard" element={<StudentDashboard />} />
        <Route path="/Teacherdashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
