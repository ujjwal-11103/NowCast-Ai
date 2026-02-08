import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Plot from "react-plotly.js";
import { Select } from "antd";
import { ArrowDownRight, Download, Play, ArrowRight, ArrowUpRight, DollarSign, Settings, Target } from "lucide-react";
import axios from "axios";
import "./style.css";

function MyVerticallyCenteredModal(props) {
  const { sendDataToParent, show, onHide } = props;
  const [salesTargetChild, setSalesTargetChild] = useState(0);

  const handleSubmit = () => {
    sendDataToParent(salesTargetChild);
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity cursor-pointer"
        onClick={onHide}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden w-full max-w-lg z-10 animate-in fade-in zoom-in duration-200">
        <div className="p-6 font-[Montserrat]">
          <h4 className="text-base font-semibold text-slate-900 mb-4">Set A Sales Target</h4>

          <div className="flex items-center bg-white border border-slate-300 rounded-md px-3 py-2 mb-6 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
            <span className="text-base font-medium text-slate-400 mr-1">$</span>
            <input
              type="number"
              placeholder="in Million"
              className="flex-1 bg-transparent border-none outline-none text-base font-normal text-slate-700 placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) => setSalesTargetChild(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                handleSubmit();
                onHide();
              }}
              className="px-6 py-1.5 bg-[#FED71F] hover:bg-[#FCD34D] text-slate-900 font-semibold rounded-md transition-all shadow-sm hover:shadow active:scale-95 text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

