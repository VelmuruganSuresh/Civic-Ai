import React, { useState } from 'react';
import { BASE_URL } from '../services/api';
import { MapPin, Calendar, ArrowRight, X } from 'lucide-react';

const UserComplaintCard = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const imageUrl = `${BASE_URL}${data.image_url}`;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        <div className="h-48 relative bg-gray-100">
          <img src={imageUrl} alt={data.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
             <p className="text-white font-bold truncate">{data.issue_type}</p>
          </div>
          <div className="absolute top-3 right-3">
             <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide backdrop-blur-md text-white ${data.status === 'Completed' ? 'bg-green-500/90' : 'bg-yellow-500/90'}`}>
               {data.status}
             </span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
             <Calendar size={14}/> {formatDate(data.created_at)}
          </div>
          
          <div className="mb-4">
            <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100 mb-2">
               {data.department}
            </span>
            <div className="flex items-start gap-1 text-slate-500 text-xs mt-1">
               <MapPin size={14} className="flex-shrink-0 mt-0.5" />
               <span className="line-clamp-1">{data.address || "Location unavailable"}</span>
            </div>
          </div>

          <button 
             onClick={() => setShowModal(true)}
             className="mt-auto w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-2 group"
          >
             View Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative animate-fade-in">
             <div className="bg-indigo-600 p-6 text-white">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-white/80 hover:text-white"><X size={24}/></button>
                <h3 className="text-xl font-bold">Complaint Details</h3>
                <p className="text-indigo-200 text-sm mt-1">{data.department}</p>
             </div>
             
             <div className="p-6 space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase">Subject</label>
                   <p className="font-semibold text-slate-800">{data.title}</p>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                   <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                      {data.description}
                   </p>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                   <div className="mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${data.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                         {data.status}
                      </span>
                   </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-100">
                    <img src={imageUrl} alt="Proof" className="w-full h-40 object-cover rounded-lg" />
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserComplaintCard;