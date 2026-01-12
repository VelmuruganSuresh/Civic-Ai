import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import ComplaintCard from './ComplaintCard';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';

const ComplaintList = () => {
  const { deptName } = useParams();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${API_URL}/complaints/${deptName}`);
        const pending = response.data.filter(item => item.status !== 'Completed');
        setComplaints(pending);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [deptName]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
             <button 
                onClick={() => navigate('/admin/departments')}
                className="flex items-center text-slate-500 hover:text-slate-800 mb-2 transition"
             >
                <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
             </button>
             <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {deptName}
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full border border-yellow-200">Active</span>
             </h2>
          </div>

          <button 
            onClick={() => navigate(`/admin/resolved/${encodeURIComponent(deptName)}`)}
            className="flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-xl border border-green-200 shadow-sm hover:shadow-md hover:bg-green-50 transition font-semibold"
          >
            <CheckCircle size={18} />
            View Resolved History
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">All Caught Up!</h3>
            <p className="text-slate-500 mt-2">No pending complaints for this department.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((item) => (
              <ComplaintCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintList;