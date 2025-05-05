import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";

const achievementData = [
  { name: "Oct", target: 150, value: 90, variance: "-15%" },
  { name: "Nov", target: 150, value: 110, variance: "-23%" },
  { name: "Dec", target: 150, value: 120, variance: "-23%" },
  { name: "Jan", target: 150, value: 170, variance: "+2%" },
  { name: "Feb", target: 150, value: 140, variance: "-8%" },
  { name: "Mar", target: 150, value: 160, variance: "+2%" },
  { name: "Apr", target: 150, value: 155, variance: "+2%" },
  { name: "Mar", target: 170, value: 180, variance: "+5%" },
];

const getVarianceColor = (variance) => {
  if (variance.startsWith("+")) return "text-green-500";
  if (variance.startsWith("-")) return "text-red-500";
  return "text-gray-500";
};

const TargetAchievementChart = () => {
  return (
    <div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={achievementData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, "dataMax + 50"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}K`}
            />
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <Tooltip />
            <Bar dataKey="value" barSize={40} fill="#4285F4">
              {achievementData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#4285F4" />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="target"
              stroke="#404040"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6 }}
              name="Target"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-8 gap-4 mt-4">
        {achievementData.map((item, index) => (
          <div key={index} className="text-center">
            <p className={getVarianceColor(item.variance)}>{item.variance}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center mt-3">
        <div className="w-6 h-0.5 bg-gray-800 mr-2"></div>
        <span className="text-sm text-gray-600">Target</span>
      </div>
    </div>
  );
};

export default TargetAchievementChart;
