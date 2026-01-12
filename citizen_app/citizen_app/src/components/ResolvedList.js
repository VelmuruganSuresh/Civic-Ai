import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import ComplaintCard from './ComplaintCard';
import { ArrowLeft, Clock } from 'lucide-react';

const ResolvedList = () => {
  const { deptName } = useParams();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${API_URL}/complaints/${deptName}`);
        const resolved = response.data.filter(item => item.status === 'Completed');
        setComplaints(resolved);
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
                onClick={() => navigate(`/admin/complaints/${encodeURIComponent(deptName)}`)}
                className="flex items-center text-slate-500 hover:text-slate-800 mb-2 transition"
             >
                <ArrowLeft size={18} className="mr-1" /> Back to Active
             </button>
             <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {deptName}
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200">Resolved Archive</span>
             </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Clock size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No History</h3>
            <p className="text-slate-500 mt-2">No resolved complaints found in the archive.</p>
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

export default ResolvedList;