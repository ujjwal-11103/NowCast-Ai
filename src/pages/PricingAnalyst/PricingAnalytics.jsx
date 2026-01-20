
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { ChevronDown, Download, Settings, Target, Play, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import SideBar from "@/components/Sidebar/SideBar";

import APLData from "../../assets/data/pricing/AP_L_L.json";
import MHC from '../../assets/data/pricing/MH_C_L.json'
import TNO from '../../assets/data/pricing/TN_O_L.json'

const userImage = "https://github.com/shadcn.png";

const PricingAnalytics = () => {
    const { isSidebarOpen } = useSidebar();

    // State
    const [state, setState] = useState("Amazon");
    const [brand, setBrand] = useState("ON Whey");
    const [sku, setSku] = useState("Gold Standard");

    // Derived State Logic
    const [loessData, setLoessData] = useState([
        { label: "Upper", value: "1.059" },
        { label: "Lower", value: "0.904" },
    ]);

    const stateValues = {
        Haryana: { upper: "1.059", lower: "0.904" },
        Delhi: { upper: "1.255", lower: "0.994" },
        "Uttar Pradesh": { upper: "1.269", lower: "1.200" },
    };

    useEffect(() => {
        if (stateValues[state]) {
            setLoessData([
                { label: "Upper", value: stateValues[state].upper },
                { label: "Lower", value: stateValues[state].lower },
            ]);
        }
    }, [state]);

    const [newSimulatedRPI, setNewSimulatedRPI] = useState("");
    const [msData, setMsData] = useState({ MS_VOL: "", MS_VAL: "" });

    const [metricsData, setMetricsData] = useState([
        {
            label: "Current",
            cintholPPG: "599",
            santoorPPG: "589",
            rpi: "0.97",
            msVol: "4.5%",
            msVal: "3.9%",
        },
        {
            label: "Simulated",
            cintholPPG: "599",
            santoorPPG: "589",
            rpi: newSimulatedRPI,
            msVol: "520",
            msVal: "7800",
        },
    ]);

    useEffect(() => {
        setMetricsData((prevData) =>
            prevData.map((item) =>
                item.label === "Simulated" ? { ...item, rpi: newSimulatedRPI } : item
            )
        );
    }, [newSimulatedRPI]);

    const handleInputChange = (e, field) => {
        const newValue = e.target.value;
        setMetricsData((prevData) =>
            prevData.map((row) =>
                row.label === "Simulated" ? { ...row, [field]: newValue } : row
            )
        );
    };

    // Calculation Effect
    useEffect(() => {
        const simulatedRow = metricsData.find((row) => row.label === "Simulated");
        if (!simulatedRow) return;

        const cinthol = parseFloat(simulatedRow.cintholPPG);
        const santoor = parseFloat(simulatedRow.santoorPPG);
        let calculatedRPI = santoor !== 0 ? (cinthol / santoor).toFixed(3) : "0";

        const upperLimit = parseFloat(loessData.find((item) => item.label === "Upper").value);
        const lowerLimit = parseFloat(loessData.find((item) => item.label === "Lower").value);

        if (parseFloat(calculatedRPI) > upperLimit || parseFloat(calculatedRPI) < lowerLimit) {
            // calculatedRPI = `Out of Bound(${calculatedRPI})`; // Simplified for UI
        }

        setNewSimulatedRPI((prev) => (prev !== calculatedRPI ? calculatedRPI : prev));

        // Updating MS Data based on new RPI
        const parsedRPI = parseFloat(calculatedRPI);
        if (!isNaN(parsedRPI)) {
            const matchedData = APLData.find((d) => d.RPI === parsedRPI);
            if (matchedData) {
                setMsData((prev) =>
                    prev.MS_VOL !== matchedData.MS_VOL || prev.MS_VAL !== matchedData.MS_VAL
                        ? { MS_VOL: matchedData.MS_VOL, MS_VAL: matchedData.MS_VAL }
                        : prev
                );
            } else {
                setMsData({ MS_VOL: "", MS_VAL: "" });
            }
        } else {
            setMsData({ MS_VOL: "", MS_VAL: "" });
        }
    }, [metricsData, loessData]);

    useEffect(() => {
        if (msData.MS_VOL && msData.MS_VAL) {
            setMetricsData((prevMetricsData) => {
                return prevMetricsData.map((item) =>
                    item.label === "Simulated"
                        ? {
                            ...item,
                            msVol: `${(parseFloat(msData.MS_VOL) * 100).toFixed(2)}%`,
                            msVal: `${(parseFloat(msData.MS_VAL) * 100).toFixed(2)}%`,
                        }
                        : item
                );
            });
        }
    }, [msData]);

    const rpiValues = APLData.map((d) => d.RPI);
    const msVolValues = APLData.map((d) => d.MS_VOL);
    const msValValues = APLData.map((d) => d.MS_VAL);
    const deepDiveData = APLData.slice(0, 50).map((d) => ({
        RPI: parseFloat(d.RPI).toFixed(2),
        msVal: parseFloat(d.MS_VAL).toFixed(2),
        msVol: parseFloat(d.MS_VOL).toFixed(2),
    }));


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
                                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Pricing Analytics</h1>
                                <p className="text-slate-500 font-medium text-lg">Deep dive into pricing strategies and market impact.</p>
                            </div>
                            {/* Profile Dropdown Removed */}
                        </div>

                        {/* Main Content Area */}
                        <div>
                            {/* Top Section */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                                {/* Model Highlights Card */}
                                <div className="bg-[#FED71F] rounded-2xl shadow-sm p-5 w-full md:w-1/3 border border-yellow-300">
                                    <h5 className="font-bold text-lg mb-3 text-slate-900">Model Highlights</h5>
                                    <div className="bg-yellow-400/50 rounded-xl p-3 flex gap-4 text-sm text-slate-800 border border-yellow-400">
                                        <div>Accuracy: <strong>87%</strong></div>
                                        <div>Baseline: <strong>4.99</strong></div>
                                        <div>Competition: <strong>Product 2</strong></div>
                                    </div>
                                </div>

                                {/* Dropdowns */}
                                <div className="flex flex-wrap gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
                                    <div className="flex flex-col gap-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Select Channel</label>
                                        <select
                                            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium hover:bg-gray-50 transition-colors w-full min-w-[160px]"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                        >
                                            <option value="Amazon">Amazon</option>
                                            <option value="Flipkart">Flipkart</option>
                                            <option value="Haryana">Haryana</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Select Brand</label>
                                        <select
                                            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium hover:bg-gray-50 transition-colors w-full min-w-[160px]"
                                            value={brand}
                                            onChange={(e) => setBrand(e.target.value)}
                                        >
                                            <option value="ON Whey">ON Whey</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Select SKU</label>
                                        <select
                                            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium hover:bg-gray-50 transition-colors w-full min-w-[160px]"
                                            value={sku}
                                            onChange={(e) => setSku(e.target.value)}
                                        >
                                            <option value="Gold Standard">Gold Standard</option>
                                            <option value="Isolate">Isolate</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Table */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-lg text-gray-800 mb-4">Metrics Overview</h5>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                                <th className="p-3 rounded-l-lg">Status</th>
                                                <th className="p-3">Product 1 Price</th>
                                                <th className="p-3">Product 2 Price</th>
                                                <th className="p-3">RPI Monitor</th>
                                                <th className="p-3">MS Vol</th>
                                                <th className="p-3 rounded-r-lg">MS Val</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {metricsData.map((row, index) => (
                                                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-4 font-bold text-gray-700">{row.label}</td>
                                                    <td className="p-4">
                                                        {row.label === "Simulated" ? (
                                                            <input
                                                                type="text"
                                                                value={row.cintholPPG}
                                                                onChange={(e) => handleInputChange(e, "cintholPPG")}
                                                                className="border border-gray-200 rounded-md px-3 py-1.5 w-24 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                            />
                                                        ) : <span className="text-gray-600 font-medium">{row.cintholPPG}</span>}
                                                    </td>
                                                    <td className="p-4">
                                                        {row.label === "Simulated" ? (
                                                            <input
                                                                type="text"
                                                                value={row.santoorPPG}
                                                                onChange={(e) => handleInputChange(e, "santoorPPG")}
                                                                className="border border-gray-200 rounded-md px-3 py-1.5 w-24 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                            />
                                                        ) : <span className="text-gray-600 font-medium">{row.santoorPPG}</span>}
                                                    </td>
                                                    <td className="p-4 font-mono text-gray-600">{row.rpi}</td>
                                                    <td className="p-4 font-mono text-gray-600">{row.msVol}</td>
                                                    <td className="p-4 font-mono text-gray-600">{row.msVal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Charts & Stats */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                                {/* Chart */}
                                <div className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-6 flex flex-col">
                                    <h5 className="font-bold text-lg text-gray-800 mb-6 font-[Montserrat]">RPI vs Market Share</h5>
                                    <div className="flex-1 w-full min-h-0">
                                        <Plot
                                            data={[
                                                {
                                                    x: rpiValues,
                                                    y: msVolValues,
                                                    type: "scatter",
                                                    mode: "lines",
                                                    name: "MS VOL",
                                                    line: { color: "#3B82F6", width: 3 },
                                                    yaxis: "y1"
                                                },
                                                {
                                                    x: rpiValues,
                                                    y: msValValues,
                                                    type: "scatter",
                                                    mode: "lines",
                                                    name: "MS VAL",
                                                    line: { color: "#EF4444", width: 3 },
                                                    yaxis: "y2"
                                                }
                                            ]}
                                            layout={{
                                                height: 400,
                                                autosize: true,
                                                xaxis: { title: "RPI", gridcolor: "#f3f4f6" },
                                                yaxis: {
                                                    title: "MS VOL",
                                                    titlefont: { color: "#3B82F6" },
                                                    tickfont: { color: "#3B82F6" },
                                                    gridcolor: "#f3f4f6"
                                                },
                                                yaxis2: {
                                                    title: "MS VAL",
                                                    titlefont: { color: "#EF4444" },
                                                    tickfont: { color: "#EF4444" },
                                                    overlaying: "y",
                                                    side: "right"
                                                },
                                                showlegend: true,
                                                legend: { orientation: "h", y: 1.1 },
                                                margin: { t: 20, l: 60, r: 60, b: 50 },
                                                paper_bgcolor: 'rgba(0,0,0,0)',
                                                plot_bgcolor: 'rgba(0,0,0,0)',
                                                font: { family: 'Montserrat, sans-serif' },
                                                shapes: [
                                                    {
                                                        type: "line",
                                                        x0: newSimulatedRPI,
                                                        x1: newSimulatedRPI,
                                                        y0: 0,
                                                        y1: 1,
                                                        yref: "paper",
                                                        line: { color: "#6366f1", width: 2, dash: "dot" }
                                                    }
                                                ]
                                            }}
                                            useResizeHandler={true}
                                            style={{ width: "100%", height: "100%" }}
                                            config={{ displayModeBar: false }}
                                        />
                                    </div>
                                </div>

                                {/* Stat Cards */}
                                <div className="flex flex-col gap-4">
                                    <StatCard label="Current Market Share" value="3.9%" color="#3B82F6" />
                                    <StatCard label="Simulated Market Share" value={`${(parseFloat(msData.MS_VAL) * 100).toFixed(1)}%`} color="#64748B" />
                                    <StatCard
                                        label="Projected Uplift"
                                        value={`${((parseFloat(msData.MS_VAL) - 0.039) * 100).toFixed(1) < 0
                                            ? ((parseFloat(msData.MS_VAL) - 0.039) * 100).toFixed(1)
                                            : Math.abs(((parseFloat(msData.MS_VAL) - 0.039) * 100).toFixed(1))
                                            }%`}
                                        color={
                                            ((parseFloat(msData.MS_VAL) - 0.039) * 100).toFixed(1) < 0
                                                ? "#EF4444"  // Red
                                                : ((parseFloat(msData.MS_VAL) - 0.039) * 100).toFixed(1) > 0
                                                    ? "#10B981" // Green
                                                    : "#0F172A"
                                        }
                                    />
                                </div>
                            </div>

                            {/* Deep Dive Table */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h5 className="font-bold text-lg text-gray-800 mb-4">Deep Dive Analysis</h5>
                                <div className="overflow-x-auto max-h-96 custom-scrollbar">
                                    <table className="w-full text-center border-collapse text-sm">
                                        <thead className="bg-gray-50 sticky top-0 z-10 text-gray-500 uppercase text-xs tracking-wider">
                                            <tr>
                                                <th className="p-3 border-b border-gray-200">RPI</th>
                                                <th className="p-3 border-b border-gray-200">MS VAL</th>
                                                <th className="p-3 border-b border-gray-200">MS VOL</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {deepDiveData.map((row, i) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-3 text-gray-700">{row.RPI}</td>
                                                    <td className="p-3 text-gray-700">{row.msVal}</td>
                                                    <td className="p-3 text-gray-700">{row.msVol}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, color }) => (
    <div className="text-white p-4 rounded shadow-md text-center" style={{ backgroundColor: color }}>
        <p className="text-sm opacity-90">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);

export default PricingAnalytics;
