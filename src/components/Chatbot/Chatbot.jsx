import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Zap, FileText, BarChart3, Bot, User, RefreshCcw } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useForecast } from "@/context/ForecastContext/ForecastContext";

const Chatbot = ({ filters = {} }) => {
    const [input, setInput] = useState("");
    // Initial message
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I can help you simulate scenarios. Select a mode below or type a command.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Mode State: "default" | "what-if" | "rca"
    const [activeMode, setActiveMode] = useState("default");

    // CHANGED: Use a ref for the CONTAINER, not an element at the bottom
    const chatContainerRef = useRef(null);
    const { updateForecastData, handleWhatIfScenario, globalData } = useForecast();

    // CHANGED: Scroll logic to target only the container
    useEffect(() => {
        if (chatContainerRef.current) {
            const { scrollHeight, clientHeight } = chatContainerRef.current;
            // Only scroll if content is taller than container
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
            // Clean filters: only include non-null and non-"All" values
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value && value !== "All")
            );

            // Generate key from filters (without channel and subCat): Chain_Depot_SKU
            const key = `${cleanFilters.chain || '*'}_${cleanFilters.depot || '*'}_${cleanFilters.sku || '*'}`;

            let apiUrl = 'http://20.235.178.245:5000/api/update-consensus';
            let payload = { owner: "Rahul", prompt: userMessage.text, filters: cleanFilters, key };

            // Switch API based on Mode
            if (activeMode === "what-if") {
                apiUrl = 'http://20.235.178.245:5000/api/WhatIf';
                payload = { prompt: userMessage.text, filters: cleanFilters, key };
            } else if (activeMode === "rca") {
                apiUrl = 'http://20.235.178.245:5000/api/rca';
                payload = { include_sources: true, question: userMessage.text, filters: cleanFilters, key };
            }

            // Print payload to console
            console.log(`[${activeMode.toUpperCase()}] Sending Payload:`, payload);
            console.log(`API URL: ${apiUrl}`);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            // Handle Response based on Mode
            if (activeMode === "default") {
                if (data.status === "success") {
                    if (data.consensus_data && data.consensus_data.length > 0) {
                        // Extract filters from the parsed request
                        const parsedFilters = data.parsed_request?.parsed_parameters?.filters;
                        // PASS 3 ARGUMENTS: Data, Metadata, AND Filters
                        updateForecastData(data.consensus_data, data.change_details, parsedFilters);
                        setMessages(prev => [...prev, {
                            type: 'bot',
                            text: `**Success!** \n\nI've updated **${data.affected_records} records**. The charts have been refreshed.`
                        }]);
                    } else {
                        setMessages(prev => [...prev, {
                            type: 'bot',
                            text: "I processed your request, but no matching records were found to update."
                        }]);
                    }
                } else {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: `**Error:** ${data.message || "Something went wrong."}`
                    }]);
                }
            }
            else if (activeMode === "what-if") {
                if (data.status === "success") {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: data.analysis || "Here is the analysis."
                    }]);

                    if (data.updated_records && data.updated_records.length > 0) {
                        handleWhatIfScenario(data.updated_records);
                    }
                } else {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: `**Error:** ${data.message}`
                    }]);
                }
            }
            else if (activeMode === "rca") {
                if (data.status === "success") {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: data.report || "Root Cause Analysis complete."
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: `**Error:** ${data.message}`
                    }]);
                }
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

    // Helper to get Color Scheme based on Mode
    const getModeColor = () => {
        switch (activeMode) {
            case 'what-if': return 'text-purple-600 bg-purple-100 border-purple-200';
            case 'rca': return 'text-orange-600 bg-orange-100 border-orange-200';
            default: return 'text-blue-600 bg-blue-100 border-blue-200';
        }
    };

    return (
        <Card className="w-full h-full flex flex-col border border-gray-200 shadow-xl overflow-hidden bg-white rounded-xl">

            {/* Header */}
            <div className="p-4 bg-white border-b flex justify-between items-center flex-none">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${getModeColor()}`}>
                        {activeMode === 'default' && <BarChart3 className="h-5 w-5" />}
                        {activeMode === 'what-if' && <Zap className="h-5 w-5" />}
                        {activeMode === 'rca' && <FileText className="h-5 w-5" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Nowcast AI Bot</h3>
                        <p className="text-xs text-gray-500 capitalize">{activeMode.replace('-', ' ')} Mode Active</p>
                    </div>
                </div>
            </div>

            {/* Mode Toggles */}
            <div className="flex p-2 bg-gray-50/50 border-b gap-2 justify-center flex-none">
                {[
                    { id: 'default', icon: RefreshCcw, label: 'Consensus', color: 'bg-blue-600' },
                    { id: 'what-if', icon: Zap, label: 'What-If', color: 'bg-purple-600' },
                    { id: 'rca', icon: FileText, label: 'RCA', color: 'bg-orange-500' }
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

            {/* Messages Area - CHANGED: Attached ref here instead of bottom div */}
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
                            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed 
                                ${isUser
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                }`}>
                                {isUser ? (
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                ) : (
                                    /* MARKDOWN RENDERER FOR BOT */
                                    <div className="markdown-content">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                // Customize Markdown Elements
                                                strong: ({ node, ...props }) => <span className="font-bold text-indigo-700" {...props} />,
                                                em: ({ node, ...props }) => <span className="italic text-gray-600" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
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
                {/* CHANGED: Removed the empty div reference here */}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t flex-none">
                <div className="relative flex items-center">
                    <Input
                        placeholder={
                            activeMode === "default" ? "e.g. Increase forecast by 10% for GT..." :
                                activeMode === "what-if" ? "e.g. What if we raise prices by 5%?..." :
                                    "Ask why sales dropped last month..."
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