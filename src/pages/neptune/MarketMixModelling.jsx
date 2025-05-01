import React, { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Calendar, DollarSign, Download, LineChart, Target } from "lucide-react";
import NavBar from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";

import Plot from "react-plotly.js";


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


    // for second stage
    const [salesTarget, setSalesTarget] = useState(0);
    console.log("salesTarget:::", salesTarget);

    // get the data from the API using axios and store it in the state and this should be async
    const [allocatedBudgetData, setAllocatedBudgetData] = useState([]);
    const [loadingABD, setLoadingABD] = useState(true);
    const [errorABD, setErrorABD] = useState(null);

    // header data

    useEffect(() => {
        const fetchDataABD = async () => {
            try {
                const response = await axios.post(
                    "http://13.71.126.202:8082/neptune/allocated-budget/",
                    {
                        category: category,
                    }
                );
                setAllocatedBudgetData(response.data);
            } catch (error) {
                setErrorABD(error);
            }
            setLoadingABD(false);
        };
        fetchDataABD();
    }, [category]);


    // simulated Data
    const [simulatedData, setSimulatedData] = useState({});
    const [salesSimulatedData, setSalesSimulatedData] = useState(0);
    console.log(
        "simulatedData::::+++++++++++++++++",
        "Total",
        salesSimulatedData
    );
    const [ROMISimulatedData, setROMISimulatedData] = useState(0);

    useEffect(() => {
        const fetchSimulateData = async () => {
            try {
                const response = await axios.post(
                    "http://13.71.126.202:8082/neptune/simulate/",
                    {
                        category: category,
                        cols_to_update: {
                            TV: parseInt(simulate.TV),
                            Digital: parseInt(simulate.Digital),
                            Sponsorship: parseInt(simulate.Sponsorship),
                            product_mrp: parseInt(simulate.product_mrp),
                        },
                    }
                );
                setSimulatedData(response.data);
            } catch (error) {
                setErrorABD(error);
            }
            setLoadingABD(false);
        };
        fetchSimulateData();
    }, [category, simulate]);




    // 1. Bar graph data
    const [barGraphData, setBarGraphData] = useState([]);
    const [barGraphOptimalBudget, setBarGraphOptimalBudget] = useState(["--"]);
    const [optimalROMI, setOptimalROMI] = useState(["--"]);
    console.log("barGraphOptimalBudget", barGraphOptimalBudget);
    useEffect(() => {
        const fetchBarGraphData = async () => {
            try {
                const response = await axios.post(
                    "http://13.71.126.202:8082/neptune/optimal-budget-allocation/",
                    {
                        category: category,
                        optimal: allocatedOptimal,
                        simulated: allocatedSimulated ? simulate : false,
                        sales_target: +salesTarget * 1e6,
                    }
                );
                setBarGraphData(response.data);
            } catch (error) {
                setErrorABD(error);
            }
            setLoadingABD(false);
        };
        fetchBarGraphData();
    }, [salesTarget, simulate, category, allocatedOptimal]);

    console.log("barGraphData", barGraphData);

    // 2. curve graph
    const [curveGraphData, setCurveGraphData] = useState([]);
    // get the data for curveGraphData from the API using axios as a post method and store it in the state and this should be async ans it take request body

    useEffect(() => {
        const newChannel = {
            ...channel,
            Digital: {
                allocated:
                    allocatedBudgetData?.budget?.individual?.find(
                        (item) => item[0] === "Digital"
                    )?.[1] || 0,
                ...(simulate.Digital !== 0 && { simulated: simulate.Digital }),
                optimal: barGraphData?.optimal_break_down?.Digital,
            },
        };
        setChannel(newChannel);

        // setChannel({ ...channel, TV: {
        //   allocated: allocatedBudgetData.budget.individual.find((item) => item[0] === "TV")?.[1] || 0,
        //   simulated: simulate.TV,
        // } });
    }, [simulate.Digital, allocatedBudgetData?.budget?.individual, barGraphData]);

    useEffect(() => {
        const fetchDataCurveGraph = async () => {
            try {
                const response = await axios.post(
                    "http://13.71.126.202:8082/neptune/response-curve/",
                    {
                        category,
                        channel,
                    }
                );
                setCurveGraphData(response.data);
            } catch (error) {
                setErrorABD(error);
            }
            setLoadingABD(false);
        };
        fetchDataCurveGraph();
    }, [simulate, channel]);

    console.log("curveGraphData", curveGraphData);

    // 3. scatter graph
    const [forecastGraphData, setForecastGraphData] = useState([]);
    useEffect(() => {
        const fetchDataForecastPlot = async () => {
            try {
                const response = await axios.post(
                    "http://13.71.126.202:8082//neptune/forecast-plot/",
                    {
                        category: category,
                        ci: 0.95,
                        optimal: allocatedOptimal,
                        simulated: allocatedSimulated,
                        cols_to_update: {
                            TV: parseInt(simulate.TV),
                            Digital: parseInt(simulate.Digital),
                            Sponsorship: parseInt(simulate.Sponsorship),
                            product_mrp: parseInt(simulate.product_mrp),
                        },
                    }
                );
                setForecastGraphData(response.data);
            } catch (error) {
                setErrorABD(error);
            }
            setLoadingABD(false);
        };
        fetchDataForecastPlot();
    }, [simulate, category, allocatedOptimal, allocatedSimulated]);

    console.log("forecastGraphData", forecastGraphData);

    // if (loadingABD) return "Loading...";
    // if (errorABD) return "Error!";
    // console.log(allocatedBudgetData.sales);

    // const getSalesBaseline = (sales) => {
    //   if (sales) {
    //     const match = sales.match(/\d+/);
    //     return match ? match[0] : "0";
    //   }
    //   return "0";
    // };

    const baseROMI = allocatedBudgetData["Base ROMI"];

    const handleCollapse = () => {
        if (runSimulator) {
            setOpen(!open);
        }
    };




    // 4. Bar graph data


    const [sosGraphData, setSosGraphData] = useState([]);

    useEffect(() => {
        const fetchDataSOE = async () => {
            try {
                const response = await axios.get(
                    "http://13.71.126.202:8082/neptune/sos-soe/"
                );
                setSosGraphData(response.data);
            } catch (error) {
                setErrorABD(error);
            }
            setLoadingABD(false);
        };
        fetchDataSOE();
    }, [simulate, channel]);

    console.log("sosGraphData", sosGraphData);






    const [showAlert, setShowAlert] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setShowAlert(false);
        }, 10000);
    }, []);

    const handleAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        const newChannel = {
            ...channel,
        };
        // console.log("barGraphData.optimal_break_down", barGraphData.optimal_break_down);
        if (barGraphData.optimal_break_down?.TV && newChannel?.TV) {
            newChannel.TV.optimal = barGraphData.optimal_break_down.TV;
        }
        if (barGraphData.optimal_break_down?.Digital && newChannel?.Digital) {
            newChannel.Digital.optimal = barGraphData.optimal_break_down.Digital;
        }
        if (barGraphData.optimal_break_down?.Sponsorship && newChannel?.Sponsorship) {
            newChannel.Sponsorship.optimal = barGraphData.optimal_break_down.Sponsorship;
        }
        setChannel(newChannel);
    }, [barGraphData.optimal_break_down, channel?.Digital, channel?.Sponsorship, channel?.TV]);

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


    return (
        <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1 p-4 md:p-6">

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

                {/* first row */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Product Category:</span>
                            <Select defaultValue="camera">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="camera">Camera</SelectItem>
                                    <SelectItem value="smartphone">Smartphone</SelectItem>
                                    <SelectItem value="laptop">Laptop</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setOpen(true)}
                        >
                            <Target className="mr-2 h-4 w-4" />
                            Optimize For A Sales Target
                        </Button>
                        <Button variant="outline" className="border-gray-300">
                            <LineChart className="mr-2 h-4 w-4" />
                            Optimize Allocated Budget
                        </Button>
                        <Button variant="outline" className="border-gray-300">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Allocated Budget Card */}
                    <Card className="bg-blue-50 py-4">
                        <CardHeader>
                            <CardTitle className="text-md font-medium text-gray-600">ALLOCATED BUDGET</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-3xl font-bold">$212Mn</h3>
                                    <p className="text-sm text-green-600">+2.5% vs Last Month</p>
                                </div>
                                <div className="bg-white p-2 rounded-md">
                                    <DollarSign className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="border-1 mb-3" ></div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-500">Current</p>
                                    <p className="font-medium">$212Mn</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Target</p>
                                    <p className="font-medium">--</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Simulate</p>
                                    <p className="font-medium">--</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales Card */}
                    <Card className="py-4">
                        <CardHeader>
                            <CardTitle className="text-md font-medium text-gray-600">SALES</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-3xl font-bold">453Mn <span className="text-xs text-gray-500">(in USD)</span></h3>
                                    <p className="text-sm text-green-600">+15.3% YoY Growth</p>
                                </div>
                                <div className="bg-blue-50 p-2 rounded-md">
                                    <ArrowUpRight className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="border-1 mb-3"></div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-500">Current</p>
                                    <p className="font-medium">453Mn</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Target</p>
                                    <p className="font-medium">--</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Simulate</p>
                                    <p className="font-medium">--</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    {/* ROMI Card */}
                    <Card className="py-4">
                        <CardHeader>
                            <CardTitle className="text-md font-medium text-gray-600">ROMI</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-3xl font-bold">2.13</h3>
                                    <p className="text-sm text-red-600">-0.8% vs Target</p>
                                </div>
                                <div className="bg-blue-50 p-2 rounded-md">
                                    <ArrowDownRight className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="border-1 mb-3"></div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-500">Current</p>
                                    <p className="font-medium">2.13</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Target</p>
                                    <p className="font-medium">--</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Simulate</p>
                                    <p className="font-medium">--</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Plots */}
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {/* Forecast Plot */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Forecast Plot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-start items-center text-[10px]">
                                <div className="mx-2 flex items-center">
                                    <div className="w-[10px] h-[10px] bg-[#558fff] mx-2 rounded-sm"></div>
                                    <div>Actual Sales</div>
                                </div>

                                <div className="mx-2 flex items-center">
                                    <div className="w-[10px] h-[10px] bg-[#ff8b35] mx-2 rounded-sm"></div>
                                    <div>Baseline Forecast</div>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-center rounded-md border-gray-300 bg-gray-50">
                                <Plot
                                    data={forecastGraphData.data}
                                    layout={{
                                        xaxis: {
                                            showgrid: false, // Removes vertical grid lines
                                        },
                                        yaxis: {
                                            showgrid: false, // Removes horizontal grid lines
                                        },
                                        showlegend: false, // Disables the legend
                                    }}
                                    useResizeHandler
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Response Curve */}
                    <Card>
                        <CardHeader className="">
                            <CardTitle className="text-lg font-medium">Response Curve</CardTitle>
                        </CardHeader>
                        <div className="mx-8 text-[10px] font-normal">
                            <h5 className="text-[14px] font-medium mb-1">Marketing Channels</h5>

                            <div className="flex justify-start items-center gap-2 flex-wrap">
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
                                        className="cursor-pointer px-2 py-1 border border-gray-600 rounded text-gray-800 peer-checked:bg-gray-800 peer-checked:text-white text-[10px] font-medium"
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
                                        className="cursor-pointer px-2 py-1 border border-gray-600 rounded text-gray-800 peer-checked:bg-gray-800 peer-checked:text-white text-[10px] font-medium"
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
                                        className="cursor-pointer px-2 py-1 border border-gray-600 rounded text-gray-800 peer-checked:bg-gray-800 peer-checked:text-white text-[10px] font-medium"
                                    >
                                        Sponsorship
                                    </label>
                                </div>
                            </div>

                        </div>

                        <CardContent>

                            <div className="m-3 flex items-center text-[10px]">
                                <div className="mx-2 flex items-center">
                                    <div className="w-2.5 h-2.5 bg-[#558fff] mx-2"></div>
                                    <div>Allocated Budget</div>
                                </div>

                                <div className="mx-2 flex items-center">
                                    <div className="w-2.5 h-2.5 bg-green-500 mx-2"></div>
                                    <div>Sponsorship</div>
                                </div>

                                <div className="mx-2 flex items-center">
                                    <div className="w-2.5 h-2.5 bg-violet-500 mx-2"></div>
                                    <div>TV</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center rounded-md  border-gray-300 bg-gray-50">
                                <Plot
                                    data={curveGraphData.data}
                                    layout={{
                                        xaxis: {
                                            showgrid: false, // Removes vertical grid lines
                                        },
                                        yaxis: {
                                            showgrid: false, // Removes horizontal grid lines
                                        },
                                        showlegend: false, // Disables the legend
                                    }}
                                    useResizeHandler
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Marketing Channels Wise Budget Allocated */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Marketing Channels Wise Budget Allocated</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-start items-center text-[10px]">
                                <div className="mx-2 flex items-center">
                                    <div className="w-[10px] h-[10px] bg-[#558fff] mx-2 rounded-sm"></div>
                                    <div>Marketing Channels</div>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-center rounded-md border-gray-300 bg-gray-50">
                                <Plot
                                    data={updatedGraphData}
                                    useResizeHandler
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* SOS vs SOE */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">SOS vs SOE</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="m-1 flex items-center text-[10px]">
                                <div className="mx-2 flex items-center">
                                    <div className="mx-2 w-[12px] h-[12px] bg-gray-600 border border-gray-600"></div>
                                    <div>Share of Spends</div>
                                </div>

                                <div className="mx-2 flex items-center">
                                    <div className="mx-2 w-[12px] h-[12px] bg-orange-500 border border-orange-500"></div>
                                    <div>Share of Effects</div>
                                </div>
                            </div>

                            <div className="w-full flex items-center justify-center rounded-md border-gray-300 bg-gray-50">
                                <Plot
                                    data={updatedSosGraphData}
                                    layout={{
                                        showlegend: false, // Disables the legend
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
