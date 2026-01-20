import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { ChevronDown, Download, Settings, Target, Play, AlertTriangle, ArrowUp, ArrowDown, X } from "lucide-react";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import SideBar from "@/components/Sidebar/SideBar";

// --- Mock Data Generators (Simulating API) ---

const generateBarGraphData = (optimal, simulated, salesTarget) => {
    // Simulating /neptune/optimal-budget-allocation/
    return {
        optimal_budget: 212000000,
        optimal_break_down: { TV: 152000000, Digital: 45000000, Sponsorship: 15000000 },
        fig_data: [
            {
                x: ["TV", "Digital", "Sponsorship"],
                y: optimal ? [152, 45, 15] : [120, 30, 10], // Mock values in Millions
                type: "bar",
                name: "Allocated",
                marker: { color: "#0A2472" }
            },
            simulated ? {
                x: ["TV", "Digital", "Sponsorship"],
                y: [simulated.TV || 0, simulated.Digital || 0, simulated.Sponsorship || 0].map(v => (v ? v / 1000000 : 0)),
                type: "bar",
                name: "Simulated",
                marker: { color: "#FF6B00" }
            } : null
        ].filter(Boolean)
    };
};

const generateCurveData = (simulate) => {
    // Simulating /neptune/response-curve/
    const x = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
    const y = x.map(val => 100 * (1 - Math.exp(-0.05 * val))); // Saturation curve
    return {
        data: [{
            x: x,
            y: y,
            type: "scatter",
            mode: "lines",
            name: "Response Curve",
            line: { color: "#2E86C1" }
        }]
    };
};

const generateForecastData = (isSimulated, simulateValues) => {
    // Simulating /neptune/forecast-plot/
    const baseSales = [200, 210, 220, 230, 240, 250, 245, 255, 260, 270, 280, 290];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let currentSales = [...baseSales];

    // Apply "lift" if simulated
    if (isSimulated) {
        const lift = ((parseInt(simulateValues.TV) || 0) + (parseInt(simulateValues.Digital) || 0) + (parseInt(simulateValues.Sponsorship) || 0)) * 0.0001;
        currentSales = currentSales.map(v => v + lift);
    }

    return [
        {
            x: months,
            y: currentSales,
            type: "scatter",
            mode: "lines+markers",
            name: "Actual Sales",
            line: { color: "#4f46e5" }
        },
        {
            x: months,
            y: baseSales.map(v => v * 0.9), // Baseline slightly lower
            type: "scatter",
            mode: "lines",
            name: "Baseline",
            line: { color: "#f97316", dash: "dash" }
        }
    ];
};


