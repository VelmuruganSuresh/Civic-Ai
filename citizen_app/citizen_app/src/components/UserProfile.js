import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';
import UserComplaintCard from './UserComplaintCard';

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500">Welcome back, <span className="font-semibold text-indigo-600">{userName}</span></p>
            </div>
            <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium text-gray-700">{userEmail}</p>
            </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">My Complaints History</h2>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading your history...</div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-500">You haven't posted any complaints yet.</p>
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