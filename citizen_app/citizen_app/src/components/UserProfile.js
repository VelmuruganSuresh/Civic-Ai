import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';
import UserComplaintCard from './UserComplaintCard';
import { User, Mail } from 'lucide-react';

const UserProfile = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("currentUser");

  useEffect(() => {
    const fetchMyComplaints = async () => {
      if (!userEmail) return;
      try {
        const response = await axios.get(`${API_URL}/complaints/user/${userEmail}`);
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyComplaints();
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row items-center md:items-start gap-6">
           <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
           </div>
           <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800">{userName}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 mt-2">
                 <Mail size={16}/>
                 <span>{userEmail}</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
                 <User size={12} /> Citizen Account
              </div>
           </div>
        </div>

        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold text-slate-800">My Reports History</h2>
           <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
              Total: {complaints.length}
           </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-5xl mb-4 opacity-50">📝</div>
            <h3 className="text-lg font-bold text-slate-700">No Complaints Yet</h3>
            <p className="text-slate-500 mt-1">Your submission history will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((item) => (
              <UserComplaintCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;