import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, X, User, LogOut, FileText } from "lucide-react"; // Install lucide-react if needed, or replace with emojis/svgs

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = localStorage.getItem("currentUser");
  const role = localStorage.getItem("userRole");

  if (location.pathname === "/" || location.pathname === "/signup") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    toast.info("Logged out successfully 👋");
    navigate("/");
  };

  const NavLink = ({ to, label, icon }) => (
    <button
      onClick={() => {
        navigate(to);
        setIsMobileMenuOpen(false);
      }}
      className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-indigo-50"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div
              className="flex-shrink-0 flex items-center cursor-pointer gap-2"
              onClick={() =>
                navigate(
                  role === "admin" ? "/admin/departments" : "/post-complaint"
                )
              }
            >
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Civic<span className="text-indigo-600">AI</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {role !== "admin" && (
              <button
                onClick={() => navigate("/profile")}
                className="text-slate-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <FileText size={18} />
                My Complaints
              </button>
            )}
            
            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800 leading-none">{user}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{role}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                {user ? user.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="ml-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-md focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in absolute w-full z-40">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-lg">
               <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {user ? user.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{user}</p>
                <p className="text-xs text-slate-500 uppercase">{role}</p>
              </div>
            </div>

            {role !== "admin" && (
               <NavLink to="/profile" label="My Complaints" icon={<FileText size={18}/>} />
            )}
             <NavLink to={role === "admin" ? "/admin/departments" : "/post-complaint"} label="Dashboard" icon={<User size={18}/>} />

            <button
              onClick={handleLogout}
              className="w-full mt-4 flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;