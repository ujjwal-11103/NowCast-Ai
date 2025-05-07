
import React, { useState } from "react";
import { ArrowDown, ArrowUp, DollarSign, ExternalLink, LineChart, Minus } from "lucide-react"
import { Package } from 'lucide-react';
import { ChartPie } from 'lucide-react';



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

const Planning = () => {

    const { forecastSum, forecastValue, yoyGrowth, parentLevelForecast, filters } = useForecast();
    console.log("Filters:", filters.channel);

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





    return (
        <div className="h-full overflow-x-hidden">
            <header className="flex items-center justify-between border-b p-4">
                <h1 className="text-2xl font-bold text-[#0A2472]">Planning Module</h1>
            </header>

            <main className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Forecasted Months: Jan - Feb '25</h2>

                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Package className="h-6 w-6 text-blue-500" />
                                <span className="text-sm font-medium">Forecasted Volume</span>
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-[#0A2472]">
                                    {formatForecastValue(forecastSum, false)}
                                </span>

                                <span className="ml-1 text-lg font-medium text-[#0A2472]">Units</span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">Total predicted units</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-6 w-6 text-blue-500" />
                                <span className="text-sm font-medium">Forecasted Value</span>
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-[#0A2472]">
                                    {formatForecastValue(forecastValue, true, true)}
                                </span>
                                {/* <span className="ml-1 text-lg font-medium">L</span> */}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">Total predicted revenue</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <LineChart className="h-6 w-6 text-green-500" size={24} />
                                <span className="text-sm font-medium">YoY Growth</span>
                            </div>
                            <div className="flex justify-center gap-8">
                                {/* Volume */}
                                <div className="flex items-center gap-1">
                                    {yoyGrowth == null ? (
                                        <Minus className="text-gray-400" size={16} />
                                    ) : yoyGrowth < 0 ? (
                                        <ArrowDown className="text-red-500" size={16} />
                                    ) : yoyGrowth > 0 ? (
                                        <ArrowUp className="text-green-500" size={16} />
                                    ) : (
                                        <Minus className="text-gray-400" size={16} />
                                    )}
                                    <div className="flex flex-col">

                                        <span
                                            className={`font-medium ${yoyGrowth == null
                                                ? "text-gray-400"
                                                : yoyGrowth < 0
                                                    ? "text-red-500"
                                                    : yoyGrowth > 0
                                                        ? "text-green-500"
                                                        : "text-gray-400"
                                                }`}
                                        >
                                            {yoyGrowth != null ? `${Math.abs(yoyGrowth)}%` : "--"}
                                        </span>

                                        <span className="text-xs text-gray-500">(Volume)</span>
                                    </div>
                                </div>

                                {/* Value */}
                                <div className="flex items-center gap-1">
                                    {yoyGrowth == null ? (
                                        <Minus className="text-gray-400" size={16} />
                                    ) : yoyGrowth < 0 ? (
                                        <ArrowDown className="text-red-500" size={16} />
                                    ) : yoyGrowth > 0 ? (
                                        <ArrowUp className="text-green-500" size={16} />
                                    ) : (
                                        <Minus className="text-gray-400" size={16} />
                                    )}

                                    <div className="flex flex-col">

                                        <span
                                            className={`font-medium ${yoyGrowth == null
                                                ? "text-gray-400"
                                                : yoyGrowth < 0
                                                    ? "text-red-500"
                                                    : yoyGrowth > 0
                                                        ? "text-green-500"
                                                        : "text-gray-400"
                                                }`}
                                        >
                                            {yoyGrowth != null ? `${Math.abs(yoyGrowth)}%` : "--"}
                                        </span>

                                        <span className="text-xs text-gray-500">(Value)</span>
                                    </div>
                                </div>
                            </div>


                            <div className="mt-2 text-xs text-gray-500">vs Jan+Feb 2024 Actuals</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <ChartPie className="h-6 w-6 text-blue-500" />
                                <span className="text-sm font-medium">Total Volume</span>
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-[#0A2472]">
                                    {parentLevelForecast !== null ? formatForecastValue(parentLevelForecast) : "N/A"}
                                </span>
                                <span className="ml-1 text-lg font-medium text-[#0A2472]">Units</span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Total volume for: {
                                    (() => {
                                        // Find the last non-"All" filter value
                                        const lastNonAllKey = ["sku", "subCat", "depot", "chain", "channel"]
                                            .find(k => filters[k] && filters[k] !== "All");
                                        return lastNonAllKey ? filters[lastNonAllKey] : "selected filters";
                                    })()
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Legend</span>
                            <div className="flex items-center gap-1">
                                <div className="h-1 w-6 bg-gray-400 rounded"></div>
                                <span className="text-xs">Actual Sales</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-1 w-6 bg-green-400 rounded"></div>
                                <span className="text-xs">Forecast</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg flex items-center justify-center">
                        {/* graph */}
                        <SalesTrendChart />
                    </div>
                </div>

                <div className="mb-8">
                    <ForecastTable
                        data={data}
                        selections={[
                            { field: 'Channel', value: filters.channel },
                            { field: 'Chain', value: filters.chain },
                            { field: 'Depot', value: filters.depot },
                            { field: 'SubCat', value: filters.subCat },
                            { field: 'SKU', value: filters.sku }
                        ]}
                    />
                </div>

            </main>
        </div>
    )
}

export default Planning