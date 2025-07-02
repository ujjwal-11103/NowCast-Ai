import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import {
    Menu, ChevronLeft, ChevronRight, Gauge, FilePlus, Calendar,
    BarChart2, AlertCircle, ClipboardList, ShoppingCart, LogOut   // ✅ new icon
} from "lucide-react";

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarOpen, toggleSidebar } = useSidebar();

    // Pages
    const menuItems = [
        { label: "Overall", path: "/overall", icon: Gauge },
        { label: "Ingestion", path: "/ingestion", icon: FilePlus },
        { label: "Planning", path: "/planning", icon: Calendar },
        { label: "Reporting", path: "/reporting", icon: BarChart2 },
        { label: "Error Analysis", path: "/erroranalysis", icon: AlertCircle },
        { label: "Norms", path: "/norms", icon: ClipboardList },
        { label: "Supply Chain", path: "/supplychain", icon: ShoppingCart },
    ];

    // Navigation helpers
    const goToPage = (path) => navigate(path);
    const activeLabel =
        menuItems.find((i) => location.pathname.includes(i.path))?.label ?? "";

    // ✅ simple logout stub – hook in your real logic here
    const handleLogout = () => {
        localStorage.clear();          // or remove only auth keys
        navigate("/");            // redirect wherever makes sense
    };

    return (
        <>
            {/* Mobile hamburger */}
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
                    {/* Header */}
                    <div className="p-4 flex justify-between items-center border-b border-slate-700">
                        {isSidebarOpen && (
                            <div className="flex items-center gap-2">
                                <img src="/Intellimark_AI.png" alt="" className="w-8 h-8" />
                                <span className="text-xl font-bold text-white">Intellimark</span>
                            </div>
                        )}
                        <button onClick={toggleSidebar} className="p-1 hover:bg-slate-700 rounded-md">
                            {isSidebarOpen ? (
                                <ChevronLeft size={20} className="text-white" />
                            ) : (
                                <ChevronRight size={20} className="text-white" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 flex-1">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.label}>
                                    <button
                                        onClick={() => goToPage(item.path)}
                                        className={`flex items-center w-full ${isSidebarOpen ? "px-4 py-3 justify-start" : "justify-center px-5 py-3"
                                            } space-x-3 rounded-lg transition-all duration-300 ${activeLabel === item.label
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

                    {/* ✅ Logout button pinned to bottom */}
                    <div className="px-4 py-1 border-t border-slate-700">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center w-full ${isSidebarOpen ? "px-4 py-3 justify-start" : "justify-center px-5 py-3"
                                } space-x-3 rounded-lg text-white hover:bg-red-600 transition-colors`}
                        >
                            <LogOut size={20} className="flex-shrink-0" />
                            {isSidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SideBar;
