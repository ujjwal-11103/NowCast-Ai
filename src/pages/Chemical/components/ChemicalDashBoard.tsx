import React from "react";
import {
  ClipboardList,
  Users,
  Beaker,
  AlertTriangle,
  ThumbsUp,
  Smile,
  PieChart,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: "blue" | "green" | "orange" | "purple" | "red";
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color }) => {
  const colorStyles = {
    blue: {
      bg: "from-blue-50 to-blue-100",
      text: "text-blue-700",
      icon: "bg-blue-500 text-white"
    },
    green: {
      bg: "from-green-50 to-green-100",
      text: "text-green-700",
      icon: "bg-green-500 text-white"
    },
    orange: {
      bg: "from-orange-50 to-orange-100",
      text: "text-orange-700",
      icon: "bg-orange-500 text-white"
    },
    purple: {
      bg: "from-purple-50 to-purple-100",
      text: "text-purple-700",
      icon: "bg-purple-500 text-white"
    },
    red: {
      bg: "from-red-50 to-red-100",
      text: "text-red-700",
      icon: "bg-red-500 text-white"
    },
  };

  const currentStyle = colorStyles[color];

  return (
    <div className={`bg-gradient-to-br ${currentStyle.bg} p-6 rounded-xl shadow-sm border border-white/60 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className={`text-2xl font-bold ${currentStyle.text}`}>{value}</h3>
        </div>
        <div className={`p-3 rounded-lg shadow-sm ${currentStyle.icon}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

export default function Preview() {
  const metrics = [
    {
      title: "Total Visits",
      value: 318,
      icon: ClipboardList,
      color: "blue",
    },
    {
      title: "Sales Reps",
      value: 76,
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Products",
      value: 248,
      icon: Beaker,
      color: "blue",
    },
    {
      title: "% Drop in Sales",
      value: "42%",
      icon: AlertTriangle,
      color: "red",
    },
    {
      title: "Healthy Stores%",
      value: "71%",
      icon: ThumbsUp,
      color: "orange",
    },
    {
      title: "% Growth in Sales",
      value: "40%",
      icon: Smile,
      color: "green",
    },
    {
      title: "Cross-Sell %",
      value: "15.7%",
      icon: PieChart,
      color: "purple",
    },
  ] as const;

  return (
    <div>
      {/* Remove min-h-screen, bg-gray-50, and p-8 for tighter layout */}
      <h1 className="text-2xl font-semibold mb-2">Metric Overview</h1>
      <div className="flex flex-col gap-4">
        {/* Top Row: 3 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.slice(0, 3).map((metric, idx) => (
            <MetricCard key={idx} {...metric} />
          ))}
        </div>
        {/* Bottom Row: 4 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.slice(3).map((metric, idx) => (
            <MetricCard key={idx + 3} {...metric} />
          ))}
        </div>
      </div>
    </div>
  );
}