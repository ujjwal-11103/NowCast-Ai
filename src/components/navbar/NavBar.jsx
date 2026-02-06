import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, User, ChevronDown, Menu } from "lucide-react";
import { useSidebar } from "@/context/sidebar/SidebarContext";

const NavBar = () => {
    const location = useLocation();
    const { toggleSidebar, isSidebarOpen } = useSidebar();

    // Helper to get readable title from path
    const getPageTitle = (pathname) => {
        const path = pathname.split("/").pop();
        if (!path) return "Dashboard";

        // Handle specific cases or default to formatting the path
        const formatting = {
            "marketMixModeling": "Market Mix Modeling",
            "ceoDashboard": "CEO Dashboard",
            "planningAnalyst": "NRM Dashboard",
            "cvr": "Salesman Rating",
            "overall": "Overall Dashboard",
            "tradePromotion": "Trade Promotion",
            "pricingAnalytics": "Pricing Analytics",
            "chemical": "Sales Visit",
            "norms": "Norms Analysis"
        };

        return formatting[path] || path.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    const title = getPageTitle(location.pathname);

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
            <div className="flex h-16 items-center justify-between px-6">

                {/* Left: Title & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button - Visible only on small screens if needed, 
                        but sidebar has its own toggle. We can keep it or sync it. 
                        Let's hide it for now as Sidebar handles itself usually. */}

                    <h2 className="text-xl font-bold text-slate-800 tracking-tight font-[Montserrat]">
                        {title}
                    </h2>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4 md:gap-6">

                    {/* Search Bar (Hidden on mobile) */}
                    <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-transparent focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-64">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="h-6 w-px bg-slate-200"></div>

                    {/* Profile */}
                    <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-blue-200">
                            JD
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-slate-700 leading-none">John Doe</p>
                            <p className="text-[10px] text-slate-500 font-medium">Administrator</p>
                        </div>
                        <ChevronDown size={14} className="text-slate-400" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default NavBar;
