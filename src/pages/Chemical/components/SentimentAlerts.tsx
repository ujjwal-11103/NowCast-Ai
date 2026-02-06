import React, { useState } from 'react';
import { MessageCircle, ChevronDown, AlertCircle, Target } from 'lucide-react';

const SentimentAlerts = () => {
    const [expandedSentiment, setExpandedSentiment] = useState<number | null>(null);

    const sentimentAlerts = [
        { customer: 'Acme Corp', date: '2025-01-15', purpose: 'Quality Review', sentiment: 'Positive', color: 'text-green-600', alerts: 'No issues reported.', action: 'Send thank you email.' },
        { customer: 'TechChem Ltd', date: '2025-01-14', purpose: 'Price Discussion', sentiment: 'Neutral', color: 'text-yellow-600', alerts: 'Monitoring price negotiations.', action: 'Follow-up next week.' },
        { customer: 'Global Inc', date: '2025-01-13', purpose: 'Complaint', sentiment: 'Negative', color: 'text-red-600', alerts: 'High priority complaint raised.', action: 'Immediate escalation.' },
    ];

    const toggleSentiment = (index: number) => {
        setExpandedSentiment(expandedSentiment === index ? null : index);
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 h-full">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                    <MessageCircle className="text-blue-600" size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Sentiment Alerts</h3>
            </div>
            <div className="space-y-3">
                {sentimentAlerts.map((alert, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer"
                            onClick={() => toggleSentiment(index)}
                        >
                            <div>
                                <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{alert.customer}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{alert.purpose} • {new Date(alert.date).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${alert.sentiment === 'Positive' ? 'bg-green-50 text-green-700' : alert.sentiment === 'Negative' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{alert.sentiment}</span>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform duration-200 ${expandedSentiment === index ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>

                        {expandedSentiment === index && (
                            <div className="px-4 py-3 bg-gray-50/80 rounded-b-xl border-t border-gray-100 text-sm text-gray-700 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <AlertCircle size={14} className="text-red-500" />
                                    <span>Alerts: {alert.alerts}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Target size={14} className="text-green-500" />
                                    <span>Action: {alert.action}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SentimentAlerts;
