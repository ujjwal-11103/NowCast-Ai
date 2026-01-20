import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import {
    Menu, ChevronLeft, ChevronRight, Gauge, FilePlus, Calendar,
    BarChart2, AlertCircle, ClipboardList, ShoppingCart, LogOut, Database, TrendingUp, ChevronDown, DollarSign, Activity
} from "lucide-react";
import { useAuth } from "@/context/auth/AuthContext";

const SideBar = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarOpen, toggleSidebar } = useSidebar();

    // Local state for handling sub-menus (accordion)
    const [openMenus, setOpenMenus] = useState({});

    const toggleSubMenu = (label) => {
        setOpenMenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    // Pages
    const menuItems = [
        { label: "Overall", path: "/overall", icon: Gauge },
        { label: "Ingestion", path: "/ingestion", icon: FilePlus },
        {
            label: "Planning",
            icon: Calendar,
            children: [
                { label: "Demand Planning", path: "/planning", icon: Calendar },
                { label: "Reporting", path: "/reporting", icon: BarChart2 },
                { label: "MEIO", path: "/meio", icon: Database },
                { label: "Error Analysis", path: "/erroranalysis", icon: AlertCircle },
                { label: "Norms", path: "/norms", icon: ClipboardList },
            ]
        },
        {
            label: "Sales",
            icon: TrendingUp,
            children: [
                { label: "Sales Visit Dashboard", path: "/chemical", icon: AlertCircle },
                { label: "Sales Rating", path: "/cvr", icon: ClipboardList },
                { label: "Sales Performance", path: "/salesPerformance", icon: BarChart2 },
            ]
        },
        {
            label: "Pricing Analyst",
            icon: DollarSign,
            children: [
                { label: "Market Mix Modeling", path: "/marketMixModeling", icon: BarChart2 },
                { label: "CEO Dashboard", path: "/ceoDashboard", icon: Gauge },
                { label: "Pricing Analytics", path: "/pricingAnalytics", icon: TrendingUp },
            ]
        },
        { label: "Supply Chain Tower", path: "/supplychain", icon: ShoppingCart },
        { label: "Custom Reporting", path: "/custom-reporting", icon: BarChart2 },
    ];

    // Navigation helpers
    const goToPage = (path) => navigate(path);

    // Determines if a main menu item is active
    const isActive = (item) => {
        if (item.path) {
            return location.pathname.includes(item.path);
        }
        if (item.children) {
            return item.children.some(child => location.pathname.includes(child.path));
        }
        return false;
    };

    // Determines if a specific child item is active
    const isChildActive = (path) => location.pathname.includes(path);


    // Initializes open state for parent menus if a child is currently active
    // This runs once on mount or when location changes to ensure the active menu is open
    React.useEffect(() => {
        menuItems.forEach(item => {
            if (item.children && item.children.some(child => location.pathname.includes(child.path))) {
                setOpenMenus(prev => ({ ...prev, [item.label]: true }));
            }
        });
    }, [location.pathname]);


    // simple logout 
    const handleLogout = () => {
        logout();
        navigate("/");
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
                                <img src="/profitPulse.png" alt="" className="w-8 h-8" />
                                <span className="text-xl font-bold text-white">Nowcast AI</span>
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
                            {menuItems.map((item) => {
                                const active = isActive(item);
                                const isOpen = openMenus[item.label];

                                if (item.children) {
                                    // Accordion Item
                                    return (
                                        <li key={item.label}>
                                            <button
                                                onClick={() => isSidebarOpen ? toggleSubMenu(item.label) : toggleSidebar()}
                                                className={`flex items-center w-full ${isSidebarOpen ? "px-4 py-3 justify-between" : "justify-center px-5 py-3"
                                                    } rounded-lg transition-all duration-300 ${active
                                                        ? "bg-slate-800 text-white" // Parent active style
                                                        : "text-white hover:bg-slate-800"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={20} className="flex-shrink-0" />
                                                    {isSidebarOpen && <span>{item.label}</span>}
                                                </div>
                                                {isSidebarOpen && (
                                                    isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                                )}
                                            </button>

                                            {/* Submenu */}
                                            {isSidebarOpen && isOpen && (
                                                <ul className="mt-2 space-y-1 pl-4">
                                                    {item.children.map((child) => (
                                                        <li key={child.label}>
                                                            <button
                                                                onClick={() => goToPage(child.path)}
                                                                className={`flex items-center w-full px-4 py-2 space-x-3 rounded-lg transition-all duration-300 ${isChildActive(child.path)
                                                                    ? "bg-blue-600 text-white"
                                                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                                                                    }`}
                                                            >
                                                                <child.icon size={18} className="flex-shrink-0" />
                                                                <span>{child.label}</span>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                } else {
                                    // Standard Item
                                    return (
                                        <li key={item.label}>
                                            <button
                                                onClick={() => goToPage(item.path)}
                                                className={`flex items-center w-full ${isSidebarOpen ? "px-4 py-3 justify-start" : "justify-center px-5 py-3"
                                                    } space-x-3 rounded-lg transition-all duration-300 ${active
                                                        ? "bg-blue-600 text-white"
                                                        : "text-white hover:bg-slate-700"
                                                    }`}
                                            >
                                                <item.icon size={20} className="flex-shrink-0" />
                                                {isSidebarOpen && <span>{item.label}</span>}
                                            </button>
                                        </li>
                                    )
                                }
                            })}
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
