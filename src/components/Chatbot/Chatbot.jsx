import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Zap, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useForecast } from "@/context/ForecastContext/ForecastContext";

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'I can help you simulate scenarios. Select a mode below or type a command.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Mode State: "default" | "what-if" | "rca"
    const [activeMode, setActiveMode] = useState("default");

    const messagesEndRef = useRef(null);
    const { updateForecastData, handleWhatIfScenario } = useForecast();

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            let apiUrl = 'http://20.235.178.245:5000/api/update-consensus';
            let payload = { owner: "Rahul", prompt: userMessage.text };

            // Switch API based on Mode
            if (activeMode === "what-if") {
                apiUrl = 'http://20.235.178.245:5000/api/WhatIf';
                payload = { prompt: userMessage.text };
            } else if (activeMode === "rca") {
                apiUrl = 'http://20.235.178.245:5000/api/rca';
                // RCA might not need a prompt, but we send it if the user typed something specific
                // Or you can trigger it immediately upon button click if preferred.
                // Assuming it takes a prompt for context:
                payload = { include_sources: true, question: userMessage.text };
            }

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
                        // PASS TWO ARGUMENTS: Data AND Metadata
                        updateForecastData(data.consensus_data, data.change_details);
                        setMessages(prev => [...prev, {
                            type: 'bot',
                            text: `Success! I've updated ${data.affected_records} records. The charts have been refreshed.`
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
                        text: `Error: ${data.message || "Something went wrong."}`
                    }]);
                }
            }
            else if (activeMode === "what-if") {
                // --- WHAT-IF LOGIC (Text Answer) ---
                if (data.status === "success") {
                    // 1. Show Analysis Text
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: data.analysis || "Here is the analysis."
                    }]);

                    // 2. Update Chart with Scenario Data (New_Forecast)
                    if (data.updated_records && data.updated_records.length > 0) {
                        handleWhatIfScenario(data.updated_records); // <--- CALL CONTEXT
                    }
                } else {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: `Error: ${data.message}`
                    }]);
                }
            }
            else if (activeMode === "rca") {
                // --- RCA LOGIC (Report) ---
                if (data.status === "success") {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: data.report || "Root Cause Analysis complete."
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: `Error: ${data.message}`
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

    return (
        <Card className="w-full h-full flex flex-col border border-gray-200 shadow-sm overflow-hidden bg-white">

            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center flex-none">
                <div className="flex items-center gap-2 text-white">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-semibold">Intellimark Assistant</h3>
                </div>
            </div>

            {/* Mode Selection Toggles */}
            <div className="flex p-2 bg-gray-50 border-b gap-2 justify-center flex-none">
                <Button
                    variant={activeMode === "default" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveMode("default")}
                    className={activeMode === "default" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
                >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Update
                </Button>
                <Button
                    variant={activeMode === "what-if" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveMode("what-if")}
                    className={activeMode === "what-if" ? "bg-purple-600 text-white" : "bg-white text-gray-700"}
                >
                    <Zap className="w-4 h-4 mr-1" />
                    What-If
                </Button>
                <Button
                    variant={activeMode === "rca" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveMode("rca")}
                    className={activeMode === "rca" ? "bg-orange-500 text-white" : "bg-white text-gray-700"}
                >
                    <FileText className="w-4 h-4 mr-1" />
                    RCA
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0">
                <div className="space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${msg.type === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border p-3 rounded-2xl rounded-bl-none text-xs text-gray-500 italic flex items-center gap-2 shadow-sm">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75" />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                                {activeMode === "default" ? "Updating Forecast..." : activeMode === "what-if" ? "Analyzing Scenario..." : "Running RCA..."}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t flex-none">
                <div className="flex gap-2">
                    <Input
                        placeholder={
                            activeMode === "default" ? "e.g. Increase forecast by 10% for GT" :
                                activeMode === "what-if" ? "e.g. What if we raise prices?" :
                                    "Ask about root causes..."
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="focus-visible:ring-blue-600"
                    />
                    <Button onClick={handleSend} disabled={isLoading} size="icon" className={`hover:opacity-90 ${activeMode === "default" ? "bg-blue-600" :
                        activeMode === "what-if" ? "bg-purple-600" : "bg-orange-500"
                        }`}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default Chatbot;