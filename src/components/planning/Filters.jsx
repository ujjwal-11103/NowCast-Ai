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
import data from "../../jsons/Planning/JF_censored.json";
import priceData from "../../jsons/Planning/price_df_censored.json";
import { useForecast } from "@/context/ForecastContext/ForecastContext";

const Filters = ({ showFilters }) => {

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

    // Determine if current page is Norms
    const location = useLocation();
    const isNormsPage = location.pathname === "/norms";
    // console.log("isNormsPage", isNormsPage);



    return (
        <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                    {/* Channel */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Channel</label>
                        <Select onValueChange={setSelectedChannel}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                {channelOptions.map(channel => (
                                    <SelectItem key={channel} value={channel}>
                                        {channel.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Chain - only show if channel is selected */}
                    {showChainDropdown && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Chain</label>
                            <Select
                                value={selectedChain || ""}
                                onValueChange={setSelectedChain}
                                disabled={!selectedChannel}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select chain" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
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
                    {showDepotDropdown && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Depot</label>
                            <Select
                                value={selectedDepot || ""}
                                onValueChange={setSelectedDepot}
                                disabled={!selectedChain}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select depot" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
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
                    {showSubCatDropdown && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">SubCat</label>
                            <Select
                                value={selectedSubCat || ""}
                                onValueChange={setSelectedSubCat}
                                disabled={!selectedDepot}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select subcat" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
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
                    {showSKUDropdown && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">SKU</label>
                            <Select
                                value={selectedSubSKU || ""}
                                onValueChange={setSelectedSubSKU}
                                disabled={!selectedSubCat}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select SKU" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Service Level Accuracy</label>
                            <Select
                                value={selectedAccuracy}
                                onValueChange={(value) => {
                                    setSelectedAccuracy(value);
                                    setAccuracyLevel(value);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select accuracy" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
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
            </Card>
        </div>
    );
};

export default Filters;