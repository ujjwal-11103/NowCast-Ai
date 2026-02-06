import React from 'react';
import { Package, MessageSquare, Building2, User } from 'lucide-react';

export interface CustomerData {
  date: string;
  salesmanName: string;
  chemicalName: string;
  category: string;
  clientName: string;
  customer: string;
  summaryReport: string;
  rating: string;
  sentimentScore: number;
}

interface CustomerDataTableProps {
  data: CustomerData[];
}

// ✅ Example dataset for testing
export const sampleData: CustomerData[] = [
  {
    date: "2025-08-19",
    salesmanName: "John Doe",
    chemicalName: "HCl",
    category: "Technical Support",
    clientName: "ABC Corp",
    customer: "Existing",
    summaryReport: "Customer requested urgent support for chemical delivery.",
    rating: "ok",
    sentimentScore: 4,
  },
  {
    date: "2025-08-18",
    salesmanName: "Jane Smith",
    chemicalName: "NaOH",
    category: "Feedback",
    clientName: "XYZ Pvt Ltd",
    customer: "New",
    summaryReport: "New client provided positive feedback after first order.",
    rating: "bad",
    sentimentScore: -1,
  },
  {
    date: "2025-08-17",
    salesmanName: "Michael Lee",
    chemicalName: "CaCO₃",
    category: "Critical Stock",
    clientName: "ChemWorld",
    customer: "Existing",
    summaryReport: "Low stock alert raised by client for calcium carbonate.",
    rating: "ok",
    sentimentScore: 2,
  },
  {
    date: "2025-08-16",
    salesmanName: "Sophia Turner",
    chemicalName: "NaCl",
    category: "Sample Request",
    clientName: "FoodWorks Ltd",
    customer: "New",
    summaryReport: "Requested a product sample for initial testing.",
    rating: "ok",
    sentimentScore: 3,
  },
];

const CustomerDataTable: React.FC<CustomerDataTableProps> = ({ data }) => {
  const getSentimentBadge = (score: number) => {
    if (score >= 3) {
      return { label: 'Positive', color: 'bg-green-100 text-green-800 border-green-200' };
    } else if (score >= 0) {
      return { label: 'Neutral', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else {
      return { label: 'Negative', color: 'bg-red-100 text-red-800 border-red-200' };
    }
  };

  const getRatingBadge = (rating: string) => {
    return rating === 'ok' 
      ? { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Good' }
      : { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Needs Attention' };
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Sample Request': <Package className="w-4 h-4" />,
      'Technical Support': <MessageSquare className="w-4 h-4" />,
      'Critical Stock': <Package className="w-4 h-4" />,
      'Feedback': <MessageSquare className="w-4 h-4" />,
      'Logistics Issue': <Package className="w-4 h-4" />,
      'Inquiry': <MessageSquare className="w-4 h-4" />,
      'Contract Renewal': <Building2 className="w-4 h-4" />,
      'Payment Query': <Building2 className="w-4 h-4" />,
      'New Lead Qualification': <User className="w-4 h-4" />,
      'Sales': <Building2 className="w-4 h-4" />,
      'Follow-up': <MessageSquare className="w-4 h-4" />
    };
    return iconMap[category] || <MessageSquare className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Sample Request': 'bg-purple-50 text-purple-700 border-purple-200',
      'Technical Support': 'bg-blue-50 text-blue-700 border-blue-200',
      'Critical Stock': 'bg-red-50 text-red-700 border-red-200',
      'Feedback': 'bg-green-50 text-green-700 border-green-200',
      'Logistics Issue': 'bg-orange-50 text-orange-700 border-orange-200',
      'Inquiry': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Contract Renewal': 'bg-teal-50 text-teal-700 border-teal-200',
      'Payment Query': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'New Lead Qualification': 'bg-pink-50 text-pink-700 border-pink-200',
      'Sales': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Follow-up': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colorMap[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesman</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chemical</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentiment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => {
              const sentiment = getSentimentBadge(row.sentimentScore);
              const rating = getRatingBadge(row.rating);
              const categoryColor = getCategoryColor(row.category);
              const categoryIcon = getCategoryIcon(row.category);

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.salesmanName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.chemicalName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${categoryColor}`}>
                      {categoryIcon} {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      row.customer === 'Existing' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {row.customer}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate overflow-hidden">{row.summaryReport}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${rating.color}`}>
                      {rating.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${sentiment.color}`}>
                      {sentiment.label} ({row.sentimentScore > 0 ? '+' : ''}{row.sentimentScore})
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDataTable;
