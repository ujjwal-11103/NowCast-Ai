import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import CustomerDataTable, { CustomerData, sampleData } from './CustomerDataTable';

export const ReportsAccordion: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const filteredData = sampleData.filter(item => 
    filter === 'all' ? true : item.category === filter
  );

  const uniqueCategories = Array.from(new Set(sampleData.map(item => item.category)));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="text-gray-600" size={20} />
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800">Latest Reports</h3>
            <p className="text-sm text-gray-600">Customer interaction and feedback reports</p>
          </div>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <CustomerDataTable data={filteredData} />
    </div>
  );
};