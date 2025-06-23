import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import { Menu, ChevronLeft, ChevronRight, Home, Calendar, FilePlus, Users, ShoppingCart, BarChart2, Gauge, ClipboardList, AlertCircle, Box } from "lucide-react";


const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarOpen, toggleSidebar } = useSidebar();

    // Navigation items
    const menuItems = [
        { label: "Overall", path: "/overall", icon: Gauge },
        { label: "Ingestion", path: "/ingestion", icon: FilePlus },
        { label: "Planning", path: "/planning", icon: Calendar },
        { label: "Reporting", path: "/reporting", icon: BarChart2 },
        { label: "Error Analysis", path: "/erroranalysis", icon: AlertCircle },
        { label: "Norms", path: "/norms", icon: ClipboardList },
        { label: "Supply Chain", path: "/supplychain", icon: ShoppingCart },
    ];


    // Navigation handler
    const goToPage = (path) => {
        navigate(path);
    };

    // Determine active page based on route
    const getActivePage = () => {
        return menuItems.find(item => location.pathname.includes(item.path.toLowerCase()))?.label || "";
    };

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 right-4 z-50 bg-[#0A2472] text-white p-2 rounded-md shadow-md lg:hidden"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen overflow-y-auto bg-slate-900 border-r z-40 transition-all duration-300 ${isSidebarOpen ? "w-64 translate-x-0" : "w-16 -translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar header */}
                    <div className="p-4 flex justify-between items-center border-b border-slate-700">
                        {isSidebarOpen && (
                            <div className="flex items-center gap-2">
                                <img src="/Intellimark_AI.png" alt="" className="w-8 h-8" />
                                <span className="text-xl font-bold text-white">Intellimark</span>
                            </div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-1 hover:bg-slate-700 rounded-md"
                        >
                            {isSidebarOpen ? <ChevronLeft size={20} className="text-white" /> : <ChevronRight size={20} className="text-white" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 flex-1">
                        {/* <h2 className="font-medium mb-4 text-[#0A2472]">Navigation</h2> */}
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.label}>
                                    <button
                                        onClick={() => goToPage(item.path)}
                                        className={`flex items-center w-full ${isSidebarOpen ? "px-4 py-3 justify-start" : "justify-center px-5 py-3"
                                            } space-x-3 rounded-lg transition-all duration-300 ${getActivePage() === item.label
                                                ? "bg-blue-600 text-white"
                                                : "text-white hover:bg-slate-700"
                                            }`}
                                    >
                                        <item.icon size={20} className="flex-shrink-0" />
                                        {isSidebarOpen && <span>{item.label}</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                </div>
            </aside>
        </>
    );
};

export default SideBar;