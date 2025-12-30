
import React, { useState, useEffect } from "react";
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import SideBar from "@/components/Sidebar/SideBar";
import { useForecast } from "@/context/ForecastContext/ForecastContext";
import SalesTrendChart from "@/components/planning/SalesTrendChart ";
import ForecastTable from "@/components/planning/ForecastTable";
import ForecastBreakupTable, { ConsensusBridge, ForecastBridge } from "@/components/planning/ForecastBreakupTable";

import data from "../../jsons/Planning/JF_censored.json"
import { useSidebar } from "@/context/sidebar/SidebarContext";
import Filters from "@/components/planning/Filters";
import PivotTableComponent from "@/components/planning/PivotTableComponent";
import Chatbot from "@/components/Chatbot/Chatbot";
import { formatIndianNumber as formatForecastValue } from "@/utils/formatters";
import MarqueeAnnouncement from "@/components/common/MarqueeAnnouncement";
import WaterfallChart from '@/components/planning/WaterfallChart';


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
        setFilters, // Get setFilters
        accuracy, // NEW
        bias      // NEW
    } = useForecast();

    const [showFilters, setShowFilters] = useState(false);
    const [showPivotTable, setShowPivotTable] = useState(false);
    const [pivotData, setPivotData] = useState([]);
    const [chartToggle, setChartToggle] = useState({
        oos: false
        // seasonalityTrends: false
    });

    // --- LIFTED STATE & LOGIC ---
    const selections = [
        { field: 'Channel', value: filters.channel },
        { field: 'Chain', value: filters.chain },
        { field: 'Depot', value: filters.depot },
        { field: 'SubCat', value: filters.subCat },
        { field: 'SKU', value: filters.sku }
    ];

    // 1. Determine Hierarchy
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadReport = async () => {
        setIsDownloading(true);
        try {
            // Match the key format used in data: Chain_Depot_SubCat_SKU

            const key = `${filters.chain || 'All'}_${filters.depot || 'All'}_${filters.sku || 'All'}`;
            const rawYtd = Number(parentLevelForecast) || 0;
            const ytdScaled = rawYtd < 10000000
                ? Number((rawYtd / 100000).toFixed(2))  // Less than 1 Cr -> Lakhs
                : Number((rawYtd / 10000000).toFixed(2)); // 1 Cr or more -> Crores

            const payload = {
                key: key,
                report_key: key,
                forecast_volume: Number(((Number(forecastSum) || 0) / 100000).toFixed(2)), // Scaled to Lakhs (L)
                forecast_value: Number(((Number(forecastValue) || 0) / 10000000).toFixed(2)), // Scaled to Crores (Cr)
                yoy_growth: Number(yoyGrowth) || 0,
                ytd_volume: ytdScaled,
                model_accuracy: Number(accuracy) || 0,
                question: "Generate Report", // Providing default question just in case
                api_answer: "" // Providing default answer
            };

            console.log("Sending Report Payload:", payload);

            const response = await fetch('http://20.235.178.245:5500/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to generate report');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "forecast_report.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading report:", error);
            alert(`Failed to download report: ${error.message}. Please check console for details.`);
        } finally {
            setIsDownloading(false);
        }
    };

    const getItemLevel = () => {
        if (!filters.channel || filters.channel === 'All') return 'Channel';
        if (!filters.chain) return 'Chain';

        // If Chain is 'All', show Depots (Subcategory of Chain), unless a specific depot is selected
        const isChainAll = filters.chain === 'All';
        const isDepotSpecific = filters.depot && filters.depot !== 'All';
        if (isChainAll && !isDepotSpecific) return 'Depot';

        if (!filters.depot) return 'Depot';

        // If Depot is 'All', show SubCats (Subcategory of Depot), unless a specific subcat is selected
        const isDepotAll = filters.depot === 'All';
        const isSubCatSpecific = filters.subCat && filters.subCat !== 'All';
        if (isDepotAll && !isSubCatSpecific) return 'SubCat';

        if (!filters.subCat) return 'SubCat';

        // If SubCat is 'All', show SKUs
        if (filters.subCat === 'All' && (!filters.sku || filters.sku === 'All')) return 'SKU';

        return 'SKU';
    }
    const itemLevel = getItemLevel()

    const handleDrillDown = (itemName) => {
        const currentLevel = itemLevel; // Uses specific logic
        const newFilters = { ...filters };

        if (currentLevel === 'Channel') newFilters.channel = itemName;
        else if (currentLevel === 'Chain') newFilters.chain = itemName;
        else if (currentLevel === 'Depot') newFilters.depot = itemName;
        else if (currentLevel === 'SubCat') newFilters.subCat = itemName;

        setFilters(newFilters);
    };

    // 2. Filter Data
    // 2. Filter Data
    const filteredData = globalData.filter(item => {
        return selections.every(sel => {
            // When filtering, if a selection is 'All' (e.g., Chain=All), we do NOT filter by specific Chain.
            // We just ensure the PARENT level matches.
            // Since we process top-down (Channel -> Chain -> Depot), the previous checks handle the parent.
            // So if value is 'All', we simply return true (include all items at this level).

            if (sel.value === 'All') return true
            if (!sel.value) return true // Treat null/undefined as pass for safety (or handling unselected lower levels)
            return item[sel.field] === sel.value
        })
    })

    // 3. Group & Sum Data (Oct, Nov, Dec)
    const groupedData = filteredData.reduce((acc, item) => {
        const key = item[itemLevel]
        if (!acc[key]) {
            acc[key] = {
                name: key,
                LYOct: 0, LYNov: 0, LYDec: 0,
                ForecastOct: 0, ForecastNov: 0, ForecastDec: 0,
                // Intelligence Columns
                Recent_Trend_Category: item.Recent_Trend_Category,
                Long_Term_Trend_Category: item.Long_Term_Trend_Category,
                Forecast_Summary: item.Forecast_Summary,
                // Metadata storage
                salesInputOct: null, salesInputNov: null, salesInputDec: null,
                // Arrays to store raw items for accurate consensus diff calculation
                itemsOct: [], itemsNov: [], itemsDec: [],
                // Forecast Components
                TrendOct: 0, TrendNov: 0, TrendDec: 0,
                SeasonalityOct: 0, SeasonalityNov: 0, SeasonalityDec: 0,
                DiscountOct: 0, DiscountNov: 0, DiscountDec: 0,
                SpendsOct: 0, SpendsNov: 0, SpendsDec: 0,
                Lag3Oct: 0, Lag3Nov: 0, Lag3Dec: 0,
                MA4Oct: 0, MA4Nov: 0, MA4Dec: 0
            }
        }

        // LY Logic (2023)
        if (item.Date && item.Date.includes('2023-10')) acc[key].LYOct += Number(item.actual) || 0
        if (item.Date && item.Date.includes('2023-11')) acc[key].LYNov += Number(item.actual) || 0
        if (item.Date && item.Date.includes('2023-12')) acc[key].LYDec += Number(item.actual) || 0

        // Forecast Logic (2024) & Metadata Capture
        // We accumulate the raw items into arrays so we can sum their ConsensusForecast later
        if (item.Date && item.Date.includes('2024-10')) {
            acc[key].ForecastOct += Number(item.forecast) || 0;
            acc[key].itemsOct.push(item);
            if (item.salesInput) acc[key].salesInputOct = item.salesInput;

            acc[key].TrendOct += Number(item.Trend) || (Number(item.forecast || 0) * 0.5);
            acc[key].SeasonalityOct += Number(item.Seasonality) || (Number(item.forecast || 0) * 0.2);
            acc[key].DiscountOct += Number(item.Discount) || (Number(item.forecast || 0) * 0.1);
            acc[key].SpendsOct += Number(item.Spends) || (Number(item.forecast || 0) * 0.1);
            acc[key].Lag3Oct += Number(item.Lag3) || (Number(item.forecast || 0) * 0.05);
            acc[key].MA4Oct += Number(item.MA4) || (Number(item.forecast || 0) * 0.05);
        }
        if (item.Date && item.Date.includes('2024-11')) {
            acc[key].ForecastNov += Number(item.forecast) || 0;
            acc[key].itemsNov.push(item);
            if (item.salesInput) acc[key].salesInputNov = item.salesInput;

            acc[key].TrendNov += Number(item.Trend) || (Number(item.forecast || 0) * 0.5);
            acc[key].SeasonalityNov += Number(item.Seasonality) || (Number(item.forecast || 0) * 0.2);
            acc[key].DiscountNov += Number(item.Discount) || (Number(item.forecast || 0) * 0.1);
            acc[key].SpendsNov += Number(item.Spends) || (Number(item.forecast || 0) * 0.1);
            acc[key].Lag3Nov += Number(item.Lag3) || (Number(item.forecast || 0) * 0.05);
            acc[key].MA4Nov += Number(item.MA4) || (Number(item.forecast || 0) * 0.05);
        }
        if (item.Date && item.Date.includes('2024-12')) {
            acc[key].ForecastDec += Number(item.forecast) || 0;
            acc[key].itemsDec.push(item);
            if (item.salesInput) acc[key].salesInputDec = item.salesInput;

            acc[key].TrendDec += Number(item.Trend) || (Number(item.forecast || 0) * 0.5);
            acc[key].SeasonalityDec += Number(item.Seasonality) || (Number(item.forecast || 0) * 0.2);
            acc[key].DiscountDec += Number(item.Discount) || (Number(item.forecast || 0) * 0.1);
            acc[key].SpendsDec += Number(item.Spends) || (Number(item.forecast || 0) * 0.1);
            acc[key].Lag3Dec += Number(item.Lag3) || (Number(item.forecast || 0) * 0.05);
            acc[key].MA4Dec += Number(item.MA4) || (Number(item.forecast || 0) * 0.05);
        }

        // Capture Intelligence Columns if present (as they might only be on specific rows like 2024-10)
        if (!acc[key].Recent_Trend_Category && item.Recent_Trend_Category) acc[key].Recent_Trend_Category = item.Recent_Trend_Category;
        if (!acc[key].Long_Term_Trend_Category && item.Long_Term_Trend_Category) acc[key].Long_Term_Trend_Category = item.Long_Term_Trend_Category;
        if (!acc[key].Forecast_Summary && item.Forecast_Summary) acc[key].Forecast_Summary = item.Forecast_Summary;

        return acc
    }, {})

    const tableData = Object.values(groupedData).map(item => ({ ...item }))

    const [teamInputs, setTeamInputs] = useState({});
    const [consensusValues, setConsensusValues] = useState({});

    // --- AUTO-FILL & SYNC EFFECT ---
    // This runs whenever 'globalData' changes (Initial Load OR Chatbot Update)
    useEffect(() => {
        const nextInputs = {};
        const nextConsensus = {};

        tableData.forEach(row => {
            // Helper to process a month
            const processMonth = (items, baselineSum, salesInputMetadata) => {
                // Default: Consensus = Baseline
                let consensusSum = baselineSum;
                let inputData = null;

                // If we have items for this month
                if (items && items.length > 0) {
                    // 1. Calculate the True Consensus from the Data (which API updated)
                    // Note: We use 'ConsensusForecast' if available, else 'forecast'
                    const dataConsensus = items.reduce((sum, item) =>
                        sum + (item.ConsensusForecast !== undefined ? Number(item.ConsensusForecast) : Number(item.forecast)), 0);

                    // 2. If Chatbot updated this row, we will have salesInputMetadata
                    // OR if the Data Consensus differs from Baseline (Manual or API)
                    if (salesInputMetadata) {
                        // The Delta is what we show in the Input Box
                        const delta = dataConsensus - baselineSum;

                        inputData = {
                            value: Math.round(delta), // Show +20, -50, etc.
                            comment: salesInputMetadata.comment,
                            owner: salesInputMetadata.owner
                        };

                        // Set Consensus to the Data Value
                        consensusSum = dataConsensus;
                    }
                }

                return { consensus: consensusSum, input: inputData };
            };

            const octResult = processMonth(row.itemsOct, row.ForecastOct, row.salesInputOct);
            const novResult = processMonth(row.itemsNov, row.ForecastNov, row.salesInputNov);
            const decResult = processMonth(row.itemsDec, row.ForecastDec, row.salesInputDec);

            // Update Inputs State (Only if inputData exists)
            if (octResult.input || novResult.input || decResult.input) {
                if (!nextInputs[row.name]) nextInputs[row.name] = { sales: {}, marketing: {}, finance: {} };
                if (octResult.input) nextInputs[row.name].sales.oct = octResult.input;
                if (novResult.input) nextInputs[row.name].sales.nov = novResult.input;
                if (decResult.input) nextInputs[row.name].sales.dec = decResult.input;
            }

            // Update Consensus State
            nextConsensus[row.name] = {
                oct: Math.round(octResult.consensus),
                nov: Math.round(novResult.consensus),
                dec: Math.round(decResult.consensus)
            };
        });

        setTeamInputs(nextInputs);
        setConsensusValues(nextConsensus);

    }, [globalData, filters]); // Re-run when data or filters change


    // Handle MANUAL input changes (Supports Batch or Single)
    const handleTeamInputChange = (arg1, team, month, field, value) => {
        const changes = Array.isArray(arg1) ? arg1 : [{ itemName: arg1, team, month, field, value }];

        setTeamInputs(prev => {
            const newInputs = { ...prev };

            changes.forEach(({ itemName, team, month, field, value }) => {
                if (!newInputs[itemName]) newInputs[itemName] = { sales: {}, marketing: {}, finance: {} };
                if (!newInputs[itemName][team]) newInputs[itemName][team] = {};
                if (!newInputs[itemName][team][month]) newInputs[itemName][team][month] = {};
                newInputs[itemName][team][month][field] = value;
            });

            // Recalculate Consensus for affected rows
            // We need access to the UPDATED inputs to calc consensus. 'newInputs' has them.
            setConsensusValues(curr => {
                const newConsensus = { ...curr };
                const affectedRows = new Set(changes.map(c => c.itemName));

                affectedRows.forEach(name => {
                    const row = tableData.find(r => r.name === name);
                    if (row) {
                        const getVal = (t, m) => parseFloat(newInputs[name]?.[t]?.[m]?.value) || 0;
                        const calcMonth = (m, base) => base + getVal('sales', m) + getVal('marketing', m) + getVal('finance', m);

                        // Recalculate all months for this row (or just affected ones? easier to do all)
                        newConsensus[name] = {
                            oct: Math.round(calcMonth('oct', row.ForecastOct)),
                            nov: Math.round(calcMonth('nov', row.ForecastNov)),
                            dec: Math.round(calcMonth('dec', row.ForecastDec))
                        };
                    }
                });
                return newConsensus;
            });

            return newInputs;
        });
    };

    // --- END LIFTED STATE & LOGIC ---

    const toggleFilters = () => setShowFilters(!showFilters);

    const handleToggleChart = (toggleType) => {
        setChartToggle(prev => ({
            ...prev,
            [toggleType]: !prev[toggleType]
        }));
    };

    // Calculate Aggregated Bridge Data Per Month
    const bridgeData = React.useMemo(() => {
        if (!tableData || tableData.length === 0) return [];

        // Aggregate per Month
        const months = {
            'Oct': { label: 'Oct', baseline: 0, sales: 0, marketing: 0, finance: 0, trend: 0, seasonality: 0, discount: 0, spends: 0, lag3: 0, ma4: 0 },
            'Nov': { label: 'Nov', baseline: 0, sales: 0, marketing: 0, finance: 0, trend: 0, seasonality: 0, discount: 0, spends: 0, lag3: 0, ma4: 0 },
            'Dec': { label: 'Dec', baseline: 0, sales: 0, marketing: 0, finance: 0, trend: 0, seasonality: 0, discount: 0, spends: 0, lag3: 0, ma4: 0 },
        };

        tableData.forEach(row => {
            // Baselines (Already summed in tableData items)
            months['Oct'].baseline += (Number(row.ForecastOct) || 0);
            months['Nov'].baseline += (Number(row.ForecastNov) || 0);
            months['Dec'].baseline += (Number(row.ForecastDec) || 0);

            // Inputs (Keyed by row name)
            const inputs = teamInputs[row.name];
            if (inputs) {
                // Sales
                months['Oct'].sales += (parseFloat(inputs.sales?.oct?.value) || 0);
                months['Nov'].sales += (parseFloat(inputs.sales?.nov?.value) || 0);
                months['Dec'].sales += (parseFloat(inputs.sales?.dec?.value) || 0);

                // Marketing
                months['Oct'].marketing += (parseFloat(inputs.marketing?.oct?.value) || 0);
                months['Nov'].marketing += (parseFloat(inputs.marketing?.nov?.value) || 0);
                months['Dec'].marketing += (parseFloat(inputs.marketing?.dec?.value) || 0);

                // Finance
                months['Oct'].finance += (parseFloat(inputs.finance?.oct?.value) || 0);
                months['Nov'].finance += (parseFloat(inputs.finance?.nov?.value) || 0);
                months['Dec'].finance += (parseFloat(inputs.finance?.dec?.value) || 0);
            }

            // System Components
            ['Oct', 'Nov', 'Dec'].forEach(m => {
                const suffix = m; // Oct, Nov, Dec
                months[m].trend += (Number(row[`Trend${suffix}`]) || 0);
                months[m].seasonality += (Number(row[`Seasonality${suffix}`]) || 0);
                months[m].discount += (Number(row[`Discount${suffix}`]) || 0);
                months[m].spends += (Number(row[`Spends${suffix}`]) || 0);
                months[m].lag3 += (Number(row[`Lag3${suffix}`]) || 0);
                months[m].ma4 += (Number(row[`MA4${suffix}`]) || 0);
            });
        });

        // Calculate Finals
        return Object.values(months).map(m => ({
            ...m,
            final: m.baseline + m.sales + m.marketing + m.finance,
            systemFinal: m.trend + m.seasonality + m.discount + m.spends + m.lag3 + m.ma4
        }));

    }, [tableData, teamInputs]);



    // --- Marquee Messages Logic ---
    // --- Marquee Messages Logic ---
    const marqueeMessages = React.useMemo(() => {
        // Use filteredData instead of globalData to honor active filters
        if (!filteredData || filteredData.length === 0) return null;

        const uniqueKeys = new Set();
        const messages = [];

        // Prioritize items with active alerts
        const sortedData = [...filteredData].sort((a, b) => {
            const aAlert = a.Alert && a.Alert !== 'No Alert' ? 1 : 0;
            const bAlert = b.Alert && b.Alert !== 'No Alert' ? 1 : 0;
            return bAlert - aAlert; // Descending order of importance
        });

        for (const item of sortedData) {
            if (item.key_new && item.Forecast_Summary && !uniqueKeys.has(item.key_new)) {
                // If Alert is available (and explicitly not 'No Alert'), show it.
                // Or if we just want to show summaries for everything:
                // User said: "if alert is available, show forecast summary".
                // We'll show the summary for all items that have one, but prioritized by Alert presence.
                messages.push(`(${item.key_new}) ${item.Forecast_Summary}`);
                uniqueKeys.add(item.key_new);
            }
            if (messages.length >= 10) break; // Limit to 10 items
        }

        return messages.length > 0 ? messages : null;
    }, [filteredData]);

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
            <div className="flex min-h-screen relative">
                <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} fixed z-[100] h-full`}>
                    <SideBar />
                </div>

                <div className={`main transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 font-sans`}>


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
                                <h2 className="text-xl font-semibold text-gray-800">Forecast Period: Oct-Nov-Dec '24</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>Last updated: Today</span>
                                    <RefreshCw className="w-4 h-4" />
                                </div>
                            </div>

                            {/* UPDATED GRID TO 5 COLUMNS - RESPONSIVE & COMPACT */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {/* 1. Forecast Volume */}
                                <Card className="relative overflow-hidden p-6 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Package className="w-16 h-16 text-blue-600" />
                                    </div>
                                    <div className="space-y-1 relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                                <Package className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Forecast Volume</p>
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 tracking-tight">{Math.round(forecastSum).toLocaleString()}</div>
                                        <p className="text-xs text-slate-500 font-medium pt-1">Total predicted units</p>
                                    </div>
                                </Card>

                                {/* 2. Forecast Value */}
                                <Card className="relative overflow-hidden p-6 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <DollarSign className="w-16 h-16 text-emerald-600" />
                                    </div>
                                    <div className="space-y-1 relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-emerald-100 rounded-lg">
                                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Forecast Value</p>
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 tracking-tight">{formatForecastValue(forecastValue, true)}</div>
                                        <p className="text-xs text-slate-500 font-medium pt-1">Total predicted revenue</p>
                                    </div>
                                </Card>

                                {/* 3. YoY Growth */}
                                <Card className="relative overflow-hidden p-6 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <LineChart className="w-16 h-16 text-amber-600" />
                                    </div>
                                    <div className="space-y-1 relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-amber-100 rounded-lg">
                                                <LineChart className="w-4 h-4 text-amber-600" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">YoY Growth</p>
                                        </div>
                                        <div className={`text-2xl font-bold tracking-tight ${yoyGrowth < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                            {yoyGrowth != null ? `${yoyGrowth > 0 ? '+' : ''}${yoyGrowth}%` : "N/A"}
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium pt-1">vs Same Period Last Year</p>
                                    </div>
                                </Card>

                                {/* 4. YTD Volume */}
                                <Card className="relative overflow-hidden p-6 bg-white hover:bg-violet-50/50 border border-slate-200 hover:border-violet-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Calendar className="w-16 h-16 text-violet-600" />
                                    </div>
                                    <div className="space-y-1 relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-violet-100 rounded-lg">
                                                <Calendar className="w-4 h-4 text-violet-600" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">YTD Volume (2024)</p>
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 tracking-tight">{Math.round(parentLevelForecast).toLocaleString()}</div>
                                        <p className="text-xs text-slate-500 font-medium pt-1">Total Actuals 2024</p>
                                    </div>
                                </Card>

                                {/* 5. Accuracy & Bias */}
                                <Card className="relative overflow-hidden p-6 bg-white hover:bg-rose-50/50 border border-slate-200 hover:border-rose-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Activity className="w-16 h-16 text-rose-600" />
                                    </div>
                                    <div className="space-y-1 relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-rose-100 rounded-lg">
                                                <Activity className="w-4 h-4 text-rose-600" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model Accuracy</p>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xl font-bold text-slate-900">{accuracy ? `${accuracy}%` : "N/A"}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Acc.</span>
                                            </div>
                                            <div className="w-full h-px bg-slate-100"></div>
                                            <div className="flex justify-between items-end">
                                                <span className={`text-base font-bold ${bias > 0 ? "text-blue-600" : "text-orange-600"}`}>
                                                    {bias ? `${bias > 0 ? '+' : ''}${bias}%` : "N/A"}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Bias</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Card>




                        {/* OOS Analysis Chart & Forecast Bridge - RESPONSIVE CONTAINER */}
                        <div className="w-full h-[450px] lg:h-[500px] mb-6">
                            <Card className="w-full h-full flex flex-col p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden rounded-xl">
                                <div className="flex justify-between items-center mb-4 flex-none">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <LineChart className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 tracking-tight">Actual vs Forecast</h3>
                                            <p className="text-xs text-gray-500">Historical performance and OOS impact</p>
                                        </div>
                                    </div>
                                    {/* Chart Toggle Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleChart('oos')}
                                            className={`font-medium transition-all duration-200 border ${chartToggle.oos
                                                ? 'bg-red-50 border-red-200 text-red-700 shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            OOS Days
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleChart('seasonalityTrends')}
                                            className={`font-medium transition-all duration-200 border ${chartToggle.seasonalityTrends
                                                ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            Trends
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex-1 min-h-0 w-full relative">
                                    <SalesTrendChart
                                        chartToggle={chartToggle}
                                        manualConsensus={{
                                            '2024-10-01': Object.values(consensusValues).reduce((acc, curr) => acc + (curr.oct || 0), 0),
                                            '2024-11-01': Object.values(consensusValues).reduce((acc, curr) => acc + (curr.nov || 0), 0),
                                            '2024-12-01': Object.values(consensusValues).reduce((acc, curr) => acc + (curr.dec || 0), 0)
                                        }}
                                    />
                                </div>
                            </Card>
                        </div>


                        {/* Marquee Announcement - Above Chatbot */}
                        <div className="w-full">
                            <MarqueeAnnouncement announcements={marqueeMessages} />
                        </div>

                        {/* --- ROW 2: Chatbot (Full Width) --- */}
                        <div className="w-full h-[600px]">
                            <Chatbot filters={filters} />
                        </div>

                        {/* Forecast Bridge (Increased Width below Chatbot) */}
                        <div className="w-full h-auto mb-6">
                            <Card className="w-full flex flex-col p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                                <div className="flex justify-between items-center mb-4 flex-none">
                                    <h3 className="text-lg font-semibold text-gray-800">Forecast Analysis</h3>
                                </div>

                                <Accordion type="single" collapsible defaultValue="consensus" className="w-full">
                                    <AccordionItem value="consensus" className="border-b-0">
                                        <AccordionTrigger className="hover:no-underline py-2 px-1">
                                            <span className="text-base font-medium text-gray-700">Consensus Breakup</span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="h-[500px] w-full pt-2">
                                                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4 h-full">
                                                    {/* 1. Consensus Breakup Section */}
                                                    <div className="space-y-3 h-full flex flex-col">
                                                        <h4 className="text-sm font-medium text-gray-700">Consensus Breakup</h4>
                                                        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 flex flex-col relative overflow-hidden">

                                                            {/* Decorative Background Icon */}
                                                            <div className="absolute -top-6 -right-6 opacity-5 rotate-12 pointer-events-none">
                                                                <Package className="w-32 h-32 text-blue-600" />
                                                            </div>

                                                            <div className="flex flex-col h-full z-10">
                                                                {/* Top: Total Consensus */}
                                                                <div className="flex-none mb-4 border-b border-blue-200/60 pb-4">
                                                                    <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Total Consensus</h4>
                                                                    <div className="text-4xl font-extrabold text-slate-900 tracking-tight break-words">
                                                                        {Math.round(
                                                                            Object.values(consensusValues).reduce((acc, curr) =>
                                                                                acc + (curr.oct || 0) + (curr.nov || 0) + (curr.dec || 0), 0
                                                                            )
                                                                        ).toLocaleString()}
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-500 font-medium mt-1">Aggregated Volume (Oct - Dec)</p>
                                                                </div>

                                                                {/* Middle/Bottom: Vertically Distributed Monthly Data */}
                                                                <div className="flex-1 flex flex-col justify-around">
                                                                    {/* Oct */}
                                                                    <div className="flex flex-col group">
                                                                        <div className="flex justify-between items-end mb-1">
                                                                            <span className="text-xs font-bold text-slate-400 uppercase">Oct</span>
                                                                            <span className="text-2xl font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                                                                {Math.round(Object.values(consensusValues).reduce((acc, curr) => acc + (curr.oct || 0), 0)).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                        <div className="h-1.5 w-full bg-blue-100/50 rounded-full overflow-hidden">
                                                                            <div className="h-full bg-blue-500 w-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Nov */}
                                                                    <div className="flex flex-col group">
                                                                        <div className="flex justify-between items-end mb-1">
                                                                            <span className="text-xs font-bold text-slate-400 uppercase">Nov</span>
                                                                            <span className="text-2xl font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                                                                {Math.round(Object.values(consensusValues).reduce((acc, curr) => acc + (curr.nov || 0), 0)).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                        <div className="h-1.5 w-full bg-blue-100/50 rounded-full overflow-hidden">
                                                                            <div className="h-full bg-blue-500 w-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Dec */}
                                                                    <div className="flex flex-col group">
                                                                        <div className="flex justify-between items-end mb-1">
                                                                            <span className="text-xs font-bold text-slate-400 uppercase">Dec</span>
                                                                            <span className="text-2xl font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                                                                {Math.round(Object.values(consensusValues).reduce((acc, curr) => acc + (curr.dec || 0), 0)).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                        <div className="h-1.5 w-full bg-blue-100/50 rounded-full overflow-hidden">
                                                                            <div className="h-full bg-blue-500 w-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 2. Forecast Breakup (Waterfalls) Section */}
                                                    <div className="flex flex-col gap-3 h-full min-h-0 col-span-2 lg:col-span-1">
                                                        <div className="flex justify-between items-center shrink-0">
                                                            <h4 className="text-sm font-medium text-gray-700">Consensus Bridge Analysis</h4>
                                                        </div>

                                                        {/* Horizontal Scroll or Grid for 3 months */}
                                                        <div className="bg-white border border-gray-200 rounded-lg p-2 flex gap-4 overflow-x-auto flex-1 min-h-0">
                                                            {bridgeData.map((monthData, idx) => {
                                                                const chartData = [
                                                                    { label: 'Baseline', value: monthData.baseline },
                                                                    { label: 'Sales', value: monthData.sales },
                                                                    { label: 'Marketing', value: monthData.marketing },
                                                                    { label: 'Finance', value: monthData.finance }
                                                                ];
                                                                return (
                                                                    <div key={idx} className="min-w-[300px] flex-1">
                                                                        <h5 className="text-center font-semibold text-gray-600 mb-2">{monthData.label}</h5>
                                                                        <WaterfallChart data={chartData} />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="forecast" className="border-b-0">
                                        <AccordionTrigger className="hover:no-underline py-2 px-1">
                                            <span className="text-base font-medium text-gray-700">Forecast Breakup</span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="pt-4 space-y-6">
                                                {/* 1. Forecast System Breakup Section - VERTICAL WATERFALLS */}
                                                <div className="flex flex-col gap-3 h-[400px]">
                                                    <div className="flex justify-between items-center shrink-0">
                                                        <h4 className="text-sm font-bold text-gray-700 tracking-tight">System Forecast Decomposition</h4>
                                                    </div>

                                                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex gap-6 overflow-x-auto relative flex-1 min-h-0">
                                                        {/* Background Grid Pattern */}
                                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

                                                        {bridgeData.map((monthData, idx) => {
                                                            const chartData = [
                                                                { label: 'Trend', value: monthData.trend },
                                                                { label: 'Seas.', value: monthData.seasonality },
                                                                { label: 'Disc.', value: monthData.discount },
                                                                { label: 'Sup.', value: monthData.spends }, // Renamed Spends to Sup. for brevity if needed, or keep Spends
                                                                { label: 'Lag3', value: monthData.lag3 },
                                                                { label: 'MA4', value: monthData.ma4 }
                                                            ];
                                                            return (
                                                                <div key={idx} className="min-w-[320px] flex-1 z-10 flex flex-col">
                                                                    <div className="text-center mb-2">
                                                                        <span className="inline-block px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                                                            {monthData.label} Breakdown
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-1 w-full min-h-0">
                                                                        <WaterfallChart data={chartData} />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <ForecastBreakupTable
                                                    tableData={tableData}
                                                    teamInputs={teamInputs}
                                                    consensusValues={consensusValues}
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </Card>
                        </div>

                        {/* Forecast Table */}
                        <div className="mb-8">
                            <ForecastTable
                                data={globalData}
                                selections={selections}
                                tableData={tableData}
                                teamInputs={teamInputs}
                                consensusValues={consensusValues}
                                handleTeamInputChange={handleTeamInputChange}
                                onDrillDown={handleDrillDown}
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

                    {/* Download Report Button - Fixed Bottom */}
                    <div className="mt-8 flex justify-end pb-8 max-w-7xl mx-auto px-6">
                        <Button
                            onClick={handleDownloadReport}
                            disabled={isDownloading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[200px]"
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Forecast Report
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Planning;