import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Maximize2, Minimize2, ExternalLink, ArrowLeft } from 'lucide-react';

const TPOptimization = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [key, setKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Use proxy route to allow loading the external app within our domain
    // The vite.config.js proxy router will route API calls correctly to avoid collisions
    const iframeUrl = '/tp-optimisation';

    const handleRefresh = () => {
        setIsLoading(true);
        setKey(prevKey => prevKey + 1);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const openInNewTab = () => {
        window.open('http://52.172.42.245:5005/tp-optimisation', '_blank');
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleIframeLoad = () => {
        console.log('Iframe loaded');
        setTimeout(() => setIsLoading(false), 500);
    };

    // Fallback timeout to ensure loader doesn't stick if load event misses
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 5000); // 5 seconds timeout
        return () => clearTimeout(timeout);
    }, [key]);

    if (isFullscreen) {
        return (
            <div className="h-screen bg-slate-50 overflow-hidden fixed inset-0 z-[1000]">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-3 flex items-center justify-between border-b border-slate-700 shadow-xl">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors group"
                            title="Go Back"
                        >
                            <ArrowLeft size={20} className="text-white group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <h2 className="text-white text-lg font-bold">Trade Promotion Optimization</h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRefresh}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <RefreshCw size={18} className={`text-white ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={openInNewTab}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <ExternalLink size={18} className="text-white" />
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Minimize2 size={18} className="text-white" />
                            <span className="text-white text-sm font-semibold">Exit</span>
                        </button>
                    </div>
                </div>

                <div className="h-[calc(100vh-57px)] relative bg-white">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white flex items-center justify-center z-20">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-slate-800 text-lg font-semibold">Loading Dashboard...</p>
                            </div>
                        </div>
                    )}
                    <iframe
                        key={key}
                        src={iframeUrl}
                        className="w-full h-full border-0"
                        title="Trade Promotion Optimization"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
                        onLoad={handleIframeLoad}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 h-[100vh] flex flex-col overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative w-full max-w-[1920px] mx-auto h-full flex flex-col p-6">
                <div className="flex-none flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-full hover:border-indigo-300 hover:bg-white transition-all shadow-md hover:shadow-lg group"
                            title="Go Back"
                        >
                            <ArrowLeft size={24} className="text-slate-700 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Trade Promotion Optimization
                            </h1>
                            <p className="text-slate-600 text-sm font-medium mt-1">Live Dashboard</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRefresh}
                            className="p-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl hover:border-purple-300 hover:bg-white transition-all shadow-md hover:shadow-lg hover:scale-105"
                            title="Refresh"
                        >
                            <RefreshCw size={20} className={`text-slate-700 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={openInNewTab}
                            className="p-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-white transition-all shadow-md hover:shadow-lg hover:scale-105"
                            title="Open New Tab"
                        >
                            <ExternalLink size={20} className="text-slate-700" />
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                        >
                            <Maximize2 size={20} />
                            Fullscreen
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative min-h-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20"></div>

                    <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden h-full">
                        {isLoading && (
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center z-20">
                                <div className="text-center">
                                    <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-xl font-bold text-slate-800">Loading Dashboard...</p>
                                    <p className="text-sm text-slate-600 mt-1">Please wait</p>
                                </div>
                            </div>
                        )}

                        <iframe
                            key={key}
                            src={iframeUrl}
                            className="w-full h-full border-0 bg-white"
                            title="Trade Promotion Optimization"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
                            onLoad={handleIframeLoad}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TPOptimization;
