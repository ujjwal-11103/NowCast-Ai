import React, { useState } from 'react';
import { Trophy, ChevronDown, Calendar, Target } from 'lucide-react';

const TopPerformers = () => {
    const [expandedConversion, setExpandedConversion] = useState<number | null>(null);

    const conversionData = [
        { salesman: 'John Smith', conversion: '92%', company: 'ChemTech Ltd', date: '2025-01-13', purpose: 'Follow-up' },
        { salesman: 'Sarah Johnson', conversion: '94%', company: 'Global Inc', date: '2025-01-10', purpose: 'Price Negotiation' },
        { salesman: 'Mike Chen', conversion: '96%', company: 'Acme Corp', date: '2025-01-08', purpose: 'Contract Signing' },
    ];

    const toggleConversion = (index: number) => {
        setExpandedConversion(expandedConversion === index ? null : index);
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 h-full">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-yellow-50 rounded-xl">
                    <Trophy className="text-yellow-600" size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Top Performers</h3>
            </div>
            <div className="space-y-3">
                {conversionData.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-yellow-200 transition-all duration-200 group">
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer"
                            onClick={() => toggleConversion(index)}
                        >
                            <div>
                                <div className="text-sm font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors">{item.salesman}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{item.company}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{item.conversion}</span>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform duration-200 ${expandedConversion === index ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>

                        {expandedConversion === index && (
                            <div className="px-4 py-3 bg-gray-50/80 rounded-b-xl border-t border-gray-100 text-sm text-gray-700 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Calendar size={14} className="text-blue-500" />
                                    <span>Date: {new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Target size={14} className="text-green-500" />
                                    <span>Purpose: {item.purpose}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopPerformers;
