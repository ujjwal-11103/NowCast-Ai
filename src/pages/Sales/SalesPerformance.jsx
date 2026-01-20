
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import SideBar from "@/components/Sidebar/SideBar";
import whiteShadow from "../../assets/img/whiteShadow.png";
import target from "../../assets/img/target.png";
import salesHomes from "../../assets/img/salesHome.png";
import geographies from "../../assets/img/geographies.png";
import maps from "../../assets/img/maps.png";
import loss from "../../assets/img/loss.png";
import gain from "../../assets/img/gain.png";
import dslr from "../../assets/img/dslr.png";
import p2p from "../../assets/img/p2p.png";
import CustomerMap from "./components/CustomerMap";
import ViewDetailPopup from "./components/ViewDetailPopup";
import { ChevronDown, Filter } from "lucide-react";

// Mock User Image - normally would come from auth context or assets
const userImage = "https://github.com/shadcn.png";

const SalesPerformance = () => {
    const { isSidebarOpen } = useSidebar();

    const imgUrl = {
        whiteShadowIcon: <img src={whiteShadow} alt="shadow" />,
        targetIcon: <img src={target} alt="target" className="absolute left-[15px]" />,
        salesIcon: <img src={salesHomes} alt="sales" />,
        geoIcons: <img src={geographies} alt="geo" />,
        mapIcon: <img src={maps} className="w-full h-[95%] cursor-move" alt="map" />,
        lossIcon: <img src={loss} alt="loss" />,
        gianIcon: <img src={gain} alt="gain" />,
        dslrIcon: <img src={dslr} className="h-[20px] w-[30px]" alt="dslr" />,
        p2pIcons: <img src={p2p} className="h-[20px] w-[30px]" alt="p2p" />,
    };

    const [openPopup, setOpenPopup] = useState(false);
    const [rowData, setRowData] = useState([]);

    // Data API Service Configuration
    const axiosInstance = axios.create({
        baseURL: "http://13.71.126.202:8085/",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Mock Data for Fallback
    const mockCustomerData = [
        { Customer: "Cust 1", Lat: 37.7749, Long: -122.4194, Target_Acheived: 50000, Total_Target: 45000, Alert: "No Alert" },
        { Customer: "Cust 2", Lat: 40.7128, Long: -74.0060, Target_Acheived: 28000, Total_Target: 32000, Alert: "Target Not achieved" },
        { Customer: "Cust 3", Lat: 34.0522, Long: -118.2437, Target_Acheived: 45000, Total_Target: 40000, Alert: "Target Overachieved" },
        { Customer: "Cust 4", Lat: 41.8781, Long: -87.6298, Target_Acheived: 20000, Total_Target: 25000, Alert: "Regulars not selling" },
        { Customer: "Cust 5", Lat: 29.7604, Long: -95.3698, Target_Acheived: 35000, Total_Target: 35000, Alert: "No Alert" },
    ];

    // Data State
    const [kpiData, setKpiData] = useState({
        total_target: 3000000,
        target_achieved: 2900000,
        top_outlets: [
            { name: "n1", target: 25000, achieved: "26000", comment: "Ahead on track" },
            { name: "n2", target: 28000, achieved: "32000", comment: "Ahead on track" },
            { name: "n3", target: 27000, achieved: "27700", comment: "Ahead on track" },
        ],
        top_geography: [
            { name: "g1", target: 25000, achieved: "26000", comment: "Ahead on track" },
            { name: "g2", target: 28000, achieved: "32000", comment: "Ahead on track" },
            { name: "g3", target: 27000, achieved: "27700", comment: "Ahead on track" },
        ],
    });

    const [goodPerformerData, setGoodPerformers] = useState([
        { name: "Acme Corp", "Forecasted Target": 5000, achieved: 5500, Alert: "Target Overachieved" },
        { name: "Globex", "Forecasted Target": 4000, achieved: 4200, Alert: "No Alert" },
    ]);
    const [badPerformanceData, setBadPerformanceData] = useState([
        { name: "Initech", "Forecasted Target": 6000, achieved: 4000, Alert: "Target Not achieved" },
    ]);
    const [outletData, setOutletData] = useState([
        { Customer: "Cust 1", Channel: "Retail", Target: 10000, Achieved: 12000, Status: "No Alert", E2E: "P1", E2S: "P2" },
        { Customer: "Cust 2", Channel: "Online", Target: 15000, Achieved: 14000, Status: "Target Not achieved", E2E: "P3", E2S: "P4" },
    ]);
    const [outletColumns, setOutletColumns] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [customerData, setCustomerData] = useState(mockCustomerData);
    const [goodProducts, setGoodProducts] = useState(["DSLR", "Lens"]);
    const [badProducts, setBadProducts] = useState(["Tripod", "Bag"]);

    const [outletKpi, setOutletKPI] = useState(kpiData.top_outlets);
    const [geoKpi, setGeoKpi] = useState(kpiData.top_geography);

    useEffect(() => {
        setOutletKPI(kpiData.top_outlets);
        setGeoKpi(kpiData.top_geography);
    }, [kpiData]);

    useEffect(() => {
        fetchData();
        fetchmapData();
        performersAPI();
        fetchtopBadProducts();
        outletAPI();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get("/alfred/kpis/");
            if (response.data) {
                setKpiData(response.data);
            }
        } catch (err) {
            console.error("KPI API Failed, using mock data", err);
        }
    };

    const fetchmapData = async () => {
        try {
            const response = await axiosInstance.get("/alfred/lat-long");
            if (response.data && Array.isArray(response.data)) {
                const mappedData = response.data.map(item => ({
                    ...item,
                    Customer: item["Sales Man"],
                    Target_Acheived: 0,
                    Total_Target: 0
                }));
                setCustomerData(mappedData);
            }
        } catch (err) {
            console.error("Map Data API Failed, using mock data", err);
        }
    };

    const fetchtopBadProducts = async () => {
        try {
            const response = await axiosInstance.get("/alfred/e2e-e2s");
            if (response.data) {
                setGoodProducts(response.data.e2e || []);
                setBadProducts(response.data.e2s || []);
            }
        } catch (err) {
            console.error("Products API Failed, using mock data", err);
        }
    };

    const performersAPI = async () => {
        try {
            const response = await axiosInstance.get("/alfred/performers");
            if (response.data) {
                const processPerformers = (arr) => {
                    return (Array.isArray(arr) ? arr : []).map(r => ({
                        name: r["Sales Man"] || r.Name || r.name,
                        "Forecasted Target": r["Total Target"] || r["Forecasted Target"],
                        achieved: r["Target Achieved"] || r["Total Achieved"] || r.achieved,
                        Alert: r.Alert
                    }));
                };

                if (response.data.good_performers) {
                    setGoodPerformers(processPerformers(response.data.good_performers));
                }
                if (response.data.bad_performers) {
                    setBadPerformanceData(processPerformers(response.data.bad_performers));
                }
            }
        } catch (err) {
            console.error("Performers API Failed, using mock data", err);
        }
    };

    const outletAPI = async () => {
        try {
            const response = await axiosInstance.get("/alfred/outlet-sales");
            if (response.data) {
                if (response.data.columns) setOutletColumns(response.data.columns);
                if (response.data.records) setOutletData(response.data.records);
            }
        } catch (err) {
            console.error("Outlet API Failed, using mock data", err);
        }
    };

    function formatNumber(number) {
        if (!number) return "0";
        if (number >= 1e9) return (number / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
        if (number >= 1e6) return (number / 1e6).toFixed(1).replace(/\.0$/, "") + "Mn";
        if (number >= 1e3) return (number / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
        return number.toString();
    }

    function calculatePercentage(target, achieved) {
        if (!target) return "";
        let percentage = ((achieved - target) / target) * 100;
        return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`;
    }



    const handleRowClick = (row) => {
        setRowData(row);
        setOpenPopup(true);
    };

    // Filter and Pagination Logic
    const filteredOutletData = (outletData || []).filter(row => {
        if (!searchTerm) return true;
        return Object.values(row).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredOutletData.length / itemsPerPage);
    const paginatedOutletData = filteredOutletData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] relative font-sans selection:bg-blue-100">
            {/* Sidebar Wrapper */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} fixed z-50 h-full`}>
                <SideBar />
            </div>

            {/* Main Content Wrapper */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? "pl-64" : "pl-16"} flex-1 w-full relative min-h-screen`}>

                <main className="max-w-[1600px] mx-auto p-8">
                    {/* Header Section (Styled like FilterHeader) */}
                    <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-heading">Sales Performance</h1>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                        <Filter size={16} />
                                        <span>Filters Applied</span>
                                    </div>


                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className="flex flex-wrap gap-2">
                                {['State', 'Area', 'Product', 'Customer', 'Time'].map((label, idx) => (
                                    <div key={idx} className="relative">
                                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200">
                                            <span className="text-sm font-medium text-blue-800">{label}</span>
                                            <ChevronDown size={14} className="text-blue-600" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 font-sans">
                        {/* Header Button Row */}
                        <div className="flex flex-row-reverse mb-4">
                            <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-[#333] rounded-md py-1.5 px-4 text-sm font-medium hover:bg-gray-50 shadow-sm">
                                <svg width="14" height="14" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.41225 11.25H1.875C0.841125 11.25 0 10.4089 0 9.375V1.875C0 0.841125 0.841125 0 1.875 0H4.85725C5.35806 0 5.82894 0.195031 6.18306 0.549188L6.88387 1.25H10.375C11.4089 1.25 12.25 2.09113 12.25 3.125V4.43781C12.25 4.783 11.9702 5.06281 11.625 5.06281C11.2798 5.06281 11 4.783 11 4.43781V3.125C11 2.78038 10.7196 2.5 10.375 2.5H6.625C6.45925 2.5 6.30025 2.43416 6.18306 2.31694L5.29919 1.43306C5.18113 1.315 5.02419 1.25 4.85725 1.25H1.875C1.53038 1.25 1.25 1.53038 1.25 1.875V9.375C1.25 9.71963 1.53038 10 1.875 10H4.41225C4.75744 10 5.03725 10.2798 5.03725 10.625C5.03725 10.9702 4.75744 11.25 4.41225 11.25Z" fill="#1B1A1C" />
                                    <path d="M6.625 15C6.27981 15 6 14.7202 6 14.375V12.5C6 10.0876 7.96263 8.125 10.375 8.125H11V7.5C11 6.81075 11.5608 6.25 12.25 6.25C12.5838 6.25 12.8977 6.37997 13.1338 6.616L15.6339 9.11609C15.87 9.35228 16 9.66616 16 10C16 10.3338 15.87 10.6477 15.634 10.8838L13.1339 13.3839C12.8977 13.62 12.5838 13.75 12.25 13.75C11.5608 13.75 11 13.1892 11 12.5V11.875H9.125C8.09113 11.875 7.25 12.7161 7.25 13.75V14.375C7.25 14.7202 6.97019 15 6.625 15ZM9.125 10.625H11.625C11.9702 10.625 12.25 10.9048 12.25 11.25V12.5L14.75 10L12.25 7.49997L12.25 8.75C12.25 9.09519 11.9702 9.375 11.625 9.375H10.375C9.19266 9.375 8.16163 10.0349 7.63088 11.0059C8.07497 10.7631 8.58422 10.625 9.125 10.625Z" fill="#1B1A1C" />
                                </svg>
                                Export
                            </button>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            {/* Top Row: KPIs */}
                            {/* Top Row: KPIs */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Forecast Sales Target */}
                                <div className="bg-gradient-to-br from-[#1E293B] to-[#334155] text-white rounded-2xl h-[260px] flex items-center p-6 relative shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 overflow-hidden group border border-gray-700/50">
                                    {/* Background decorative elements */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>

                                    <div className="w-[60%] z-10 flex flex-col justify-center h-full">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                                {imgUrl.targetIcon}
                                            </div>
                                            <h5 className="font-semibold text-base text-gray-200 tracking-wide uppercase">Forecast Target</h5>
                                        </div>

                                        <div className="mt-3 text-left">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-6xl tracking-tight text-white drop-shadow-sm">{formatNumber(kpiData?.total_target)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-lg font-medium text-gray-400">/ {formatNumber(kpiData?.target_achieved)}</span>
                                                <span className="text-sm text-gray-400 font-light">Target vs Achieved</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-[40%] flex flex-col items-center justify-center relative z-10 pl-4 border-l border-white/10">
                                        {/* Simple SVG Circular Progress */}
                                        <div className="relative w-24 h-24">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-600/50" />
                                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                    strokeDasharray={2 * Math.PI * 40}
                                                    strokeDashoffset={2 * Math.PI * 40 * (1 - (Math.min(kpiData?.target_achieved / kpiData?.total_target, 1) || 0))}
                                                    className="text-yellow-400 transition-all duration-1000 ease-out"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <span className="text-xl font-bold text-white">
                                                    {Math.round((kpiData?.target_achieved / kpiData?.total_target) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3 bg-green-500/20 text-green-300 px-3 py-1 rounded text-xs font-semibold border border-green-500/30">On Track</div>
                                    </div>
                                </div>

                                {/* Top Sales Channels */}
                                <div className="bg-white border border-gray-100/80 rounded-2xl h-[260px] flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] transform scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                        {imgUrl.salesIcon}
                                    </div>
                                    <div className="w-full p-5 flex flex-col h-full">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-sm ring-1 ring-blue-100">
                                                {imgUrl.salesIcon}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-lg text-gray-800 font-heading leading-tight">Top Channels</h5>
                                                <span className="text-xs text-gray-400 font-medium">By Volume</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between gap-3 overflow-y-auto custom-scrollbar pr-1">
                                            {(outletKpi || []).map((kpi, index) => {
                                                const isPositive = calculatePercentage(kpi.target, parseFloat(kpi.achieved)).includes('+');
                                                // Simplified List Layout
                                                return (
                                                    <div key={index} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/80 border border-gray-100 hover:bg-blue-50/50 hover:border-blue-100 transition-colors group/item">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-1.5 h-8 rounded-full ${isPositive ? 'bg-blue-500' : 'bg-orange-400'}`}></div>
                                                            <div>
                                                                <h6 className="text-[13px] font-bold text-gray-700">{kpi.name}</h6>
                                                                <div className="text-[11px] font-semibold text-gray-400">Target: {formatNumber(kpi.target)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-base font-extrabold text-gray-900">{formatNumber(kpi.achieved)}</div>
                                                            <span className={`text-[11px] font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                                {calculatePercentage(kpi.target, parseFloat(kpi.achieved))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Top Geographies */}
                                <div className="bg-white border border-gray-100/80 rounded-2xl h-[260px] flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] transform scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                        {imgUrl.geoIcons}
                                    </div>
                                    <div className="w-full p-5 flex flex-col h-full">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                                                {imgUrl.geoIcons}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-lg text-gray-800 font-heading leading-tight">Top Regions</h5>
                                                <span className="text-xs text-gray-400 font-medium">By Performance</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between gap-3 overflow-y-auto custom-scrollbar pr-1">
                                            {(geoKpi || []).map((kpi, index) => {
                                                const isPositive = calculatePercentage(kpi.target, parseFloat(kpi.achieved)).includes('+');
                                                // Simplified List Layout
                                                return (
                                                    <div key={index} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/80 border border-gray-100 hover:bg-indigo-50/50 hover:border-indigo-100 transition-colors group/item">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-1.5 h-8 rounded-full ${isPositive ? 'bg-indigo-500' : 'bg-rose-400'}`}></div>
                                                            <div>
                                                                <h6 className="text-[13px] font-bold text-gray-700">{kpi.name}</h6>
                                                                <div className="text-[11px] font-semibold text-gray-400">Target: {formatNumber(kpi.target)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-base font-extrabold text-gray-900">{formatNumber(kpi.achieved)}</div>
                                                            <span className={`text-[11px] font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                                {calculatePercentage(kpi.target, parseFloat(kpi.achieved))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Section */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                                {/* Map Section */}
                                <div className="md:col-span-5">
                                    <div className="border border-gray-200/60 bg-white rounded-2xl shadow-sm h-[544px] flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
                                        {/* Floating Header */}
                                        <div className="absolute top-0 left-0 w-full p-5 z-10 flex justify-between items-start pointer-events-none">
                                            <div>
                                                <h5 className="font-bold text-[16px] text-gray-800 font-heading bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-100/50 shadow-sm inline-block">Geography Wise Performance</h5>
                                            </div>
                                            {/* Live Data badge - optional, keeping it cleaner or moving it */}
                                            <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-emerald-600 border border-emerald-100 shadow-sm">
                                                LIVE
                                            </div>
                                        </div>

                                        {/* Full Height Map */}
                                        <div className="flex-1 w-full min-h-0 relative bg-gray-50/10">
                                            {customerData?.length >= 1 ? <CustomerMap customerData={customerData} /> : <div className="p-4 flex justify-center h-full items-center">{imgUrl.mapIcon}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Third Section: 4 Components in One Line */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Easy to Earn */}
                                <div className="h-[320px] border border-blue-100/50 bg-white rounded-2xl shadow-sm p-5 flex flex-col hover:shadow-lg transition-all duration-300 group">
                                    <div className="flex justify-between items-center mb-4">
                                        <h5 className="font-bold text-[15px] text-gray-900 font-heading">Easy to Earn</h5>
                                        <div className="bg-emerald-50 px-3 py-1.5 rounded-full flex items-center justify-center">
                                            <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 9C1 9 5 9 7 5C9 1 13 1 15 5C17 9 20 9 23 3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="h-full overflow-auto pr-1 custom-scrollbar space-y-3 snap-y snap-mandatory scroll-p-3">
                                        {goodProducts.map((product, index) => (
                                            <div key={index} className="w-full p-2.5 bg-[#F0FBFA] border border-emerald-100/50 rounded-xl flex items-center gap-3 cursor-pointer hover:border-emerald-200 hover:shadow-sm transition-all duration-200 snap-start">
                                                <div className="bg-white p-1.5 rounded-lg shadow-sm border border-emerald-50/50 shrink-0">
                                                    {imgUrl.dslrIcon}
                                                </div>
                                                <h6 className="font-semibold text-[13px] text-gray-700">{product}</h6>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Easy to Sell */}
                                <div className="h-[320px] border border-blue-100/50 bg-white rounded-2xl shadow-sm p-5 flex flex-col hover:shadow-lg transition-all duration-300 group">
                                    <div className="flex justify-between items-center mb-4">
                                        <h5 className="font-bold text-[15px] text-gray-900 font-heading">Easy to Sell</h5>
                                        <div className="bg-rose-50 px-3 py-1.5 rounded-full flex items-center justify-center">
                                            <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 9C1 9 5 9 7 5C9 1 13 1 15 5C17 9 20 9 23 3" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="h-full overflow-auto pr-1 custom-scrollbar space-y-3 snap-y snap-mandatory scroll-p-3">
                                        {badProducts.map((product, index) => (
                                            <div key={index} className="w-full p-2.5 bg-[#FFF1F2] border border-rose-100/50 rounded-xl flex items-center gap-3 cursor-pointer hover:border-rose-200 hover:shadow-sm transition-all duration-200 snap-start">
                                                <div className="bg-white p-1.5 rounded-lg shadow-sm border border-rose-50/50 shrink-0">
                                                    {imgUrl.p2pIcons}
                                                </div>
                                                <h6 className="font-semibold text-[13px] text-gray-700">{product}</h6>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Performing Customers Table */}
                                <div className="border border-gray-200 bg-white rounded-xl shadow-sm flex flex-col h-[320px] overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <h5 className="font-bold text-[15px] text-gray-900 text-left p-5 border-b border-gray-100 bg-white sticky top-0 font-heading">Top Performing Customers</h5>
                                    <div className="overflow-auto flex-1 custom-scrollbar">
                                        <table className="w-full text-left text-xs min-w-[300px]">
                                            <thead className="bg-white text-gray-400 font-semibold uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-gray-50">
                                                <tr>
                                                    <th className="p-3 pl-4 font-medium">Name</th>
                                                    <th className="p-3 font-medium text-right">Achieved</th>
                                                    <th className="p-3 font-medium text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50/50">
                                                {goodPerformerData.map((row, i) => (
                                                    <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                                        <td className="p-3 pl-4">
                                                            <span className="font-medium text-gray-900 text-[13px] block truncate max-w-[100px]" title={row.name}>{row.name}</span>
                                                        </td>
                                                        <td className="p-3 text-right">
                                                            <span className="font-bold text-base text-green-600 block">{formatNumber(row.achieved)}</span>
                                                            <span className="text-[10px] text-gray-400">/ {formatNumber(row["Forecasted Target"])}</span>
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <span className="bg-green-100 text-green-700 w-2 h-2 rounded-full inline-block" title={row.Alert || "Target Overachieved"}></span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Customers Not On Track */}
                                <div className="border border-gray-200 bg-white rounded-xl shadow-sm flex flex-col h-[320px] overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <h5 className="font-bold text-[15px] text-gray-900 text-left p-5 border-b border-gray-100 bg-white sticky top-0 font-heading">Customers Not On Track</h5>
                                    <div className="overflow-auto flex-1 custom-scrollbar">
                                        <table className="w-full text-left text-xs min-w-[300px]">
                                            <thead className="bg-white text-gray-400 font-semibold uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-gray-50">
                                                <tr>
                                                    <th className="p-3 pl-4 font-medium">Name</th>
                                                    <th className="p-3 font-medium text-right">Achieved</th>
                                                    <th className="p-3 font-medium text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50/50">
                                                {badPerformanceData.map((row, i) => (
                                                    <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                                        <td className="p-3 pl-4">
                                                            <span className="font-medium text-gray-900 text-[13px] block truncate max-w-[100px]" title={row.name}>{row.name}</span>
                                                        </td>
                                                        <td className="p-3 text-right">
                                                            <span className="font-bold text-base text-red-600 block">{formatNumber(row.achieved)}</span>
                                                            <span className="text-[10px] text-gray-400">/ {formatNumber(row["Forecasted Target"])}</span>
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <span className="bg-red-100 text-red-700 w-2 h-2 rounded-full inline-block" title={row.Alert || "Target Not Achieved"}></span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section: Sales By Outlet */}
                            <div className="mt-8 border border-gray-200 bg-white rounded-xl shadow-sm flex flex-col h-[500px] overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="p-5 flex justify-between items-center bg-white border-b border-gray-100">
                                    <div>
                                        <h5 className="font-bold text-[16px] text-gray-900 font-heading">Sales By Outlet</h5>
                                        <p className="text-gray-500 text-[11px] font-medium mt-1">Detailed performance breakdown by outlet</p>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search outlets..."
                                            className="border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 text-gray-700 bg-gray-50 transition-all placeholder:text-gray-400"
                                            value={searchTerm}
                                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                        />
                                    </div>
                                </div>

                                <div className="overflow-auto flex-1 p-0 custom-scrollbar">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-white sticky top-0 border-b border-gray-100 z-10 font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                                            <tr>
                                                {outletColumns.length > 0 ? (
                                                    outletColumns.map((col, i) => (
                                                        <th key={i} className="p-4 pl-6">{col.header}</th>
                                                    ))
                                                ) : (
                                                    // Fallback headers
                                                    <>
                                                        <th className="p-4 pl-6">Customer</th>
                                                        <th className="p-4">Channel</th>
                                                        <th className="p-4 text-right">Target</th>
                                                        <th className="p-4 text-right">Actuals</th>
                                                        <th className="p-4 text-center">E2E</th>
                                                        <th className="p-4">Status</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {paginatedOutletData.length > 0 ? (
                                                paginatedOutletData.map((row, i) => (
                                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                                        {outletColumns.length > 0 ? (
                                                            outletColumns.map((col, j) => {
                                                                const val = row[col.field];
                                                                if (col.field === 'Customer' || col.field === 'Sales Man') {
                                                                    return (
                                                                        <td key={j} className="p-4 pl-6">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${col.field === 'Customer' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                                                    {String(val).charAt(0)}
                                                                                </div>
                                                                                <span
                                                                                    className="text-gray-900 font-semibold cursor-pointer hover:text-blue-600 transition-colors text-[13px]"
                                                                                    onClick={() => handleRowClick(row)}
                                                                                >
                                                                                    {val}
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                    );
                                                                }
                                                                if (col.field === 'Alert' || col.field === 'Status') {
                                                                    const badgeClass =
                                                                        val === "Target Overachieved" || val === "No Alert" ? "bg-green-100 text-green-700" :
                                                                            val === "Regulars not selling" || val === "Target Not achieved" ? "bg-red-100 text-red-700" :
                                                                                "bg-orange-100 text-orange-700";
                                                                    return (
                                                                        <td key={j} className="p-4">
                                                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${badgeClass}`}>
                                                                                {val}
                                                                            </span>
                                                                        </td>
                                                                    );
                                                                }
                                                                return <td key={j} className="p-4 text-gray-600 font-medium text-[13px]">{val}</td>;
                                                            })
                                                        ) : (
                                                            <>
                                                                <td className="p-4 pl-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shadow-sm border border-blue-100/50">
                                                                            {row.Customer.charAt(0)}
                                                                        </div>
                                                                        <span className="text-gray-900 font-semibold cursor-pointer hover:text-blue-600 transition-colors text-[13px]" onClick={() => handleRowClick(row)}>{row.Customer}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-gray-600"><span className="text-[13px] font-medium">{row.Channel}</span></td>
                                                                <td className="p-4 text-right font-medium text-gray-500 text-[13px]">{row.Target.toLocaleString()}</td>
                                                                <td className="p-4 text-right font-bold text-gray-900 text-[13px]">{row.Achieved.toLocaleString()}</td>
                                                                <td className="p-4 text-center text-gray-500 text-[13px]">{row.E2E}</td>
                                                                <td className="p-4">
                                                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block min-w-[100px] text-center ${(row.Status === "No Alert" || row.Status === "Target Overachieved")
                                                                        ? "bg-green-50 text-green-700 border border-green-100" // Subtler green
                                                                        : "bg-red-50 text-red-700 border border-red-100" // Subtler red
                                                                        }`}>
                                                                        {row.Status || row.Alert}
                                                                    </span>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={outletColumns.length || 6} className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                                        <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        <span className="text-sm font-medium">No records found matching your search</span>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="p-4 border-t border-gray-100 bg-white flex justify-between items-center">
                                    <div className="text-xs text-gray-500">
                                        Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredOutletData.length)}</span> of <span className="font-medium text-gray-900">{filteredOutletData.length}</span> results
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
                                        >
                                            <ChevronDown className="rotate-90 w-4 h-4" />
                                        </button>
                                        <div className="flex gap-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let startPage = Math.max(1, currentPage - 2);
                                                let endPage = Math.min(totalPages, startPage + 4);
                                                if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

                                                const pageNum = startPage + i;
                                                if (pageNum > totalPages) return null;

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-all ${currentPage === pageNum
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
                                        >
                                            <ChevronDown className="-rotate-90 w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {openPopup && (
                        <div className="relative z-[100]">
                            <ViewDetailPopup
                                visible={openPopup}
                                closeAction={() => setOpenPopup(false)}
                                rowData={rowData}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SalesPerformance;
