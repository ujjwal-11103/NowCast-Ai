import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
// Removed ScrollArea import to use native div for reliable flex scrolling
import { useForecast } from "@/context/ForecastContext/ForecastContext";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'I can help you simulate scenarios. Try: "Increase forecast by 10% for Product_1 in GT channel".' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const { updateForecastData } = useForecast();

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
            const response = await fetch('http://20.235.178.245:5000/api/update-consensus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    owner: "CurrentUser",
                    prompt: userMessage.text
                })
            });

            const data = await response.json();

            if (data.status === "success") {
                if (data.consensus_data && data.consensus_data.length > 0) {
                    updateForecastData(data.consensus_data);
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: `Success! I've updated ${data.affected_records} records based on your request.`
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: "I processed your request, but no records needed updating based on the filters."
                    }]);
                }
            } else {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: `Error: ${data.message || "Something went wrong."}`
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

    if (!isOpen) {
        return (
            <Button
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 z-[9999] transition-all duration-200 hover:scale-105"
                onClick={() => setIsOpen(true)}
            >
                <MessageSquare className="h-6 w-6 text-white" />
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[500px] shadow-2xl z-[9999] flex flex-col border-0 animate-in slide-in-from-bottom-5 overflow-hidden">
            {/* Header - Fixed Height */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center flex-none">
                <div className="flex items-center gap-2 text-white">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-semibold">Intellimark Assistant</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages Area - Grow to fill space, Scrollable */}
            {/* Added overflow-y-auto and min-h-0 to ensure proper flex behavior */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0">
                <div className="space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.type === 'user'
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
                                Calculating impact...
                            </div>
                        </div>
                    )}
                    {/* Invisible element to scroll to */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area - Fixed Height */}
            <div className="p-4 bg-white border-t flex-none">
                <div className="flex gap-2">
                    <Input
                        placeholder="Type your scenario..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="focus-visible:ring-blue-600"
                    />
                    <Button onClick={handleSend} disabled={isLoading} size="icon" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default Chatbot;