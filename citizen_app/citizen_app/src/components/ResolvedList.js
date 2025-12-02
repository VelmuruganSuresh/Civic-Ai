import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import ComplaintCard from './ComplaintCard';

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
                onClick={() => navigate(`/admin/complaints/${encodeURIComponent(deptName)}`)}
                className="bg-white px-4 py-2 rounded shadow text-gray-700 hover:bg-gray-50 mr-4 font-medium"
            >
                ← Back to Active
            </button>
            <h2 className="text-2xl font-bold text-green-700">✅ {deptName} (Resolved)</h2>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 text-xl mt-10">Loading history...</div>
        ) : complaints.length === 0 ? (
          <div className="text-center mt-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-500">No resolved complaints yet.</p>
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