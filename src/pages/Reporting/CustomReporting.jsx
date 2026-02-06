import React, { useState, useEffect, useRef, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Download, RefreshCw, TrendingUp, BarChart2, Activity, Trash2, GripVertical, Plus } from 'lucide-react';
import { loadReportingData, fetchNewReportingData } from "@/services/reportingService";

const CustomReporting = () => {
    const [data, setData] = useState([]);
    const [draggedField, setDraggedField] = useState(null);
    const [droppedFields, setDroppedFields] = useState({
        xAxis: null,
        yAxis: [],
        groupBy: null
    });
    const [chartType, setChartType] = useState('scatter');
    const [plotData, setPlotData] = useState([]);

    // Available fields to drag
    const availableFields = [
        { id: 'date', label: 'Date', type: 'dimension', icon: '📅', color: 'from-blue-500 to-indigo-600' },
        { id: 'region', label: 'Region', type: 'dimension', icon: '🌍', color: 'from-purple-500 to-pink-600' },
        { id: 'product_category', label: 'Product Category', type: 'dimension', icon: '📦', color: 'from-emerald-500 to-teal-600' },
        { id: 'channel', label: 'Channel', type: 'dimension', icon: '📡', color: 'from-amber-500 to-orange-600' },
        { id: 'sales', label: 'Sales', type: 'measure', icon: '💰', color: 'from-green-500 to-emerald-600' },
        { id: 'profit', label: 'Profit', type: 'measure', icon: '📈', color: 'from-indigo-500 to-purple-600' },
        { id: 'revenue', label: 'Revenue', type: 'measure', icon: '💵', color: 'from-cyan-500 to-blue-600' },
        { id: 'units', label: 'Units', type: 'measure', icon: '📊', color: 'from-pink-500 to-rose-600' },
        { id: 'budget_variance', label: 'Budget Variance', type: 'measure', icon: '📉', color: 'from-orange-500 to-red-600' },
        { id: 'growth_pct', label: 'Growth %', type: 'measure', icon: '🚀', color: 'from-teal-500 to-cyan-600' }
    ];

    // Load data
    useEffect(() => {
        const init = async () => {
            const initialData = await loadReportingData();
            setData(initialData);
        };
        init();
    }, []);

    // Generate chart data when fields change
    useEffect(() => {
        if (data.length > 0 && droppedFields.xAxis && droppedFields.yAxis.length > 0) {
            generateChartData();
        }
    }, [droppedFields, chartType, data]);

    const generateChartData = () => {
        const { xAxis, yAxis, groupBy } = droppedFields;

        if (!xAxis || yAxis.length === 0) {
            setPlotData([]);
            return;
        }

        // Group data by x-axis and optionally by groupBy
        const grouped = {};

        data.forEach(item => {
            const xValue = item[xAxis];
            const groupValue = groupBy ? item[groupBy] : 'All';

            const key = `${xValue}_${groupValue}`;

            if (!grouped[key]) {
                grouped[key] = {
                    x: xValue,
                    group: groupValue,
                    ...yAxis.reduce((acc, field) => ({ ...acc, [field]: 0 }), {})
                };
            }

            yAxis.forEach(field => {
                grouped[key][field] += Number(item[field] || 0);
            });
        });

        const groupedArray = Object.values(grouped);

        // Create traces
        const traces = [];

        if (groupBy) {
            const groups = [...new Set(groupedArray.map(d => d.group))];

            groups.forEach(group => {
                yAxis.forEach(yField => {
                    const groupData = groupedArray.filter(d => d.group === group);

                    traces.push({
                        x: groupData.map(d => d.x),
                        y: groupData.map(d => d[yField]),
                        name: `${group} - ${availableFields.find(f => f.id === yField)?.label}`,
                        type: chartType === 'line' ? 'scatter' : chartType,
                        mode: chartType === 'line' ? 'lines+markers' : undefined,
                        marker: chartType === 'scatter' ? { size: 10 } : undefined
                    });
                });
            });
        } else {
            yAxis.forEach(yField => {
                traces.push({
                    x: groupedArray.map(d => d.x),
                    y: groupedArray.map(d => d[yField]),
                    name: availableFields.find(f => f.id === yField)?.label,
                    type: chartType === 'line' ? 'scatter' : chartType,
                    mode: chartType === 'line' ? 'lines+markers' : undefined,
                    marker: chartType === 'scatter' ? { size: 10 } : undefined
                });
            });
        }

        setPlotData(traces);
    };

    const handleDragStart = (field) => {
        setDraggedField(field);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDropXAxis = (e) => {
        e.preventDefault();
        if (draggedField && draggedField.type === 'dimension') {
            setDroppedFields(prev => ({ ...prev, xAxis: draggedField.id }));
        }
        setDraggedField(null);
    };

    const handleDropYAxis = (e) => {
        e.preventDefault();
        if (draggedField && draggedField.type === 'measure') {
            setDroppedFields(prev => ({
                ...prev,
                yAxis: [...prev.yAxis, draggedField.id]
            }));
        }
        setDraggedField(null);
    };

    const handleDropGroupBy = (e) => {
        e.preventDefault();
        if (draggedField && draggedField.type === 'dimension') {
            setDroppedFields(prev => ({ ...prev, groupBy: draggedField.id }));
        }
        setDraggedField(null);
    };

    const removeField = (zone, fieldId = null) => {
        if (zone === 'xAxis') {
            setDroppedFields(prev => ({ ...prev, xAxis: null }));
        } else if (zone === 'yAxis' && fieldId) {
            setDroppedFields(prev => ({
                ...prev,
                yAxis: prev.yAxis.filter(f => f !== fieldId)
            }));
        } else if (zone === 'groupBy') {
            setDroppedFields(prev => ({ ...prev, groupBy: null }));
        }
    };

    const clearAll = () => {
        setDroppedFields({ xAxis: null, yAxis: [], groupBy: null });
        setPlotData([]);
    };

    const handleRefresh = async () => {
        const newData = await fetchNewReportingData();
        setData(newData);
    };

    const summaryStats = useMemo(() => {
        return data.reduce((acc, curr) => {
            return {
                sales: (acc.sales || 0) + (curr.sales || 0),
                profit: (acc.profit || 0) + (curr.profit || 0),
                revenue: (acc.revenue || 0) + (curr.revenue || 0),
                units: (acc.units || 0) + (curr.units || 0)
            };
        }, {});
    }, [data]);

    const getFieldInfo = (fieldId) => availableFields.find(f => f.id === fieldId);

    return (
        <div className="min-h-screen bg-slate-50/50 relative overflow-hidden font-sans text-slate-900">
            {/* Background Decoration - Subtle & Premium */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 p-6 md:p-8">
                <div className="max-w-[1800px] mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 animate-in slide-in-from-top-4 duration-500">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                                    <BarChart2 className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                    Custom Reporting
                                </h1>
                            </div>
                            <p className="text-slate-500 font-medium ml-1">Build your own analytics dashboard with drag & drop</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={clearAll}
                                className="flex items-center gap-2 bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                            >
                                <Trash2 size={18} />
                                <span className="hidden sm:inline">Clear All</span>
                            </button>
                            <button className="flex items-center gap-2 bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm active:scale-95">
                                <Download size={18} />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                            <button
                                onClick={handleRefresh}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
                            >
                                <RefreshCw size={18} />
                                <span>Update Data</span>
                            </button>
                        </div>
                    </div>

                    {/* Summary Metrics - Professional Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        {summaryStats && [
                            { label: 'Total Sales', value: summaryStats.sales, prefix: '$', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <TrendingUp className="w-5 h-5" /> },
                            { label: 'Revenue', value: summaryStats.revenue, prefix: '$', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: <Activity className="w-5 h-5" /> },
                            { label: 'Gross Profit', value: summaryStats.profit, prefix: '$', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <BarChart2 className="w-5 h-5" /> },
                            { label: 'Total Units', value: summaryStats.units, prefix: '', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <GripVertical className="w-5 h-5" /> }
                        ].map((metric, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-slate-500 font-semibold text-sm uppercase tracking-wide">{metric.label}</h3>
                                    <div className={`p-2 rounded-lg ${metric.bg} ${metric.color} transition-colors group-hover:bg-white group-hover:shadow-sm`}>
                                        {metric.icon}
                                    </div>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-slate-800 tracking-tight">
                                        {metric.prefix}{Math.abs(metric.value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Workspace */}
                    <div className="grid lg:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">

                        {/* Sidebar - Tools */}
                        <div className="lg:col-span-3 min-w-[280px]">
                            <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden sticky top-6">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-indigo-500" />
                                        Data Fields
                                    </h3>
                                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{availableFields.length}</span>
                                </div>

                                <div className="p-4 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                                    {/* Dimensions Group */}
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
                                            Dimension
                                            <div className="h-px bg-slate-200 flex-1"></div>
                                        </div>
                                        <div className="space-y-2">
                                            {availableFields.filter(f => f.type === 'dimension').map(field => (
                                                <div
                                                    key={field.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(field)}
                                                    className="bg-white border hover:border-indigo-300 border-slate-200 p-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3 group select-none"
                                                >
                                                    <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${field.color} flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                                                        {field.icon}
                                                    </div>
                                                    <span className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{field.label}</span>
                                                    <GripVertical className="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Measures Group */}
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
                                            Measure
                                            <div className="h-px bg-slate-200 flex-1"></div>
                                        </div>
                                        <div className="space-y-2">
                                            {availableFields.filter(f => f.type === 'measure').map(field => (
                                                <div
                                                    key={field.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(field)}
                                                    className="bg-white border hover:border-emerald-300 border-slate-200 p-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3 group select-none"
                                                >
                                                    <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${field.color} flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                                                        {field.icon}
                                                    </div>
                                                    <span className="font-semibold text-slate-700 text-sm group-hover:text-emerald-600 transition-colors">{field.label}</span>
                                                    <GripVertical className="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Configuration & View */}
                        <div className="lg:col-span-9 space-y-6">

                            {/* Drop Zones Container */}
                            <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                    <h3 className="font-bold text-slate-800 text-lg">Chart Configuration</h3>

                                    <div className="flex p-1 bg-slate-100 rounded-lg self-start">
                                        {['bar', 'line', 'scatter'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setChartType(type)}
                                                className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all ${chartType === type
                                                    ? 'bg-white text-indigo-600 shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* X-Axis */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDropXAxis}
                                        className={`relative border-2 border-dashed rounded-xl p-4 min-h-[140px] flex flex-col transition-all duration-300 ${draggedField?.type === 'dimension'
                                            ? 'border-indigo-400 bg-indigo-50/30'
                                            : droppedFields.xAxis ? 'border-indigo-200 bg-indigo-50/10' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                            X-Axis
                                        </div>

                                        {droppedFields.xAxis ? (
                                            <div className="mt-auto bg-white border border-indigo-100 shadow-sm p-3 rounded-lg flex items-center justify-between group animate-in zoom-in-95 duration-200">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${getFieldInfo(droppedFields.xAxis)?.color} flex items-center justify-center text-sm text-white`}>
                                                        {getFieldInfo(droppedFields.xAxis)?.icon}
                                                    </div>
                                                    <span className="font-semibold text-slate-700">{getFieldInfo(droppedFields.xAxis)?.label}</span>
                                                </div>
                                                <button onClick={() => removeField('xAxis')} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                                                <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
                                                <span className="text-sm font-medium">Drop Dimension</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Y-Axis */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDropYAxis}
                                        className={`relative border-2 border-dashed rounded-xl p-4 min-h-[140px] flex flex-col transition-all duration-300 ${draggedField?.type === 'measure'
                                            ? 'border-emerald-400 bg-emerald-50/30'
                                            : droppedFields.yAxis.length > 0 ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            Y-Axis
                                        </div>

                                        {droppedFields.yAxis.length > 0 ? (
                                            <div className="space-y-2 mt-auto">
                                                {droppedFields.yAxis.map(fieldId => (
                                                    <div key={fieldId} className="bg-white border border-emerald-100 shadow-sm p-2 rounded-lg flex items-center justify-between group animate-in zoom-in-95 duration-200">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-6 h-6 rounded bg-gradient-to-br ${getFieldInfo(fieldId)?.color} flex items-center justify-center text-xs text-white`}>
                                                                {getFieldInfo(fieldId)?.icon}
                                                            </div>
                                                            <span className="font-semibold text-slate-700 text-sm">{getFieldInfo(fieldId)?.label}</span>
                                                        </div>
                                                        <button onClick={() => removeField('yAxis', fieldId)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                                                <BarChart2 className="w-8 h-8 mb-2 opacity-50" />
                                                <span className="text-sm font-medium">Drop Measures</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Group By */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDropGroupBy}
                                        className={`relative border-2 border-dashed rounded-xl p-4 min-h-[140px] flex flex-col transition-all duration-300 ${draggedField?.type === 'dimension'
                                            ? 'border-purple-400 bg-purple-50/30'
                                            : droppedFields.groupBy ? 'border-purple-200 bg-purple-50/10' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                            Group By
                                            <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded ml-auto">OPTIONAL</span>
                                        </div>

                                        {droppedFields.groupBy ? (
                                            <div className="mt-auto bg-white border border-purple-100 shadow-sm p-3 rounded-lg flex items-center justify-between group animate-in zoom-in-95 duration-200">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${getFieldInfo(droppedFields.groupBy)?.color} flex items-center justify-center text-sm text-white`}>
                                                        {getFieldInfo(droppedFields.groupBy)?.icon}
                                                    </div>
                                                    <span className="font-semibold text-slate-700">{getFieldInfo(droppedFields.groupBy)?.label}</span>
                                                </div>
                                                <button onClick={() => removeField('groupBy')} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                                                <GripVertical className="w-8 h-8 mb-2 opacity-50" />
                                                <span className="text-sm font-medium">Drop Group Dimension</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Chart Visualization Area */}
                            <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 p-1">
                                <div className="bg-slate-50/30 rounded-lg p-6 min-h-[500px] flex flex-col">
                                    {plotData.length > 0 ? (
                                        <div className="flex-1 w-full h-[500px]">
                                            <Plot
                                                key={`${droppedFields.xAxis}-${droppedFields.yAxis.join(',')}-${droppedFields.groupBy || ''}-${chartType}`}
                                                data={plotData}
                                                layout={{
                                                    autosize: true,
                                                    title: {
                                                        text: '',
                                                        font: { size: 18, family: 'Inter, sans-serif' }
                                                    },
                                                    xaxis: {
                                                        title: { text: getFieldInfo(droppedFields.xAxis)?.label || '', font: { size: 12, color: '#64748b' } },
                                                        gridcolor: '#f1f5f9',
                                                        linecolor: '#cbd5e1',
                                                        tickfont: { size: 11, color: '#64748b' }
                                                    },
                                                    yaxis: {
                                                        title: { text: 'Value', font: { size: 12, color: '#64748b' } },
                                                        gridcolor: '#f1f5f9',
                                                        linecolor: '#cbd5e1',
                                                        tickfont: { size: 11, color: '#64748b' }
                                                    },
                                                    legend: {
                                                        orientation: 'h',
                                                        yanchor: 'bottom',
                                                        y: 1.02,
                                                        xanchor: 'right',
                                                        x: 1
                                                    },
                                                    plot_bgcolor: 'rgba(255, 255, 255, 0)',
                                                    paper_bgcolor: 'rgba(255, 255, 255, 0)',
                                                    margin: { t: 50, l: 60, r: 20, b: 60 },
                                                    font: { family: 'Inter, sans-serif', color: '#334155' }
                                                }}
                                                style={{ width: '100%', height: '100%' }}
                                                config={{ responsive: true, displayModeBar: false }}
                                                useResizeHandler={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-slate-100">
                                                <BarChart2 className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Visualize</h3>
                                            <p className="text-slate-500 max-w-sm text-center leading-relaxed">
                                                Drag fields from the left <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-100 text-indigo-600 rounded text-xs mx-1">📦</span> panel into the drop zones above <span className="inline-flex items-center justify-center w-5 h-5 bg-emerald-100 text-emerald-600 rounded text-xs mx-1">⬆️</span> to generate your analytics.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomReporting;
