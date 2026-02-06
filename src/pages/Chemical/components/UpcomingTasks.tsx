import React from 'react';
import { Calendar, FileText, Phone, Mail, TrendingUp } from 'lucide-react';

const UpcomingTasks = () => {
  const nextVisits = [
    { customer: 'Chemical Innovations Ltd', date: '2025-01-16', type: 'Site Visit', priority: 'High' },
    { customer: 'Polymer Solutions Inc', date: '2025-01-17', type: 'Product Demo', priority: 'Medium' },
    { customer: 'Advanced Materials Co', date: '2025-01-18', type: 'Contract Review', priority: 'Low' },
  ];

  const quotes = [
    { customer: 'BioTech Industries', product: 'Specialized Solvents', amount: 'Toluene, Tergada', status: 'Pending' },
    { customer: 'Green Chemistry Corp', product: 'Eco-friendly Compounds', amount: 'Benzene', status: 'Approved' },
    { customer: 'Research Labs Inc', product: 'High Purity Reagents', amount: 'Benzene, Toluene', status: 'Under Review' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Under Review': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Next Visit Requirements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="text-blue-600" size={20} />
          <h3 className="text-base font-semibold text-gray-900">Next Visit Recommended</h3>
        </div>
        <div className="space-y-3">
          {nextVisits.map((visit, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-150">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{visit.customer}</div>
                <div className="text-xs text-gray-600 mt-1">{visit.type} • {new Date(visit.date).toLocaleDateString()}</div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(visit.priority)}`}>
                {visit.priority}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
              <Phone size={12} className="mr-1" />
              Call
            </button>
            <button className="flex items-center px-3 py-1.5 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200">
              <Mail size={12} className="mr-1" />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* Quote Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <FileText className="text-teal-600" size={20} />
          <h3 className="text-base font-semibold text-gray-900">Quote Requested</h3>
        </div>
        <div className="space-y-3">
          {quotes.map((quote, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-150">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-gray-900">{quote.customer}</div>
                {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                  {quote.status}
                </span> */}
              </div>
              <div className="text-xs text-gray-600">{quote.product}</div>
              <div className="text-xs text-gray-800 mt-1">{quote.amount}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default UpcomingTasks;