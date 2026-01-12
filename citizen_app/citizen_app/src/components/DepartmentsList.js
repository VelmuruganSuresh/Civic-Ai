import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Map, Droplets, Zap, TreePine, Building2, ChevronRight } from 'lucide-react'; // Example icons

const DepartmentsList = () => {
  const navigate = useNavigate();

  const departments = [
    { name: 'Sanitation Department', icon: <Truck size={32}/>, color: 'bg-orange-50 text-orange-600 border-orange-100', hover: 'hover:border-orange-300 hover:shadow-orange-100' },
    { name: 'Roads & Highways', icon: <Map size={32}/>, color: 'bg-slate-50 text-slate-600 border-slate-200', hover: 'hover:border-slate-400 hover:shadow-slate-100' },
    { name: 'Water Supply Board', icon: <Droplets size={32}/>, color: 'bg-blue-50 text-blue-600 border-blue-100', hover: 'hover:border-blue-300 hover:shadow-blue-100' },
    { name: 'Electricity Board', icon: <Zap size={32}/>, color: 'bg-yellow-50 text-yellow-600 border-yellow-100', hover: 'hover:border-yellow-300 hover:shadow-yellow-100' },
    { name: 'Forestry Department', icon: <TreePine size={32}/>, color: 'bg-green-50 text-green-600 border-green-100', hover: 'hover:border-green-300 hover:shadow-green-100' },
    { name: 'General Administration', icon: <Building2 size={32}/>, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', hover: 'hover:border-indigo-300 hover:shadow-indigo-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Admin Dashboard</h1>
           <p className="text-slate-500 mt-2 text-lg">Select a department to manage complaints and view reports.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <div 
              key={index} 
              onClick={() => navigate(`/admin/complaints/${encodeURIComponent(dept.name)}`)}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl ${dept.color} ${dept.hover} bg-white animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                 <div className={`p-3 rounded-xl ${dept.color.split(' ')[0]}`}>
                    {dept.icon}
                 </div>
                 <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                   <ChevronRight size={20} className="text-slate-400"/>
                 </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1">{dept.name}</h3>
              <p className="text-sm text-slate-500 font-medium">View pending issues</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsList;