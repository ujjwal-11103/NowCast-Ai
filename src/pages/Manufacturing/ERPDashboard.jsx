import React from 'react';
import { Card } from "@/components/ui/card";
import { Package, TrendingUp, AlertCircle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ERPDashboard = () => {
    const navigate = useNavigate();

    const shortcuts = [
        { title: "Item Stock", icon: Package, link: "/stock/item-view", color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Work Order", icon: Clock, link: "/manufacturing/work-order", color: "text-orange-600", bg: "bg-orange-50" },
        { title: "Material Request", icon: AlertCircle, link: "/manufacturing/issue-materials", color: "text-red-600", bg: "bg-red-50" },
        { title: "Stock Ledger", icon: TrendingUp, link: "/stock/ledger", color: "text-purple-600", bg: "bg-purple-50" },
    ];

    const stats = [
        { label: "Open Work Orders", value: "12", color: "text-orange-600" },
        { label: "Items Below Reorder", value: "5", color: "text-red-600" },
        { label: "Completed Today", value: "8", color: "text-green-600" },
        { label: "Total Valuation", value: "$1.2M", color: "text-blue-600" },
    ];

    const chartData = [
        { name: 'Jan 01', value: 40 },
        { name: 'Jan 05', value: 30 },
        { name: 'Jan 10', value: 20 },
        { name: 'Jan 15', value: 27 },
        { name: 'Jan 20', value: 18 },
        { name: 'Jan 25', value: 23 },
        { name: 'Jan 30', value: 34 },
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen space-y-8 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Manufacturing Dashboard</h1>
                    <p className="text-slate-500">Welcome to your production workspace</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-400">Last updated: Just now</div>
                    <button
                        onClick={() => navigate('/stock')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
                    >
                        Next Step: Stock Overview
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Shortcuts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {shortcuts.map((shortcut, idx) => (
                    <Card
                        key={idx}
                        className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all border-slate-200"
                        onClick={() => navigate(shortcut.link)}
                    >
                        <div className={`p-3 rounded-lg ${shortcut.bg}`}>
                            <shortcut.icon className={`w-6 h-6 ${shortcut.color}`} />
                        </div>
                        <span className="font-semibold text-slate-700">{shortcut.title}</span>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart/Stats Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4">
                        {stats.map((stat, idx) => (
                            <Card key={idx} className="p-4 border-slate-200">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Production Chart */}
                    <Card className="p-6 border-slate-200 min-h-[300px]">
                        <h3 className="font-bold text-slate-700 mb-4">Production Trend (Last 30 Days)</h3>
                        <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Onboarding / Pending */}
                <div className="space-y-6">
                    <Card className="p-6 border-slate-200">
                        <h3 className="font-bold text-slate-700 mb-4">Your Action Items</h3>
                        <div className="space-y-3">
                            {[
                                { text: "Approve Material Request #MR-2024-001", time: "2h ago", link: "/manufacturing/issue-materials" },
                                { text: "Review BOM for New Product X", time: "5h ago", link: "/manufacturing/bom" },
                                { text: "Stock Audit Pending: Warehouse A", time: "1d ago", link: "/stock" }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => navigate(item.link)}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <div className="mt-1 w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">{item.text}</p>
                                        <p className="text-xs text-slate-400">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">System Status</h3>
                        <p className="text-sm text-blue-700 mb-4">All production lines are running optimally. No downtime reported today.</p>
                        <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>System Operational</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ERPDashboard;
