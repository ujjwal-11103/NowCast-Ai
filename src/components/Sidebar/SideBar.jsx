import React, { useEffect, useState } from "react";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Menu } from "lucide-react";

import data from "../../jsons/Planning/JF_censored.json"
import priceData from "../../jsons/Planning/price_df_censored.json";

import { useForecast } from "@/context/ForecastContext/ForecastContext";

const SideBar = () => {
    const { selectedNav, setSelectedNav } = useSidebar();
    const [isOpen, setIsOpen] = useState(true);

    const { forecastSum, setForecastSum, forecastValue, setForecastValue, yoyGrowth, setYoyGrowth, parentLevelForecast, setParentLevelForecast, setFilters } = useForecast();

    const [selectedChannel, setSelectedChannel] = useState(null);
    const [selectedChain, setSelectedChain] = useState(null);
    const [selectedDepot, setSelectedDepot] = useState(null);
    const [selectedSubCat, setSelectedSubCat] = useState(null);
    const [selectedSubSKU, setSelectedSubSKU] = useState(null);

    const [channelOptions, setChannelOptions] = useState([]);
    const [chainOptions, setChainOptions] = useState([]);
    const [depotOptions, setDepotOptions] = useState([]);
    const [subCatOptions, setSubCatOptions] = useState([]);
    const [skuOptions, setSkuOptions] = useState([]);

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

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 bg-[#0A2472] text-white p-2 rounded-md shadow-md lg:hidden"
            >
                <Menu size={20} />
            </button>

            <div
                className={`fixed top-0 left-0 h-screen overflow-y-auto bg-[#E6F0FF] border-r z-40 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64 lg:translate-x-0`}
            >
                <div className="p-4">
                    <h2 className="font-medium mb-4">Navigation</h2>
                    <RadioGroup
                        value={selectedNav}
                        className="space-y-2"
                        onValueChange={setSelectedNav}
                    >
                        {[
                            "Overall",
                            "Ingestion",
                            "Planning",
                            "Reporting",
                            "Error Analysis",
                            "Norms",
                            "Supply Chain",
                        ].map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={item}
                                    id={item.toLowerCase().replace(" ", "-")}
                                    className="h-4 w-4 border-2 border-[#0A2472] text-[#0A2472]"
                                />
                                <Label
                                    htmlFor={item.toLowerCase().replace(" ", "-")}
                                    className={`cursor-pointer ${selectedNav === item ? "text-[#0A2472] font-medium" : ""}`}
                                >
                                    {item}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="p-4 border-t space-y-4">
                    {/* Channel */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">Channel</h3>
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
                    {showChainDropdown && (
                        <div>
                            <h3 className="text-sm font-medium mb-2">Chain</h3>
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
                    {showDepotDropdown && (
                        <div>
                            <h3 className="text-sm font-medium mb-2">Depot</h3>
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
                    {showSubCatDropdown && (
                        <div>
                            <h3 className="text-sm font-medium mb-2">SubCat</h3>
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
                    {showSKUDropdown && (
                        <div>
                            <h3 className="text-sm font-medium mb-2">SKU</h3>
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
                </div>
            </div>
        </>
    );
};

export default SideBar;