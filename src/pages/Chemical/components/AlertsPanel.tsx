import React from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

const AlertsPanel = () => {
  const alerts = [
    {
      type: 'urgent',
      message: 'Quality complaint from Global Chemicals Inc',
      time: '10 min ago',
      icon: XCircle,
      bgColor: 'bg-red-50 border-red-200',
      iconColor: 'text-red-500'
    },
    {
      type: 'warning',
      message: 'Payment overdue from TechChem Solutions',
      time: '2 hours ago',
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-500'
    },
    {
      type: 'success',
      message: 'Contract signed with Acme Chemical Corp',
      time: '1 day ago',
      icon: CheckCircle,
      bgColor: 'bg-green-50 border-green-200',
      iconColor: 'text-green-500'
    },
    {
      type: 'info',
      message: 'Meeting scheduled with Industrial Solutions',
      time: '2 days ago',
      icon: Clock,
      bgColor: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-500'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 h-full min-h-[400px] flex flex-col">
      <div className="flex items-center space-x-3 mb-6 flex-shrink-0">
        <div className="p-2.5 bg-orange-50 rounded-xl">
          <AlertTriangle className="text-orange-600" size={22} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Alerts</h3>
        <div className="ml-auto flex space-x-1">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full" title="Urgent"></span>
          <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full" title="Warning"></span>
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full" title="Success"></span>
        </div>
      </div>
      <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-gray-200">
        {alerts.map((alert, index) => {
          const IconComponent = alert.icon;
          return (
            <div key={index} className={`p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 group`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors`}>
                  <IconComponent className={alert.iconColor} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-semibold leading-tight">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {alert.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPanel;