import React from 'react';
import { Calendar, Phone, Mail } from 'lucide-react';

const NextVisitRecommended = () => {
    const nextVisits = [
        { customer: 'Chemical Innovations Ltd', date: '2025-01-16', type: 'Site Visit', priority: 'High' },
        { customer: 'Polymer Solutions Inc', date: '2025-01-17', type: 'Product Demo', priority: 'Medium' },
        { customer: 'Advanced Materials Co', date: '2025-01-18', type: 'Contract Review', priority: 'Low' },
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            case 'Low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 h-full transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-indigo-50 rounded-xl">
                    <Calendar className="text-indigo-600" size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Next Visit Recommended</h3>
            </div>
            <div className="space-y-3">
                {nextVisits.map((visit, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 rounded-xl transition-all duration-200">
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">{visit.customer}</div>
                            <div className="text-xs text-gray-500 mt-1">{visit.type} • {new Date(visit.date).toLocaleDateString()}</div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getPriorityColor(visit.priority)}`}>
                            {visit.priority}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                    <button className="flex items-center px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow">
                        <Phone size={14} className="mr-1.5" />
                        Call
                    </button>
                    <button className="flex items-center px-4 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Mail size={14} className="mr-1.5" />
                        Email
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NextVisitRecommended;
