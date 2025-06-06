import SideBar from '@/components/Sidebar/SideBar';
import { useSidebar } from '@/context/sidebar/SidebarContext';
import React from 'react'

const ErrorAnalysis = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar(); // Get sidebar state and toggle function

    return (
        <div>
            <div className="flex">
                <div
                    className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"
                        } fixed`}>
                    <SideBar />
                </div>

                <div className={`main transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} w-full`}>
                    <div>
                        <h1>Error Analysis</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorAnalysis
