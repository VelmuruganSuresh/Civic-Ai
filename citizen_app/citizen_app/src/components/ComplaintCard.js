import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL, API_URL } from '../services/api';
import { MapPin, Calendar, FileText, CheckCircle, ExternalLink, X } from 'lucide-react';

const ComplaintCard = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(data.status); 

  const imageUrl = `${BASE_URL}${data.image_url}`;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const handleMarkCompleted = async () => {
    const result = await Swal.fire({
        title: 'Resolve Issue?',
        text: "Are you sure this work is done?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Mark Resolved',
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280',
    });

    if (result.isConfirmed) {
        try {
            await axios.put(`${API_URL}/complaints/${data.id}/resolve`);
            setStatus("Completed"); 
            Swal.fire('Success!', 'Status updated to Completed.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update status.', 'error');
        }
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
        
        {/* Image Section */}
        <div className="h-56 relative overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setShowModal(true)}>
          <img 
             src={imageUrl} 
             alt={data.title} 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute top-3 right-3">
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md shadow-sm ${status === 'Completed' ? 'bg-green-500/90 text-white' : 'bg-yellow-400/90 text-yellow-900'}`}>
               {status}
             </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-4">
             <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{data.issue_type}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                   <Calendar size={12}/> {formatDate(data.created_at)}
                </span>
             </div>
             <h3 className="font-bold text-slate-800 text-lg leading-tight line-clamp-1">{data.title}</h3>
             <div className="flex items-center gap-1 text-slate-500 text-xs mt-2">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="truncate">{data.address || "Location unavailable"}</span>
             </div>
          </div>
          
          <div className="mt-auto space-y-3 pt-4 border-t border-gray-50">
            <button 
                onClick={() => setShowModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition flex items-center justify-center gap-2 text-sm"
            >
                <FileText size={16}/> View Letter
            </button>

            {status !== 'Completed' && (
                <button 
                    onClick={handleMarkCompleted}
                    className="w-full py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2 text-sm"
                >
                    <CheckCircle size={16}/> Mark Resolved
                </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            
            <button 
               onClick={() => setShowModal(false)} 
               className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <X size={20} className="text-gray-600"/>
            </button>

            <div className="p-8">
               <div className="text-center mb-8 border-b border-gray-100 pb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Building2Icon />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 font-serif">Formal Grievance Letter</h2>
                  <p className="text-slate-500 text-sm mt-1">Ref ID: {data.id.slice(-8).toUpperCase()}</p>
               </div>

               <div className="font-serif text-slate-700 leading-relaxed space-y-6 max-w-lg mx-auto">
                  <div className="flex justify-between text-sm italic text-slate-500">
                     <span>{formatDate(data.created_at)}</span>
                     <span>From: {data.username}</span>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <p className="font-bold text-slate-900">To The Commissioner,</p>
                        <p>{data.department}</p>
                     </div>
                     
                     <div>
                        <span className="font-bold text-slate-900">Subject: </span>
                        <span>{data.title}</span>
                     </div>

                     <p className="whitespace-pre-wrap">{data.description}</p>

                     <p>Sincerely,<br/>{data.username}</p>
                  </div>
               </div>
               
               <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Attached Evidence</p>
                  <img src={imageUrl} alt="Evidence" className="w-full h-auto rounded-lg border border-slate-200" />
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Simple Icon Component for the modal
const Building2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
);

export default ComplaintCard;