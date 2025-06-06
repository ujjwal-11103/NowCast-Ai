import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import { useForecast } from "@/context/ForecastContext/ForecastContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Menu, ChevronLeft, ChevronRight, Home, Calendar, FilePlus, Users, ShoppingCart, BarChart2, Gauge, ClipboardList, AlertCircle, Box } from "lucide-react";
import data from "../../jsons/Planning/JF_censored.json";
import priceData from "../../jsons/Planning/price_df_censored.json";

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const {
        setForecastSum,
        setForecastValue,
        setYoyGrowth,
        setParentLevelForecast,
        setFilters,
        setAccuracyLevel
    } = useForecast();

    // State for dropdown selections
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [selectedChain, setSelectedChain] = useState(null);
    const [selectedDepot, setSelectedDepot] = useState(null);
    const [selectedSubCat, setSelectedSubCat] = useState(null);
    const [selectedSubSKU, setSelectedSubSKU] = useState(null);
    const [selectedAccuracy, setSelectedAccuracy] = useState("95%");

    // Options for dropdowns
    const [channelOptions, setChannelOptions] = useState([]);
    const [chainOptions, setChainOptions] = useState([]);
    const [depotOptions, setDepotOptions] = useState([]);
    const [subCatOptions, setSubCatOptions] = useState([]);
    const [skuOptions, setSkuOptions] = useState([]);
    const accuracyOptions = ["90%", "95%", "98%", "99%", "99.5%"];

    // Navigation items
    const menuItems = [
        { label: "Overall", path: "/overall", icon: Gauge },
        { label: "Ingestion", path: "/ingestion", icon: FilePlus },
        { label: "Planning", path: "/planning", icon: Calendar },
        { label: "Reporting", path: "/reporting", icon: BarChart2 },
        { label: "Error Analysis", path: "/erroranalysis", icon: AlertCircle },
        { label: "Norms", path: "/norms", icon: ClipboardList },
        { label: "Supply Chain", path: "/supplychain", icon: ShoppingCart },
    ];

    // Determine if current page is Norms
    const isNormsPage = location.pathname === "/norms";

    // Load unique channels initially
    useEffect(() => {
        const channels = [...new Set(data.map(item => item.Channel))];
        setChannelOptions(channels);
    }, []);

    // Handle chain selection
    useEffect(() => {
        if (selectedChannel) {
            const filtered = data.filter(item => item.Channel === selectedChannel);
            setChainOptions([...new Set(filtered.map(item => item.Chain))]);

            // Reset downstream selections when channel changes
            setSelectedChain(null);
            setSelectedDepot(null);
            setSelectedSubCat(null);
            setSelectedSubSKU(null);
            setDepotOptions([]);
            setSubCatOptions([]);
            setSkuOptions([]);
        }
    }, [selectedChannel]);

    // Handle depot selection
    useEffect(() => {
        if (selectedChain) {
            if (selectedChain === "All") {
                // When "All" is selected for chain, set all downstream to "All" and clear options
                setSelectedDepot("All");
                setSelectedSubCat("All");
                setSelectedSubSKU("All");
                setDepotOptions([]);
                setSubCatOptions([]);
                setSkuOptions([]);
            } else {
                const filtered = data.filter(
                    item => item.Channel === selectedChannel && item.Chain === selectedChain
                );
                setDepotOptions([...new Set(filtered.map(item => item.Depot))]);
                setSelectedDepot(null);
                setSelectedSubCat(null);
                setSelectedSubSKU(null);
                setSubCatOptions([]);
                setSkuOptions([]);
            }
        }
    }, [selectedChain, selectedChannel]);

    // Handle subcat selection
    useEffect(() => {
        if (selectedDepot) {
            if (selectedDepot === "All") {
                // When "All" is selected for depot, set downstream to "All" and clear options
                setSelectedSubCat("All");
                setSelectedSubSKU("All");
                setSubCatOptions([]);
                setSkuOptions([]);
            } else {
                const filtered = data.filter(
                    item =>
                        item.Channel === selectedChannel &&
                        item.Chain === selectedChain &&
                        item.Depot === selectedDepot
                );
                setSubCatOptions([...new Set(filtered.map(item => item.SubCat))]);
                setSelectedSubCat(null);
                setSelectedSubSKU(null);
                setSkuOptions([]);
            }
        }
    }, [selectedDepot, selectedChannel, selectedChain]);

    // Handle SKU selection
    useEffect(() => {
        if (selectedSubCat) {
            if (selectedSubCat === "All") {
                // When "All" is selected for subcat, set SKU to "All" and clear options
                setSelectedSubSKU("All");
                setSkuOptions([]);
            } else {
                const filtered = data.filter(
                    item =>
                        item.Channel === selectedChannel &&
                        item.Chain === selectedChain &&
                        item.Depot === selectedDepot &&
                        item.SubCat === selectedSubCat
                );
                setSkuOptions([...new Set(filtered.map(item => item.SKU))]);
                setSelectedSubSKU(null);
            }
        }
    }, [selectedSubCat, selectedChannel, selectedChain, selectedDepot]);

    // Calculate metrics based on selections
    useEffect(() => {
        if (selectedChannel) {
            // Filter data based on selections
            let filteredData = data.filter(item => {
                if (item.Channel !== selectedChannel) return false;
                if (selectedChain && selectedChain !== "All" && item.Chain !== selectedChain) return false;
                if (selectedDepot && selectedDepot !== "All" && item.Depot !== selectedDepot) return false;
                if (selectedSubCat && selectedSubCat !== "All" && item.SubCat !== selectedSubCat) return false;
                if (selectedSubSKU && selectedSubSKU !== "All" && item.SKU !== selectedSubSKU) return false;
                return item.Date === "2025-01-01" || item.Date === "2025-02-01";
            });

            // Calculate metrics...

            // Calculate total forecast
            const totalForecast = filteredData.reduce((sum, item) => sum + (item.forecast || 0), 0);
            setForecastSum(totalForecast);

            // Calculate forecast value
            if (filteredData.length > 0) {
                let totalValue = 0;

                filteredData.forEach(dataItem => {
                    const matchedPrice = priceData.find(priceItem =>
                        priceItem.Channel === dataItem.Channel &&
                        priceItem.Chain === dataItem.Chain &&
                        priceItem.Depot === dataItem.Depot &&
                        priceItem.SubCat === dataItem.SubCat &&
                        priceItem.SKU === dataItem.SKU
                    );
                    const unitPrice = matchedPrice?.UnitPrice || 0;
                    totalValue += (dataItem.forecast || 0) * unitPrice;
                });

                setForecastValue(Math.round(totalValue));
            } else {
                setForecastValue(null);
            }

            // Calculate YoY Growth
            let actuals2024 = data.filter(item => {
                // Apply the same filters as above but for 2024 data
                if (selectedChannel && item.Channel !== selectedChannel) return false;
                if (selectedChain && selectedChain !== "All" && item.Chain !== selectedChain) return false;
                if (selectedDepot && selectedDepot !== "All" && item.Depot !== selectedDepot) return false;
                if (selectedSubCat && selectedSubCat !== "All" && item.SubCat !== selectedSubCat) return false;
                if (selectedSubSKU && selectedSubSKU !== "All" && item.SKU !== selectedSubSKU) return false;
                return item.Date === "2024-01-01" || item.Date === "2024-02-01";
            });

            const totalActual2024 = actuals2024.reduce((sum, item) => sum + (item.actual || 0), 0);

            if (totalActual2024 > 0) {
                const yoy = ((totalForecast - totalActual2024) / totalActual2024) * 100;
                setYoyGrowth(yoy.toFixed(1));
            } else {
                setYoyGrowth(null);
            }

            // Calculate parent level forecast (immediate parent in hierarchy)
            let parentFilter = {};

            // Determine parent level based on current selection
            if (selectedSubSKU && selectedSubSKU !== "All") {
                // Current level: SKU -> Parent: SubCat (all SKUs in same SubCat)
                parentFilter = {
                    Channel: selectedChannel,
                    Chain: selectedChain !== "All" ? selectedChain : null,
                    Depot: selectedDepot !== "All" ? selectedDepot : null,
                    SubCat: selectedSubCat !== "All" ? selectedSubCat : null
                };
            } else if (selectedSubSKU === "All" || selectedSubCat) {
                // Current level: SubCat -> Parent: Depot (all SubCats in same Depot)
                parentFilter = {
                    Channel: selectedChannel,
                    Chain: selectedChain !== "All" ? selectedChain : null,
                    Depot: selectedDepot !== "All" ? selectedDepot : null
                };
            } else if (selectedDepot === "All" || selectedDepot) {
                // Current level: Depot -> Parent: Chain (all Depots in same Chain)
                parentFilter = {
                    Channel: selectedChannel,
                    Chain: selectedChain !== "All" ? selectedChain : null
                };
            } else if (selectedChain === "All" || selectedChain) {
                // Current level: Chain -> Parent: Channel (all Chains in same Channel)
                parentFilter = {
                    Channel: selectedChannel
                };
            }

            const parentLevelData = data.filter(item =>
                (parentFilter.Channel ? item.Channel === parentFilter.Channel : true) &&
                (parentFilter.Chain ? item.Chain === parentFilter.Chain : true) &&
                (parentFilter.Depot ? item.Depot === parentFilter.Depot : true) &&
                (parentFilter.SubCat ? item.SubCat === parentFilter.SubCat : true) &&
                (item.Date === "2025-01-01" || item.Date === "2025-02-01")
            );

            const parentTotalForecast = parentLevelData.reduce((sum, item) =>
                sum + (item.forecast || 0), 0);

            setParentLevelForecast(parentTotalForecast);
        } else {
            setForecastSum(null);
            setForecastValue(null);
            setYoyGrowth(null);
            setParentLevelForecast(null);
        }
    }, [selectedChannel, selectedChain, selectedDepot, selectedSubCat, selectedSubSKU]);

    useEffect(() => {
        setFilters({
            channel: selectedChannel,
            chain: selectedChain,
            depot: selectedDepot,
            subCat: selectedSubCat,
            sku: selectedSubSKU,
        });
    }, [selectedChannel, selectedChain, selectedDepot, selectedSubCat, selectedSubSKU]);

    // Determine which dropdowns to show
    const showChainDropdown = selectedChannel;
    const showDepotDropdown = selectedChain && selectedChain !== "All";
    const showSubCatDropdown = selectedDepot && selectedDepot !== "All";
    const showSKUDropdown = selectedSubCat && selectedSubCat !== "All";


    // Norms
    // useEffect(() => {
    //     setShowAccuracyDropdown(isNormsPage === "Norms");
    //     if (isNormsPage === "Norms") {
    //         setAccuracyLevel(selectedAccuracy); // Update context when Norms is selected
    //     }
    // }, [isNormsPage, selectedAccuracy]);

    // Navigation handler
    const goToPage = (path) => {
        navigate(path);
    };

    // Determine active page based on route
    const getActivePage = () => {
        return menuItems.find(item => location.pathname.includes(item.path.toLowerCase()))?.label || "";
    };

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 right-4 z-50 bg-[#0A2472] text-white p-2 rounded-md shadow-md lg:hidden"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen overflow-y-auto bg-slate-900 border-r z-40 transition-all duration-300 ${isSidebarOpen ? "w-64 translate-x-0" : "w-16 -translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar header */}
                    <div className="p-4 flex justify-between items-center border-b border-slate-700">
                        {isSidebarOpen && (
                            <div className="flex items-center gap-2">
                                <img src="/Intellimark_AI.png" alt="" className="w-8 h-8" />
                                <span className="text-xl font-bold text-white">Intellimark</span>
                            </div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-1 hover:bg-slate-700 rounded-md"
                        >
                            {isSidebarOpen ? <ChevronLeft size={20} className="text-white" /> : <ChevronRight size={20} className="text-white" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 flex-1">
                        {/* <h2 className="font-medium mb-4 text-[#0A2472]">Navigation</h2> */}
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.label}>
                                    <button
                                        onClick={() => goToPage(item.path)}
                                        className={`flex items-center w-full ${isSidebarOpen ? "px-4 py-3 justify-start" : "justify-center px-5 py-3"
                                            } space-x-3 rounded-lg transition-all duration-300 ${getActivePage() === item.label
                                                ? "bg-blue-600 text-white"
                                                : "text-white hover:bg-slate-700"
                                            }`}
                                    >
                                        <item.icon size={20} className="flex-shrink-0" />
                                        {isSidebarOpen && <span>{item.label}</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Filters section */}
                    {
                        isSidebarOpen &&

                        <div className="p-4 border-t border-slate-700 space-y-4">
                            {/* Channel */}
                            <div>
                                <h3 className="text-sm font-medium mb-2 text-white">Channel</h3>
                                <Select onValueChange={setSelectedChannel}>
                                    <SelectTrigger className="w-full bg-white">
                                        <SelectValue placeholder="Select channel" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {channelOptions.map(channel => (
                                            <SelectItem key={channel} value={channel}>
                                                {channel.toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Chain - only show if channel is selected */}
                            {selectedChannel && (
                                <div>
                                    <h3 className="text-sm font-medium mb-2 text-white" >Chain</h3>
                                    <Select
                                        value={selectedChain || ""}
                                        onValueChange={setSelectedChain}
                                        disabled={!selectedChannel}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Select chain" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="All">ALL</SelectItem>
                                            {chainOptions.map(chain => (
                                                <SelectItem key={chain} value={chain}>
                                                    {chain.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Depot - only show if chain is selected and not "All" */}
                            {selectedChain && selectedChain !== "All" && (
                                <div>
                                    <h3 className="text-sm font-medium mb-2 text-white">Depot</h3>
                                    <Select
                                        value={selectedDepot || ""}
                                        onValueChange={setSelectedDepot}
                                        disabled={!selectedChain}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Select depot" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="All">ALL</SelectItem>
                                            {depotOptions.map(depot => (
                                                <SelectItem key={depot} value={depot}>
                                                    {depot.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* SubCat - only show if depot is selected and not "All" */}
                            {selectedDepot && selectedDepot !== "All" && (
                                <div>
                                    <h3 className="text-sm font-medium mb-2 text-white">SubCat</h3>
                                    <Select
                                        value={selectedSubCat || ""}
                                        onValueChange={setSelectedSubCat}
                                        disabled={!selectedDepot}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Select subcat" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="All">ALL</SelectItem>
                                            {subCatOptions.map(subcat => (
                                                <SelectItem key={subcat} value={subcat}>
                                                    {subcat.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* SKU - only show if subcat is selected and not "All" */}
                            {selectedSubCat && selectedSubCat !== "All" && (
                                <div>
                                    <h3 className="text-sm font-medium mb-2 text-white">SKU</h3>
                                    <Select
                                        value={selectedSubSKU || ""}
                                        onValueChange={setSelectedSubSKU}
                                        disabled={!selectedSubCat}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Select SKU" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="All">ALL</SelectItem>
                                            {skuOptions.map(sku => (
                                                <SelectItem key={sku} value={sku}>
                                                    {sku.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Norms accuracy - only show on Norms page */}
                            {isNormsPage && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium mb-2 text-white">Service Level Accuracy</h3>
                                    <Select
                                        value={selectedAccuracy}
                                        onValueChange={(value) => {
                                            setSelectedAccuracy(value);
                                            setAccuracyLevel(value);
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Select accuracy" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {accuracyOptions.map(option => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    }
                </div>
            </aside>
        </>
    );
};

export default SideBar;