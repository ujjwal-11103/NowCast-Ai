import React from 'react';
import { useSidebar } from "@/context/sidebar/SidebarContext";
import SideBar from "@/components/Sidebar/SideBar";

const Layout = ({ children }) => {
    const { isSidebarOpen } = useSidebar();

    return (
        <div className="min-h-screen font-sans bg-slate-50 relative overflow-x-hidden">
            {/* Sidebar Wrapper */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} fixed z-50 h-full`}>
                <SideBar />
            </div>

            {/* Main Content */}
            <div className={`main transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} min-h-screen relative`}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
