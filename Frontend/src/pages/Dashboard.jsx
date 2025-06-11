import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenCheck,
  Users,
  FolderKanban,
  Megaphone,
  FilePlus2,
  Settings,
  FileText,
  UserCircle,
} from "lucide-react";

const actions = [
  { icon: BookOpenCheck, label: "Create Portals", route: "/create-portal" },
  { icon: FolderKanban, label: "View Portals", route: "/view-portals" },
  { icon: Users, label: "Manage Students", route: "/students" },
  { icon: Megaphone, label: "Announcements", route: "/announcements" },
  { icon: FilePlus2, label: "Upload Resources", route: "/resources" },
  { icon: FileText, label: "Assignments", route: "/assignments" },
  { icon: UserCircle, label: "Profile Settings", route: "/profile" },
  { icon: Settings, label: "System Settings", route: "/settings" },
];

const backgroundStyle = {
  backgroundColor: "#f5f7fa", // light crystal grey
};

export default function Dashboard({ teacherName }) {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen text-gray-800 overflow-hidden px-6 py-12 flex flex-col items-center justify-center"
      style={backgroundStyle}
    >
      {/* Welcome Message */}
      <div className="text-center mb-16 z-10">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900">
          {teacherName ? `Welcome, ${teacherName}` : "Your LMS Control Center"}
        </h1>
        <p className="text-gray-600 mt-2">
          Navigate and manage everything from this hub.
        </p>
      </div>

      {/* Floating Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 z-10">
        {actions.map(({ icon: Icon, label, route }) => (
          <div
            key={label}
            onClick={() => navigate(route)}
            className="relative group cursor-pointer hover:scale-105 transition duration-300"
          >
            {/* Icon Background */}
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white shadow-md group-hover:shadow-lg transition duration-300">
              <Icon
                size={36}
                className="text-blue-600 group-hover:text-blue-500 transition"
              />
            </div>
            {/* Label Below */}
            <div className="text-sm mt-2 text-center text-gray-700 group-hover:text-gray-900 transition">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Background animated lines */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 L100 100 M100 0 L0 100"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          <path
            d="M50 0 L50 100 M0 50 L100 50"
            stroke="#cbd5e1"
            strokeWidth="0.2"
          />
        </svg>
      </div>
    </div>
  );
}
