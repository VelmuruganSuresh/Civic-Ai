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
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />

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
    </Router>
  );
}

export default App;