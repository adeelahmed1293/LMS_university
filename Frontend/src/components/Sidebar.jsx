import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  LayoutDashboard,
  Users,
  BookOpen,
  Bell,
  Folder,
} from "lucide-react";

export default function Sidebar({ teacherName, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/profile");
  };

  const navItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    { to: "/students", icon: <Users size={20} />, label: "Students" },
    {
      to: "/create-portal",
      icon: <BookOpen size={20} />,
      label: "Create Portal",
    },
    { to: "/view-portals", icon: <Folder size={20} />, label: "View Portals" },
    { to: "/announcements", icon: <Bell size={20} />, label: "Announcements" },
    { to: "/resources", icon: <BookOpen size={20} />, label: "Resources" },
    { to: "/profile", icon: <User size={20} />, label: "Profile Settings" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-semibold ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md scale-[1.02]"
        : "text-blue-900 hover:bg-blue-100 hover:text-blue-700"
    }`;

  return (
    <aside className="min-h-screen w-64 bg-white bg-opacity-60 backdrop-blur-lg border-r border-blue-100 shadow-2xl p-6 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="mb-8">
          <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {teacherName ? `Hi, ${teacherName}` : "Welcome, Teacher"}
          </h2>
          <p className="text-sm text-blue-500 font-medium">Your LMS Panel</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
