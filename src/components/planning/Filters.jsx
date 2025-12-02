import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useForecast } from "@/context/ForecastContext/ForecastContext";

const Filters = ({ showFilters }) => {

    const {
        globalData,
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

    // 1. Load Channels
    useEffect(() => {
        if (globalData && globalData.length > 0) {
            const channels = [...new Set(globalData.map(item => item.Channel))];
            setChannelOptions(channels);
        }
    }, [globalData]);

    // 2. Chain Logic
    useEffect(() => {
        if (selectedChannel && globalData) {
            const filtered = globalData.filter(item => item.Channel === selectedChannel);
            setChainOptions([...new Set(filtered.map(item => item.Chain))]);
        }
    }, [selectedChannel, globalData]);

    useEffect(() => {
        setSelectedChain(null); setSelectedDepot(null); setSelectedSubCat(null); setSelectedSubSKU(null);
        setDepotOptions([]); setSubCatOptions([]); setSkuOptions([]);
    }, [selectedChannel]);

    // 3. Depot Logic
    useEffect(() => {
        if (selectedChain && globalData) {
            if (selectedChain !== "All") {
                const filtered = globalData.filter(item => item.Channel === selectedChannel && item.Chain === selectedChain);
                setDepotOptions([...new Set(filtered.map(item => item.Depot))]);
            }
        }
    }, [selectedChain, selectedChannel, globalData]);

    useEffect(() => {
        if (selectedChain === "All") {
            setSelectedDepot("All"); setSelectedSubCat("All"); setSelectedSubSKU("All");
            setDepotOptions([]); setSubCatOptions([]); setSkuOptions([]);
        } else {
            setSelectedDepot(null); setSelectedSubCat(null); setSelectedSubSKU(null);
            setSubCatOptions([]); setSkuOptions([]);
        }
    }, [selectedChain]);

    // 4. SubCat Logic
    useEffect(() => {
        if (selectedDepot && globalData) {
            if (selectedDepot !== "All") {
                const filtered = globalData.filter(item => item.Channel === selectedChannel && item.Chain === selectedChain && item.Depot === selectedDepot);
                setSubCatOptions([...new Set(filtered.map(item => item.SubCat))]);
            }
        }
    }, [selectedDepot, selectedChannel, selectedChain, globalData]);

    useEffect(() => {
        if (selectedDepot === "All") {
            setSelectedSubCat("All"); setSelectedSubSKU("All");
            setSubCatOptions([]); setSkuOptions([]);
        } else {
            setSelectedSubCat(null); setSelectedSubSKU(null); setSkuOptions([]);
        }
    }, [selectedDepot]);

    // 5. SKU Logic
    useEffect(() => {
        if (selectedSubCat && globalData) {
            if (selectedSubCat !== "All") {
                const filtered = globalData.filter(item => item.Channel === selectedChannel && item.Chain === selectedChain && item.Depot === selectedDepot && item.SubCat === selectedSubCat);
                setSkuOptions([...new Set(filtered.map(item => item.SKU))]);
            }
        }
    }, [selectedSubCat, selectedChannel, selectedChain, selectedDepot, globalData]);

    useEffect(() => {
        if (selectedSubCat === "All") { setSelectedSubSKU("All"); setSkuOptions([]); }
        else { setSelectedSubSKU(null); }
    }, [selectedSubCat]);


    // ==========================================
    //  UPDATED METRICS CALCULATION
    // ==========================================
    useEffect(() => {
        if (selectedChannel && globalData) {

            // 1. Filter Data based on selections
            const filteredData = globalData.filter(item => {
                if (item.Channel !== selectedChannel) return false;
                if (selectedChain && selectedChain !== "All" && item.Chain !== selectedChain) return false;
                if (selectedDepot && selectedDepot !== "All" && item.Depot !== selectedDepot) return false;
                if (selectedSubCat && selectedSubCat !== "All" && item.SubCat !== selectedSubCat) return false;
                if (selectedSubSKU && selectedSubSKU !== "All" && item.SKU !== selectedSubSKU) return false;
                return true;
            });

            // 2. Separate Future (Forecast) vs Past (History)
            // Using the 'Period' field from your new JSON ensures we capture the right rows
            // regardless of the exact Date string.
            const forecastData = filteredData.filter(item =>
                item.Period === "Forecast" ||
                (item.Date >= "2024-11-01") // Fallback: Capture recent months if Period label is missing
            );

            const historyData = filteredData.filter(item =>
                item.Period === "History" ||
                (item.Date < "2024-11-01")
            );

            // --- A. Forecast Sum (Volume) ---
            const totalForecast = forecastData.reduce((sum, item) => sum + (Number(item.forecast) || 0), 0);
            setForecastSum(Math.round(totalForecast));

            // --- B. Forecast Value (Revenue) ---
            const totalValue = forecastData.reduce((sum, item) => {
                const price = Number(item.Price) || 0;
                return sum + ((Number(item.forecast) || 0) * price);
            }, 0);
            setForecastValue(Math.round(totalValue));

            // --- C. YoY Growth ---
            // Compare Forecast Sum vs Last Year Actuals (Simplification: using total history sum for demo)
            // Ideally, you match months (Jan 25 vs Jan 24). 
            // For now, let's grab the most recent history sum as a baseline.
            const totalActuals = historyData.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);

            if (totalActuals > 0 && totalForecast > 0) {
                // This is a rough proxy for YoY since datasets might differ in length
                // You can refine this to match specific months if needed.
                const yoy = ((totalForecast - (totalActuals / 12 * 2)) / (totalActuals / 12 * 2)) * 100; // rough comparison against 2 months avg
                setYoyGrowth(yoy.toFixed(1));
            } else {
                setYoyGrowth(null);
            }

            // --- D. Parent Level Forecast ---
            let parentFilter = {};
            if (selectedSubSKU && selectedSubSKU !== "All") {
                parentFilter = { Channel: selectedChannel, Chain: selectedChain !== "All" ? selectedChain : null, Depot: selectedDepot !== "All" ? selectedDepot : null, SubCat: selectedSubCat !== "All" ? selectedSubCat : null };
            } else if (selectedSubSKU === "All" || selectedSubCat) {
                parentFilter = { Channel: selectedChannel, Chain: selectedChain !== "All" ? selectedChain : null, Depot: selectedDepot !== "All" ? selectedDepot : null };
            } else if (selectedDepot === "All" || selectedDepot) {
                parentFilter = { Channel: selectedChannel, Chain: selectedChain !== "All" ? selectedChain : null };
            } else if (selectedChain === "All" || selectedChain) {
                parentFilter = { Channel: selectedChannel };
            }

            const parentLevelData = globalData.filter(item =>
                (parentFilter.Channel ? item.Channel === parentFilter.Channel : true) &&
                (parentFilter.Chain ? item.Chain === parentFilter.Chain : true) &&
                (parentFilter.Depot ? item.Depot === parentFilter.Depot : true) &&
                (parentFilter.SubCat ? item.SubCat === parentFilter.SubCat : true) &&
                (item.Period === "Forecast" || item.Date >= "2024-11-01")
            );

            const parentTotalForecast = parentLevelData.reduce((sum, item) => sum + (Number(item.forecast) || 0), 0);
            setParentLevelForecast(Math.round(parentTotalForecast));

        } else {
            setForecastSum(null);
            setForecastValue(null);
            setYoyGrowth(null);
            setParentLevelForecast(null);
        }
    }, [selectedChannel, selectedChain, selectedDepot, selectedSubCat, selectedSubSKU, globalData]);

    useEffect(() => {
        setFilters({
            channel: selectedChannel,
            chain: selectedChain,
            depot: selectedDepot,
            subCat: selectedSubCat,
            sku: selectedSubSKU,
        });
    }, [selectedChannel, selectedChain, selectedDepot, selectedSubCat, selectedSubSKU]);

    // Render helpers
    const showChainDropdown = selectedChannel;
    const showDepotDropdown = selectedChain && selectedChain !== "All";
    const showSubCatDropdown = selectedDepot && selectedDepot !== "All";
    const showSKUDropdown = selectedSubCat && selectedSubCat !== "All";
    const location = useLocation();
    const isNormsPage = location.pathname === "/norms";

    return (
        <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* ... (Keep your existing Dropdown JSX code exactly as is) ... */}
                    {/* Channel */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Channel</label>
                        <Select onValueChange={setSelectedChannel} value={selectedChannel || ""}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select channel" /></SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                {channelOptions.map(channel => <SelectItem key={channel} value={channel}>{channel.toUpperCase()}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Chain */}
                    {showChainDropdown && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Chain</label>
                            <Select value={selectedChain || ""} onValueChange={setSelectedChain} disabled={!selectedChannel}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select chain" /></SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    <SelectItem value="All">ALL</SelectItem>
                                    {chainOptions.map(chain => <SelectItem key={chain} value={chain}>{chain.toUpperCase()}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {/* Depot */}
                    {showDepotDropdown && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Depot</label>
                            <Select value={selectedDepot || ""} onValueChange={setSelectedDepot} disabled={!selectedChain}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select depot" /></SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    <SelectItem value="All">ALL</SelectItem>
                                    {depotOptions.map(depot => <SelectItem key={depot} value={depot}>{depot.toUpperCase()}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {/* SubCat */}
                    {showSubCatDropdown && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">SubCat</label>
                            <Select value={selectedSubCat || ""} onValueChange={setSelectedSubCat} disabled={!selectedDepot}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select subcat" /></SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    <SelectItem value="All">ALL</SelectItem>
                                    {subCatOptions.map(subcat => <SelectItem key={subcat} value={subcat}>{subcat.toUpperCase()}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {/* SKU */}
                    {showSKUDropdown && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">SKU</label>
                            <Select value={selectedSubSKU || ""} onValueChange={setSelectedSubSKU} disabled={!selectedSubCat}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select SKU" /></SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    <SelectItem value="All">ALL</SelectItem>
                                    {skuOptions.map(sku => <SelectItem key={sku} value={sku}>{sku.toUpperCase()}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {/* Accuracy */}
                    {isNormsPage && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Service Level Accuracy</label>
                            <Select value={selectedAccuracy} onValueChange={(value) => { setSelectedAccuracy(value); setAccuracyLevel(value); }}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select accuracy" /></SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    {accuracyOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Filters;