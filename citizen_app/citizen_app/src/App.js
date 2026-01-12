import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'; 
import Login from './components/Login';
import PostComplaint from './components/PostComplaint';
import ReviewComplaint from './components/ReviewComplaint';
import DepartmentsList from './components/DepartmentsList';
import ComplaintList from './components/ComplaintList';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import ResolvedList from './components/ResolvedList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/post-complaint" element={<ProtectedRoute><PostComplaint /></ProtectedRoute>} />
            <Route path="/review-complaint" element={<ProtectedRoute><ReviewComplaint /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/admin/departments" element={<ProtectedRoute adminOnly={true}><DepartmentsList /></ProtectedRoute>} />
            <Route path="/admin/complaints/:deptName" element={<ProtectedRoute adminOnly={true}><ComplaintList /></ProtectedRoute>} />
            <Route path="/admin/resolved/:deptName" element={<ProtectedRoute adminOnly={true}><ResolvedList /></ProtectedRoute>} />
          </Routes>
        </div>
        
        {/* Optional Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
           <div className="container mx-auto px-4 text-center text-sm text-gray-500">
             &copy; {new Date().getFullYear()} Civic AI. Empowering Citizens.
           </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;