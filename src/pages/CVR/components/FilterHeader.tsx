import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';

const FilterHeader = () => {
  const filters = [
    { label: 'State', value: 'All Industries' },
    { label: 'Area', value: 'John Smith' },
    { label: 'Product', value: 'All Products' },
    { label: 'Customer', value: 'All Customers' },
    { label: 'Time', value: 'Last 30 Days' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold text-gray-900">Salesman Rating Dashboard</h1>
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Filter size={16} />
          <span>Filters Applied</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <div key={index} className="relative">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200">
              <span className="text-sm font-medium text-blue-800">{filter.label}</span>
              <ChevronDown size={14} className="text-blue-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterHeader;