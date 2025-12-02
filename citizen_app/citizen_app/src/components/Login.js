import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { API_URL } from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        token: credentialResponse.credential
      });

      const { name, email, role } = response.data;

      localStorage.setItem("currentUser", name);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", role);

      toast.success(`Welcome, ${name}!`);

      setTimeout(() => {
        if (role === 'admin') {
            navigate('/admin/departments');
        } else {
            navigate('/post-complaint');
        }
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.error("Login Failed. Backend Connection Error.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
            <span className="text-4xl">🏛️</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">Civic AI</h2>
            <p className="text-gray-500 text-sm">Sign in to continue</p>
        </div>

        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => toast.error("Google Login Failed")}
                useOneTap
            />
        </div>
      </div>
    </div>
  );
};

export default Login;