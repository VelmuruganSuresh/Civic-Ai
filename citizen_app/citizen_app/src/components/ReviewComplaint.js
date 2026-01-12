import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { API_URL } from '../services/api';
import { ArrowLeft, Send, MapPin, Building, FileText, User } from 'lucide-react';

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
    formData.append("title", aiResult.subject || "No Subject");
    formData.append("description", aiResult.body || "No Description");
    formData.append("department", aiResult.department || "General");
    formData.append("issue_type", aiResult.issue_type || "Other");
    formData.append("address", aiResult.address || "Unknown Location");

    try {
      await axios.post(`${API_URL}/complaints`, formData); 

      toast.success('Complaint Reported Successfully!');
      setTimeout(() => {
        navigate('/post-complaint');
      }, 2000);

    } catch (error) {
      console.error("Submission Error:", error);
      toast.error('Submission Failed. Please try again.');
      setIsSubmitting(false);
    } 
  };

  if (!aiResult) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
           <button 
             onClick={() => navigate('/post-complaint')}
             className="flex items-center text-slate-500 hover:text-slate-800 transition"
           >
             <ArrowLeft size={20} className="mr-2"/>
             Back to Camera
           </button>
           <h1 className="text-2xl font-bold text-slate-800">Review & Submit</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Image Preview Banner */}
          {previewUrl && (
             <div className="h-64 w-full bg-slate-100 relative group overflow-hidden">
               <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition"></div>
               <img 
                 src={previewUrl} 
                 alt="Evidence" 
                 className="w-full h-full object-contain p-4" 
               />
               <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                 Evidence Attached
               </div>
             </div>
          )}

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* Document Preview */}
              <div className="flex-grow space-y-6">
                 
                 <div className="flex items-start gap-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mt-1">
                      <Building size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-indigo-500 uppercase font-bold tracking-wide mb-1">Recipient</p>
                      <p className="font-semibold text-slate-800">{aiResult.department}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="bg-white p-2 rounded-lg text-slate-500 mt-1 border border-slate-100 shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-1">Detected Location</p>
                      <p className="text-sm text-slate-700">{aiResult.address}</p>
                    </div>
                 </div>

                 <div className="mt-8 border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
                       <FileText size={20} className="text-indigo-600"/>
                       <span>Formal Letter Preview</span>
                    </div>
                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm font-serif text-slate-700 leading-relaxed text-sm md:text-base">
                       <p className="font-bold mb-4">Subject: {aiResult.subject}</p>
                       <p className="whitespace-pre-wrap">{aiResult.body}</p>
                       <p className="mt-6 pt-4 border-t border-dashed border-gray-200 text-slate-500">
                         Sincerely,<br/>
                         <span className="font-semibold text-slate-800">{localStorage.getItem("currentUser") || "Citizen"}</span>
                       </p>
                    </div>
                 </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => navigate('/post-complaint')} 
                className="px-6 py-3 rounded-xl border border-gray-300 text-slate-600 font-semibold hover:bg-gray-50 transition w-full md:w-auto"
              >
                Cancel
              </button>
              <button 
                onClick={handleFinalSubmit} 
                disabled={isSubmitting} 
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex-grow flex items-center justify-center gap-2 disabled:bg-indigo-300 disabled:shadow-none"
              >
                {isSubmitting ? (
                   <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                   <>
                     <span>Confirm & Send</span>
                     <Send size={18} />
                   </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewComplaint;