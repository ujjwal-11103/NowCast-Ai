import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Zap, FileText, BarChart3, Bot, User, RefreshCcw } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Plot from 'react-plotly.js'; // Import Plotly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useForecast } from "@/context/ForecastContext/ForecastContext";

const Chatbot = ({ filters = {} }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I can help you simulate scenarios. Select a mode below or type a command.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Mode State: "default" | "what-if" | "rca" | "explorer"
    const [activeMode, setActiveMode] = useState("default");

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
                    chart: data.chart || null // Capture chart data if present (mainly for what-if)
                };

                setMessages(prev => [...prev, botResponse]);

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
        <Card className="w-full h-full flex flex-col border border-gray-200 shadow-xl overflow-hidden bg-white rounded-xl">

            {/* Header */}
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

            {/* Mode Toggles */}
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

            {/* Messages Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-6 scroll-smooth"
            >
                {messages.map((msg, idx) => {
                    const isUser = msg.type === 'user';
                    return (
                        <div key={idx} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            {/* Bot Avatar */}
                            {!isUser && (
                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-none shadow-sm">
                                    <Sparkles className="w-4 h-4 text-indigo-500" />
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div className={`max-w-[90%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed 
                                ${isUser
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                }`}>

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
                                            <div className="mt-4 w-full overflow-x-auto border rounded-2xl border-gray-200 shadow-sm bg-white">
                                                <table className="w-full text-xs text-left text-gray-700">
                                                    <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-100">
                                                        <tr>
                                                            <th className="px-4 py-3 whitespace-nowrap">Date</th>
                                                            <th className="px-4 py-3 whitespace-nowrap">SKU</th>
                                                            <th className="px-4 py-3 text-right whitespace-nowrap">PredictedForecast</th>
                                                            <th className="px-4 py-3 text-right whitespace-nowrap">ConsensusForecast</th>
                                                            <th className="px-4 py-3 text-center whitespace-nowrap">Over/Under Stretch %</th>
                                                            <th className="px-4 py-3 text-right whitespace-nowrap text-gray-500">Lower_CL</th>
                                                            <th className="px-4 py-3 text-right whitespace-nowrap text-gray-500">Upper_CL</th>
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
                                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                                                        0%
                                                                    </span>
                                                                );
                                                            } else if (pct > 0) {
                                                                statusBadge = (
                                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">
                                                                        Overstretch ↑ {pct.toFixed(1)}%
                                                                    </span>
                                                                );
                                                            } else {
                                                                statusBadge = (
                                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                                                        Understretch ↓ {Math.abs(pct).toFixed(1)}%
                                                                    </span>
                                                                );
                                                            }

                                                            return (
                                                                <tr key={rIdx} className="hover:bg-blue-50/50 transition-colors duration-150">
                                                                    <td className="px-4 py-3 font-medium whitespace-nowrap text-slate-700">{dateStr}</td>
                                                                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{sku}</td>
                                                                    <td className="px-4 py-3 text-right text-slate-600 font-medium">{Math.round(predicted).toLocaleString()}</td>
                                                                    <td className="px-4 py-3 text-right font-bold text-indigo-600">{Math.round(consensus).toLocaleString()}</td>
                                                                    <td className="px-4 py-3 text-center whitespace-nowrap">
                                                                        {statusBadge}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right text-slate-400 text-[11px] font-mono">{Math.round(lowerCL).toLocaleString()}</td>
                                                                    <td className="px-4 py-3 text-right text-slate-400 text-[11px] font-mono">{Math.round(upperCL).toLocaleString()}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* RENDER CHART IF PRESENT */}
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
                            </div>

                            {/* User Avatar */}
                            {isUser && (
                                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-none shadow-sm">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-none shadow-sm">
                            <Bot className="w-4 h-4 text-gray-500 animate-pulse" />
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t flex-none">
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
                        className="pr-12 py-6 rounded-full border-gray-300 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 bg-gray-50"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading}
                        size="icon"
                        className={`absolute right-2 h-9 w-9 rounded-full shadow-sm transition-all
                            ${activeMode === "default" ? "bg-blue-600 hover:bg-blue-700" :
                                activeMode === "what-if" ? "bg-purple-600 hover:bg-purple-700" :
                                    activeMode === "explorer" ? "bg-green-600 hover:bg-green-700" :
                                        "bg-orange-500 hover:bg-orange-600"
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