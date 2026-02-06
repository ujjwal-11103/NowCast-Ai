import React, { useMemo } from 'react';
// SideBar moved to Layout
import { useForecast } from '@/context/ForecastContext/ForecastContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, CheckCircle2, BarChart2 } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';

const ErrorAnalysis = () => {
    // const { isSidebarOpen } = useSidebar();
    const { globalData } = useForecast();

    // --- Calculations ---
    const metrics = useMemo(() => {
        if (!globalData || globalData.length === 0) return null;

        let totalActual = 0;
        let totalForecast = 0;
        let weightedAbsError = 0;
        let totalBias = 0;

        // Group by Date for Trend Chart
        const trendMap = {};

        globalData.forEach(item => {
            const act = Number(item.actual) || 0;
            const fcst = Number(item.forecast) || 0;
            const err = fcst - act;
            const absErr = Math.abs(err);

            totalActual += act;
            totalForecast += fcst;
            weightedAbsError += absErr;
            totalBias += err; // Simple sum of errors

            // Trend Data
            const date = item.Date;
            if (!trendMap[date]) trendMap[date] = { date, error: 0, absError: 0 };
            trendMap[date].error += err;
            trendMap[date].absError += absErr;
        });

        const wmape = totalActual > 0 ? (weightedAbsError / totalActual) * 100 : 0;
        const accuracy = Math.max(0, 100 - wmape);
        const biasPct = totalActual > 0 ? (totalBias / totalActual) * 100 : 0;

        const trendData = Object.values(trendMap).sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            wmape: wmape.toFixed(1),
            accuracy: accuracy.toFixed(1),
            biasPct: biasPct.toFixed(1),
            totalBias: totalBias.toLocaleString(),
            trendData
        };
    }, [globalData]);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 override-styles">

            <div className="flex-1 p-8 overflow-y-auto w-full">
                <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in">

                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-[Montserrat]">Error Analysis</h1>
                        <p className="text-slate-500">Diagnose forecast performance and identify bias patterns.</p>
                    </div>

                    {!metrics ? (
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-400">No data available for analysis.</p>
                        </div>
                    ) : (
                        <>
                            {/* KPI Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Forecast Accuracy</CardTitle>
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">{metrics.accuracy}%</div>
                                        <p className="text-xs text-slate-500 mt-1">Weighted Mean Absolute Percentage Error (1 - WMAPE)</p>
                                    </CardContent>
                                </Card>

                                <Card className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${Number(metrics.biasPct) > 0 ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Forecast Bias</CardTitle>
                                        <TrendingUp className={`h-4 w-4 ${Number(metrics.biasPct) > 0 ? 'text-amber-500' : 'text-blue-500'}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">{metrics.biasPct > 0 ? '+' : ''}{metrics.biasPct}%</div>
                                        <p className="text-xs text-slate-500 mt-1">Directional Error (Over/Under Forecast)</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Absolute Error</CardTitle>
                                        <AlertCircle className="h-4 w-4 text-rose-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">{metrics.wmape}%</div>
                                        <p className="text-xs text-slate-500 mt-1">Overall Error Magnitude (WMAPE)</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-800">Error Trend Over Time</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={metrics.trendData}>
                                                <defs>
                                                    <linearGradient id="colorAbsError" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}
                                                />
                                                <Area type="monotone" dataKey="absError" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorAbsError)" name="Abs Error" />
                                                <Line type="monotone" dataKey="error" stroke="#3b82f6" strokeWidth={2} dot={false} name="Net Bias" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-800">Top contributors to Error</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[300px] flex items-center justify-center text-slate-400 border border-dashed border-slate-100 rounded-lg bg-slate-50/50">
                                        <span>Breakdown Visualization Coming Soon</span>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Detailed Analysis Table */}
                            <Card className="shadow-sm border border-slate-200">
                                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-lg font-semibold text-slate-800">Detailed Data Analysis</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-[400px] overflow-auto custom-scrollbar">
                                        <Table>
                                            <TableHeader className="bg-slate-50 sticky top-0 z-10">
                                                <TableRow>
                                                    <TableHead className="w-[120px]">Date</TableHead>
                                                    <TableHead>SKU</TableHead>
                                                    <TableHead className="text-right">Actual</TableHead>
                                                    <TableHead className="text-right">Forecast</TableHead>
                                                    <TableHead className="text-right">Abs Error</TableHead>
                                                    <TableHead className="text-right">Acc %</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {globalData.slice(0, 50).map((row, i) => {
                                                    const act = Number(row.actual) || 0;
                                                    const fcst = Number(row.forecast) || 0;
                                                    const absErr = Math.abs(fcst - act);
                                                    const rowAcc = act > 0 ? Math.max(0, 100 - (absErr / act * 100)) : 0;

                                                    return (
                                                        <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                                                            <TableCell className="font-medium text-slate-700">{row.Date}</TableCell>
                                                            <TableCell className="text-slate-600 font-mono text-xs">{row.SKU || row.key}</TableCell>
                                                            <TableCell className="text-right text-slate-600">{act.toLocaleString()}</TableCell>
                                                            <TableCell className="text-right text-slate-600">{fcst.toLocaleString()}</TableCell>
                                                            <TableCell className="text-right font-medium text-rose-600">{absErr.toLocaleString()}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Badge variant={rowAcc >= 80 ? "success" : rowAcc >= 60 ? "warning" : "destructive"}
                                                                    className={`${rowAcc >= 80 ? 'bg-emerald-100 text-emerald-700' : rowAcc >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'} hover:bg-opacity-80`}>
                                                                    {rowAcc.toFixed(0)}%
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ErrorAnalysis;