const MarketMixModeling = () => {
    const { isSidebarOpen } = useSidebar();

    // State mirroring Neptune/index.jsx
    const [category, setCategory] = useState("Camera");
    const [alertVisible, setAlertVisible] = useState(true);

    const [modalShow, setModalShow] = useState(false);
    const [salesTarget, setSalesTarget] = useState(0);

    const [optimizeAllocate, setOptimizeAllocate] = useState(false);

    const [runSimulator, setRunSimulator] = useState(false);
    const [simulateValues, setSimulateValues] = useState({
        TV: 0,
        Digital: 0,
        Sponsorship: 0
    });

    const [barGraphData, setBarGraphData] = useState(null);
    const [curveGraphData, setCurveGraphData] = useState(null);
    const [forecastGraphData, setForecastGraphData] = useState(null);

    useEffect(() => {
        const isSimulated = runSimulator;
        const isOptimal = optimizeAllocate || salesTarget > 0;

        setBarGraphData(generateBarGraphData(isOptimal, isSimulated ? simulateValues : null, salesTarget));
        setCurveGraphData(generateCurveData(simulateValues));
        setForecastGraphData(generateForecastData(isSimulated, simulateValues));

    }, [category, optimizeAllocate, salesTarget, runSimulator, simulateValues]);


    const handleSimulateChange = (field, value) => {
        setSimulateValues(prev => ({ ...prev, [field]: value }));
    };

    const handleBackToBaseline = () => {
        setOptimizeAllocate(false);
        setSalesTarget(0);
    };

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

                        {/* Premium Header */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Market Mix Modeling</h1>
                                <p className="text-slate-500 font-medium text-lg">Optimize your marketing spend for maximum ROI.</p>
                            </div>
                            {/* Profile Dropdown Removed */}
                        </div>


                        {/* Main Content Area */}
                        <div>
                            {alertVisible && (
                                <div className="bg-[#FF6B00] text-white p-4 rounded-xl flex justify-between items-center mb-6 shadow-md hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#FED71F] p-2 rounded-full text-black">
                                            <AlertTriangle size={20} />
                                        </div>
                                        <span className="font-semibold text-sm">
                                            Major drop in {category} sales with lower forecasts than planned. Optimise now to get better results.
                                        </span>
                                    </div>
                                    <button onClick={() => setAlertVisible(false)} className="bg-white text-black rounded-full p-1.5 hover:bg-gray-100 transition">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}


                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                                    <label className="text-sm font-bold text-gray-700 ml-2">Product Category:</label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="appearance-none bg-gray-50 border-0 text-gray-700 py-1.5 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            <option value="Camera">Camera</option>
                                            <option value="CameraAccessory">Camera Accessory</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={() => setModalShow(true)}
                                        className="flex items-center gap-2 bg-[#0A2472] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-900 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                    >
                                        <Target size={16} /> Optimize For A Sales Target
                                    </button>

                                    {!optimizeAllocate ? (
                                        <button
                                            onClick={() => setOptimizeAllocate(true)}
                                            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <Settings size={16} /> Optimize Allocated Budget
                                        </button>
                                    ) : null}


                                    {!runSimulator ? (
                                        <button
                                            onClick={() => setRunSimulator(true)}
                                            className="flex items-center gap-2 bg-[#FF6B00] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#e66000] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                        >
                                            <Play size={16} /> Run Simulator
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1.5 border border-orange-200 shadow-sm">
                                            <div className="flex items-center gap-1 text-[#FF6B00] font-bold text-sm">
                                                <Play size={16} fill="#FF6B00" />
                                                Simulator On
                                            </div>
                                            <div className="h-6 w-px bg-gray-200 mx-2"></div>
                                            <button
                                                onClick={() => {
                                                    setRunSimulator(false);
                                                    setSimulateValues({ TV: 0, Digital: 0, Sponsorship: 0 });
                                                }}
                                                className="text-xs font-semibold hover:text-red-600 flex items-center gap-1 transition-colors"
                                            >
                                                <div className="bg-[#FF6B00] rounded-full p-0.5"><div className="bg-white w-1.5 h-1.5 rounded-full"></div></div>
                                                Stop
                                            </button>
                                        </div>
                                    )}

                                    <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
                                        <Download size={16} /> Export
                                    </button>
                                </div>
                            </div>


                            {(optimizeAllocate || salesTarget > 0) && (
                                <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 rounded-xl flex justify-between items-center mb-6 border border-gray-200 animate-in fade-in slide-in-from-top-2">
                                    <span className="text-sm font-bold text-gray-700 pl-2">You are now viewing the Optimized Budget</span>
                                    <button
                                        onClick={handleBackToBaseline}
                                        className="flex items-center gap-2 text-sm font-medium bg-white border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <span className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">←</span>
                                        Back to baseline view
                                    </button>
                                </div>
                            )}


                            {runSimulator && (
                                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm mb-8 border border-orange-100 ring-1 ring-orange-50 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-[#FF6B00] rounded-full"></div>
                                        Specify Budget For Different Channels
                                    </h4>
                                    <div className="flex flex-wrap gap-8">
                                        {["TV", "Digital", "Sponsorship"].map((channel) => (
                                            <div key={channel} className="flex flex-col gap-2">
                                                <div className="flex justify-between items-baseline min-w-[150px]">
                                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{channel}</span>
                                                </div>
                                                <div className="relative group">
                                                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium group-focus-within:text-blue-500 transition-colors">$</span>
                                                    <input
                                                        type="number"
                                                        value={simulateValues[channel] || ""}
                                                        onChange={(e) => handleSimulateChange(channel, e.target.value)}
                                                        className="pl-7 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm w-full focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-2xl"></div>
                                    <h6 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Allocated Budget</h6>
                                    <div className="text-3xl font-extrabold text-gray-900">
                                        ${((barGraphData?.optimal_budget || 212000000) / 1000000).toFixed(0)}Mn
                                    </div>
                                    <div className="text-xs font-medium text-emerald-600 mt-2 flex items-center bg-emerald-50 w-fit px-2 py-1 rounded-md">
                                        <ArrowUp size={12} className="mr-1" /> 12% vs last year
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl"></div>
                                    <h6 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Sales</h6>
                                    <div className="text-3xl font-extrabold text-gray-900">
                                        $453Mn
                                    </div>
                                    <div className="text-xs font-medium text-rose-500 mt-2 flex items-center bg-rose-50 w-fit px-2 py-1 rounded-md">
                                        <ArrowDown size={12} className="mr-1" /> 5% vs target
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 rounded-l-2xl"></div>
                                    <h6 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ROMI</h6>
                                    <div className="text-3xl font-extrabold text-gray-900">
                                        213.0%
                                    </div>
                                    <div className="text-xs font-medium text-gray-400 mt-2">Return on Marketing Investment</div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-2xl"></div>
                                    <h6 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Optimal Spend</h6>
                                    <div className="text-3xl font-extrabold text-gray-900">
                                        89%
                                    </div>
                                    <div className="text-xs font-medium text-gray-400 mt-2">Budget Utilization</div>
                                </div>
                            </div>


                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/60 flex flex-col">
                                    <h5 className="font-bold text-sm text-gray-800 mb-6 font-[Montserrat]">Optimal Budget Allocation</h5>
                                    <div className="flex-1 w-full min-h-0">
                                        {barGraphData && (
                                            <Plot
                                                data={barGraphData.fig_data}
                                                layout={{
                                                    barmode: "group",
                                                    autosize: true,
                                                    height: 300,
                                                    margin: { l: 40, r: 20, t: 20, b: 40 },
                                                    legend: { orientation: "h", y: -0.2 },
                                                    paper_bgcolor: 'rgba(0,0,0,0)',
                                                    plot_bgcolor: 'rgba(0,0,0,0)',
                                                    font: { family: 'Montserrat, sans-serif' }
                                                }}
                                                useResizeHandler={true}
                                                style={{ width: "100%", height: "100%" }}
                                                config={{ displayModeBar: false }}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/60 flex flex-col">
                                    <h5 className="font-bold text-sm text-gray-800 mb-6 font-[Montserrat]">Forecast vs Baseline</h5>
                                    <div className="flex-1 w-full min-h-0">
                                        {forecastGraphData && (
                                            <Plot
                                                data={forecastGraphData}
                                                layout={{
                                                    autosize: true,
                                                    height: 300,
                                                    margin: { l: 40, r: 20, t: 20, b: 40 },
                                                    legend: { orientation: "h", y: -0.2 },
                                                    paper_bgcolor: 'rgba(0,0,0,0)',
                                                    plot_bgcolor: 'rgba(0,0,0,0)',
                                                    font: { family: 'Montserrat, sans-serif' }
                                                }}
                                                useResizeHandler={true}
                                                style={{ width: "100%", height: "100%" }}
                                                config={{ displayModeBar: false }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/60 flex flex-col">
                                    <h5 className="font-bold text-sm text-gray-800 mb-6 font-[Montserrat]">Response Curve</h5>
                                    <div className="flex-1 w-full min-h-0">
                                        {curveGraphData && (
                                            <Plot
                                                data={curveGraphData.data}
                                                layout={{
                                                    autosize: true,
                                                    height: 300,
                                                    margin: { l: 40, r: 20, t: 20, b: 40 },
                                                    paper_bgcolor: 'rgba(0,0,0,0)',
                                                    plot_bgcolor: 'rgba(0,0,0,0)',
                                                    font: { family: 'Montserrat, sans-serif' }
                                                }}
                                                useResizeHandler={true}
                                                style={{ width: "100%", height: "100%" }}
                                                config={{ displayModeBar: false }}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/60 flex flex-col">
                                    <h5 className="font-bold text-sm text-gray-800 mb-6 font-[Montserrat]">Source of Sales (SOS)</h5>
                                    <div className="flex flex-1 items-center justify-center h-[300px] text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-300">
                                        <div className="text-center">
                                            <div className="mb-2 text-3xl font-light">📊</div>
                                            <span>Chart Placeholder (SOS Data)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                {modalShow && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-2xl shadow-2xl w-96 p-8 transform scale-100 transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-gray-900">Set A Sales Target</h3>
                                <button onClick={() => setModalShow(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex items-center mb-8 relative">
                                <span className="absolute left-0 top-0 bottom-0 bg-gray-100 px-4 flex items-center justify-center text-lg font-bold text-gray-500 rounded-l-lg border border-r-0 border-gray-200">$</span>
                                <input
                                    type="number"
                                    placeholder="Amount in Million"
                                    className="pl-14 pr-4 py-3 bg-white border border-gray-200 text-lg w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={(e) => setSalesTarget(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        setOptimizeAllocate(false);
                                        setModalShow(false);
                                    }}
                                    className="bg-[#FED71F] text-black font-bold text-sm px-8 py-3 rounded-full hover:bg-yellow-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketMixModeling;
