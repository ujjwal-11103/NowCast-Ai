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
        filters, // Added filters to sync back
        setFilters,
        setAccuracyLevel,
        setAccuracy,
        setBias
    } = useForecast();

    // State for dropdown options
    const [channelOptions, setChannelOptions] = useState([]);
    const [chainOptions, setChainOptions] = useState([]);
    const [depotOptions, setDepotOptions] = useState([]);
    const [subCatOptions, setSubCatOptions] = useState([]);
    const [skuOptions, setSkuOptions] = useState([]);
    const accuracyOptions = ["90%", "95%", "98%", "99%", "99.5%"];

    // --- HANDLERS FOR DROPDOWN CHANGES (Direct Context Update) ---
    const handleChannelChange = (val) => {
        setFilters(prev => ({
            ...prev,
            channel: val,
            chain: null,
            depot: null,
            subCat: null,
            sku: null
        }));
    };

    const handleChainChange = (val) => {
        setFilters(prev => ({
            ...prev,
            chain: val,
            depot: val === 'All' ? 'All' : null, // If Chain is All, effectively reset or set default for children
            subCat: val === 'All' ? 'All' : null,
            sku: val === 'All' ? 'All' : null
        }));
    };

    const handleDepotChange = (val) => {
        setFilters(prev => ({
            ...prev,
            depot: val,
            subCat: val === 'All' ? 'All' : null,
            sku: val === 'All' ? 'All' : null
        }));
    };

    const handleSubCatChange = (val) => {
        setFilters(prev => ({
            ...prev,
            subCat: val,
            sku: val === 'All' ? 'All' : null
        }));
    };

    const handleSkuChange = (val) => {
        setFilters(prev => ({
            ...prev,
            sku: val
        }));
    };

    // --- OPTIONS LOGIC (Derived from Context) ---

    // 1. Load Channels
    useEffect(() => {
        if (globalData && globalData.length > 0) {
            const channels = [...new Set(globalData.map(item => item.Channel))];
            setChannelOptions(channels);
        }
    }, [globalData]);

    // 2. Chain Logic
    useEffect(() => {
        if (filters.channel && globalData) {
            const filtered = globalData.filter(item => item.Channel === filters.channel);
            setChainOptions([...new Set(filtered.map(item => item.Chain))]);
        } else {
            setChainOptions([]);
        }
    }, [filters.channel, globalData]);

    // 3. Depot Logic
    useEffect(() => {
        if (filters.chain && globalData) {
            if (filters.chain !== "All") {
                const filtered = globalData.filter(item => item.Channel === filters.channel && item.Chain === filters.chain);
                setDepotOptions([...new Set(filtered.map(item => item.Depot))]);
            } else {
                setDepotOptions([]);
            }
        } else {
            setDepotOptions([]);
        }
    }, [filters.chain, filters.channel, globalData]);

    // 4. SubCat Logic
    useEffect(() => {
        if (filters.depot && globalData) {
            if (filters.depot !== "All") {
                const filtered = globalData.filter(item =>
                    item.Channel === filters.channel &&
                    item.Chain === filters.chain &&
                    item.Depot === filters.depot
                );
                setSubCatOptions([...new Set(filtered.map(item => item.SubCat))]);
            } else {
                setSubCatOptions([]);
            }
        } else {
            setSubCatOptions([]);
        }
    }, [filters.depot, filters.chain, filters.channel, globalData]);

    // 5. SKU Logic
    useEffect(() => {
        if (filters.subCat && globalData) {
            if (filters.subCat !== "All") {
                const filtered = globalData.filter(item =>
                    item.Channel === filters.channel &&
                    item.Chain === filters.chain &&
                    item.Depot === filters.depot &&
                    item.SubCat === filters.subCat
                );
                setSkuOptions([...new Set(filtered.map(item => item.SKU))]);
            } else {
                setSkuOptions([]);
            }
        } else {
            setSkuOptions([]);
        }
    }, [filters.subCat, filters.channel, filters.chain, filters.depot, globalData]);

    // ==========================================
    //  UPDATED METRICS CALCULATION
    // ==========================================
    useEffect(() => {
        if (globalData) {

            // 1. Filter Data
            const filteredData = globalData.filter(item => {
                if (filters.channel && item.Channel !== filters.channel) return false;
                if (filters.chain && filters.chain !== "All" && item.Chain !== filters.chain) return false;
                if (filters.depot && filters.depot !== "All" && item.Depot !== filters.depot) return false;
                if (filters.subCat && filters.subCat !== "All" && item.SubCat !== filters.subCat) return false;
                if (filters.sku && filters.sku !== "All" && item.SKU !== filters.sku) return false;
                return true;
            });

            // 2. Forecast Period Data
            const forecastData = filteredData.filter(item => item.Period === "Forecast");
            const historyData = filteredData.filter(item => item.Period === "History");

            // --- A. Forecast Volume ---
            // Use ConsensusForecast to reflect the latest user/chatbot plan, not just the static baseline 'forecast'
            const totalForecastVolume = forecastData.reduce((sum, item) => sum + (Number(item.ConsensusForecast) || 0), 0);
            setForecastSum(Math.round(totalForecastVolume));

            // --- B. Forecast Value ---
            const totalForecastValue = forecastData.reduce((sum, item) => {
                const price = Number(item.Price) || 0;
                return sum + ((Number(item.ConsensusForecast) || 0) * price);
            }, 0);
            setForecastValue(Math.round(totalForecastValue));

            // --- C. YoY Growth ---
            const forecastMonths = [...new Set(forecastData.map(d => d.Date ? d.Date.substring(0, 7) : ""))].filter(Boolean);
            const lyMonths = forecastMonths.map(dateStr => {
                const year = parseInt(dateStr.substring(0, 4));
                const month = dateStr.substring(5, 7);
                return `${year - 1}-${month}`;
            });
            const lyData = filteredData.filter(item => {
                const itemMonth = item.Date ? item.Date.substring(0, 7) : "";
                return lyMonths.includes(itemMonth) && item.Period === "History";
            });
            const totalLYActuals = lyData.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);

            if (totalLYActuals > 0) {
                const yoy = ((totalForecastVolume - totalLYActuals) / totalLYActuals) * 100;
                setYoyGrowth(yoy.toFixed(1));
            } else {
                setYoyGrowth(null);
            }

            // --- D. YTD Volume ---
            const currentHistoryYear = "2024";
            const ytdData = filteredData.filter(item => item.Period === "History" && item.Date.startsWith(currentHistoryYear));
            const ytdVolume = ytdData.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);
            setParentLevelForecast(Math.round(ytdVolume));


            // --- E. ACCURACY & BIAS (UPDATED: USING JUL-SEP 2024) ---

            // Target months: July, August, September 2024
            const targetMonths = ['2024-07', '2024-08', '2024-09'];

            const accuracyData = filteredData.filter(item => {
                // Extract YYYY-MM from item date
                const dateStr = item.Date.substring(0, 7);
                // Check if date matches our target months AND has valid actuals
                return targetMonths.includes(dateStr) && item.actual > 0;
            });

            if (accuracyData.length > 0) {
                // Sum up Actuals and Forecasts for these 3 months
                const accSumActual = accuracyData.reduce((s, i) => s + (Number(i.actual) || 0), 0);
                const accSumForecast = accuracyData.reduce((s, i) => s + (Number(i.forecast) || 0), 0);

                // Formula: Accuracy = (1 - |Actual - Forecast| / Actual) * 100
                // We use aggregations to calculate Weighted Accuracy (standard for KPIs)
                const diff = Math.abs(accSumActual - accSumForecast);
                const accVal = (1 - (diff / accSumActual)) * 100;
                setAccuracy(accVal.toFixed(1));

                // Formula: Bias = (Forecast / Actual - 1) * 100
                const biasVal = ((accSumForecast / accSumActual) - 1) * 100;
                setBias(biasVal.toFixed(1));
            } else {
                setAccuracy(null);
                setBias(null);
            }

        } else {
            // Reset all if no data
            setForecastSum(null); setForecastValue(null); setYoyGrowth(null); setParentLevelForecast(null);
            setAccuracy(null); setBias(null);
        }
    }, [filters.channel, filters.chain, filters.depot, filters.subCat, filters.sku, globalData]);

    // Render helpers
    const showChainDropdown = filters.channel;
    const showDepotDropdown = filters.chain && filters.chain !== "All";
    const showSubCatDropdown = filters.depot && filters.depot !== "All";
    const showSKUDropdown = filters.subCat && filters.subCat !== "All";
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
                        <Select onValueChange={handleChannelChange} value={filters.channel || ""}>
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
                            <Select value={filters.chain || ""} onValueChange={handleChainChange} disabled={!filters.channel}>
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
                            <Select value={filters.depot || ""} onValueChange={handleDepotChange} disabled={!filters.chain}>
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
                            <label className="text-sm font-medium text-gray-700">Sub Category</label>
                            <Select value={filters.subCat || ""} onValueChange={handleSubCatChange} disabled={!filters.depot}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select sub-category" /></SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    <SelectItem value="All">ALL</SelectItem>
                                    {subCatOptions.map(subCat => <SelectItem key={subCat} value={subCat}>{subCat.toUpperCase()}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {/* SKU */}
                    {showSKUDropdown && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">SKU</label>
                            <Select value={filters.sku || ""} onValueChange={handleSkuChange} disabled={!filters.subCat}>
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