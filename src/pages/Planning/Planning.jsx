
import React, { useState } from "react";
import { ArrowDown, ArrowUp, Calendar, DollarSign, ExternalLink, LineChart, Loader2, Minus } from "lucide-react"
import { Package } from 'lucide-react';
import { ChartPie } from 'lucide-react';
import { Filter, RefreshCw, Download, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import SideBar from "@/components/Sidebar/SideBar";
import { useForecast } from "@/context/ForecastContext/ForecastContext";
import SalesTrendChart from "@/components/planning/SalesTrendChart ";
import ForecastTable from "@/components/planning/ForecastTable";

import data from "../../jsons/Planning/JF_censored.json"
import { useSidebar } from "@/context/sidebar/SidebarContext";
import Filters from "@/components/planning/Filters";
import PivotTableComponent from "@/components/planning/PivotTableComponent";
import Chatbot from "@/components/Chatbot/Chatbot";



const Planning = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const {
        forecastSum,
        forecastValue,
        yoyGrowth,
        parentLevelForecast,
        filters,
        globalData,
        isLoading
    } = useForecast();

    const [showFilters, setShowFilters] = useState(false);

    const [showPivotTable, setShowPivotTable] = useState(false);
    const [pivotData, setPivotData] = useState([]);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };


    const formatForecastValue = (value, isCurrency = false, useIndianUnits = false) => {
        if (value === null || value === undefined) return "N/A";
        let formattedValue;

        if (useIndianUnits) {
            if (value >= 10000000) {
                formattedValue = (value / 10000000).toFixed(1) + " Cr";
            } else if (value >= 100000) {
                formattedValue = (value / 100000).toFixed(1) + " L";
            } else {
                formattedValue = value.toFixed(1);
            }
            return isCurrency ? `₹ ${formattedValue}` : `${formattedValue}`;
        } else {
            if (value >= 1_000_000) {
                formattedValue = (value / 1_000_000).toFixed(1) + "M";
            } else if (value >= 1_000) {
                formattedValue = (value / 1_000).toFixed(1) + "K";
            } else {
                formattedValue = value.toFixed(1);
            }
            return isCurrency ? `₹ ${formattedValue}` : `${formattedValue}`;
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <p className="text-gray-500 font-medium">Loading Forecast Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex">
                <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} fixed`}>
                    <SideBar />
                </div>

                <div className={`main transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} w-full bg-gray-50 p-6`}>
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Header Section */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-indigo-600 mb-2">Planning Module</h1>
                                <p className="text-gray-600">Make data-driven decisions with advanced forecasting</p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={toggleFilters}
                                    className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 transition-colors"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                                </Button>

                                {/* <Button variant="outline"
                                    className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 transition-colors">
                                    <RefreshCw className="w-4 h-4" />
                                    Refresh
                                </Button> */}

                            </div>
                        </div>

                        {/* Animated Filter Dropdowns */}
                        <Filters
                            showFilters={showFilters}
                        />

                        {/* Forecasted Period Header */}
                        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold text-gray-800">Forecasted Months: Jan - Feb '24</h2>
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                                        <span className="text-xs text-gray-500">?</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>Last updated: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <RefreshCw className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Existing Filter Display */}
                            <div className="">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Forecasted Sales for:</span>
                                    <div className="flex items-center gap-2">
                                        {["channel", "chain", "depot", "subCat", "sku"].map((key, index, array) => {
                                            const value = filters[key];
                                            const nextKeys = array.slice(0, index + 1);
                                            const allPreviousSelected = nextKeys.every(k => filters[k] !== null);

                                            // Find the last non-"All" value in the filters
                                            const lastNonAllKey = [...array].reverse().find(k => filters[k] && filters[k] !== "All");

                                            // Only show if:
                                            // 1. It's the last non-"All" value or any previous value before it
                                            // 2. All previous filters are selected
                                            if (value && value !== "All" && allPreviousSelected && array.indexOf(lastNonAllKey) >= index) {
                                                return (
                                                    <React.Fragment key={key}>
                                                        {index !== 0 && <span>&gt;</span>}
                                                        <Badge className="bg-[#3661ee] hover:bg-[#3351ad] text-white">{value}</Badge>
                                                    </React.Fragment>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Forecasted Volume Card */}
                                <Card className="p-6 bg-blue-50 border border-blue-100 hover:shadow-lg transition-all duration-200 hover:scale-105">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-5 h-5 text-blue-600" />
                                            <p className="text-sm font-medium text-blue-600">Forecasted Volume</p>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-gray-900">
                                                {formatForecastValue(forecastSum, false)}
                                            </span>
                                            <span className="text-sm text-gray-500">Units</span>
                                        </div>
                                        <p className="text-xs text-gray-600">Total predicted units</p>
                                    </div>
                                </Card>

                                {/* Forecasted Value Card */}
                                <Card className="p-6 bg-green-50 border border-green-100 hover:shadow-lg transition-all duration-200 hover:scale-105">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                            <p className="text-sm font-medium text-green-600">Forecasted Value</p>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-gray-900">
                                                {formatForecastValue(forecastValue, true, true)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">Total predicted revenue</p>
                                    </div>
                                </Card>

                                {/* YoY Growth Card */}
                                <Card className="p-6 bg-yellow-50 border border-yellow-100 hover:shadow-lg transition-all duration-200 hover:scale-105">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <LineChart className="w-5 h-5 text-yellow-600" />
                                            <p className="text-sm font-medium text-yellow-600">YoY Growth</p>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-3xl font-bold ${yoyGrowth == null ? "text-gray-900" : yoyGrowth < 0 ? "text-red-500" : "text-green-500"}`}>
                                                {yoyGrowth != null ? `${yoyGrowth > 0 ? '+' : ''}${Math.abs(yoyGrowth)}%` : "N/A"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">vs Jan+Feb 2024 Actuals</p>
                                    </div>
                                </Card>

                                {/* Total Volume Card -> Change to YTD Volume */}
                                <Card className="p-6 bg-purple-50 border border-purple-100 hover:shadow-lg transition-all duration-200 hover:scale-105">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                            <p className="text-sm font-medium text-purple-600">YTD Volume (2024)</p>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-gray-900">
                                                {parentLevelForecast !== null ? formatForecastValue(parentLevelForecast) : "N/A"}
                                            </span>
                                            <span className="text-sm text-gray-500">Units</span>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            Total Actuals for 2024
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </Card>

                        {/* Sales Trend Chart Section */}
                        <div className="flex flex-col xl:flex-row gap-6 h-[600px]">

                            {/* Left Side: Sales Trend Chart */}
                            {/* Added 'flex-1' to take up space and 'h-full' to match height */}
                            <Card className="flex-1 flex flex-col p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200 min-w-0">
                                <div className="flex justify-between items-center mb-4 flex-none">
                                    <h3 className="text-lg font-semibold text-gray-800">Sales Trend & Forecast</h3>
                                </div>

                                {/* Chart Container - Fills remaining height */}
                                <div className="flex-1 min-h-0 w-full">
                                    <SalesTrendChart />
                                </div>
                            </Card>

                            {/* Right Side: Chatbot */}
                            {/* Fixed width of 400px on large screens */}
                            <div className="w-full xl:w-[400px] h-full flex-none">
                                <Chatbot />
                            </div>
                        </div>

                        {/* Forecast Table */}
                        <div className="mb-8">
                            <ForecastTable
                                data={globalData}
                                selections={[
                                    { field: 'Channel', value: filters.channel },
                                    { field: 'Chain', value: filters.chain },
                                    { field: 'Depot', value: filters.depot },
                                    { field: 'SubCat', value: filters.subCat },
                                    { field: 'SKU', value: filters.sku }
                                ]}
                                onPivotRequest={(tableData) => {
                                    setPivotData(tableData);
                                    setShowPivotTable(true);
                                }}
                            />
                        </div>

                        {/* // Pivot */}
                        {showPivotTable && (
                            <PivotTableComponent
                                tableData={pivotData}
                                onClose={() => setShowPivotTable(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Planning;