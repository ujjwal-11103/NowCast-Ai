import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Zap, FileText, BarChart3, Bot, User, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Plot from 'react-plotly.js'; // Import Plotly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForecast } from "@/context/ForecastContext/ForecastContext";
import rcaData from "@/assets/data/rca/response_machineDriven.json"; // Import local RCA data

// --- Internal Component for RCA Carousel ---
const RcaCarousel = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!data || data.length === 0) return <div className="p-4 text-sm text-gray-500">No RCA data available.</div>;

    const currentItem = data[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === data.length - 1;

    const handleNext = () => {
        if (!isLast) setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (!isFirst) setCurrentIndex(prev => prev - 1);
    };

    // Safely access data for the new JSON structure
    const plotData = currentItem.fig?.data || [];
    const plotLayout = currentItem.fig?.layout || {};
    const contentText = currentItem.content || "";
    const summaryText = currentItem.summary || "";

    // Extract title from Plotly layout if available, or fall back to generic
    let chartTitle = "Found Anomaly";
    if (plotLayout.title && plotLayout.title.text) {
        chartTitle = plotLayout.title.text.replace(/<[^>]*>?/gm, ''); // Simple strip HTML tags
    } else if (currentItem.title) {
        chartTitle = currentItem.title;
    }

    // Determine chart height from layout or default to 450px
    const chartHeight = plotLayout.height ? `${plotLayout.height}px` : "450px";

    return (
        <div className="flex flex-col gap-4 w-full bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            {/* Header: Title & Navigation */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Insight {currentIndex + 1} of {data.length}</span>
                    <h4 className="text-sm font-bold text-gray-800 mt-1">{chartTitle}</h4>
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={handlePrev}
                        disabled={isFirst}
                    >
                        <ChevronLeft className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={handleNext}
                        disabled={isLast}
                    >
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                    </Button>
                </div>
            </div>

            {/* Content & Summary */}
            <div className="text-xs text-gray-600 leading-relaxed space-y-2">
                {contentText && <ReactMarkdown>{contentText}</ReactMarkdown>}
                {summaryText && (
                    <div className="bg-blue-50 p-2 rounded border border-blue-100">
                        <span className="font-semibold text-blue-800 block mb-1">Summary:</span>
                        <p>{summaryText}</p>
                    </div>
                )}
            </div>

            {/* Chart Area */}
            <div
                className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative"
                style={{ height: chartHeight }}
            >
                <Plot
                    data={plotData}
                    layout={{
                        ...plotLayout,
                        autosize: true,
                        margin: { t: 30, r: 10, l: 40, b: 30 },
                        font: { size: 10 },
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        showlegend: true,
                        legend: { orientation: 'h', y: -0.15 }
                    }}
                    useResizeHandler={true}
                    style={{ width: "100%", height: "100%" }}
                    config={{ displayModeBar: false }}
                />
            </div>
        </div>
    );
};

const Chatbot = ({ filters = {}, externalMode, setExternalMode, compact = false }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I can help you simulate scenarios. Select a mode below or type a command.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Mode State: Priority to external props if provided
    const [localMode, setLocalMode] = useState("default");
    const activeMode = externalMode || localMode;
    const setActiveMode = setExternalMode || setLocalMode;

    const chatContainerRef = useRef(null);
    const { updateForecastData, handleWhatIfScenario } = useForecast();

    // Scroll logic
    useEffect(() => {
        if (chatContainerRef.current) {
            const { scrollHeight, clientHeight } = chatContainerRef.current;
            if (scrollHeight > clientHeight) {
                chatContainerRef.current.scrollTo({
                    top: scrollHeight,
                    behavior: "smooth",
                });
            }
        }
    }, [messages, isLoading]);

    // Initial Message for RCA Mode
    useEffect(() => {
        if (activeMode === 'rca') {
            setMessages(prev => {
                // If it's just the default greeting, replace it with RCA header
                if (prev.length === 1 && prev[0].text.startsWith("Hello!")) {
                    return [{
                        type: 'bot',
                        text: "Welcome to Root Cause Analysis. Here are the system-generated insights for the current anomalies.",
                        mode: 'rca'
                    }];
                }

                // Prevent duplicate initial messages if the last one is already RCA
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.mode === 'rca') return prev;

                return [
                    ...prev,
                    {
                        type: 'bot',
                        text: "Welcome to Root Cause Analysis. Here are the system-generated insights for the current anomalies.",
                        mode: 'rca'
                    }
                ];
            });
        }
    }, [activeMode]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            let apiUrl = '';
            let payload = {};

            // --- 1. DETERMINE API & PAYLOAD BASED ON MODE ---

            if (activeMode === "explorer") {
                // EXPLORER MODE: Specific Endpoint & Simple Payload
                apiUrl = 'http://20.235.178.245:5500/query';
                payload = {
                    question: userMessage.text
                };
            } else {
                // STANDARD MODES (Default, What-If, RCA): Unified Chat Endpoint
                apiUrl = 'http://20.235.178.245:5000/api/chat';

                // Prepare Common Data for Standard Modes
                const cleanFilters = Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value && value !== "All")
                );
                const key = `${cleanFilters.chain || '*'}_${cleanFilters.depot || '*'}_${cleanFilters.sku || '*'}`;

                let type = "query";
                switch (activeMode) {
                    case "default": type = "update-consensus"; break;
                    case "what-if": type = "what-if"; break;
                    case "rca": type = "rca"; break;
                    default: type = "query";
                }

                payload = {
                    question: userMessage.text,
                    owner: "Rahul",
                    filters: cleanFilters,
                    key: key,
                    type: type
                };
            }

            console.log(`[${activeMode.toUpperCase()}] Sending Payload to ${apiUrl}:`, payload);

            // --- 2. API CALL ---
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            // --- 3. UNIFIED RESPONSE HANDLING ---

            // Check success (Explorer returns 'success': true, Chat API returns 'status': 'success')
            const isSuccess = data.status === "success" || data.success === true;

            if (isSuccess) {

                // A. Display Text Response (Answer/Analysis)
                const botText = data.answer || "Request processed successfully.";

                const botResponse = {
                    type: 'bot',
                    text: botText,
                    chart: data.chart || null,
                    mode: activeMode
                };

                // B. Handle Data Side-Effects based on Mode (Only for Standard API)
                if (activeMode !== "explorer") {
                    const records = data.updated_records || data.data || [];

                    if (activeMode === "default") {
                        if (records.length > 0) {
                            const changeDetails = data.scenario || {};
                            const parsedFilters = data.scenario?.filters || payload.filters;

                            // Attach Updated Records to the Bot Message so we can render the table in the chat
                            botResponse.tableData = records;

                            updateForecastData(records, changeDetails, parsedFilters);
                        }
                    }
                    else if (activeMode === "what-if") {
                        if (records.length > 0) {
                            handleWhatIfScenario(records);
                        }
                    }
                }

                // Update Messages State AFTER all data (including tableData) is attached
                setMessages(prev => [...prev, botResponse]);

            } else {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: `**Error:** ${data.message || "The server returned an unsuccessful status."}`
                }]);
            }

        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "Sorry, I couldn't connect to the server. Please check your connection."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getModeColor = () => {
        switch (activeMode) {
            case 'what-if': return 'text-purple-600 bg-purple-100 border-purple-200';
            case 'rca': return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'explorer': return 'text-green-600 bg-green-100 border-green-200';
            default: return 'text-blue-600 bg-blue-100 border-blue-200';
        }
    };

    return (
        <Card className="w-full h-full flex flex-col border border-gray-200 shadow-xl overflow-hidden bg-white rounded-xl relative">

            {/* Premium Left Vertical Rail - Light & Dynamic */}
            {compact && (
                <div className="absolute left-0 top-0 h-full w-[72px] z-30 flex flex-col items-center py-6 bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300">

                    {/* Brand / Logo */}
                    <div className="flex flex-col items-center gap-1.5 mb-8 group cursor-default select-none">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeMode === 'what-if' ? 'from-purple-500 to-indigo-600 shadow-purple-200' :
                            activeMode === 'rca' ? 'from-orange-400 to-red-500 shadow-orange-200' :
                                activeMode === 'explorer' ? 'from-emerald-400 to-teal-500 shadow-emerald-200' :
                                    'from-blue-500 to-indigo-600 shadow-blue-200'
                            } shadow-lg text-white transform transition-transform duration-500 group-hover:rotate-12`}>
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-gray-800 tracking-tight leading-none">Nowcast</span>
                            <span className="text-[9px] font-semibold text-gray-400 tracking-widest">AI</span>
                        </div>
                    </div>

                    {/* Vertical Mode Toggles */}
                    <div className="flex flex-col w-full px-3 gap-3">
                        {[
                            { id: 'default', icon: RefreshCcw, label: 'Consensus', color: 'text-blue-600', activeBg: 'bg-blue-50 border-blue-100' },
                            { id: 'what-if', icon: Zap, label: 'What-If', color: 'text-purple-600', activeBg: 'bg-purple-50 border-purple-100' },
                            { id: 'rca', icon: FileText, label: 'RCA', color: 'text-orange-600', activeBg: 'bg-orange-50 border-orange-100' },
                            { id: 'explorer', icon: Sparkles, label: 'Explorer', color: 'text-teal-600', activeBg: 'bg-teal-50 border-teal-100' }
                        ].map((mode) => (
                            <div key={mode.id} className="relative group/tooltip flex justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setActiveMode(mode.id)}
                                    className={`w-10 h-10 rounded-xl transition-all duration-300 ${activeMode === mode.id
                                        ? `${mode.activeBg} ${mode.color} shadow-sm border`
                                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/80"
                                        }`}
                                >
                                    <mode.icon className={`w-5 h-5 transition-transform duration-300 ${activeMode === mode.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                                </Button>
                                {/* Custom Tooltip (Right) */}
                                <div className="absolute left-10 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-gray-900/90 text-white text-[10px] font-semibold rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl backdrop-blur-sm">
                                    {mode.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Status Indicator at Bottom */}
                    <div className="mt-auto mb-2">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeMode === 'what-if' ? 'bg-purple-500' :
                            activeMode === 'rca' ? 'bg-orange-500' :
                                activeMode === 'explorer' ? 'bg-teal-500' :
                                    'bg-blue-500'
                            }`} title="System Active"
                        />
                    </div>
                </div>
            )}

            {/* Header - Conditionally Rendered */}
            {!compact && (
                <div className="p-4 bg-white border-b flex justify-between items-center flex-none">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${getModeColor()}`}>
                            {activeMode === 'default' && <RefreshCcw className="h-5 w-5" />}
                            {activeMode === 'what-if' && <Zap className="h-5 w-5" />}
                            {activeMode === 'rca' && <FileText className="h-5 w-5" />}
                            {activeMode === 'explorer' && <Sparkles className="h-5 w-5" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Nowcast AI Bot</h3>
                            <p className="text-xs text-gray-500 capitalize">{activeMode === 'default' ? 'Consensus' : activeMode} Mode Active</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mode Toggles - Conditionally Rendered */}
            {!compact && (
                <div className="flex p-2 bg-gray-50/50 border-b gap-2 justify-center flex-none">
                    {[
                        { id: 'default', icon: RefreshCcw, label: 'Consensus', color: 'bg-blue-600' },
                        { id: 'what-if', icon: Zap, label: 'What-If', color: 'bg-purple-600' },
                        { id: 'rca', icon: FileText, label: 'RCA', color: 'bg-orange-500' },
                        { id: 'explorer', icon: Sparkles, label: 'Explorer', color: 'bg-green-600' }
                    ].map((mode) => (
                        <Button
                            key={mode.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveMode(mode.id)}
                            className={`transition-all duration-200 ${activeMode === mode.id
                                ? `${mode.color} text-white shadow-md hover:${mode.color} hover:text-white`
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                                }`}
                        >
                            <mode.icon className="w-3.5 h-3.5 mr-2" />
                            {mode.label}
                        </Button>
                    ))}
                </div>
            )}

            {/* Messages Area */}
            <div
                ref={chatContainerRef}
                className={`flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6 scroll-smooth ${compact ? 'pl-[90px]' : ''}`}
                style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            >
                {messages.map((msg, idx) => {
                    const isUser = msg.type === 'user';
                    return (
                        <div
                            key={idx}
                            className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-500 fill-mode-both`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {/* Bot Avatar - Premium Gradient */}
                            {!isUser && (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center flex-none shadow-md shadow-indigo-200 ring-2 ring-white transform hover:scale-105 transition-transform duration-300">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}

                            {/* Message Bubble - Premium Refinement */}
                            <div className={`max-w-[80%] rounded-2xl p-4 text-[13px] leading-relaxed font-medium shadow-sm relative group transition-all duration-300
                                ${isUser
                                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-none shadow-indigo-500/20 hover:shadow-indigo-500/30'
                                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)]'
                                }`}>

                                {/* RCA MODE SPECIAL UI */}
                                {msg.mode === 'rca' && !isUser ? (
                                    <div className="w-full min-w-[500px]">
                                        <Tabs defaultValue="system" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                                <TabsTrigger value="system">System Driven</TabsTrigger>
                                                <TabsTrigger value="user">User Driven</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="system" className="space-y-4">
                                                {/* Use New Carousel Component for Machine Driven Insights */}
                                                <RcaCarousel data={rcaData} />
                                            </TabsContent>

                                            <TabsContent value="user">
                                                <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                                                    User Driven Inputs Coming Soon
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                ) : (
                                    /* STANDARD UI (Default, What-If, etc.) */
                                    <>
                                        {/* Text Response */}
                                        {isUser ? (
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        ) : (
                                            <div className="markdown-content">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        strong: ({ node, ...props }) => <span className="font-bold text-indigo-700" {...props} />,
                                                        em: ({ node, ...props }) => <span className="italic text-gray-600" {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>

                                                {/* TABLE RENDERER FOR UPDATED RECORDS */}
                                                {msg.tableData && msg.tableData.length > 0 && (
                                                    <div className="mt-4 w-full overflow-x-auto border rounded-2xl border-gray-200 shadow-sm bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-2">
                                                        <table className="min-w-full text-xs text-left text-gray-700">
                                                            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-100">
                                                                <tr>
                                                                    <th className="px-3 py-3 whitespace-nowrap">Date</th>
                                                                    <th className="px-3 py-3 whitespace-nowrap">SKU</th>
                                                                    <th className="px-3 py-3 text-right whitespace-nowrap">Predicted</th>
                                                                    <th className="px-3 py-3 text-right whitespace-nowrap">Consensus</th>
                                                                    <th className="px-3 py-3 text-center whitespace-nowrap">Status</th>
                                                                    <th className="px-3 py-3 text-right whitespace-nowrap text-gray-500">Lower CL</th>
                                                                    <th className="px-3 py-3 text-right whitespace-nowrap text-gray-500 pr-6">Upper CL</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {msg.tableData.map((row, rIdx) => {
                                                                    // Robust Data Accessors (Case-insensitive / various keys)
                                                                    const predicted = Number(row.PredictedForecast || row.predicted_forecast || row.predicted || 0);
                                                                    const consensus = Number(row.ConsensusForecast || row.consensus_forecast || row.consensus || 0);
                                                                    const sku = row.sku || row.SKU || row.item_id || '-';
                                                                    const dateStr = String(row.Date || row.date || '').substring(0, 10);

                                                                    // Confidence Limits
                                                                    const lowerCL = Number(row.LOWER_CL || row.Lower_CL || row.lower_cl || row.lower_band || 0);
                                                                    const upperCL = Number(row.UPPER_CL || row.Upper_CL || row.upper_cl || row.upper_band || 0);

                                                                    const diff = consensus - predicted;
                                                                    const pct = predicted !== 0 ? (diff / predicted) * 100 : 0;

                                                                    let statusBadge;
                                                                    if (Math.abs(pct) < 0.1) {
                                                                        statusBadge = (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                                                                0%
                                                                            </span>
                                                                        );
                                                                    } else if (pct > 0) {
                                                                        statusBadge = (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">
                                                                                Over {pct.toFixed(0)}%
                                                                            </span>
                                                                        );
                                                                    } else {
                                                                        statusBadge = (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                                                                Under {Math.abs(pct).toFixed(0)}%
                                                                            </span>
                                                                        );
                                                                    }

                                                                    return (
                                                                        <tr key={rIdx} className="hover:bg-blue-50/50 transition-colors duration-150">
                                                                            <td className="px-3 py-2.5 font-medium whitespace-nowrap text-slate-700">{dateStr}</td>
                                                                            <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{sku}</td>
                                                                            <td className="px-3 py-2.5 text-right text-slate-600 font-medium">{Math.round(predicted).toLocaleString()}</td>
                                                                            <td className="px-3 py-2.5 text-right font-bold text-indigo-600">{Math.round(consensus).toLocaleString()}</td>
                                                                            <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                                                {statusBadge}
                                                                            </td>
                                                                            <td className="px-3 py-2.5 text-right text-slate-400 text-[11px] font-mono">{Math.round(lowerCL).toLocaleString()}</td>
                                                                            <td className="px-3 py-2.5 text-right text-slate-400 text-[11px] font-mono pr-6">{Math.round(upperCL).toLocaleString()}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* RENDER CHART IF PRESENT (Standard Mode) */}
                                        {msg.chart && !isUser && (
                                            <div className="mt-4 w-full h-[300px] bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                <Plot
                                                    data={msg.chart.data}
                                                    layout={{
                                                        ...msg.chart.layout,
                                                        autosize: true,
                                                        margin: { t: 40, r: 20, l: 40, b: 40 },
                                                        font: { size: 10 },
                                                        legend: { orientation: 'h', y: -0.2 }
                                                    }}
                                                    useResizeHandler={true}
                                                    style={{ width: "100%", height: "100%" }}
                                                    config={{
                                                        displayModeBar: "hover",
                                                        displaylogo: false,
                                                        responsive: true,
                                                        modeBarButtonsToRemove: ['lasso2d', 'select2d']
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* User Avatar - Clean & Minimal */}
                            {isUser && (
                                <div className="w-10 h-10 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center flex-none shadow-sm ring-2 ring-white">
                                    <User className="w-5 h-5 text-slate-600" />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Loading State - Consistent Avatar */}
                {isLoading && (
                    <div className="flex gap-4 justify-start animate-in fade-in zoom-in duration-300">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center flex-none shadow-md shadow-indigo-200 ring-2 ring-white animate-pulse">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white/80 border border-gray-100 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0ms]" />
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_200ms]" />
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_400ms]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className={`p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100 flex-none relative z-20 ${compact ? 'pl-[90px]' : ''}`}>
                <div className="relative flex items-center">
                    <Input
                        placeholder={
                            activeMode === "default" ? "e.g. Increase forecast by 10% for GT..." :
                                activeMode === "what-if" ? "e.g. What if we raise prices by 5%?..." :
                                    activeMode === "explorer" ? "e.g. Need trend for Jan 2023..." :
                                        "Ask about root causes..."
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="pr-12 py-6 rounded-full border-gray-200 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 bg-gray-50/50 transition-all hover:bg-white focus:bg-white shadow-sm"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading}
                        size="icon"
                        className={`absolute right-2 h-10 w-10 rounded-full shadow-md transition-all duration-300 hover:scale-105
                            ${activeMode === "default" ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" :
                                activeMode === "what-if" ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" :
                                    activeMode === "explorer" ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700" :
                                        "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                            }`}
                    >
                        <Send className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default Chatbot;