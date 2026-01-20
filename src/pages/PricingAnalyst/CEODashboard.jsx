import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import { ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import SideBar from "@/components/Sidebar/SideBar";
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

const customerDataMock = [
    { Lat: 34.0522, Long: -118.2437, Alert: "No Alert", Customer: "Cust A", Target_Acheived: 110 },
    { Lat: 40.7128, Long: -74.0060, Alert: "Lower than Geo Growth", Customer: "Cust B", Target_Acheived: 80 },
    { Lat: 37.7749, Long: -122.4194, Alert: "Regulars not selling", Customer: "Cust C", Target_Acheived: 60 },
    { Lat: 41.8781, Long: -87.6298, Alert: "No Alert", Customer: "Cust D", Target_Acheived: 105 },
    { Lat: 29.7604, Long: -95.3698, Alert: "Lower than Geo Growth", Customer: "Cust E", Target_Acheived: 85 }
];

const HeaderCard = ({ title, data, unit, color = "bg-[#FEC107]", textColor = "text-black", subText = "" }) => (
    <div className={`${color} p-4 rounded-lg shadow-sm flex flex-col justify-between min-w-[140px] h-[100px] relative overflow-hidden group hover:shadow-md transition-all duration-300`}>
        <div className={`text-[11px] font-bold text-gray-800 uppercase tracking-wide z-10 font-[Montserrat]`}>{title}</div>
        <div className="flex items-baseline mt-2 z-10">
            <span className={`text-2xl font-extrabold ${textColor} font-[Montserrat]`}>{data}</span>
            {unit && <span className="text-sm font-bold text-gray-800 ml-1 font-[Montserrat]">{unit}</span>}
        </div>
        {subText && <div className="text-[10px] font-medium text-gray-800 mt-1 uppercase opacity-80 z-10">{subText}</div>}
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-500"></div>
    </div>
);

const ProductListCard = ({ title, products, type = "default" }) => (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h6 className="text-sm font-bold text-gray-700 mb-4 font-[Montserrat]">{title}</h6>
        <div className="space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
            {products && products.length > 0 ? (
                products.map((p, i) => (
                    <div key={i} className="bg-[#FFF9C4] py-3 px-4 rounded-xl shadow-sm text-xs font-semibold text-gray-800 text-center transform hover:scale-[1.02] transition-transform duration-200 cursor-default border border-yellow-100/50">
                        {p}
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-400 text-xs py-10">No data available</div>
            )}
        </div>
    </div>
);

const CustomerMap = ({ customerData }) => {
    return (
        <Plot
            data={[
                {
                    type: "scattermapbox",
                    lat: customerData.map((customer) => customer.Lat),
                    lon: customerData.map((customer) => customer.Long),
                    mode: "markers",
                    marker: {
                        size: 14,
                        color: customerData.map((customer) => {
                            if (customer.Alert === "No Alert") return "#22c55e";
                            else if (customer.Alert === "Lower than Geo Growth") return "#eab308";
                            else if (customer.Alert === "Regulars not selling") return "#ef4444";
                            else return "#22c55e";
                        }),
                        opacity: 0.8,
                    },
                    text: customerData.map(c => `Customer: ${c.Customer}<br>Target: ${c.Target_Acheived}%`),
                    hoverinfo: "text",
                },
            ]}
            layout={{
                autosize: true,
                hovermode: "closest",
                mapbox: {
                    style: "carto-positron",
                    center: { lat: 37.0902, lon: -95.7129 },
                    zoom: 3,
                },
                margin: { t: 0, b: 0, l: 0, r: 0 },
            }}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler
        />
    );
};

const CEODashboard = () => {
    const { isSidebarOpen } = useSidebar();

    // Data States
    const [sellingProducts, setSellingProducts] = useState({ e2e: [], e2s: [] });
    const [donutGraphData, setDonutGraphData] = useState({});
    const [customerData, setCustomerData] = useState(customerDataMock);

    // Fetch Selling Products
    useEffect(() => {
        const fetchSellingProducts = async () => {
            try {
                const response = await axios.get("http://13.71.126.202:8085/alfred/e2e-e2s/");
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
                const response = await axios.get("http://13.71.126.202:8000/teresa/eda-plots");
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
            try {
                const response = await axios.get("http://13.71.126.202:8085/alfred/lat-long/");
                if (response.data && response.data.length > 0) setCustomerData(response.data);
            } catch (error) {
                console.error("Error fetching map data:", error);
            }
        };
        fetchMapData();
    }, []);


    return (
        <div>
            <div className="flex min-h-screen relative font-sans">
                <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} fixed z-[100] h-full`}>
                    <SideBar />
                </div>

                <div className={`main transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} flex-1 bg-slate-50 relative min-h-screen p-8 font-sans overflow-x-hidden text-slate-900`}>

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

                        {/* Map Section */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 h-[400px] flex flex-col hover:shadow-md transition-all duration-300">
                            <h5 className="font-bold text-slate-700 mb-4 font-[Montserrat] text-sm shrink-0">Geography Wise Sales</h5>
                            <div className="flex-1 min-h-0 w-full relative overflow-hidden rounded-xl">
                                {customerData?.length > 0 ? (
                                    <CustomerMap customerData={customerData} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-sm text-gray-400">Loading Map Data...</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
export default CEODashboard;
