import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const seasonalityData = [
  { name: "Jan", value: 150 },
  { name: "Feb", value: 200 },
  { name: "Mar", value: 150 },
  { name: "Apr", value: 220 },
  { name: "May", value: 150 },
  { name: "Jun", value: 180 },
];

const SeasonalityChart = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={seasonalityData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563EB"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeasonalityChart;
