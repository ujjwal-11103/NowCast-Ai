import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import {
    Menu, ChevronLeft, ChevronRight, Gauge, FilePlus, Calendar,
    BarChart2, BarChart3, AlertCircle, ClipboardList, ShoppingCart, LogOut, Database, TrendingUp, ChevronDown, DollarSign, Activity,
    Hammer, Package, CheckCircle, Clipboard, Building
} from "lucide-react";
import { useAuth } from "@/context/auth/AuthContext";
import Logo from "@/assets/Login/Favicon.png";

const SideBar = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarOpen, toggleSidebar } = useSidebar();

    // Local state for handling sub-menus (accordion)
    const [openMenus, setOpenMenus] = useState({});

    // Effect to close submenus when sidebar is closed
    React.useEffect(() => {
        if (!isSidebarOpen) {
            setOpenMenus({});
        }
    }, [isSidebarOpen]);

    const toggleSubMenu = (label) => {
        setOpenMenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    // Pages
    // Pages
    const menuItems = [
        // --- Existing Items ---
        { label: "Ingestion", path: "/ingestion", icon: FilePlus },
        {
            label: "Revenue Growth",
            icon: DollarSign,
            children: [
                { label: "Market Mix Modeling", path: "/marketMixModeling", icon: BarChart2 },
                // { label: "CEO Dashboard", path: "/ceoDashboard", icon: Gauge },
                { label: "Pricing Analytics", path: "/pricingAnalytics", icon: TrendingUp },
                { label: "TPO", path: "/tradePromotion", icon: TrendingUp },
                { label: "NRM Dashboard", path: "/planningAnalyst", icon: BarChart3 },
            ]
        },

        // Temporarily hidden - ERPNext section
        // {
        //     label: "ERPNext",
        //     icon: Building,
        //     children: [
        //         { label: "Dashboard", path: "/dashboard" },
        //         { label: "Stock Overview", path: "/stock" },
        //         { label: "Item Stock", path: "/stock/item-view" },
        //         { label: "Bill of Materials", path: "/manufacturing/bom" },
        //         { label: "Work Orders", path: "/manufacturing/work-order" },
        //         { label: "Issue Materials", path: "/manufacturing/issue-materials" },
        //         { label: "Complete Production", path: "/manufacturing/complete-production" },
        //         { label: "Finished Goods", path: "/stock/finished-goods" },
        //         { label: "Stock Ledger", path: "/stock/ledger" },
        //     ]
        // },
    ];

    // Navigation helpers
    const goToPage = (path) => {
        navigate(path);
    };
    // Determines if a main menu item is active
    const isActive = (item) => {
        if (item.path) {
            return location.pathname === item.path;
        }
        if (item.children) {
            return item.children.some(child => location.pathname === child.path);
        }
        return false;
    };

    // Determines if a specific child item is active
    const isChildActive = (path) => location.pathname === path;


    // Initializes open state for parent menus if a child is currently active
    // This runs once on mount or when location changes to ensure the active menu is open
    React.useEffect(() => {
        menuItems.forEach(item => {
            if (item.children && item.children.some(child => location.pathname === child.path)) {
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
                type="button"
                onClick={toggleSidebar}
                className="fixed top-4 right-4 z-50 bg-primary text-white p-2 rounded-md shadow-md lg:hidden"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 z-40 transition-all duration-300 shadow-2xl ${isSidebarOpen ? "w-64 translate-x-0" : "w-16 -translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 flex justify-between items-center border-b border-white/10 bg-white/5 backdrop-blur-sm">
                        {isSidebarOpen && (
                            <div className="flex items-center gap-3 animate-in fade-in duration-300">
                                <img src={Logo} alt="Logo" className="w-8 h-8" />
                                <span className="text-xl font-bold text-white tracking-wide font-[Montserrat] whitespace-nowrap">NowCast AI</span>
                            </div>
                        )}
                        <button type="button" onClick={toggleSidebar} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                            {isSidebarOpen ? (
                                <ChevronLeft size={20} />
                            ) : (
                                <ChevronRight size={20} />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 flex-1 space-y-1">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const active = isActive(item);
                                const isOpen = openMenus[item.label];

                                if (item.children) {
                                    // Accordion Item
                                    return (
                                        <li key={item.label}>
                                            <button
                                                type="button"
                                                onClick={() => isSidebarOpen ? toggleSubMenu(item.label) : toggleSidebar()}
                                                className={`flex items-center w-full ${isSidebarOpen ? "px-4 py-3 justify-between" : "justify-center px-0 py-3"
                                                    } rounded-xl transition-all duration-300 group relative ${active
                                                        ? "bg-secondary text-white shadow-lg shadow-blue-900/40" // Parent active style
                                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={20} className={`flex-shrink-0 transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                                                    {isSidebarOpen && <span className="font-medium text-[14px]">{item.label}</span>}
                                                </div>
                                                {isSidebarOpen && (
                                                    <div className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}>
                                                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                    </div>
                                                )}
                                            </button>

                                            {/* Submenu */}
                                            {isSidebarOpen && isOpen && (
                                                <ul className="mt-2 text-sm space-y-1 pl-4 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-800">
                                                    {item.children.map((child) => (
                                                        <li key={child.label}>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    goToPage(child.path);
                                                                }}
                                                                className={`flex items-center w-full px-4 py-2.5 space-x-3 rounded-lg transition-all duration-200 relative ml-2 ${isChildActive(child.path)
                                                                    ? "text-secondary bg-secondary/10 font-medium border-l-2 border-secondary"
                                                                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5 border-l-2 border-transparent"
                                                                    }`}
                                                            >
                                                                {/* <child.icon size={16} className="flex-shrink-0 opacity-70" /> */}
                                                                <span>{child.label}</span>
                                                                {isChildActive(child.path) && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>}
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
                                                type="button"
                                                onClick={() => goToPage(item.path)}
                                                className={`flex items-center w-full ${isSidebarOpen ? "px-4 py-3 justify-start" : "justify-center px-0 py-3"
                                                    } space-x-3 rounded-xl transition-all duration-300 group ${active
                                                        ? "bg-secondary text-white shadow-lg shadow-blue-900/20"
                                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                    }`}
                                            >
                                                <item.icon size={20} className={`flex-shrink-0 transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                                                {isSidebarOpen && <span className="font-medium text-[14px]">{item.label}</span>}
                                            </button>
                                        </li>
                                    )
                                }
                            })}
                        </ul>
                    </nav>

                    {/* ✅ Logout button pinned to bottom */}
                    <div className="p-4 border-t border-white/10 bg-slate-950/30">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center w-full ${isSidebarOpen ? "px-4 py-3 justify-start" : "justify-center px-2 py-3"
                                } space-x-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border hover:border-red-500/20 transition-all duration-200 group`}
                        >
                            <LogOut size={20} className="flex-shrink-0 group-hover:stroke-red-400" />
                            {isSidebarOpen && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SideBar;
