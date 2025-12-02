import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react"; // Import arrows for YoY
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Package, DollarSign, LineChart, Calendar } from 'lucide-react'; // Added Calendar icon
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
        if (globalData) {

            // 1. Basic Filter (Same as before)
            const filteredData = globalData.filter(item => {
                if (selectedChannel && item.Channel !== selectedChannel) return false;

                if (selectedChain && selectedChain !== "All" && item.Chain !== selectedChain) return false;
                if (selectedDepot && selectedDepot !== "All" && item.Depot !== selectedDepot) return false;
                if (selectedSubCat && selectedSubCat !== "All" && item.SubCat !== selectedSubCat) return false;
                if (selectedSubSKU && selectedSubSKU !== "All" && item.SKU !== selectedSubSKU) return false;
                return true;
            });

            // 2. Isolate "Forecast" Period Data
            const forecastData = filteredData.filter(item => item.Period === "Forecast");

            // --- A. Forecast Volume ---
            // Formula: Sum(Forecast_Volume) Where Period == Forecast
            const totalForecastVolume = forecastData.reduce((sum, item) => sum + (Number(item.forecast) || 0), 0);
            setForecastSum(Math.round(totalForecastVolume));

            // --- B. Forecast Value ---
            // Formula: Sum(Forecast_Value) Where Period == Forecast
            // Note: Calculating Value as (Volume * Price)
            const totalForecastValue = forecastData.reduce((sum, item) => {
                const price = Number(item.Price) || 0;
                return sum + ((Number(item.forecast) || 0) * price);
            }, 0);
            setForecastValue(Math.round(totalForecastValue));

            // --- C. YoY Growth ---
            // Formula: Sum(Forecast_Volume) / Sum(LY_Actual_Value) [where LY is Forecast - 12 months]

            // Step 1: Identify Forecast Months (e.g., "2025-01", "2025-02")
            const forecastMonths = [...new Set(forecastData.map(d => d.Date.substring(0, 7)))];

            // Step 2: Calculate Target Last Year Months (e.g., "2024-01", "2024-02")
            const lyMonths = forecastMonths.map(dateStr => {
                const date = new Date(dateStr + "-01");
                date.setFullYear(date.getFullYear() - 1);
                return date.toISOString().substring(0, 7); // Returns "YYYY-MM"
            });

            // Step 3: Filter Data for LY Actuals
            const lyData = filteredData.filter(item => {
                const itemMonth = item.Date.substring(0, 7);
                return lyMonths.includes(itemMonth) && item.Period === "History";
            });

            // Step 4: Sum LY Actuals
            const totalLYActuals = lyData.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);

            // Step 5: Calculate Growth %
            if (totalLYActuals > 0) {
                // Using Standard Growth Formula: ((New - Old) / Old) * 100
                const yoy = ((totalForecastVolume - totalLYActuals) / totalLYActuals) * 100;
                setYoyGrowth(yoy.toFixed(1));
            } else {
                setYoyGrowth(null);
            }

            // --- D. YTD (Year To Date) Volume ---
            // Formula: Sum(Actual_Volume) Where Period = History, year = current year

            // Determine "Current Year" for history (Assuming 2024 based on your data)
            // Ideally, this should be dynamic: new Date().getFullYear() - 1? 
            // For now, let's look at the max year in History data.
            const currentHistoryYear = "2024";

            const ytdData = filteredData.filter(item =>
                item.Period === "History" && item.Date.startsWith(currentHistoryYear)
            );

            const ytdVolume = ytdData.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);

            // Reusing parentLevelForecast state variable to store YTD for now
            setParentLevelForecast(Math.round(ytdVolume));

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

    const forecastSumVal = useForecast().forecastSum;
    const forecastValVal = useForecast().forecastValue;
    const yoyGrowthVal = useForecast().yoyGrowth;
    const ytdVal = useForecast().parentLevelForecast; // Mapped to YTD

    return (
        <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                    {/* ... (Keep Dropdowns exactly as they were) ... */}
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