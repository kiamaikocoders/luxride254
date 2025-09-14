import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, onViewChange }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const menuItems = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "users", icon: "people", label: "Users" },
    { id: "drivers", icon: "sports_motorsports", label: "Drivers" },
    { id: "vehicles", icon: "directions_car", label: "Vehicles" },
    { id: "trips", icon: "map", label: "Trips" },
    { id: "payments", icon: "payment", label: "Payments" },
    { id: "feedback", icon: "feedback", label: "Feedback" },
    { id: "partner-portal", icon: "business", label: "Partner Portal" },
    { id: "applications", icon: "description", label: "Applications" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col h-screen">
      <div className="p-6 text-2xl font-bold text-gray-900 border-b">Admin Panel</div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center px-4 py-2 rounded-md transition-colors ${
              activeView === item.id
                ? "text-gray-700 bg-gray-200"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="material-icons mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center px-4 py-2 rounded-md transition-colors ${
            activeView === 'settings'
              ? "text-gray-700 bg-gray-200"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="material-icons mr-3">settings</span>
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-red-100 rounded-md"
        >
          <span className="material-icons mr-3">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
