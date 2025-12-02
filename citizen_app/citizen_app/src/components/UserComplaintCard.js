import React, { useState } from 'react';
import { BASE_URL } from '../services/api';

const UserComplaintCard = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const imageUrl = `${BASE_URL}${data.image_url}`;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const getStatusColor = (currentStatus) => {
      return currentStatus === 'Completed' 
        ? 'bg-green-100 text-green-800 border-green-200' 
        : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full border border-gray-100">
        <div className="h-48 overflow-hidden bg-gray-200 relative">
          <img src={imageUrl} alt={data.title} className="w-full h-full object-cover" />
          
          <div className="absolute top-2 right-2">
             <span className={`text-xs px-2 py-1 rounded font-bold uppercase border ${getStatusColor(data.status)}`}>
                {data.status}
             </span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 capitalize">{data.issue_type}</h3>
            <span className="text-xs text-gray-500 font-medium mt-1">
                {formatDate(data.created_at)}
            </span>
          </div>

          <div className="mb-3">
            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-semibold border border-blue-100">
              🏛 {data.department}
            </span>
          </div>
          
          <p className="text-gray-500 text-xs mb-4 line-clamp-2">📍 {data.address || "Location unavailable"}</p>

          <div className="mt-auto">
            <button 
                onClick={() => setShowModal(true)}
                className="w-full bg-gray-50 text-gray-700 border border-gray-200 py-2 rounded hover:bg-gray-100 transition text-sm font-semibold"
            >
                View Details 📄
            </button>
          </div>

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Complaint Details</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 text-2xl font-bold">×</button>
            </div>
            <div className="p-8 font-serif text-gray-800 leading-relaxed">
              <div className="flex justify-between mb-6 text-sm text-gray-600">
                <div>
                    <p><strong>Status:</strong> {data.status}</p>
                    <p><strong>Date:</strong> {formatDate(data.created_at)}</p>
                </div>
                <div className="text-right">
                  <p><strong>To:</strong> {data.department}</p>
                </div>
              </div>
              <p className="mb-6"><strong>Subject:</strong> {data.title}</p>
              <p className="whitespace-pre-wrap mb-6">{data.description}</p>
              <div className="mt-8 pt-4 border-t text-sm text-gray-500">
                <p><strong>Attachment:</strong> Site Evidence</p>
                <img src={imageUrl} alt="Evidence" className="h-32 mt-2 border rounded" />
                <p className="mt-1"><strong>Location:</strong> {data.address}</p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t text-right">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserComplaintCard;