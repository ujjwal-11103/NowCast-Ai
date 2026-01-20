import React from 'react';
import Dashboard from './components/Dashboard';

import { useSidebar } from "@/context/sidebar/SidebarContext";
import SideBar from "@/components/Sidebar/SideBar";

function App() {
  const { isSidebarOpen } = useSidebar();
  return (
    <div className="flex">
      <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} fixed z-50`}>
        <SideBar />
      </div>
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} w-full`}>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;