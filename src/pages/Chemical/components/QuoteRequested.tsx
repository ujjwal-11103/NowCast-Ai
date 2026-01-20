import React from 'react';
import { FileText } from 'lucide-react';

const QuoteRequested = () => {
    const quotes = [
        { customer: 'BioTech Industries', product: 'Specialized Solvents', amount: 'Toluene, Tergada', status: 'Pending' },
        { customer: 'Green Chemistry Corp', product: 'Eco-friendly Compounds', amount: 'Benzene', status: 'Approved' },
        { customer: 'Research Labs Inc', product: 'High Purity Reagents', amount: 'Benzene, Toluene', status: 'Under Review' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 h-full transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-teal-50 rounded-xl">
                    <FileText className="text-teal-600" size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Quote Requested</h3>
            </div>
            <div className="space-y-3">
                {quotes.map((quote, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 rounded-xl transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-semibold text-gray-900">{quote.customer}</div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${quote.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{quote.status}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-1.5">{quote.product}</div>
                        <div className="flex items-center text-xs font-medium text-gray-800 bg-gray-50 px-2 py-1 rounded inline-block">
                            <span className="text-gray-500 mr-1">Items:</span> {quote.amount}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuoteRequested;
