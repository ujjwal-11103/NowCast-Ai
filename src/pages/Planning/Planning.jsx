
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

const Planning = () => {

    const { forecastSum, forecastValue, yoyGrowth, parentLevelForecast, filters } = useForecast();
    console.log("Filters:", filters);

    const formatForecastValue = (value) => {
        if (value >= 1000000) return (value / 1000000).toFixed(1) + "M ";
        if (value >= 1000) return (value / 1000).toFixed(1) + "K ";
        return value.toFixed(1) + " Units";
    };



    return (
        <div className="flex h-full">
            <SideBar />
            <div className="flex-1 overflow-auto ">
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

                                    if (value && allPreviousSelected) {
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
                                        {(forecastSum / 1000).toFixed(1)}
                                    </span>

                                    <span className="ml-1 text-lg font-medium">K Units</span>
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
                                    <span className="text-3xl font-bold text-[#0A2472]">₹ {(forecastValue / 100000).toFixed(1)}</span>
                                    <span className="ml-1 text-lg font-medium">L</span>
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
                                <div className="flex flex-col">
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

                                    {/* Value */}
                                    <div className="flex items-center gap-1 mt-1">
                                        {yoyGrowth == null ? (
                                            <Minus className="text-gray-400" size={16} />
                                        ) : yoyGrowth < 0 ? (
                                            <ArrowDown className="text-red-500" size={16} />
                                        ) : yoyGrowth > 0 ? (
                                            <ArrowUp className="text-green-500" size={16} />
                                        ) : (
                                            <Minus className="text-gray-400" size={16} />
                                        )}

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
                                    <span className="text-3xl font-bold text-[#0A2472]">{parentLevelForecast !== null ? formatForecastValue(parentLevelForecast) : "N/A"}</span>
                                    <span className="ml-1 text-lg font-medium"> Units</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">Total volume for SKU: {filters.sku}</div>
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
                        <div className="h-auto w-full bg-gray-100 rounded-lg flex items-center justify-center">
                            {/* graph */}
                            <SalesTrendChart />
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead colSpan={2}>Last Year Values</TableHead>
                                        <TableHead colSpan={2}>Baseline Forecast</TableHead>
                                        <TableHead>Custom Metric</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead colSpan={2}>Sales Team</TableHead>
                                        <TableHead colSpan={2}>Consensus</TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Jan</TableHead>
                                        <TableHead>Feb</TableHead>
                                        <TableHead>Jan</TableHead>
                                        <TableHead>Feb</TableHead>
                                        <TableHead>LZF/LZA</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Jan</TableHead>
                                        <TableHead>Comment</TableHead>
                                        <TableHead>Jan</TableHead>
                                        <TableHead>Feb</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>2290</TableCell>
                                        <TableCell>578</TableCell>
                                        <TableCell>1182</TableCell>
                                        <TableCell>1246</TableCell>
                                        <TableCell>0.85</TableCell>
                                        <TableCell>SKU 10</TableCell>
                                        <TableCell>0</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>1182</TableCell>
                                        <TableCell>1246</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>4380</TableCell>
                                        <TableCell>4380</TableCell>
                                        <TableCell>2638</TableCell>
                                        <TableCell>2755</TableCell>
                                        <TableCell>0.62</TableCell>
                                        <TableCell>SKU 5</TableCell>
                                        <TableCell>0</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>2638</TableCell>
                                        <TableCell>2755</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>1409</TableCell>
                                        <TableCell>682</TableCell>
                                        <TableCell>1133</TableCell>
                                        <TableCell>1606</TableCell>
                                        <TableCell>1.31</TableCell>
                                        <TableCell>SKU 6</TableCell>
                                        <TableCell>0</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>1133</TableCell>
                                        <TableCell>1606</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>1268</TableCell>
                                        <TableCell>1900</TableCell>
                                        <TableCell>1010</TableCell>
                                        <TableCell>1392</TableCell>
                                        <TableCell>0.76</TableCell>
                                        <TableCell>SKU 9</TableCell>
                                        <TableCell>0</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>1010</TableCell>
                                        <TableCell>1392</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-semibold">Waterfall Charts</h2>
                        </div>

                        <Accordion type="multiple" className="flex flex-wrap gap-4 items-start">
                            <AccordionItem value="item-1" className="w-full md:w-[48%] border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 10 - Jan Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Jan Waterfall Chart for SKU 10</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="w-full md:w-[48%] border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 10 - Feb Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Feb Waterfall Chart for SKU 10</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="w-full md:w-[48%] border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 5 - Jan Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Jan Waterfall Chart for SKU 5</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="w-full md:w-[48%] border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 5 - Feb Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Feb Waterfall Chart for SKU 5</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5" className="w-full md:w-[48%] border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 6 - Jan Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Jan Waterfall Chart for SKU 6</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-6" className="w-full md:w-[48%] border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 6 - Feb Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Feb Waterfall Chart for SKU 6</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-7" className="w-full md:w-[48%] border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 9 - Jan Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Jan Waterfall Chart for SKU 9</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-8" className="w-full md:w-[48%] border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 9 - Feb Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Feb Waterfall Chart for SKU 9</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Planning