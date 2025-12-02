import React from 'react';
import { useNavigate } from 'react-router-dom';

const DepartmentsList = () => {
  const navigate = useNavigate();

  const departments = [
    { name: 'Sanitation Department', icon: '🗑️', color: 'bg-red-100 text-red-600' },
    { name: 'Roads & Highways', icon: '🛣️', color: 'bg-gray-200 text-gray-700' },
    { name: 'Water Supply Board', icon: '🚰', color: 'bg-blue-100 text-blue-600' },
    { name: 'Electricity Board', icon: '💡', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Forestry Department', icon: '🌳', color: 'bg-green-100 text-green-600' },
    { name: 'General Administration', icon: '🏢', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Department Dashboard</h1>
        <p className="text-gray-500 text-center mb-10">Select a department to view assigned complaints</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <div 
              key={index} 
              onClick={() => navigate(`/admin/complaints/${encodeURIComponent(dept.name)}`)}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto ${dept.color}`}>
                {dept.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center">{dept.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsList;