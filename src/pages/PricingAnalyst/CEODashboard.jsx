import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import { ChevronDown, ArrowUp, ArrowDown, DollarSign, TrendingUp, BarChart3, Calendar, Percent, Truck, Clock } from "lucide-react";

import axios from "axios";

// --- Mock Data (kept as structure reference or fallback) ---

const CeoData = {
    "kpi": {
        "total_revenue": 1088347930.4,
        "profit": 217669586.1,
        "arr": 960294553.7,
        "cy_sales": 2880883661.2,
        "qoq_growth": "-11.5%",
        "otif": "86%",
        "doh": 42
    },
    "line": {
        "data": [
            {
                "x": ["Q1", "Q2", "Q3"],
                "y": [562764013.2, 1229771717.6, 1088347930.4],
                "type": "scatter",
                "mode": "lines+markers+text",
                "name": "Sales",
                "line": { "color": "#1B1A1C" },
                "text": ["0.56B", "1.23B", "1.09B"],
                "textposition": "bottom center"
            },
            {
                "x": ["Q1", "Q2", "Q3"],
                "y": [354900000, 984600000, 667200000],
                "type": "scatter",
                "mode": "lines+markers+text",
                "name": "Marketing",
                "line": { "color": "#FF6B00" },
                "text": ["0.35B", "0.98B", "0.67B"],
                "textposition": "top center"
            }
        ],
        "layout": {
            "title": { "text": "Sales vs Marketing Trend (QoQ)" },
            "xaxis": { "title": "Quarter" },
            "yaxis": { "title": "Amount ($)" },
            "autosize": true,
            "margin": { "l": 40, "r": 20, "t": 40, "b": 40 },
            "legend": { "orientation": "h", "y": -0.2 }
        }
    }
};

import CustomerMap from "../Sales/components/CustomerMap";

// ... (keep Imports) ...

// --- Mock Data (kept as structure reference or fallback) ---

// ... (keep CeoData) ...

const customerDataMock = [
    { Lat: 34.0522, Long: -118.2437, Alert: "No Alert", Customer: "Cust A", Target_Acheived: 110 },
    { Lat: 40.7128, Long: -74.0060, Alert: "Lower than Geo Growth", Customer: "Cust B", Target_Acheived: 80 },
    { Lat: 37.7749, Long: -122.4194, Alert: "Regulars not selling", Customer: "Cust C", Target_Acheived: 60 },
    { Lat: 41.8781, Long: -87.6298, Alert: "No Alert", Customer: "Cust D", Target_Acheived: 105 },
    { Lat: 29.7604, Long: -95.3698, Alert: "Lower than Geo Growth", Customer: "Cust E", Target_Acheived: 85 }
];

const HeaderCard = ({ title, data, unit, color = "bg-accent", textColor = "text-white", subText = "", icon: Icon }) => (
    <div className={`${color} p-4 rounded-xl shadow-lg shadow-indigo-900/10 flex flex-col justify-between min-w-[140px] h-[110px] relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/10`}>
        <div className="flex justify-between items-start z-10">
            <div className={`text-[11px] font-bold text-white/90 uppercase tracking-wider font-[Montserrat]`}>{title}</div>
            {Icon && <div className="p-1.5 bg-white/20 rounded-lg text-white backdrop-blur-sm"><Icon size={14} /></div>}
        </div>
        <div className="flex items-baseline mt-2 z-10">
            <span className={`text-3xl font-extrabold ${textColor} font-[Montserrat] tracking-tight`}>{data}</span>
            {unit && <span className="text-sm font-bold text-white/80 ml-1 font-[Montserrat]">{unit}</span>}
        </div>
        {subText && <div className="text-[10px] font-medium text-white/70 mt-1 uppercase z-10">{subText}</div>}

        {/* Decorative Background Elements */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white/30 rounded-full group-hover:w-full group-hover:h-full opacity-0 group-hover:opacity-10 transition-all duration-500"></div>
    </div>
);

const ProductListCard = ({ title, products, type = "default" }) => (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h6 className="text-sm font-bold text-gray-700 mb-4 font-[Montserrat]">{title}</h6>
        <div className="space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
            {products && products.length > 0 ? (
                products.map((p, i) => (
                    <div key={i} className="bg-yellow-100 py-3 px-4 rounded-xl shadow-sm text-xs font-semibold text-gray-800 text-center transform hover:scale-[1.02] transition-transform duration-200 cursor-default border border-yellow-200/50">
                        {p}
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-400 text-xs py-10">No data available</div>
            )}
        </div>
    </div>
);

const CEODashboard = () => {


    // Data States
    const [sellingProducts, setSellingProducts] = useState({ e2e: [], e2s: [] });
    const [donutGraphData, setDonutGraphData] = useState({});
    const [customerData, setCustomerData] = useState(null);

    // Fetch Selling Products
    useEffect(() => {
        const fetchSellingProducts = async () => {
            try {
                const response = await axios.get("http://20.235.178.245:8085/alfred/e2e-e2s/");
                if (response.data) setSellingProducts(response.data);
            } catch (error) {
                console.error("Error fetching selling products:", error);
            }
        };
        fetchSellingProducts();
    }, []);

    // Fetch Donut Data
    useEffect(() => {
        const fetchDonutGraphData = async () => {
            try {
                const response = await axios.get("http://20.235.178.245:8080/teresa/eda-plots");
                if (response.data) setDonutGraphData(response.data);
            } catch (error) {
                console.error("Error fetching donut data:", error);
            }
        };
        fetchDonutGraphData();
    }, []);

    // Fetch Map Data
    useEffect(() => {
        const fetchMapData = async () => {
            // Reset data to loading on mount/remount
            setCustomerData(null);

            try {
                const response = await axios.get("http://20.235.178.245:8085/alfred/lat-long");
                if (response.data && response.data.length > 0) {
                    const mappedData = response.data.map(item => ({
                        ...item,
                        Customer: item["Sales Man"], // Map Sales Man to Customer for the map component
                        Target_Acheived: item.Target_Acheived || (Math.random() * 100).toFixed(0) // Fallback or mock if missing
                    }));
                    setCustomerData(mappedData);
                } else {
                    setCustomerData(customerDataMock); // Fallback to mock if API returns empty
                }
            } catch (error) {
                console.error("Error fetching map data:", error);
                setCustomerData(customerDataMock); // Fallback to mock on error
            }
        };
        fetchMapData();
    }, []);


    return (
        <div className="flex-1 bg-slate-50 relative min-h-screen p-8 font-sans overflow-x-hidden text-slate-900">

            {/* Vibrant Light Weight Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-100/40 to-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-rose-100/30 to-amber-100/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-teal-100/30 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1600px] mx-auto space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">

                {/* Header - Premium style matching Planning */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">CEO Dashboard</h1>
                        <p className="text-slate-500 font-medium text-lg">Executive overview of key performance indicators.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Profile Dropdown Removed */}
                    </div>
                </div>

                {/* Header Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
                    <HeaderCard title="Total Revenue (QTD)" data={"$ 1088"} unit="Mn" />
                    <HeaderCard title="Profit (QTD)" data={"$ 218"} unit="Mn" />
                    <HeaderCard title="Quarterly Sales Avg" data={"$ 960"} unit="Mn" />
                    <HeaderCard title="CY Total Sales" data={"$ 2881"} unit="Mn" />
                    <HeaderCard title="Qtr. on Qtr. Growth" data={"-11.5%"} unit="" />
                    <HeaderCard title="OTIF" data={"86%"} unit="" />
                    <HeaderCard title="Days On Hand" data={"42"} unit="" />
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-12 gap-6 h-auto">

                    {/* Column 1: Sales vs Marketing Trend (Line Chart) */}
                    <div className="col-span-12 lg:col-span-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col hover:shadow-md transition-all duration-300">
                        <h5 className="font-bold text-slate-700 mb-6 font-[Montserrat] text-sm">Sales vs Marketing Spends (QoQ)</h5>
                        <div className="flex-1 w-full h-full min-h-0">
                            <Plot
                                data={CeoData.line.data}
                                layout={{
                                    ...CeoData.line.layout,
                                    autosize: true,
                                    margin: { l: 40, r: 20, t: 20, b: 40 },
                                    legend: { orientation: "h", y: 1.1, x: 1 },
                                    font: { family: 'Montserrat, sans-serif' },
                                    paper_bgcolor: 'rgba(0,0,0,0)',
                                    plot_bgcolor: 'rgba(0,0,0,0)'
                                }}
                                useResizeHandler
                                style={{ width: "100%", height: "100%" }}
                                config={{ displayModeBar: false }}
                            />
                        </div>
                    </div>

                    {/* Column 2: Donuts (Category & Sub-Category) */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full">
                        {/* Top Donut */}
                        <div className="flex-1 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col hover:shadow-md transition-all duration-300">
                            <h6 className="text-xs font-bold text-slate-700 mb-2 font-[Montserrat]">{donutGraphData?.plot_1?.name || "Category Wise Distribution"}</h6>
                            <div className="flex-1 w-full min-h-0">
                                {donutGraphData?.plot_1?.data ? (
                                    <Plot
                                        data={donutGraphData.plot_1.data}
                                        layout={{
                                            autosize: true,
                                            margin: { l: 10, r: 10, t: 10, b: 10 },
                                            showlegend: true,
                                            legend: { orientation: 'v', x: 1, y: 0.5 },
                                            font: { family: 'Montserrat, sans-serif', size: 10 },
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)'
                                        }}
                                        useResizeHandler
                                        style={{ width: "100%", height: "100%" }}
                                        config={{ displayModeBar: false }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-gray-400">Loading...</div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Donut */}
                        <div className="flex-1 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col hover:shadow-md transition-all duration-300">
                            <h6 className="text-xs font-bold text-slate-700 mb-2 font-[Montserrat]">{donutGraphData?.plot_2?.name || "Sub-Category wise Distribution"}</h6>
                            <div className="flex-1 w-full min-h-0">
                                {donutGraphData?.plot_2?.data ? (
                                    <Plot
                                        data={donutGraphData.plot_2.data}
                                        layout={{
                                            autosize: true,
                                            margin: { l: 10, r: 10, t: 10, b: 10 },
                                            showlegend: true,
                                            legend: { orientation: 'v', x: 1, y: 0.5 },
                                            font: { family: 'Montserrat, sans-serif', size: 10 },
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)'
                                        }}
                                        useResizeHandler
                                        style={{ width: "100%", height: "100%" }}
                                        config={{ displayModeBar: false }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-gray-400">Loading...</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Product Lists */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full">
                        <div className="flex-1">
                            <ProductListCard title="Top Selling Products" products={sellingProducts?.e2e || []} />
                        </div>
                        <div className="flex-1">
                            <ProductListCard title="Least Selling Products" products={sellingProducts?.e2s || []} />
                        </div>
                    </div>

                </div>

                {/* Map Section - Geography Wise Sales (Styled to match Sales Performance) */}
                <div className="border border-slate-200/60 bg-white rounded-2xl shadow-sm h-[544px] flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
                    {/* Floating Header */}
                    <div className="absolute top-0 left-0 w-full p-5 z-10 flex justify-between items-start pointer-events-none">
                        <div>
                            <h5 className="font-bold text-[16px] text-gray-800 font-heading bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-100/50 shadow-sm inline-block font-[Montserrat]">Geography Wise Sales</h5>
                        </div>
                        {/* Live Data badge */}
                        <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-emerald-600 border border-emerald-100 shadow-sm">
                            LIVE
                        </div>
                    </div>

                    {/* Full Height Map */}
                    <div className="flex-1 w-full min-h-0 relative bg-slate-50/50">
                        {customerData && customerData.length > 0 ? (
                            <CustomerMap customerData={customerData} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm text-gray-400">Loading Map Data...</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
export default CEODashboard;
