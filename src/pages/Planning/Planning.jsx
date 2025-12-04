
import React, { useState } from "react";
import { Activity, ArrowDown, ArrowUp, Calendar, DollarSign, ExternalLink, LineChart, Loader2, Minus } from "lucide-react"
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
    const { isSidebarOpen } = useSidebar();
    const {
        forecastSum,
        forecastValue,
        yoyGrowth,
        parentLevelForecast,
        filters,
        globalData,
        isLoading,
        accuracy, // NEW
        bias      // NEW
    } = useForecast();

    const [showFilters, setShowFilters] = useState(false);
    const [showPivotTable, setShowPivotTable] = useState(false);
    const [pivotData, setPivotData] = useState([]);

    const toggleFilters = () => setShowFilters(!showFilters);

    const formatForecastValue = (value, isCurrency = false) => {
        if (value === null || value === undefined) return "N/A";
        if (value >= 10000000) return isCurrency ? `₹ ${(value / 10000000).toFixed(1)} Cr` : `${(value / 10000000).toFixed(1)} Cr`;
        if (value >= 100000) return isCurrency ? `₹ ${(value / 100000).toFixed(1)} L` : `${(value / 100000).toFixed(1)} L`;
        if (value >= 1000) return isCurrency ? `₹ ${(value / 1000).toFixed(1)} K` : `${(value / 1000).toFixed(1)} K`;
        return isCurrency ? `₹ ${value.toFixed(1)}` : value.toFixed(1);
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
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-indigo-600 mb-2">Planning Module</h1>
                                <p className="text-gray-600">Make data-driven decisions with advanced forecasting</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={toggleFilters} className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 transition-colors">
                                    <Filter className="w-4 h-4" /> Filters <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Filters */}
                        <Filters showFilters={showFilters} />

                        {/* KPI Cards */}
                        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Forecast Period: Nov '24 - Jan '25</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>Last updated: Today</span>
                                    <RefreshCw className="w-4 h-4" />
                                </div>
                            </div>

                            {/* UPDATED GRID TO 5 COLUMNS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                {/* 1. Forecast Volume */}
                                <Card className="p-6 bg-blue-50 border border-blue-100 hover:scale-105 transition-transform">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-5 h-5 text-blue-600" />
                                            <p className="text-sm font-medium text-blue-600">Forecast Volume</p>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">{formatForecastValue(forecastSum, false)}</div>
                                        <p className="text-xs text-gray-600">Total predicted units</p>
                                    </div>
                                </Card>

                                {/* 2. Forecast Value */}
                                <Card className="p-6 bg-green-50 border border-green-100 hover:scale-105 transition-transform">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                            <p className="text-sm font-medium text-green-600">Forecast Value</p>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">{formatForecastValue(forecastValue, true)}</div>
                                        <p className="text-xs text-gray-600">Total predicted revenue</p>
                                    </div>
                                </Card>

                                {/* 3. YoY Growth */}
                                <Card className="p-6 bg-yellow-50 border border-yellow-100 hover:scale-105 transition-transform">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <LineChart className="w-5 h-5 text-yellow-600" />
                                            <p className="text-sm font-medium text-yellow-600">YoY Growth</p>
                                        </div>
                                        <div className={`text-3xl font-bold ${yoyGrowth < 0 ? "text-red-500" : "text-green-500"}`}>
                                            {yoyGrowth != null ? `${yoyGrowth > 0 ? '+' : ''}${yoyGrowth}%` : "N/A"}
                                        </div>
                                        <p className="text-xs text-gray-600">vs Same Period Last Year</p>
                                    </div>
                                </Card>

                                {/* 4. YTD Volume */}
                                <Card className="p-6 bg-purple-50 border border-purple-100 hover:scale-105 transition-transform">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                            <p className="text-sm font-medium text-purple-600">YTD Volume (2024)</p>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">{formatForecastValue(parentLevelForecast)}</div>
                                        <p className="text-xs text-gray-600">Total Actuals 2024</p>
                                    </div>
                                </Card>

                                {/* 5. Accuracy & Bias (NEW) */}
                                <Card className="p-6 bg-red-50 border border-red-100 hover:scale-105 transition-transform">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-red-600" />
                                            <p className="text-sm font-medium text-red-600">Model Accuracy</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-end">
                                                <span className="text-2xl font-bold text-gray-900">{accuracy ? `${accuracy}%` : "N/A"}</span>
                                                <span className="text-xs font-medium text-gray-500 mb-1">Acc.</span>
                                            </div>
                                            <div className="w-full h-px bg-red-200 my-1"></div>
                                            <div className="flex justify-between items-end">
                                                <span className={`text-lg font-bold ${bias > 0 ? "text-blue-600" : "text-orange-600"}`}>
                                                    {bias ? `${bias > 0 ? '+' : ''}${bias}%` : "N/A"}
                                                </span>
                                                <span className="text-xs font-medium text-gray-500 mb-1">Bias</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Card>

                        {/* Sales Trend Chart & Chatbot */}
                        <div className="flex flex-col xl:flex-row gap-6 h-[600px]">
                            <Card className="flex-1 flex flex-col p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200 min-w-0">
                                <div className="flex justify-between items-center mb-4 flex-none">
                                    <h3 className="text-lg font-semibold text-gray-800">Sales Trend & Forecast</h3>
                                </div>
                                <div className="flex-1 min-h-0 w-full">
                                    <SalesTrendChart />
                                </div>
                            </Card>
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

                        {/* Pivot Table */}
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