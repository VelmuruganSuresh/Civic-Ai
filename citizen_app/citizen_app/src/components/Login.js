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

      toast.success(`Welcome back, ${name}!`);

      setTimeout(() => {
        if (role === 'admin') {
            navigate('/admin/departments');
        } else {
            navigate('/post-complaint');
        }
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.error("Login Failed. Please check your connection.");
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-slate-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-100/50 blur-3xl"></div>
          <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl"></div>
      </div>

      <ToastContainer />
      
      <div className="w-full flex items-center justify-center z-10 px-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/50 animate-fade-in">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Civic AI</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Empowering communities through technology.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
               <p className="text-sm text-indigo-700 text-center font-medium">
                 Sign in securely to report issues and track resolutions.
               </p>
            </div>

            <div className="flex justify-center py-2">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => toast.error("Google Login Failed")}
                useOneTap
                theme="filled_blue"
                shape="pill"
                size="large"
                width="100%"
              />
            </div>
            
            <p className="text-xs text-center text-gray-400 mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;