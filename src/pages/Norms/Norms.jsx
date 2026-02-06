import React, { useEffect, useState } from 'react';
import { useForecast } from '@/context/ForecastContext/ForecastContext';
import Plot from 'react-plotly.js';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import sampleData from '../../jsons/Planning/JF_censored.json';
import Filters from '@/components/planning/Filters';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, AlertCircle, Calendar, BarChart3, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Norms = () => {
    const { accuracyLevel, filters } = useForecast();
    const [processedData, setProcessedData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [plotData, setPlotData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [displayLevel, setDisplayLevel] = useState('Channel');
    const [showFilters, setShowFilters] = useState(false);
    const [summaryMetrics, setSummaryMetrics] = useState({
        totalInventory: 0,
        totalNorms: 0,
        avgDaysInHand: 0,
        variance: 0
    });

    console.log("Norms Component Rendering...");
    console.log("Filters:", filters);
    console.log("Sample Data Type:", typeof sampleData, "Is Array:", Array.isArray(sampleData));

    // Determine which level to show and which columns to display
    const getDisplayConfig = () => {
        const displayLevels = [];
        let displayLevel = 'Channel';

        if (!filters) return { displayLevel, displayLevels };

        if (filters.chain === 'All') {
            displayLevel = 'Channel';
            displayLevels.push('Channel');
        } else if (filters.depot === 'All') {
            displayLevel = 'Chain';
            displayLevels.push('Channel', 'Chain');
        } else if (filters.subCat === 'All') {
            displayLevel = 'Depot';
            displayLevels.push('Channel', 'Chain', 'Depot');
        } else if (filters.sku === 'All') {
            displayLevel = 'SubCat';
            displayLevels.push('Channel', 'Chain', 'Depot', 'SubCat');
        } else {
            displayLevel = 'SKU';
            displayLevels.push('Channel', 'Chain', 'Depot', 'SubCat', 'SKU');
        }

        return { displayLevel, displayLevels };
    };

    // Process data calculations
    const processData = (data) => {
        if (!data || !Array.isArray(data) || data.length === 0) return [];

        const serviceLevels = {
            "90%": 1.28,
            "95%": 1.645,
            "98%": 2.054,
            "99%": 2.326,
            "99.5%": 2.576
        };

        const Z_val = serviceLevels[accuracyLevel] || 1.645;

        // Calculate residuals - use actual values if forecast is null
        const residuals = data
            .filter(item => item.actual)
            .map(item => {
                const forecast = item.forecast || item.actual;
                return forecast - item.actual;
            });

        // Calculate safety stock
        const calculateSafetyStock = (forecast, actual) => {
            if (!actual) return 0;
            const effectiveForecast = forecast || actual;
            const residual = effectiveForecast - actual;
            const stdError = residuals.length > 1
                ? Math.sqrt(residuals.map(r => Math.pow(r, 2)).reduce((a, b) => a + b, 0) / (residuals.length - 1))
                : Math.abs(residual);
            return stdError * Z_val;
        };

        return data.map(item => {
            const effectiveForecast = item.forecast || item.actual || 0;
            const actualValue = item.actual || 0;
            const safetyStock = calculateSafetyStock(effectiveForecast, actualValue);

            return {
                ...item,
                safety_stock: safetyStock,
                inventory: actualValue * 1.2 + effectiveForecast * 0.3,
                norms: effectiveForecast * 1.1 + safetyStock,
                days_in_hand: (effectiveForecast > 0
                    ? (actualValue * 1.2) / (effectiveForecast / 30)
                    : 0).toFixed(1)
            };
        });
    };

    // Group data by level while maintaining all items at that level
    const groupDataByLevel = (data, level, parentFilters) => {
        if (!data) return [];
        const filteredData = data.filter(item => {
            if (parentFilters.channel && parentFilters.channel !== "All" && item.Channel !== parentFilters.channel) return false;
            if (level !== 'Chain' && parentFilters.chain && parentFilters.chain !== "All" && item.Chain !== parentFilters.chain) return false;
            if (level !== 'Depot' && parentFilters.depot && parentFilters.depot !== "All" && item.Depot !== parentFilters.depot) return false;
            if (level !== 'SubCat' && parentFilters.subCat && parentFilters.subCat !== "All" && item.SubCat !== parentFilters.subCat) return false;
            return true;
        });

        return filteredData.reduce((acc, item) => {
            const key = item[level];
            if (!acc[key]) {
                acc[key] = {
                    ...item,
                    [level]: key,
                    actual: 0,
                    forecast: 0,
                    safety_stock: 0,
                    inventory: 0,
                    norms: 0,
                    days_in_hand: 0,
                    count: 0
                };
            }

            const safeAdd = (val) => Number(val) || 0;

            acc[key].actual += safeAdd(item.actual);
            acc[key].forecast += safeAdd(item.forecast);
            acc[key].safety_stock += safeAdd(item.safety_stock);
            acc[key].inventory += safeAdd(item.inventory);
            acc[key].norms += safeAdd(item.norms);
            acc[key].days_in_hand += parseFloat(item.days_in_hand) || 0;
            acc[key].count++;

            return acc;
        }, {});
    };

    // Main data processing effect
    useEffect(() => {
        console.log("Norms: UseEffect Triggered");
        if (!sampleData || !Array.isArray(sampleData)) {
            console.error("No sample data found or invalid format!");
            return;
        }

        const { displayLevel, displayLevels } = getDisplayConfig();
        setDisplayLevel(displayLevel);

        const processed = processData(sampleData);
        setProcessedData(processed);

        const parentFilters = {
            channel: filters?.channel,
            chain: displayLevel === 'Channel' ? 'All' : filters?.chain,
            depot: displayLevel === 'Chain' || displayLevel === 'Channel' ? 'All' : filters?.depot,
            subCat: displayLevel === 'Depot' || displayLevel === 'Chain' || displayLevel === 'Channel' ? 'All' : filters?.subCat
        };

        const groupedData = groupDataByLevel(processed, displayLevel, parentFilters);

        // For table data (January only)
        const janData = processed.filter(item => item.Date === "2024-01-01");
        const groupedJanData = groupDataByLevel(janData, displayLevel, parentFilters);
        const finalJanData = Object.values(groupedJanData).map(item => ({
            ...item,
            days_in_hand: (item.count > 0 ? (item.days_in_hand / item.count) : 0).toFixed(1),
            calculated_user_norms: item.norms > 0 ? (item.actual / item.norms) : 0
        }));

        console.log("Norms: Table Data Rows:", finalJanData.length);
        setTableData(finalJanData);

        // Calculate summary metrics
        const totalInventory = finalJanData.reduce((sum, item) => sum + (item.inventory || 0), 0);
        const totalNorms = finalJanData.reduce((sum, item) => sum + (item.norms || 0), 0);
        const avgDays = finalJanData.length > 0
            ? finalJanData.reduce((sum, item) => sum + parseFloat(item.days_in_hand || 0), 0) / finalJanData.length
            : 0;
        const variance = totalNorms > 0 ? ((totalInventory - totalNorms) / totalNorms * 100) : 0;

        setSummaryMetrics({
            totalInventory: Math.floor(totalInventory),
            totalNorms: Math.floor(totalNorms),
            avgDaysInHand: avgDays.toFixed(1),
            variance: variance.toFixed(1)
        });

        // Update column definitions
        const metricColumns = [
            {
                headerName: 'Inventory',
                field: 'actual',
                valueFormatter: params => Math.floor(params.value).toLocaleString(),
                cellClass: 'text-right font-mono text-slate-700 font-medium',
                width: 140
            },
            {
                headerName: 'Norms',
                field: 'norms',
                valueFormatter: params => Math.floor(params.value).toLocaleString(),
                cellClass: 'text-right font-mono text-slate-700 font-medium',
                width: 140
            },
            {
                headerName: 'User Norms',
                field: 'calculated_user_norms',
                valueFormatter: params => (params.value * 100).toFixed(0) + '%',
                cellClass: 'text-right font-mono font-bold text-indigo-600',
                width: 170
            },
            {
                headerName: 'Days in Hand',
                field: 'days_in_hand',
                cellClass: 'text-right font-mono text-emerald-600 font-semibold',
                width: 140
            }
        ];

        const hierarchyColumns = displayLevels.map(level => ({
            headerName: level,
            field: level,
            width: 160,
            sortable: true,
            cellClass: 'font-semibold text-slate-800',
            cellStyle: { borderRight: '1px solid #e2e8f0' }
        }));

        setColumnDefs([...hierarchyColumns, ...metricColumns]);

        // Prepare plot data with enhanced styling
        const dates = [...new Set(processed.map(item => item.Date))].sort();
        const traces = [
            {
                x: dates,
                y: dates.map(date => {
                    const items = processed.filter(d => d.Date === date);
                    return items.reduce((sum, item) => sum + (item.actual || 0), 0);
                }),
                name: 'Actual',
                type: 'bar',
                marker: {
                    color: '#818cf8',
                    opacity: 0.7
                },
                hovertemplate: '<b>Actual</b><br>%{y:,.0f}<extra></extra>'
            },
            {
                x: dates,
                y: dates.map(date => {
                    const items = processed.filter(d => d.Date === date);
                    return items.reduce((sum, item) => sum + (item.forecast || 0), 0);
                }),
                name: 'Forecast',
                type: 'bar',
                marker: {
                    color: '#c7d2fe',
                    opacity: 0.7
                },
                hovertemplate: '<b>Forecast</b><br>%{y:,.0f}<extra></extra>'
            },
            {
                x: dates,
                y: dates.map(date => {
                    const items = processed.filter(d => d.Date === date);
                    return items.reduce((sum, item) => sum + (item.norms || 0), 0);
                }),
                name: 'Norms',
                type: 'scatter',
                mode: 'lines+markers',
                line: { color: '#6366f1', width: 3 },
                marker: { size: 6, color: '#6366f1' },
                hovertemplate: '<b>Norms</b><br>%{y:,.0f}<extra></extra>'
            },
            {
                x: dates,
                y: dates.map(date => {
                    const items = processed.filter(d => d.Date === date);
                    return items.reduce((sum, item) => sum + (item.inventory || 0), 0);
                }),
                name: 'Inventory',
                type: 'scatter',
                mode: 'lines+markers',
                line: { color: '#10b981', width: 3 },
                marker: { size: 6, color: '#10b981' },
                hovertemplate: '<b>Inventory</b><br>%{y:,.0f}<extra></extra>'
            }
        ];

        setPlotData(traces);
    }, [filters, accuracyLevel]);

    const layout = {
        title: { text: '' },
        barmode: 'group',
        xaxis: {
            title: { text: 'Date', font: { size: 12, color: '#64748b' } },
            gridcolor: '#f1f5f9',
            linecolor: '#cbd5e1',
            tickfont: { size: 11, color: '#64748b' }
        },
        yaxis: {
            title: { text: 'Quantity', font: { size: 12, color: '#64748b' } },
            gridcolor: '#f1f5f9',
            linecolor: '#cbd5e1',
            tickfont: { size: 11, color: '#64748b' }
        },
        showlegend: true,
        legend: {
            orientation: 'h',
            yanchor: 'bottom',
            y: 1.02,
            xanchor: 'right',
            x: 1,
            font: { size: 11 }
        },
        plot_bgcolor: 'rgba(248, 250, 252, 0.5)',
        paper_bgcolor: 'transparent',
        margin: { t: 40, l: 60, r: 20, b: 50 },
        hovermode: 'x unified'
    };

    const defaultColDef = {
        sortable: true,
        resizable: true,
        filter: true,
        headerClass: 'bg-slate-50 text-slate-700 font-bold'
    };

    const calculateTableDimensions = () => {
        const rowCount = tableData?.length || 0;
        const height = Math.min(
            600,
            50 + (rowCount * 42) + (rowCount > 10 ? 40 : 0)
        );
        return { height };
    };

    const { height } = calculateTableDimensions();

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-blue-100/30 to-cyan-100/30 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 p-8">
                <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Page Header */}
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Inventory Norms
                                </h1>
                                <p className="text-slate-600 text-lg font-medium">Monitor inventory levels, safety stocks, and deviation from norms</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-200 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Service Level: {accuracyLevel || 'N/A'}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`h-10 px-4 text-sm rounded-full border-2 font-semibold shadow-sm transition-all duration-300 ${showFilters
                                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <Filter className={`w-4 h-4 mr-2 ${showFilters ? 'text-indigo-600' : 'text-slate-500'}`} />
                                    Filters
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    {showFilters && (
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-lg animate-in slide-in-from-top-4 duration-300">
                            <Filters showFilters={true} />
                        </div>
                    )}

                    {/* Summary Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {/* Total Inventory Card */}
                        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Package className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-blue-100 text-sm font-medium">Total Inventory</p>
                                    <p className="text-3xl font-bold tracking-tight">{formatNumber(summaryMetrics.totalInventory)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Norms Card */}
                        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-purple-100 text-sm font-medium">Total Norms</p>
                                    <p className="text-3xl font-bold tracking-tight">{formatNumber(summaryMetrics.totalNorms)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Avg Days in Hand Card */}
                        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-emerald-100 text-sm font-medium">Avg Days in Hand</p>
                                    <p className="text-3xl font-bold tracking-tight">{summaryMetrics.avgDaysInHand}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Variance Card */}
                        <Card className={`bg-gradient-to-br ${parseFloat(summaryMetrics.variance) >= 0 ? 'from-amber-500 to-orange-600' : 'from-rose-500 to-red-600'} text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden relative group`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white/90 text-sm font-medium">Variance from Norms</p>
                                    <p className="text-3xl font-bold tracking-tight">{summaryMetrics.variance}%</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart Section */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-800">Norms vs Inventory Trends</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {plotData.length > 0 ? (
                                <div className="w-full h-[450px] rounded-xl overflow-hidden">
                                    <Plot
                                        data={plotData}
                                        layout={{ ...layout, autosize: true }}
                                        style={{ width: '100%', height: '100%' }}
                                        config={{ responsive: true, displayModeBar: false }}
                                        useResizeHandler={true}
                                    />
                                </div>
                            ) : (
                                <div className="h-[450px] flex flex-col items-center justify-center text-slate-400">
                                    <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-lg font-medium">Loading Chart Data...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Data Table Section */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Package className="w-5 h-5 text-purple-600" />
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-800">Detailed Inventory Breakdown (Jan 2024)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {tableData.length > 0 ? (
                                <div
                                    className="ag-theme-alpine w-full border-none"
                                    style={{ height: `${height}px` }}
                                >
                                    <style>{`
                                        .ag-theme-alpine {
                                            --ag-header-background-color: #f8fafc;
                                            --ag-header-foreground-color: #334155;
                                            --ag-border-color: #e2e8f0;
                                            --ag-row-hover-color: #f1f5f9;
                                            --ag-font-family: 'Inter', -apple-system, sans-serif;
                                            --ag-font-size: 13px;
                                            --ag-header-height: 48px;
                                        }
                                        .ag-theme-alpine .ag-header {
                                            border-bottom: 2px solid #e2e8f0;
                                        }
                                        .ag-theme-alpine .ag-header-cell {
                                            font-weight: 700;
                                            text-transform: uppercase;
                                            font-size: 11px;
                                            letter-spacing: 0.5px;
                                        }
                                        .ag-theme-alpine .ag-row {
                                            border-bottom: 1px solid #f1f5f9;
                                            transition: all 0.2s ease;
                                        }
                                        .ag-theme-alpine .ag-row:hover {
                                            background-color: #f8fafc !important;
                                            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                                        }
                                        .ag-theme-alpine .ag-cell {
                                            padding: 12px 16px;
                                        }
                                    `}</style>
                                    <AgGridReact
                                        columnDefs={columnDefs}
                                        rowData={tableData}
                                        defaultColDef={defaultColDef}
                                        modules={[ClientSideRowModelModule]}
                                        onGridReady={params => {
                                            setGridApi(params.api);
                                            params.api.sizeColumnsToFit();
                                        }}
                                        pagination={true}
                                        paginationPageSize={10}
                                        suppressCellFocus={true}
                                        headerHeight={48}
                                        rowHeight={48}
                                        animateRows={true}
                                    />
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                                    <p className="text-slate-400 text-lg font-medium">No Data Available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Norms;