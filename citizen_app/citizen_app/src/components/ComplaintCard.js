import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL, API_URL } from '../services/api';

const ComplaintCard = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(data.status); 

  const imageUrl = `${BASE_URL}${data.image_url}`;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleMarkCompleted = async () => {
    const result = await Swal.fire({
        title: 'Mark as Resolved?',
        text: "This will update the status to 'Completed'.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Complete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        focusCancel: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280',
        customClass: {
            popup: 'rounded-xl shadow-2xl font-sans',
            title: 'text-xl font-bold text-gray-800',
            content: 'text-gray-600',
            confirmButton: 'px-6 py-2.5 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 border-none',
            cancelButton: 'px-6 py-2.5 rounded-lg font-bold text-white bg-gray-500 hover:bg-gray-600 border-none mr-3'
        },
        buttonsStyling: false 
    });

    if (result.isConfirmed) {
        try {
            await axios.put(`${API_URL}/complaints/${data.id}/resolve`);
            setStatus("Completed"); 
            
            Swal.fire({
                title: 'Resolved!',
                text: 'The complaint has been closed.',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-xl font-sans',
                    confirmButton: 'px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 border-none'
                },
                buttonsStyling: false
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to update status.', 'error');
        }
    }
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
             <span className={`text-xs px-2 py-1 rounded font-bold uppercase border ${getStatusColor(status)}`}>
                {status}
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
          
          <p className="text-gray-500 text-xs mb-4">📍 {data.address || "Location unavailable"}</p>

          <div className="mt-auto space-y-2">
            <button 
                onClick={() => setShowModal(true)}
                className="w-full bg-indigo-50 text-indigo-700 border border-indigo-200 py-2 rounded hover:bg-indigo-100 transition text-sm font-semibold"
            >
                View Official Letter 📩
            </button>

            {status !== 'Completed' && (
                <button 
                    onClick={handleMarkCompleted}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm font-semibold shadow-sm"
                >
                    Mark as Completed ✅
                </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Official Complaint Letter</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 text-2xl font-bold">×</button>
            </div>

            <div className="p-8 font-serif text-gray-800 leading-relaxed">
              <div className="flex justify-between mb-6 text-sm text-gray-600">
                <div>
                  <p><strong>From:</strong> {data.username || "Citizen"}</p>
                  <p><strong>Date:</strong> {formatDate(data.created_at)}</p>
                </div>
                <div className="text-right">
                  <p><strong>To:</strong> The Commissioner,</p>
                  <p>{data.department}</p>
                </div>
              </div>

              <p className="mb-6"><strong>Subject:</strong> {data.title}</p>
              <p className="whitespace-pre-wrap mb-6">{data.description}</p>
              <p>Sincerely,<br/>{data.username || "Concerned Citizen"}</p>
              
              <div className="mt-8 pt-4 border-t text-sm text-gray-500">
                <p><strong>Attachment:</strong> Site Evidence</p>
                <img src={imageUrl} alt="Evidence" className="h-32 mt-2 border rounded" />
                <p className="mt-1"><strong>Location:</strong> {data.address}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComplaintCard;