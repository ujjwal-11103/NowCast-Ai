import React from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const trendData = [
    { name: "2021", value: 60 },
    { name: "2021", value: 100 },
    { name: "2022", value: 180 },
    { name: "2023", value: 260 },
];

const TrendChart = () => {
    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={trendData}
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
                        tickFormatter={(value) => (value === 0 ? "" : `${value}`)}
                    />
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                    />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#2563EB" }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;
