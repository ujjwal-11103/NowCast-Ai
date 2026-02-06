import React from 'react';
import { Activity, Bell, Settings, User } from 'lucide-react';
import AppSwitcher from '../../../components/AppSwitcher';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <AppSwitcher />
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg shadow-md">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sales Analytics</h1>
                <p className="text-sm text-gray-600">Chemical Operations Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Settings size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};