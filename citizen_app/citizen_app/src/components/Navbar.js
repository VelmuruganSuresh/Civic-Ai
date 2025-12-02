import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = localStorage.getItem("currentUser");
  const role = localStorage.getItem("userRole");

  if (location.pathname === "/" || location.pathname === "/signup") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    toast.info("Logged out successfully 👋");
    navigate("/");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() =>
            navigate(
              role === "admin" ? "/admin/departments" : "/post-complaint"
            )
          }
        >
          <span className="text-2xl">🏛️</span>
          <span className="text-xl font-bold">Civic AI</span>
        </div>

        <div className="flex items-center space-x-4">
          {role !== "admin" && (
            <button
              onClick={() => navigate("/profile")}
              className="text-white hover:text-indigo-200 font-medium mr-2"
            >
              My Complaints
            </button>
          )}
          <span className="text-sm font-medium bg-indigo-700 px-3 py-1 rounded-full">
            👤 {user} ({role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-bold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
