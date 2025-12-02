import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../services/api';

const ReviewComplaint = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { aiResult, imageFile, previewUrl } = location.state || {};

  useEffect(() => {
    if (!aiResult || !imageFile) {
        navigate('/post-complaint');
    }
  }, [aiResult, imageFile, navigate]);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    const currentUser = localStorage.getItem("currentUser") || "Anonymous";
    const currentEmail = localStorage.getItem("userEmail") || "No Email";

    formData.append("file", imageFile);
    formData.append("username", currentUser);
    formData.append("email", currentEmail);
    formData.append("title", aiResult.subject);
    formData.append("description", aiResult.body);
    formData.append("department", aiResult.department);
    formData.append("issue_type", aiResult.issue_type);
    formData.append("address", aiResult.address);

    try {
      await axios.post(`${API_URL}/complaints`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success('Complaint Letter Sent Successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/post-complaint');
      }, 2500);

    } catch (error) {
      console.error(error);
      
      toast.error('Submission Failed. Please try again.', {
        position: "top-center",
        autoClose: 3000,
      });
      setIsSubmitting(false);
    } 
  };

  if (!aiResult) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
      
      <ToastContainer />

      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Review Letter</h1>
        
        {previewUrl && (
            <div className="mb-6 flex justify-center bg-gray-50 p-2 rounded border border-dashed border-gray-300">
                <img 
                    src={previewUrl} 
                    alt="Evidence" 
                    className="h-40 object-contain rounded" 
                />
            </div>
        )}

        <div className="bg-gray-50 p-6 border rounded-lg mb-6 font-serif text-sm text-gray-800 shadow-inner">
            <p className="mb-2"><strong>From:</strong> {localStorage.getItem("currentUser")}</p>
            <p className="mb-2"><strong>To:</strong> {aiResult.department}</p>
            <p className="mb-4"><strong>Location:</strong> {aiResult.address}</p>
            <hr className="border-gray-300 mb-4"/>
            <p className="mb-4 font-bold">{aiResult.subject}</p>
            <p className="whitespace-pre-wrap leading-relaxed">{aiResult.body}</p>
        </div>

        <div className="flex gap-3">
            <button 
                onClick={() => navigate('/post-complaint')} 
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 transition"
            >
                Cancel
            </button>
            <button 
                onClick={handleFinalSubmit} 
                disabled={isSubmitting} 
                className="flex-1 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
            >
                {isSubmitting ? "Sending..." : "Send Letter ✅"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewComplaint;