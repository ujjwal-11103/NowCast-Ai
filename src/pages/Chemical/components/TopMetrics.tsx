import React, { useState } from 'react';
import { Trophy, MessageCircle, ChevronDown, FileText, Target, Calendar, AlertCircle } from 'lucide-react';

const TopMetrics = () => {
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<string | null>(null);
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const [expandedConversion, setExpandedConversion] = useState<number | null>(null);
  const [expandedSentiment, setExpandedSentiment] = useState<number | null>(null);

  const salesPeople = ['All Sales Reps', 'John Smith', 'Sarah Johnson', 'Mike Chen'];
  const sentimentTypes = ['All Sentiments', 'Positive', 'Neutral', 'Negative'];

  const conversionData = [
    { salesman: 'John Smith', conversion: '92%', company: 'ChemTech Ltd', date: '2025-01-13', purpose: 'Follow-up' },
    { salesman: 'Sarah Johnson', conversion: '94%', company: 'Global Inc', date: '2025-01-10', purpose: 'Price Negotiation' },
    { salesman: 'Mike Chen', conversion: '96%', company: 'Acme Corp', date: '2025-01-08', purpose: 'Contract Signing' },
  ];

  const sentimentAlerts = [
    { customer: 'Acme Corp', date: '2025-01-15', purpose: 'Quality Review', sentiment: 'Positive', color: 'text-green-600', alerts: 'No issues reported.', action: 'Send thank you email.' },
    { customer: 'TechChem Ltd', date: '2025-01-14', purpose: 'Price Discussion', sentiment: 'Neutral', color: 'text-yellow-600', alerts: 'Monitoring price negotiations.', action: 'Follow-up next week.' },
    { customer: 'Global Inc', date: '2025-01-13', purpose: 'Complaint', sentiment: 'Negative', color: 'text-red-600', alerts: 'High priority complaint raised.', action: 'Immediate escalation.' },
  ];

  const toggleConversion = (index: number) => {
    setExpandedConversion(expandedConversion === index ? null : index);
  };

  const toggleSentiment = (index: number) => {
    setExpandedSentiment(expandedSentiment === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Top Conversions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Trophy className="text-yellow-500" size={20} />
          <h3 className="text-base font-semibold text-gray-900">Top Performers</h3>
        </div>
        <div className="space-y-2">
          {(selectedSalesPerson ? conversionData.filter(item => item.salesman === selectedSalesPerson) : conversionData).map((item, index) => (
            <div key={index} className="bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-150">
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => toggleConversion(index)}
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.salesman}</div>
                  <div className="text-xs text-gray-600">{item.company}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-green-600">{item.conversion}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${expandedConversion === index ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {expandedConversion === index && (
                <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-700 space-y-2">
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

      {/* Sentiment Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <MessageCircle className="text-blue-500" size={20} />
          <h3 className="text-base font-semibold text-gray-900">Sentiment Alerts</h3>
        </div>
        <div className="space-y-2">
          {(selectedSentiment ? sentimentAlerts.filter(alert => alert.sentiment === selectedSentiment) : sentimentAlerts).map((alert, index) => (
            <div key={index} className="bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-150">
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => toggleSentiment(index)}
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">{alert.customer}</div>
                  <div className="text-xs text-gray-600">{alert.purpose} • {new Date(alert.date).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-semibold ${alert.color}`}>{alert.sentiment}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${expandedSentiment === index ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {expandedSentiment === index && (
                <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-700 space-y-2">
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

    </div>
  );
};

export default TopMetrics;
