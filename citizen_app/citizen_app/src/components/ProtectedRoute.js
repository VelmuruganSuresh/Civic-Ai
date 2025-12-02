import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = localStorage.getItem("currentUser");
  const role = localStorage.getItem("userRole");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/post-complaint" replace />;
  }

  return children;
};

export default ProtectedRoute;