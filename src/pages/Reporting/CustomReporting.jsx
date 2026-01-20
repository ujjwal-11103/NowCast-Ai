import React, { useState, useEffect, useRef, useMemo } from 'react';
import perspective from "@finos/perspective";
import "@finos/perspective-viewer/dist/css/themes.css";

import { Download, RefreshCw, Settings, TrendingUp, BarChart2, LineChart, LayoutGrid, Activity } from 'lucide-react';
import { useSidebar } from "@/context/sidebar/SidebarContext";
import SideBar from "@/components/Sidebar/SideBar";

import { loadReportingData, fetchNewReportingData } from "@/services/reportingService";

const CustomReporting = () => {
    const { isSidebarOpen } = useSidebar();
    const viewerRef = useRef(null);
    const [librariesLoaded, setLibrariesLoaded] = useState(false);
    const [table, setTable] = useState(null);
    const [data, setData] = useState([]);

    // UI State
    const [activeView, setActiveView] = useState('trend');

    const availableKpis = [
        { id: 'sales', label: 'Total Sales', prefix: '$' },
        { id: 'revenue', label: 'Net Revenue', prefix: '$' },
        { id: 'profit', label: 'Gross Profit', prefix: '$' },
        { id: 'units', label: 'Total Units', prefix: '' },
        { id: 'budget_variance', label: 'Budget Variance', prefix: '$' },
        { id: 'growth_pct', label: 'Avg Growth', prefix: '', suffix: '%' }
    ];

    // Initial Data Load & Perspective Init
    useEffect(() => {
        let isCancelled = false;

        const init = async () => {
            // Imports are lazy loaded to ensure proper registration
            try {
                // Assign to variable to ensure side-effects (registration) run
                await import("@finos/perspective-viewer");
                await import("@finos/perspective-viewer-datagrid");
                await import("@finos/perspective-viewer-d3fc");

                if (!isCancelled) setLibrariesLoaded(true);
            } catch (e) {
                console.error("Failed to load perspective libraries", e);
            }

            if (isCancelled) return;

            const initialData = await loadReportingData();
            setData(initialData);

            const worker = perspective.worker();
            const newTable = await worker.table(initialData);
            setTable(newTable);
        };

        init();
        return () => { isCancelled = true; };
    }, []);

    // ... (rest of code)

    // Effect to load table into viewer when ready
    useEffect(() => {
        if (librariesLoaded && table && viewerRef.current) {
            // Small timeout to ensure element is upgraded
            setTimeout(() => {
                viewerRef.current.load(table);
                restoreView('trend');
            }, 100);
        }
    }, [librariesLoaded, table]);

    // Effect to toggle settings sidebar imperatively
    useEffect(() => {
        if (viewerRef.current) {
            // Ensure settings are false by default (optional)
        }
    }, [activeView]);

    // ...



    const handleRefresh = async () => {
        // In a real scenario, this would fetch new rows from the backend
        const newData = await fetchNewReportingData();
        setData(newData); // Reset data or append? Let's reset for clarity with static file
        if (table) {
            // Perspective table.update appends by default, replace properly involves clearing or creating new table
            // For simplicity in this demo, we'll just update (append) which mimics 'streaming' more data
            // Or better, let's just re-load the table content effectively
            table.update(newData);
        }
    };

    const restoreView = (type) => {
        if (!viewerRef.current) return;
        setActiveView(type);

        const views = {
            trend: {
                plugin: "Y Line",
                group_by: ["date"],
                split_by: ["region"],
                columns: ["sales"],
                aggregates: { sales: "sum" },
                theme: "Pro Light",
                title: "Sales Trend by Region (Seasonality)",
                settings: true
            },
            pivot: {
                plugin: "Datagrid",
                group_by: ["region", "product_category"],
                columns: ["sales", "profit", "budget_variance", "growth_pct"],
                aggregates: {
                    sales: "sum",
                    profit: "sum",
                    budget_variance: "sum",
                    growth_pct: "avg"
                },
                theme: "Pro Light",
                title: "Regional Performance Matrix",
                settings: true
            },
            waterfall: { // Simulated with Bar
                plugin: "Y Bar",
                group_by: ["product_category"],
                columns: ["profit"],
                sort: [["profit", "desc"]],
                aggregates: { profit: "sum" },
                theme: "Pro Light",
                title: "Profit Contribution by Category",
                settings: true
            },
            delta: {
                plugin: "Y Bar",
                group_by: ["product_category"],
                columns: ["budget_variance"],
                aggregates: { budget_variance: "sum" },
                theme: "Pro Light",
                title: "Budget Variance (Positive vs Negative Delta)",
                settings: true
            },
            growth_scatter: {
                plugin: "X/Y Scatter",
                group_by: ["product_category"],
                columns: ["sales", "profit", "growth_pct", "region"],
                aggregates: { sales: "sum", profit: "sum", growth_pct: "avg" },
                theme: "Pro Light",
                title: "Growth vs Profitability",
                settings: true
            }
        };

        if (views[type]) {
            viewerRef.current.restore(views[type]);
        }
    };

    // Calculate Dynamic Stats
    const summaryStats = useMemo(() => {
        return data.reduce((acc, curr) => {
            const newAcc = { ...acc };
            availableKpis.forEach(kpi => {
                const val = curr[kpi.id] || 0;
                newAcc[kpi.id] = (newAcc[kpi.id] || 0) + val;
            });
            return newAcc;
        }, {});
    }, [data]);

    // Force settings open after data load
    useEffect(() => {
        if (librariesLoaded && table && viewerRef.current) {
            const timer = setTimeout(() => {
                console.log("Aggressively forcing settings: true");
                viewerRef.current.restore({ settings: true });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [librariesLoaded, table]);

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
            {/* Sidebar */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} fixed z-[100] h-full`}>
                <SideBar />
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} flex flex-col min-h-screen relative`}>
                {/* ... existing background ... */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-bl from-blue-100/50 to-purple-100/50 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-tr from-emerald-100/50 to-teal-100/50 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 p-8 space-y-6 max-w-[1800px] mx-auto w-full h-screen flex flex-col">
                    {/* ... Header and Controls (unchanged) ... */}

                    <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 shrink-0">
                        {/* Header Content */}
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Custom Reporting</h1>
                            <p className="text-slate-500 font-medium text-lg mt-1">Advanced User-Driven Analytics</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-all shadow-sm">
                                <Download size={18} /> Export
                            </button>
                            <button
                                onClick={handleRefresh}
                                className="flex items-center gap-2 bg-[#0A2472] text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-900 transition-all shadow-md shadow-blue-900/20"
                            >
                                <RefreshCw size={18} /> Update Data
                            </button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        {/* Preset Views */}
                        <div className="flex gap-2 bg-white/60 p-1.5 rounded-lg border border-slate-200 w-fit backdrop-blur-sm shadow-sm">
                            {[
                                { id: 'trend', label: 'Trend Analysis', icon: TrendingUp },
                                { id: 'waterfall', label: 'Profit Waterfall', icon: BarChart2 },
                                { id: 'delta', label: 'Delta', icon: Activity },
                                { id: 'pivot', label: 'Pivot Table', icon: LayoutGrid },
                            ].map(view => (
                                <button
                                    key={view.id}
                                    onClick={() => restoreView(view.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeView === view.id
                                        ? 'bg-[#0A2472] text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <view.icon size={14} />
                                    {view.label}
                                </button>
                            ))}
                        </div>

                        {/* Dynamic Controls */}
                        <div className="flex gap-3 bg-white/60 p-1.5 rounded-lg border border-slate-200 w-fit backdrop-blur-sm shadow-sm items-center">
                            {/* Chart Selector */}
                            <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
                                <span className="text-[10px] font-bold uppercase text-slate-400">Chart</span>
                                <select
                                    className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                                    onChange={(e) => {
                                        if (viewerRef.current) viewerRef.current.restore({ plugin: e.target.value });
                                    }}
                                >
                                    <option value="Y Line">Line Chart</option>
                                    <option value="Y Bar">Bar Chart</option>
                                    <option value="X/Y Scatter">Scatter Plot</option>
                                    <option value="Datagrid">Data Grid</option>
                                    <option value="Heatmap">Heatmap</option>
                                    <option value="Treemap">Treemap</option>
                                </select>
                            </div>

                            {/* Group By Selector */}
                            <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
                                <span className="text-[10px] font-bold uppercase text-slate-400">Group By</span>
                                <select
                                    className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                                    onChange={(e) => {
                                        if (viewerRef.current) viewerRef.current.restore({ group_by: [e.target.value] });
                                    }}
                                >
                                    <option value="region">Region</option>
                                    <option value="product_category">Product Category</option>
                                    <option value="channel">Channel</option>
                                    <option value="date">Date</option>
                                </select>
                            </div>

                            {/* Advanced Settings Toggle */}
                            <button
                                onClick={() => {
                                    if (viewerRef.current) viewerRef.current.toggleConfig();
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all ml-1"
                            >
                                <Settings size={14} />
                                Toggle Builder
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 shrink-0">
                        {[
                            { id: 'sales', label: 'Total Sales', prefix: '$', value: summaryStats.sales },
                            { id: 'profit', label: 'Gross Profit', prefix: '$', value: summaryStats.profit },
                            { id: 'budget_variance', label: 'Budget Variance', prefix: '$', value: summaryStats.budget_variance },
                            { id: 'growth_pct', label: 'Avg Growth', prefix: '', suffix: '%', isAvg: true, value: summaryStats.growth_pct }
                        ].map((metric) => (
                            <div key={metric.id} className="bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{metric.label}</div>
                                <div className={`text-2xl font-extrabold ${metric.value < 0 ? 'text-red-500' : 'text-slate-900'}`}>
                                    {metric.prefix}
                                    {metric.isAvg
                                        ? (metric.value / (data.length || 1)).toFixed(1) + (metric.suffix || '')
                                        : Math.abs(metric.value).toLocaleString(undefined, { maximumFractionDigits: 0 })
                                    }
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
                                    {metric.value < 0 ? <Activity size={14} className="text-red-500" /> : <TrendingUp size={14} />}
                                    <span className={metric.value < 0 ? 'text-red-500' : 'text-emerald-600'}>
                                        {metric.value < 0 ? 'Negative Trend' : 'Positive Trend'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Perspective Viewer */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-1 relative min-h-[500px]">
                        {librariesLoaded && (
                            <perspective-viewer
                                ref={viewerRef}
                                key="perspective-viewer-loaded"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomReporting;
