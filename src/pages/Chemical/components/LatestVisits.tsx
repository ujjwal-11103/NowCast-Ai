import React, { useState } from "react";
import { Calendar, User, AlertCircle, FileText, Target, Clock, ChevronDown } from "lucide-react";

const LatestVisits = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const uniqueCustomers = ['All Customers', 'Acme Chemical Corp', 'Industrial Solutions Ltd', 'ChemTech Industries', 'Global Chemicals Inc', 'EnviroChem Pvt Ltd', 'BioTech Labs'];

  const handleCustomerSelect = (customer: string) => {
    setSelectedCustomer(customer === 'All Customers' ? null : customer);
    setShowDropdown(false);
  };

  const visits = [
    {
      "customerName": "Acme Chemical Corp",
      "date": "2025-01-15",
      "sentiment": "Positive",
      "action": "Follow-up",
      "purpose": "Product Demo",
      "notes": "Interested in bulk orders",
      "sentimentColor": "text-green-600 bg-green-100",
      "latestSummary": "Toulene, Benzene, Tergada",
      "alerts": "No immediate alerts.",
      "sentimentAction": "Send proposal and discount structure.",
      "summary": "The client is very interested in the bulk orders and we have a follow up scheduled to send proposal and discount structure.",
      "nextVisitReport": "Follow-up meeting scheduled for Jan 25 to discuss detailed pricing."
    },
    {
      "customerName": "Industrial Solutions Ltd",
      "date": "2025-01-14",
      "sentiment": "Neutral",
      "action": "Quote Sent",
      "purpose": "Price Inquiry",
      "notes": "Comparing competitors",
      "sentimentColor": "text-yellow-600 bg-yellow-100",
      "latestSummary": "Toulene, Benzene, Tergada",
      "alerts": "Might consider competitor pricing.",
      "sentimentAction": "Follow up with revised quote.",
      "summary": "They are comparing our pricing with other competitors and we will follow up with them with a revised quote to convert.",
      "nextVisitReport": "Virtual check-in call next week to address price concerns."
    },
    {
      "customerName": "ChemTech Industries",
      "date": "2025-01-13",
      "sentiment": "Positive",
      "action": "Contract Review",
      "purpose": "Contract Negotiation",
      "notes": "Ready to close deal",
      "sentimentColor": "text-green-600 bg-green-100",
      "latestSummary": "Toulene, Benzene, Tergada",
      "alerts": "None.",
      "sentimentAction": "Finalize contract draft.",
      "summary": "The client is ready to close the deal, so we will finalize the contract draft to close it as soon as possible.",
      "nextVisitReport": "On-site visit on Feb 1 to review and finalize contract."
    },
    {
      "customerName": "Global Chemicals Inc",
      "date": "2025-01-12",
      "sentiment": "Negative",
      "action": "Schedule Meeting",
      "purpose": "Issue Resolution",
      "notes": "Quality concerns raised",
      "sentimentColor": "text-red-600 bg-red-100",
      "latestSummary": "Toulene, Benzene, Tergada",
      "alerts": "High priority - could lose client.",
      "sentimentAction": "Resolve issue within a week.",
      "summary": "The client raised quality concerns about the latest product which must be resolved within a week to not lose the client.",
      "nextVisitReport": "Emergency meeting on Jan 18 to address quality issues."
    },
    {
      "customerName": "EnviroChem Pvt Ltd",
      "date": "2025-01-10",
      "sentiment": "Positive",
      "action": "Order Taken",
      "purpose": "Bulk Order",
      "notes": "Large shipment confirmed",
      "sentimentColor": "text-green-600 bg-green-100",
      "latestSummary": "Toulene, Benzene, Tergada",
      "alerts": "Monitor supply chain delays.",
      "sentimentAction": "Ensure timely delivery.",
      "summary": "They confirmed a large shipment and placed a bulk order, so we have to ensure a timely delivery.",
      "nextVisitReport": "Post-delivery satisfaction review to be scheduled."
    },
    {
      "customerName": "BioTech Labs",
      "date": "2025-01-09",
      "sentiment": "Neutral",
      "action": "Follow-up",
      "purpose": "Sample Testing",
      "notes": "Samples sent for testing",
      "sentimentColor": "text-yellow-600 bg-yellow-100",
      "latestSummary": "Toulene, Benzene, Tergada",
      "alerts": "If delayed, risk losing interest.",
      "sentimentAction": "Check with lab for ETA.",
      "summary": "Client is testing the samples we sent for their lab, so we will check the ETA of the results.",
      "nextVisitReport": "Lab visit on Jan 20 to review test results."
    }
  ];

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-[450px] flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Calendar className="text-blue-600" size={22} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Latest Visits</h2>
          </div>
          <div className="flex items-center space-x-2 relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-1.5 shadow-sm border border-gray-100
                ${selectedCustomer ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
            >
              <span>Customers</span>
              <span className="text-xs ml-1 font-bold">
                {selectedCustomer ? `(${selectedCustomer})` : ''}
              </span>
              <ChevronDown
                size={14}
                className={`ml-1 transition-transform duration-200 ${showDropdown ? 'transform rotate-180' : ''}`}
              />
            </button>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-1.5 shadow-sm border border-gray-100
                ${selectedCustomer ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
            >
              <span>Sentiment</span>
              <ChevronDown
                size={14}
              />
            </button>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-1.5 shadow-sm border border-gray-100
                ${selectedCustomer ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
            >
              <span>Action</span>
              <ChevronDown
                size={14}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-12 w-64 rounded-xl shadow-xl bg-white border border-gray-100 z-10 overflow-hidden ring-1 ring-black ring-opacity-5">
                <div className="py-1 max-h-56 overflow-auto scrollbar-thin scrollbar-thumb-gray-200" role="menu" aria-orientation="vertical">
                  {uniqueCustomers.map((customer) => (
                    <button
                      key={customer}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCustomer === customer ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {customer}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sentiment</th>
              <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Summary</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {(selectedCustomer ? visits.filter(visit => visit.customerName === selectedCustomer) : visits).map((visit, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`transition-colors duration-150 cursor-pointer ${expandedRow === index ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleRow(index)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-1.5 bg-gray-100 rounded-full mr-3">
                          <User className="text-gray-500" size={14} />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{visit.customerName}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${expandedRow === index ? 'transform rotate-180 text-blue-500' : ''
                          }`}
                      />
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(visit.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${visit.sentimentColor}`}
                    >
                      {visit.sentiment}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {visit.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {visit.summary}
                  </td>
                </tr>

                {expandedRow === index && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-start space-x-3">
                          <FileText className="text-blue-500 mt-1" size={18} />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Chemicals</p>
                            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{visit.latestSummary}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="text-red-500 mt-1" size={18} />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Alerts</p>
                            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{visit.alerts}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Target className="text-green-500 mt-1" size={18} />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Sentiment Action</p>
                            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{visit.sentimentAction}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Clock className="text-purple-500 mt-1" size={18} />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Next Visit Report</p>
                            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{visit.nextVisitReport}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestVisits;
