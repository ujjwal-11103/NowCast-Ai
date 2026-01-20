import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const colorClasses = {
  blue: {
    bg: 'from-blue-50 to-blue-100',
    icon: 'bg-blue-500 text-white',
    text: 'text-blue-700',
    change: 'text-blue-600'
  },
  green: {
    bg: 'from-green-50 to-green-100',
    icon: 'bg-green-500 text-white',
    text: 'text-green-700',
    change: 'text-green-600'
  },
  orange: {
    bg: 'from-orange-50 to-orange-100',
    icon: 'bg-orange-500 text-white',
    text: 'text-orange-700',
    change: 'text-orange-600'
  },
  purple: {
    bg: 'from-purple-50 to-purple-100',
    icon: 'bg-purple-500 text-white',
    text: 'text-purple-700',
    change: 'text-purple-600'
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color
}) => {
  const classes = colorClasses[color];

  return (
    <div className={`bg-gradient-to-br ${classes.bg} p-6 rounded-xl shadow-sm border border-white/60 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${classes.text} mb-2`}>{value}</p>
          <div className="flex items-center space-x-1">
            <span className={`text-xs font-medium ${classes.change}`}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {change}
            </span>
          </div>
        </div>
        <div className={`${classes.icon} p-3 rounded-lg shadow-sm`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};