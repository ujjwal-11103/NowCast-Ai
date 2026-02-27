import React, { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Calendar, DollarSign, Download, LineChart, Target, Play } from "lucide-react";
import NavBar from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";

import Plot from "react-plotly.js";
import "./plotly-custom.css";


const MarketMixModelling = () => {


    const [selectedFeature, setSelectedFeature] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [runSimulator, setRunSimulator] = useState(false);
    const [optimizeAllocate, setOptimizeAllocate] = useState(false);

    const [category, setCategory] = useState("Camera");
    const [channel, setChannel] = useState({});

    const [allocatedOptimal, setAllocatedOptimal] = useState(false);
    const [allocatedSimulated, setAllocatedSimulated] = useState(false);

    const [simulate, setSimulate] = useState({
        TV: 0,
        Digital: 0,
        Sponsorship: 0,
        product_mrp: 0,
    });

    const [simulateTV, setSimulateTV] = useState(0);
    const [simulateDigital, setSimulateDigital] = useState(0);
    const [simulateSponsorship, setSimulateSponsorship] = useState(0);
    const [simulateproduct_mrp, setSimulateproduct_mrp] = useState(0);


    // for second stage
    const [salesTarget, setSalesTarget] = useState(0);
    console.log("salesTarget:::", salesTarget);

    // get the data from the API using axios and store it in the state and this should be async
    const [allocatedBudgetData, setAllocatedBudgetData] = useState([]);
    const [loadingABD, setLoadingABD] = useState(true);
    const [errorABD, setErrorABD] = useState(null);

    // header data

    // Mock Data Constants
    const MOCK_ALLOCATED_BUDGET = {
        budget: {
            individual: [
                ["TV", 150],
                ["Digital", 120],
                ["Sponsorship", 80]
            ]
        },
        sales: "453Mn",
        "Base ROMI": 2.13
    };

    const MOCK_SIMULATED_DATA = {
        forecast: [120, 130, 140], // Example forecast values
        romi: 2.25
    };

    const MOCK_BAR_GRAPH_DATA = {
        fig_data: [
            {
                x: ["TV", "Digital", "Sponsorship"],
                y: [150, 120, 80],
                type: "bar",
                name: "Current Allocation",
                marker: { color: "#6366f1" }
            },
            {
                x: ["TV", "Digital", "Sponsorship"],
                y: [170, 140, 70],
                type: "bar",
                name: "Optimal Allocation",
                marker: { color: "#10b981" }
            }
        ],
        optimal_break_down: {
            TV: 170,
            Digital: 140,
            Sponsorship: 70
        },
        optimal_budget: 380000000
    };

    const MOCK_CURVE_GRAPH_DATA = {
        data: [
            {
                x: [100, 200, 300, 400, 500],
                y: [10, 25, 45, 60, 70],
                type: 'scatter',
                mode: 'lines',
                name: 'TV Response',
                line: { color: '#8b5cf6', width: 3 }
            },
            {
                x: [100, 200, 300, 400, 500],
                y: [15, 35, 50, 65, 75],
                type: 'scatter',
                mode: 'lines',
                name: 'Digital Response',
                line: { color: '#10b981', width: 3 }
            }
        ]
    };

    const MOCK_FORECAST_GRAPH_DATA = {
        data: [
            {
                x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                y: [40, 45, 30, 50, 60, 55, 70, 65, 80, 85, 90, 100],
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Actual Sales',
                line: { color: '#3b82f6', width: 3 },
                marker: { size: 6 }
            },
            {
                x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                y: [35, 40, 35, 45, 55, 60, 65, 70, 75, 80, 85, 95],
                type: 'scatter',
                mode: 'lines',
                name: 'Baseline Forecast',
                line: { color: '#f97316', width: 3, dash: 'dot' }
            }
        ]
    };

    const MOCK_SOS_GRAPH_DATA = [
        {
            x: ["TV", "Digital", "Sponsorship"],
            y: [40, 35, 25],
            type: "bar",
            name: "Share of Spends",
            marker: { color: "#64748b" }
        },
        {
            x: ["TV", "Digital", "Sponsorship"],
            y: [45, 40, 15],
            type: "bar",
            name: "Share of Effects",
            marker: { color: "#f97316" }
        }
    ];


    // State definitions restored
    const [simulatedData, setSimulatedData] = useState({});
    const [salesSimulatedData, setSalesSimulatedData] = useState(0);
    const [ROMISimulatedData, setROMISimulatedData] = useState(0);

    const [barGraphData, setBarGraphData] = useState([]);
    const [barGraphOptimalBudget, setBarGraphOptimalBudget] = useState(["--"]);
    const [optimalROMI, setOptimalROMI] = useState(["--"]);

    const [curveGraphData, setCurveGraphData] = useState([]);
    const [forecastGraphData, setForecastGraphData] = useState([]);
    const [sosGraphData, setSosGraphData] = useState([]);

    const [showAlert, setShowAlert] = useState(true);

    // Use Effects with Mock Data for extensive testing
    // header data
    useEffect(() => {
        // Mocking API call for Allocated Budget
        setAllocatedBudgetData(MOCK_ALLOCATED_BUDGET);
        setLoadingABD(false);
        setErrorABD(null); // Clear errors for mock mode
    }, [category]);

    useEffect(() => {
        setTimeout(() => {
            setShowAlert(false);
        }, 10000);
    }, []);


    // simulated Data
    useEffect(() => {
        if (runSimulator) { // Only update if simulator is "running" or just set default
            setSimulatedData(MOCK_SIMULATED_DATA);
        }
    }, [category, simulate, runSimulator]);

    // 1. Bar graph data
    useEffect(() => {
        // Mocking API call for Bar Graph
        setBarGraphData(MOCK_BAR_GRAPH_DATA);
    }, [salesTarget, simulate, category, allocatedOptimal]);

    // 2. curve graph
    useEffect(() => {
        const newChannel = {
            ...channel,
            Digital: {
                allocated:
                    MOCK_ALLOCATED_BUDGET.budget.individual.find(
                        (item) => item[0] === "Digital"
                    )?.[1] || 0,
                ...(simulate.Digital !== 0 && { simulated: simulate.Digital }),
                optimal: MOCK_BAR_GRAPH_DATA.optimal_break_down?.Digital,
            },
        };
        // Avoid infinite loop by checking JSON string equality or just setting it once if possible
        // For mock purposes, simplified logic:
        if (JSON.stringify(channel) !== JSON.stringify(newChannel)) {
            setChannel(newChannel);
        }

    }, [simulate.Digital]); // Reduced dependencies for mock stability

    useEffect(() => {
        // Mocking API call for Curve Graph
        setCurveGraphData(MOCK_CURVE_GRAPH_DATA);
    }, [simulate, channel]);

    // 3. scatter graph
    useEffect(() => {
        // Mocking API call for Forecast Plot
        setForecastGraphData(MOCK_FORECAST_GRAPH_DATA);
    }, [simulate, category, allocatedOptimal, allocatedSimulated]);


    // 4. Bar graph data (SOS vs SOE)
    useEffect(() => {
        // Mocking API call for SOS vs SOE
        setSosGraphData(MOCK_SOS_GRAPH_DATA);
    }, [simulate, channel]);


    // Channel update logic for interaction
    useEffect(() => {
        const newChannel = {
            ...channel,
        };
        if (MOCK_BAR_GRAPH_DATA.optimal_break_down?.TV && newChannel?.TV) {
            newChannel.TV.optimal = MOCK_BAR_GRAPH_DATA.optimal_break_down.TV;
        }
        if (MOCK_BAR_GRAPH_DATA.optimal_break_down?.Digital && newChannel?.Digital) {
            newChannel.Digital.optimal = MOCK_BAR_GRAPH_DATA.optimal_break_down.Digital;
        }
        if (MOCK_BAR_GRAPH_DATA.optimal_break_down?.Sponsorship && newChannel?.Sponsorship) {
            newChannel.Sponsorship.optimal = MOCK_BAR_GRAPH_DATA.optimal_break_down.Sponsorship;
        }
        // Only set if changed
        if (JSON.stringify(channel) !== JSON.stringify(newChannel)) {
            setChannel(newChannel);
        }
    }, [channel?.Digital, channel?.Sponsorship, channel?.TV]); // Removed MOCK_BAR_GRAPH_DATA dependency loop

    const buttonStyles = {
        fontSize: "12px",
        fontWeight: "600",
        padding: "10px 15px", // Uniform padding
        display: "flex",
        alignItems: "center",
        gap: "8px",
    };


    // plot bar width increment purpose
    const updatedGraphData = Array.isArray(barGraphData?.fig_data)
        ? barGraphData.fig_data.map((item) => ({
            ...item,
            width: 0.4, // Adjust this value to increase bar width
        }))
        : [];

    const updatedSosGraphData = Array.isArray(sosGraphData) ? sosGraphData.map((item) => ({
        ...item,
        width: 0.4, // Increased bar width
    })) : [];

    const handleSubmit = () => {
        console.log("Sales Target:", salesTarget);
        setOpen(false);
    };

    const handleAlert = () => {
        setShowAlert(false);
    };


    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans relative overflow-x-hidden text-slate-900">
            {/* Vibrant Light Weight Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-100/40 to-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-rose-100/30 to-amber-100/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-teal-100/30 rounded-full blur-[100px]" />
            </div>

            <main className="flex-1 p-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both max-w-[1600px] mx-auto w-full">

                {errorABD && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg z-10 relative">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    <span className="font-bold">Error:</span> Unable to fetch data. Please check your network connection or try again later.
                                    <br />
                                    <span className="text-xs text-red-500 font-mono mt-1 block">{errorABD.message}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Market Mix Modeling</h1>
                        <p className="text-slate-500 font-medium text-lg">Optimize your marketing spend for maximum ROI.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-slate-500 bg-white/50 px-3 py-1 rounded-full border border-slate-200/50 backdrop-blur-sm">
                            Last updated: Just now
                        </div>
                    </div>
                </div>

                {/* Alert */}
                {showAlert && (
                    <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 text-amber-900 px-6 py-4 flex justify-between items-start md:items-center mb-8 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-start md:items-center gap-4">
                            <div className="bg-amber-100 p-2 rounded-full flex-shrink-0 text-amber-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-amber-950">Optimization Recommendation</h4>
                                <p className="text-sm opacity-90 font-medium">
                                    Major drop in Camera sales detected. Optimization is recommended to recover forecast targets.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleAlert}
                            className="text-amber-700 hover:text-amber-900 transition-colors bg-amber-100/50 hover:bg-amber-200/50 p-2 rounded-xl"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                )}

                {/* Dialogue */}
                <Dialog open={open} onOpenChange={setOpen}>

                    <DialogContent className="font-[Montserrat] text-[16px]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">Set A Sales Target</DialogTitle>
                        </DialogHeader>

                        <div className="flex items-center space-x-2 bg-gray-200 rounded-md p-2 my-3">
                            <span className="text-xl font-medium">$</span>
                            <Input
                                placeholder="in Million"
                                className="bg-gray-100 text-xl"
                                onChange={(e) => setSalesTarget(e.target.value)}
                            />
                        </div>

                        <div className="text-right">
                            <Button
                                className="bg-[#FED71F] hover:bg-[#e6c40f] text-black text-sm font-normal px-6"
                                onClick={handleSubmit}
                            >
                                Continue
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Action Bar */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product Category</span>
                            <Select defaultValue="camera">
                                <SelectTrigger className="w-[180px] border-slate-200/60 bg-white/50 shadow-sm focus:ring-0 rounded-lg">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 shadow-lg">
                                    <SelectItem value="camera">Camera</SelectItem>
                                    <SelectItem value="smartphone">Smartphone</SelectItem>
                                    <SelectItem value="laptop">Laptop</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg" onClick={() => setOpen(true)}>
                            <Target className="mr-2 h-4 w-4" />
                            Optimize For Sales
                        </Button>

                        {!optimizeAllocate ? (
                            <Button variant="outline" className="border-slate-200 bg-white/80 hover:bg-white text-slate-700 rounded-lg" onClick={() => setOptimizeAllocate(true)}>
                                <LineChart className="mr-2 h-4 w-4" />
                                Optimize Budget
                            </Button>
                        ) : !runSimulator ? (
                            <Button
                                className="bg-[#FF6B00] hover:bg-[#e65a00] text-white border-none shadow-sm rounded-lg"
                                onClick={() => {
                                    setRunSimulator(true);
                                }}
                            >
                                <Play className="mr-2 w-4 h-4 fill-current" />
                                Run Simulator
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 font-bold text-sm mr-2 text-[#FF6B00]">
                                    <Play className="h-4 w-4 fill-current" />
                                    <span>Simulator On</span>
                                </div>

                                <Button
                                    size="sm"
                                    className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 h-7 px-3 text-xs rounded-lg"
                                    onClick={() => {
                                        setRunSimulator(false);
                                        setSimulate({ TV: 0, Digital: 0, Sponsorship: 0, product_mrp: 0 });
                                    }}
                                >
                                    <div className="rounded-full bg-[#FF6B00] p-0.5 w-3 h-3 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                                    </div>
                                    Stop
                                </Button>
                            </div>
                        )}
                        <Button variant="outline" className="border-slate-200 bg-white/80 hover:bg-white text-slate-700 rounded-lg">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Optimized View Banner */}
                {(optimizeAllocate || salesTarget) && (
                    <div className="flex justify-between items-center bg-indigo-50/80 backdrop-blur-sm border-l-4 border-indigo-500 p-4 mb-8 shadow-sm rounded-r-2xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-1.5 rounded-full text-indigo-600">
                                <LineChart className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-900 text-sm">Optimized Budget Mode</h4>
                                <p className="text-xs text-indigo-700">Displaying optimal allocation for maximum ROI.</p>
                            </div>
                        </div>
                        <button
                            className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors bg-white/80 px-4 py-2 rounded-lg shadow-sm border border-indigo-100 hover:shadow-md"
                            onClick={() => {
                                setOptimizeAllocate(false);
                                if (runSimulator) setRunSimulator(false);
                                setSalesTarget(0);
                                setOptimalROMI("--");
                                setAllocatedOptimal(false);
                                setAllocatedSimulated(false);
                            }}
                        >
                            <ArrowDownRight className="w-4 h-4 mr-2" />
                            Return to Baseline
                        </button>
                    </div>
                )}

                {/* Simulator Inputs */}
                {runSimulator && (
                    <div className="bg-white/80 backdrop-blur-sm p-6 mb-8 rounded-2xl border border-white/60 shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <span className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                    <Target className="w-5 h-5" />
                                </span>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Simulator Configuration</h4>
                                    <p className="text-xs text-slate-500">Adjust budget allocation to simulate outcomes</p>
                                </div>
                            </div>
                            <Button
                                className="bg-[#FF6B00] hover:bg-[#e65a00] text-white text-xs font-semibold px-6 shadow-md shadow-orange-100 rounded-lg"
                                onClick={() => {
                                    const newChannel = { ...channel };
                                    if (simulateTV !== 0 && newChannel.TV) newChannel.TV.simulated = simulateTV;
                                    if (simulateDigital !== 0 && newChannel.Digital) newChannel.Digital.simulated = simulateDigital;
                                    if (simulateSponsorship !== 0 && newChannel.Sponsorship) newChannel.Sponsorship.simulated = simulateSponsorship;
                                    setChannel(newChannel);

                                    setSimulate({
                                        TV: simulateTV,
                                        Digital: simulateDigital,
                                        Sponsorship: simulateSponsorship,
                                        product_mrp: simulateproduct_mrp,
                                    });

                                    const temp = (simulatedData.forecast?.[0] || 0) + (simulatedData.forecast?.[1] || 0) + (simulatedData.forecast?.[2] || 0);
                                    setSalesSimulatedData(temp);
                                    setROMISimulatedData(simulatedData.romi);
                                    setAllocatedSimulated(true);
                                }}
                            >
                                Run Simulation
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">TV Budget</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="pl-8 bg-slate-50/50 border-slate-200 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg"
                                        onChange={(e) => setSimulateTV(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Digital Budget</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="pl-8 bg-slate-50/50 border-slate-200 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg"
                                        onChange={(e) => setSimulateDigital(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sponsorship Budget</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="pl-8 bg-slate-50/50 border-slate-200 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg"
                                        onChange={(e) => setSimulateSponsorship(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Allocated Budget Card */}
                    <Card className="bg-blue-50/80 backdrop-blur-sm py-4 border border-blue-100/50 shadow-sm rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">ALLOCATED BUDGET</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-3xl font-extrabold text-slate-900">
                                        ${Math.round(
                                            (allocatedBudgetData?.budget?.individual?.reduce((a, b) => a + b[1], 0) || 0)
                                        )}Mn
                                    </h3>
                                    <p className="text-sm font-medium text-emerald-600 mt-1 flex items-center">+2.5% vs Last Month</p>
                                </div>
                                <div className="bg-white/80 p-2 rounded-xl shadow-sm">
                                    <DollarSign className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="border-t border-blue-200/50 mb-4" ></div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-slate-400">Current</p>
                                    <p className="font-bold text-slate-700">
                                        ${Math.round(
                                            (allocatedBudgetData?.budget?.individual?.reduce((a, b) => a + b[1], 0) || 0)
                                        )}Mn
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-slate-400">Target</p>
                                    <p className="font-bold text-slate-700">
                                        {barGraphData?.optimal_budget ? "$" + Math.floor(barGraphData.optimal_budget / 1000000) + "Mn" : "--"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-slate-400">Simulate</p>
                                    <p className="font-bold text-slate-700">
                                        {allocatedSimulated ? "$" + Math.round((simulatedData?.forecast?.reduce((a, b) => a + b, 0) || 0)) + "Mn" : "--"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales Card */}
                    <Card className="bg-white/80 backdrop-blur-sm py-4 border border-white/60 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">SALES</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-3xl font-extrabold text-slate-900">
                                        {allocatedBudgetData?.sales || "--"}
                                    </h3>
                                    <p className="text-sm font-medium text-emerald-600 mt-1">+15.3% YoY Growth</p>
                                </div>
                                <div className="bg-blue-50/50 p-2 rounded-xl">
                                    <ArrowUpRight className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="border-t border-slate-100 mb-4"></div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-slate-400">Current</p>
                                    <p className="font-bold text-slate-700">{allocatedBudgetData?.sales || "--"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-slate-400">Target</p>
                                    <p className="font-bold text-slate-700">{salesTarget > 0 ? salesTarget + "Mn" : "--"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-slate-400">Simulate</p>
                                    <p className="font-bold text-slate-700">
                                        {allocatedSimulated ? Math.round((simulatedData?.forecast?.reduce((a, b) => a + b, 0) || 0)) + "Mn" : "--"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ROMI Card */}
                    <Card className="bg-white/80 backdrop-blur-sm py-4 border border-white/60 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">ROMI</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-3xl font-extrabold text-slate-900">
                                        {allocatedBudgetData?.["Base ROMI"] || 2.13}
                                    </h3>
                                    <p className="text-sm font-medium text-rose-500 mt-1">-0.8% vs Target</p>
                                </div>
                                <div className="bg-blue-50/50 p-2 rounded-xl">
                                    <ArrowDownRight className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="border-t border-slate-100 mb-4"></div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-slate-400">Current</p>
                                    <p className="font-bold text-slate-700">{allocatedBudgetData?.["Base ROMI"] || "--"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-slate-400">Target</p>
                                    <p className="font-bold text-slate-700">2.5</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-slate-400">Simulate</p>
                                    <p className="font-bold text-slate-700">{allocatedSimulated ? (simulatedData?.romi || "--") : "--"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Calculated Budget Card (Shown only if salesTarget and optimal budget exist) */}
                    {salesTarget > 0 && barGraphData?.optimal_budget > 0 && (
                        <Card className="py-4 border-0 shadow-sm bg-gray-50/80 backdrop-blur-sm rounded-2xl">
                            <CardHeader>
                                <CardTitle className="text-md font-medium text-gray-600">CALCULATED BUDGET</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold">
                                    {Math.floor(barGraphData.optimal_budget / 1000000) + "Mn"}
                                </h3>
                            </CardContent>
                        </Card>
                    )}

                </div>

                {/* Plots */}
                {/* Plots */}
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {/* Forecast Plot */}
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold text-slate-800">Forecast Plot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-start items-center text-[10px] mb-4">
                                <div className="mx-2 flex items-center">
                                    <div className="w-[10px] h-[10px] bg-[#558fff] mx-2 rounded-sm"></div>
                                    <div>Actual Sales</div>
                                </div>

                                <div className="mx-2 flex items-center">
                                    <div className="w-[10px] h-[10px] bg-[#ff8b35] mx-2 rounded-sm"></div>
                                    <div>Baseline Forecast</div>
                                </div>
                            </div>
                            <div className="w-full h-[280px] flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-50/80 to-white/50 p-3">
                                <Plot
                                    data={forecastGraphData?.data || []}
                                    layout={{
                                        autosize: true,
                                        margin: { l: 45, r: 20, t: 10, b: 40 },
                                        xaxis: {
                                            showgrid: true,
                                            gridcolor: 'rgba(148, 163, 184, 0.1)',
                                            gridwidth: 1,
                                            title: {
                                                text: 'Month',
                                                font: { size: 10, color: '#64748b', family: 'Inter, sans-serif' }
                                            },
                                            tickfont: { size: 9, color: '#64748b' }
                                        },
                                        yaxis: {
                                            showgrid: true,
                                            gridcolor: 'rgba(148, 163, 184, 0.1)',
                                            gridwidth: 1,
                                            title: {
                                                text: 'Sales (Mn)',
                                                font: { size: 10, color: '#64748b', family: 'Inter, sans-serif' }
                                            },
                                            tickfont: { size: 9, color: '#64748b' }
                                        },
                                        showlegend: false,
                                        paper_bgcolor: 'rgba(0,0,0,0)',
                                        plot_bgcolor: 'rgba(0,0,0,0)',
                                        hovermode: 'x unified',
                                        hoverlabel: {
                                            bgcolor: 'white',
                                            bordercolor: '#e2e8f0',
                                            font: { size: 11, family: 'Inter, sans-serif' }
                                        }
                                    }}
                                    config={{
                                        displayModeBar: true,
                                        displaylogo: false,
                                        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d'],
                                        toImageButtonOptions: { filename: 'forecast_plot' }
                                    }}
                                    useResizeHandler
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Response Curve */}
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl">
                        <CardHeader className="">
                            <CardTitle className="text-lg font-bold text-slate-800">Response Curve</CardTitle>
                        </CardHeader>
                        <div className="mx-8 text-[10px] font-normal">
                            <h5 className="text-[14px] font-medium mb-1">Marketing Channels</h5>

                            <div className="flex justify-start items-center gap-2 flex-wrap mb-4">
                                {/* TV Checkbox */}
                                <div className="my-1">
                                    <input
                                        type="checkbox"
                                        id="btn-check-1-outlined"
                                        className="hidden peer"
                                        autoComplete="off"
                                        defaultChecked={channel.TV}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setChannel({
                                                    ...channel,
                                                    TV: {
                                                        allocated:
                                                            (allocatedBudgetData.budget.individual.find(
                                                                (item) => item[0] === "TV"
                                                            )?.[1] || 0) * 1e6,
                                                        ...(simulate.TV !== 0 && { simulated: simulate.TV }),
                                                        optimal: barGraphData.optimal_break_down.TV,
                                                    },
                                                });
                                            } else {
                                                const newChannel = { ...channel };
                                                if (Object.keys(newChannel).length > 0) {
                                                    delete newChannel.TV;
                                                }
                                                setChannel(newChannel);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="btn-check-1-outlined"
                                        className="cursor-pointer px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 peer-checked:bg-slate-800 peer-checked:text-white peer-checked:border-slate-800 text-xs font-medium transition-all"
                                    >
                                        TV
                                    </label>
                                </div>

                                {/* Digital Checkbox */}
                                <div className="my-1">
                                    <input
                                        type="checkbox"
                                        id="btn-check-2-outlined"
                                        className="hidden peer"
                                        autoComplete="off"
                                        checked={channel.Digital}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setChannel({
                                                    ...channel,
                                                    Digital: {
                                                        allocated:
                                                            (allocatedBudgetData.budget.individual.find(
                                                                (item) => item[0] === "Digital"
                                                            )?.[1] || 0) * 1e6,
                                                        ...(simulate.Digital !== 0 && { simulated: simulate.Digital }),
                                                        optimal: barGraphData.optimal_break_down.Digital,
                                                    },
                                                });
                                            } else {
                                                const newChannel = { ...channel };
                                                if (Object.keys(newChannel).length > 0) {
                                                    delete newChannel.Digital;
                                                }
                                                setChannel(newChannel);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="btn-check-2-outlined"
                                        className="cursor-pointer px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 peer-checked:bg-slate-800 peer-checked:text-white peer-checked:border-slate-800 text-xs font-medium transition-all"
                                    >
                                        Digital
                                    </label>
                                </div>

                                {/* Sponsorship Checkbox */}
                                <div className="my-1">
                                    <input
                                        type="checkbox"
                                        id="btn-check-3-outlined"
                                        className="hidden peer"
                                        autoComplete="off"
                                        defaultChecked={channel.Sponsorship}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setChannel({
                                                    ...channel,
                                                    Sponsorship: {
                                                        allocated:
                                                            (allocatedBudgetData.budget.individual.find(
                                                                (item) => item[0] === "Sponsorship"
                                                            )?.[1] || 0) * 1e6,
                                                        ...(simulate.Sponsorship !== 0 && {
                                                            simulated: simulate.Sponsorship,
                                                        }),
                                                        optimal: barGraphData.optimal_break_down.Sponsorship,
                                                    },
                                                });
                                            } else {
                                                const newChannel = { ...channel };
                                                if (Object.keys(newChannel).length > 0) {
                                                    delete newChannel.Sponsorship;
                                                }
                                                setChannel(newChannel);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="btn-check-3-outlined"
                                        className="cursor-pointer px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 peer-checked:bg-slate-800 peer-checked:text-white peer-checked:border-slate-800 text-xs font-medium transition-all"
                                    >
                                        Sponsorship
                                    </label>
                                </div>
                            </div>

                        </div>

                        <CardContent>

                            <div className="m-3 flex items-center text-[10px]">
                                <div className="mx-2 flex items-center">
                                    <div className="w-2.5 h-2.5 bg-[#558fff] mx-2 rounded-full"></div>
                                    <div>Allocated Budget</div>
                                </div>

                                <div className="mx-2 flex items-center">
                                    <div className="w-2.5 h-2.5 bg-green-500 mx-2 rounded-full"></div>
                                    <div>Sponsorship</div>
                                </div>

                                <div className="mx-2 flex items-center">
                                    <div className="w-2.5 h-2.5 bg-violet-500 mx-2 rounded-full"></div>
                                    <div>TV</div>
                                </div>
                            </div>

                            <div className="w-full h-[280px] flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-50/80 to-white/50 p-3">
                                <Plot
                                    data={curveGraphData?.data || []}
                                    layout={{
                                        autosize: true,
                                        margin: { l: 45, r: 20, t: 10, b: 40 },
                                        xaxis: {
                                            showgrid: true,
                                            gridcolor: 'rgba(148, 163, 184, 0.1)',
                                            gridwidth: 1,
                                            title: {
                                                text: 'Budget (Mn)',
                                                font: { size: 10, color: '#64748b', family: 'Inter, sans-serif' }
                                            },
                                            tickfont: { size: 9, color: '#64748b' }
                                        },
                                        yaxis: {
                                            showgrid: true,
                                            gridcolor: 'rgba(148, 163, 184, 0.1)',
                                            gridwidth: 1,
                                            title: {
                                                text: 'Sales Impact',
                                                font: { size: 10, color: '#64748b', family: 'Inter, sans-serif' }
                                            },
                                            tickfont: { size: 9, color: '#64748b' }
                                        },
                                        showlegend: false,
                                        paper_bgcolor: 'rgba(0,0,0,0)',
                                        plot_bgcolor: 'rgba(0,0,0,0)',
                                        hovermode: 'closest',
                                        hoverlabel: {
                                            bgcolor: 'white',
                                            bordercolor: '#e2e8f0',
                                            font: { size: 11, family: 'Inter, sans-serif' }
                                        }
                                    }}
                                    config={{
                                        displayModeBar: true,
                                        displaylogo: false,
                                        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d'],
                                        toImageButtonOptions: { filename: 'response_curve' }
                                    }}
                                    useResizeHandler
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Marketing Channels Wise Budget Allocated */}
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold text-slate-800">Marketing Channels Wise Budget Allocated</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-start items-center text-[10px] mb-4">
                                <div className="mx-2 flex items-center">
                                    <div className="w-[10px] h-[10px] bg-[#558fff] mx-2 rounded-sm"></div>
                                    <div>Marketing Channels</div>
                                </div>
                            </div>
                            <div className="w-full h-[280px] flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-50/80 to-white/50 p-3">
                                <Plot
                                    data={updatedGraphData}
                                    useResizeHandler
                                    style={{ width: "100%", height: "100%" }}
                                    layout={{
                                        autosize: true,
                                        margin: { l: 45, r: 20, t: 10, b: 40 },
                                        xaxis: {
                                            showgrid: false,
                                            title: {
                                                text: 'Marketing Channel',
                                                font: { size: 10, color: '#64748b', family: 'Inter, sans-serif' }
                                            },
                                            tickfont: { size: 9, color: '#64748b' }
                                        },
                                        yaxis: {
                                            showgrid: true,
                                            gridcolor: 'rgba(148, 163, 184, 0.1)',
                                            gridwidth: 1,
                                            title: {
                                                text: 'Budget (Mn)',
                                                font: { size: 10, color: '#64748b', family: 'Inter, sans-serif' }
                                            },
                                            tickfont: { size: 9, color: '#64748b' }
                                        },
                                        paper_bgcolor: 'rgba(0,0,0,0)',
                                        plot_bgcolor: 'rgba(0,0,0,0)',
                                        bargap: 0.3,
                                        hovermode: 'closest',
                                        hoverlabel: {
                                            bgcolor: 'white',
                                            bordercolor: '#e2e8f0',
                                            font: { size: 11, family: 'Inter, sans-serif' }
                                        }
                                    }}
                                    config={{
                                        displayModeBar: true,
                                        displaylogo: false,
                                        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d'],
                                        toImageButtonOptions: { filename: 'budget_allocation' }
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* SOS vs SOE */}
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold text-slate-800">SOS vs SOE</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="m-1 flex items-center text-[10px] mb-4">
                                <div className="mx-2 flex items-center">
                                    <div className="mx-2 w-[12px] h-[12px] bg-gray-600 border border-gray-600 rounded-full"></div>
                                    <div>Share of Spends</div>
                                </div>

                                <div className="mx-2 flex items-center">
                                    <div className="mx-2 w-[12px] h-[12px] bg-orange-500 border border-orange-500 rounded-full"></div>
                                    <div>Share of Effects</div>
                                </div>
                            </div>

                            <div className="w-full h-[280px] flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-50/80 to-white/50 p-3">
                                <Plot
                                    data={updatedSosGraphData}
                                    layout={{
                                        autosize: true,
                                        margin: { l: 45, r: 20, t: 10, b: 40 },
                                        xaxis: {
                                            showgrid: false,
                                            title: {
                                                text: 'Marketing Channel',
                                                font: { size: 10, color: '#64748b', family: 'Inter, sans-serif' }
                                            },
                                            tickfont: { size: 9, color: '#64748b' }
                                        },
                                        yaxis: {
                                            showgrid: true,
                                            gridcolor: 'rgba(148, 163, 184, 0.1)',
                                            gridwidth: 1,
                                            title: {
                                                text: 'Percentage (%)',
                                                font: { size: 10, color: '#64748b', family: 'Inter, sans-serif' }
                                            },
                                            tickfont: { size: 9, color: '#64748b' }
                                        },
                                        showlegend: false,
                                        barmode: 'group',
                                        bargap: 0.2,
                                        bargroupgap: 0.1,
                                        paper_bgcolor: 'rgba(0,0,0,0)',
                                        plot_bgcolor: 'rgba(0,0,0,0)',
                                        hovermode: 'closest',
                                        hoverlabel: {
                                            bgcolor: 'white',
                                            bordercolor: '#e2e8f0',
                                            font: { size: 11, family: 'Inter, sans-serif' }
                                        }
                                    }}
                                    config={{
                                        displayModeBar: true,
                                        displaylogo: false,
                                        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d'],
                                        toImageButtonOptions: { filename: 'sos_vs_soe' }
                                    }}
                                    useResizeHandler
                                    style={{ width: "100%", height: "100%" }}
                                />

                            </div>
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
};

export default MarketMixModelling;