const Neptune = () => {
  const [selectedFeature, setSelectedFeature] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [runSimulator, setRunSimulator] = useState(false);
  const [optimizeAllocate, setOptimizeAllocate] = useState(false);

  const [category, setCategory] = useState("Camera");
  const [channel, setChannel] = useState({
    TV: { allocated: 0 },
    Digital: { allocated: 0 },
    Sponsorship: { allocated: 0 },
  });

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

  // const [chatbot, setChatbot] = useState(0);
  // useEffect(() => {
  //   const fetchDataABD = async () => {
  //     try {
  //       const response = await axios.post("http://13.71.126.202:8181/chatbot", {
  //         user: "How has my company been performing in the last quarter?",
  //       });
  //       setChatbot(response.data);
  //     } catch (error) {
  //       setErrorABD(error);
  //     }
  //     setLoadingABD(false);
  //   };
  //   fetchDataABD();
  // }, []);

  // console.log("chatbot", chatbot);

  // const val = fetch('http://13.71.126.202:8081/chatbot/', {
  //   method: 'POST',
  //   headers: {
  //       'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //       user: "How has my company been performing in the last quarter?"
  //   })
  // })
  // .then(response => response.json())
  // .then(data => console.log(data))
  // .catch(error => console.error('Error:', error));

  // console.log("val", val);

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
      TV: {
        allocated:
          (allocatedBudgetData?.budget?.individual?.find(
            (item) => item[0] === "TV"
          )?.[1] || 0) * 1e6,
        ...(simulate.TV !== 0 && { simulated: simulate.TV }),
        optimal: barGraphData?.optimal_break_down?.TV,
      },
      Digital: {
        allocated:
          (allocatedBudgetData?.budget?.individual?.find(
            (item) => item[0] === "Digital"
          )?.[1] || 0) * 1e6,
        ...(simulate.Digital !== 0 && { simulated: simulate.Digital }),
        optimal: barGraphData?.optimal_break_down?.Digital,
      },
      Sponsorship: {
        allocated:
          (allocatedBudgetData?.budget?.individual?.find(
            (item) => item[0] === "Sponsorship"
          )?.[1] || 0) * 1e6,
        ...(simulate.Sponsorship !== 0 && { simulated: simulate.Sponsorship }),
        optimal: barGraphData?.optimal_break_down?.Sponsorship,
      },
    };
    setChannel(newChannel);
  }, [
    simulate.TV,
    simulate.Digital,
    simulate.Sponsorship,
    allocatedBudgetData?.budget?.individual,
    barGraphData,
  ]);

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






  const [showAlert, setShowAlert] = useState(false);
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


  // ---


  return (
    <div className="flex-1 bg-slate-50 relative min-h-screen p-8 font-sans overflow-x-hidden text-slate-900">
      {/* Background Blobs - CEO Dashboard Theme */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-100/40 to-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-rose-100/30 to-amber-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-teal-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1700px] mx-auto space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">

        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 font-[Montserrat]">Market Mix Modeling</h1>
            <p className="text-slate-500 font-medium text-lg font-[Montserrat]">Analyze and optimize marketing strategies.</p>
          </div>
        </div>

        {/* Alert Section */}
        {showAlert && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl flex justify-between items-center shadow-xl shadow-orange-500/20 border border-orange-400/50 animate-in slide-in-from-top-4 duration-500 w-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex items-start gap-5 relative z-10">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md shadow-inner border border-white/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-sm">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FED71F" stroke="#B45309" strokeWidth="1.5" />
                  <path d="M12 8V13" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 16H12.01" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 tracking-tight">Sales Alert</h4>
                <p className="text-orange-50 font-medium opacity-90 text-sm leading-relaxed">
                  Major drop in Camera sales with lower forecasts than planned.
                  <span className="block font-bold mt-1 text-white">Optimize now to get better results.</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleAlert}
              className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10 relative z-10"
            >
              <span className="text-xl font-bold leading-none">&times;</span>
            </button>
          </div>
        )}



        {/* Controls Section */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200/50">
          <div className="flex flex-col gap-6">

            {/* Top Controls: Category & Buttons */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                <label htmlFor="dropdown" className="font-semibold text-slate-700 text-sm">Product Category:</label>
                <Select
                  value={category}
                  onChange={(value) => setCategory(value)}
                  placeholder="Select a category"
                  style={{ minWidth: 160 }}
                  bordered={false}
                  className="font-medium"
                >
                  <Select.Option value="Camera">Camera</Select.Option>
                  <Select.Option value="CameraAccessory">Camera Accessory</Select.Option>
                </Select>
              </div>

              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                sendDataToParent={(data) => {
                  setSalesTarget(data);
                  setBarGraphOptimalBudget(barGraphData.optimal_budget);
                  setOptimalROMI(salesTarget / (barGraphData.optimal_budget / 1000000));
                  setAllocatedOptimal(true);
                }}
              />

              <div className="flex items-center gap-3">
                {/* Sales Target Button */}
                <button
                  onClick={() => setModalShow(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
                >
                  <Target size={16} />
                  <span>Optimize For Sales Target</span>
                </button>

                {!optimizeAllocate ? (
                  <button
                    onClick={() => setOptimizeAllocate(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                  >
                    <Settings size={16} />
                    <span>Optimize Budget</span>
                  </button>
                ) : !runSimulator ? (
                  <button
                    onClick={() => {
                      setOpen(!open);
                      setRunSimulator(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-orange-500/20 active:scale-95"
                  >
                    <Play size={16} fill="white" />
                    <span>Run Simulator</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                    <span className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      Simulator On
                    </span>
                    <button
                      onClick={() => {
                        setOpen(!open);
                        setRunSimulator(false);
                        setSimulate({ TV: 0, Digital: 0, Sponsorship: 0, product_mrp: 0 });
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-200 transition-colors ml-2 shadow-sm"
                    >
                      <div className="w-2 h-2 bg-slate-400 rounded-sm"></div>
                      Stop
                    </button>
                  </div>
                )}

                <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Optimization Active Banner */}
            {(optimizeAllocate || salesTarget) && (
              <div className="flex justify-between items-center bg-indigo-50 px-6 py-3 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                <div className="text-indigo-900 font-bold text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  You are now viewing the Optimized Budget
                </div>
                <button
                  onClick={() => {
                    setOptimizeAllocate(false);
                    handleCollapse();
                    setSalesTarget(0);
                    setOptimalROMI("--");
                    setAllocatedOptimal(false);
                    setAllocatedSimulated(false);
                  }}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold text-xs py-1 px-3 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <ArrowDownRight size={14} />
                  Back to baseline view
                </button>
              </div>
            )}

            {/* Simulator Inputs (Collapse) */}
            {open && (
              <div id="example-collapse-text" className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 mt-2 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="font-bold text-slate-700 text-sm whitespace-nowrap">
                    Specify Budget For Different Channels:
                  </div>
                  {/* Inputs */}
                  {/* TV Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">TV</label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold group-focus-within:text-orange-500 transition-colors">$</span>
                      <input
                        type="text"
                        value={simulateTV || ''}
                        className="w-32 pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setSimulateTV(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Digital Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Digital</label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold group-focus-within:text-orange-500 transition-colors">$</span>
                      <input
                        type="text"
                        value={simulateDigital || ''}
                        className="w-32 pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setSimulateDigital(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Sponsorship Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sponsorship</label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold group-focus-within:text-orange-500 transition-colors">$</span>
                      <input
                        type="text"
                        value={simulateSponsorship || ''}
                        className="w-32 pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setSimulateSponsorship(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Product MRP Input (Disabled to match original logic) */}
                  {/* <div className="flex flex-col gap-1 border-l pl-6 border-slate-200 ml-4">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product MRP</label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold group-focus-within:text-amber-500 transition-colors">$</span>
                      <input
                        type="text"
                        value={simulateproduct_mrp || ''}
                        className="w-32 pl-7 pr-3 py-2 bg-amber-50/50 border border-amber-200 rounded-lg text-sm font-semibold text-amber-900 outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-sm"
                        onChange={(e) => setSimulateproduct_mrp(e.target.value)}
                      />
                    </div>
                  </div> */}

                  <button
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
                      // Make sure simulatedData exists before accessing it
                      if (simulatedData && simulatedData.forecast) {
                        const temp = +simulatedData.forecast[0] + +simulatedData.forecast[1] + +simulatedData.forecast[2];
                        setSalesSimulatedData(temp);
                        setROMISimulatedData(simulatedData.romi);
                      }
                      setAllocatedSimulated(true);
                    }}
                    className="ml-auto px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-900/10 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Play size={14} fill="white" />
                    Simulate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Allocated Budget Card */}
          <div className="col-span-12 md:col-span-4 bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-sm rounded-3xl p-6 hover:shadow-lg hover:shadow-emerald-100/40 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-emerald-600/80 font-bold text-xs uppercase tracking-wider mb-2">Allocated Budget</p>
                <h3 className="text-2xl xl:text-3xl font-extrabold text-slate-800 tracking-tight">
                  ${allocatedBudgetData?.budget?.total ? Math.floor(allocatedBudgetData.budget.total) : "0"}Mn
                </h3>
                <div className="flex items-center gap-1 mt-2 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                  <ArrowUpRight size={14} className="text-emerald-600" />
                  <span className="text-emerald-700 text-xs font-bold">+2.5% vs Last Month</span>
                </div>
              </div>
              <div className="bg-emerald-100 p-3 rounded-2xl group-hover:bg-emerald-200 transition-colors">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="h-px bg-slate-100 my-4"></div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1">Current</p>
                <p className="text-slate-700 font-bold">{allocatedBudgetData?.budget?.total ? Math.floor(allocatedBudgetData.budget.total) : "0"}Mn</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1">Target</p>
                <p className="text-slate-700 font-bold">
                  {barGraphData?.optimal_budget > 0 ? `${Math.floor(barGraphData.optimal_budget / 1000000)}Mn` : "--"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1">Simulate</p>
                <p className="text-slate-700 font-bold">
                  {barGraphData?.simulated_budget > 0 ? `${Math.floor(barGraphData.simulated_budget / 1000000)}Mn` : "--"}
                </p>
              </div>
            </div>
          </div>

          {/* Sales Card */}
          <div className="col-span-12 md:col-span-4 bg-white/90 backdrop-blur-sm border border-blue-100 shadow-sm rounded-3xl p-6 hover:shadow-lg hover:shadow-blue-100/40 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-600/80 font-bold text-xs uppercase tracking-wider mb-2">Sales</p>
                <h3 className="text-2xl xl:text-3xl font-extrabold text-slate-800 tracking-tight flex items-baseline gap-1">
                  {allocatedBudgetData?.sales ? Math.floor(allocatedBudgetData.sales) : "0"}Mn
                  <span className="text-slate-400 text-sm font-medium">(USD)</span>
                </h3>
                <div className="flex items-center gap-1 mt-2 bg-blue-50 w-fit px-2 py-1 rounded-lg">
                  <ArrowUpRight size={14} className="text-blue-600" />
                  <span className="text-blue-700 text-xs font-bold">+15.3% YoY Growth</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-2xl group-hover:bg-blue-200 transition-colors">
                <ArrowUpRight className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="h-px bg-slate-100 my-4"></div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1">Current</p>
                <p className="text-slate-700 font-bold">{allocatedBudgetData?.sales ? Math.floor(allocatedBudgetData.sales) : "0"}Mn</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1">Target</p>
                <p className="text-slate-700 font-bold">{salesTarget > 0 ? `${salesTarget}Mn  ` : "--"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1">Simulate</p>
                <p className="text-slate-700 font-bold">
                  {salesSimulatedData !== undefined && salesSimulatedData !== null ? (Math.floor(salesSimulatedData) / 1000000).toFixed(1) : "--"}
                </p>
              </div>
            </div>
          </div>

          {/* ROMI Card */}
          <div className="col-span-12 md:col-span-4 bg-white/90 backdrop-blur-sm border border-amber-100 shadow-sm rounded-3xl p-6 hover:shadow-lg hover:shadow-amber-100/40 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-amber-600/80 font-bold text-xs uppercase tracking-wider mb-2">ROMI</p>
                <h3 className="text-2xl xl:text-3xl font-extrabold text-slate-800 tracking-tight">{baseROMI}</h3>
                <div className="flex items-center gap-1 mt-2 bg-rose-50 w-fit px-2 py-1 rounded-lg">
                  <ArrowDownRight size={14} className="text-rose-600" />
                  <span className="text-rose-700 text-xs font-bold">-0.8% vs Target</span>
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-2xl group-hover:bg-amber-200 transition-colors">
                <ArrowDownRight className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="h-px bg-slate-100 my-4"></div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1">Current</p>
                <p className="text-slate-700 font-bold">{baseROMI}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1">Target</p>
                <p className="text-slate-700 font-bold">{optimalROMI !== "--" ? optimalROMI : "--"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1">Simulate</p>
                <p className="text-slate-700 font-bold">{ROMISimulatedData ?? "--"}</p>
              </div>
            </div>
          </div>

          {/* Calculated Budget Card (Shown only if salesTarget exists) */}
          {salesTarget > 0 && barGraphData?.optimal_budget > 0 && (
            <div className="col-span-12 md:col-span-4">
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-3xl p-6">
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">CALCULATED BUDGET</p>
                <h3 className="text-2xl xl:text-3xl font-extrabold text-slate-800 mb-0">
                  {Math.floor(barGraphData.optimal_budget / 1000000) + "Mn"}
                </h3>
              </div>
            </div>
          )}
        </div>


        {/* Plots */}
        {/* Charts Section */}
        <div className="grid grid-cols-12 gap-6 mt-8">
          {/* Forecast Plot */}
          <div className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm rounded-3xl p-6 relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg tracking-tight">Forecast Sales</h3>
              <div className="flex items-center gap-4 text-[10px] font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-[#558fff]"></div>
                  <span>Actual Sales</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-[#ff8b35]"></div>
                  <span>Baseline Forecast</span>
                </div>
              </div>
            </div>
            <div className="h-[400px] w-full rounded-2xl overflow-hidden relative z-0">
              <Plot
                data={forecastGraphData.data}
                layout={{
                  xaxis: { showgrid: false, zeroline: false, showline: true, linecolor: '#e2e8f0' },
                  yaxis: { showgrid: true, gridcolor: '#f1f5f9', zeroline: false },
                  margin: { l: 40, r: 20, t: 20, b: 40 },
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  showlegend: false,
                  autosize: true
                }}
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                config={{ displayModeBar: false }}
              />
            </div>
          </div>

          {/* Response Curve */}
          <div className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm rounded-3xl p-6 relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-lg tracking-tight mb-2">Response Curve</h3>
                <p className="text-xs font-medium text-slate-500">Analyze marketing channels efficiency</p>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  {/* TV Checkbox */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={!!channel.TV}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setChannel({
                              ...channel,
                              TV: {
                                allocated: (allocatedBudgetData?.budget?.individual?.find(item => item[0] === "TV")?.[1] || 0) * 1e6,
                                ...(simulate?.TV !== 0 && { simulated: simulate?.TV }),
                                optimal: barGraphData?.optimal_break_down?.TV
                              }
                            });
                          } else {
                            const newChannel = { ...channel };
                            if (Object.keys(newChannel).length > 0) delete newChannel.TV;
                            setChannel(newChannel);
                          }
                        }}
                      />
                      <div className="w-4 h-4 bg-white border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-600 peer-checked:text-blue-700">TV</span>
                    </label>
                  </div>

                  {/* Digital Checkbox */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={!!channel.Digital}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setChannel({
                              ...channel,
                              Digital: {
                                allocated: (allocatedBudgetData?.budget?.individual?.find(item => item[0] === "Digital")?.[1] || 0) * 1e6,
                                ...(simulate?.Digital !== 0 && { simulated: simulate?.Digital }),
                                optimal: barGraphData?.optimal_break_down?.Digital
                              }
                            });
                          } else {
                            const newChannel = { ...channel };
                            if (Object.keys(newChannel).length > 0) delete newChannel.Digital;
                            setChannel(newChannel);
                          }
                        }}
                      />
                      <div className="w-4 h-4 bg-white border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-600 peer-checked:text-blue-700">Digital</span>
                    </label>
                  </div>

                  {/* Sponsorship Checkbox */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={!!channel.Sponsorship}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setChannel({
                              ...channel,
                              Sponsorship: {
                                allocated: (allocatedBudgetData?.budget?.individual?.find(item => item[0] === "Sponsorship")?.[1] || 0) * 1e6,
                                ...(simulate?.Sponsorship !== 0 && { simulated: simulate?.Sponsorship }),
                                optimal: barGraphData?.optimal_break_down?.Sponsorship
                              }
                            });
                          } else {
                            const newChannel = { ...channel };
                            if (Object.keys(newChannel).length > 0) delete newChannel.Sponsorship;
                            setChannel(newChannel);
                          }
                        }}
                      />
                      <div className="w-4 h-4 bg-white border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-600 peer-checked:text-blue-700">Sponsorship</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#558fff]"></div> Current</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#696969]"></div> Optimal</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#ff8b35]"></div> Simulated</div>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full rounded-2xl overflow-hidden relative z-0">
              <Plot
                data={curveGraphData.data}
                layout={{
                  xaxis: { showgrid: false, zeroline: false, showline: true, linecolor: '#e2e8f0' },
                  yaxis: { showgrid: true, gridcolor: '#f1f5f9', zeroline: false },
                  margin: { l: 40, r: 20, t: 20, b: 40 },
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  showlegend: false,
                  autosize: true
                }}
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                config={{ displayModeBar: false }}
              />
            </div>
          </div>

          {/* Budget Allocation Chart */}
          <div className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm rounded-3xl p-6 relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg tracking-tight">Budget Allocation</h3>
              <div className="flex items-center gap-4 text-[10px] font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#568FFF]"></div>
                  <span>Marketing Channels</span>
                </div>
                {barGraphData?.optimal_budget > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-[#696969]"></div>
                    <span>Optimal Budget Allocation</span>
                  </div>
                )}
              </div>
            </div>
            <div className="h-[400px] w-full rounded-2xl overflow-hidden relative z-0">
              <Plot
                data={updatedGraphData}
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                layout={{
                  autosize: true,
                  margin: { l: 50, r: 30, t: 20, b: 120 },
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  xaxis: {
                    showgrid: false,
                    zeroline: false,
                    showline: true,
                    linecolor: '#e2e8f0',
                    tickangle: -45,
                    automargin: true,
                    tickfont: { size: 10 }
                  },
                  yaxis: { showgrid: true, gridcolor: '#f1f5f9', zeroline: false },
                  showlegend: false
                }}
                config={{ displayModeBar: false }}
              />
            </div>
          </div>

          {/* Spending Efficiency (SOS vs SOE) */}
          <div className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm rounded-3xl p-6 relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg tracking-tight">Spending Efficiency</h3>
              <div className="flex items-center gap-4 text-xs font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#696969]"></div>
                  <span className="text-slate-600">Share of Spend</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#ff8b35]"></div>
                  <span className="text-slate-600">Share of Effect</span>
                </div>
              </div>
            </div>
            <div className="h-[400px] w-full rounded-2xl overflow-hidden relative z-0">
              <Plot
                data={updatedSosGraphData}
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                layout={{
                  autosize: true,
                  margin: { l: 50, r: 30, t: 20, b: 120 },
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  xaxis: {
                    showgrid: false,
                    zeroline: false,
                    showline: true,
                    linecolor: '#e2e8f0',
                    tickangle: -45,
                    automargin: true,
                    tickfont: { size: 10 }
                  },
                  yaxis: { showgrid: true, gridcolor: '#f1f5f9', zeroline: false },
                  showlegend: false
                }}
                config={{ displayModeBar: false }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Neptune;
