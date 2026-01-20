import React from 'react';
// NowCast AI CVR Application
// import DynamicNavbar from '../../components/DynamicNavbar';
import { MetricCard } from './components/MetricCard';
import { LeaderBoard } from './components/LeaderBoard';
import { ReportsAccordion } from './components/ReportsAccordion';
import {
  Users,
  Shield,
  BarChart3,
  CheckCircle,
} from 'lucide-react';
import FilterHeader from './components/FilterHeader';

import { useSidebar } from "../../context/sidebar/SidebarContext";
import SideBar from "../../components/Sidebar/SideBar";

function App() {
  const { isSidebarOpen } = useSidebar();

  const metrics = [
    {
      title: 'Total Sales Visits',
      value: '2,847',
      change: '+12.3% from last month',
      trend: 'up' as const,
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Sell in %',
      value: '95%',
      change: '+0.2 from last quarter',
      trend: 'up' as const,
      icon: Shield,
      color: 'green' as const
    },
    {
      title: 'Cross-sell Quantile',
      value: '94.2%',
      change: '+2.1% this quarter',
      trend: 'up' as const,
      icon: BarChart3,
      color: 'purple' as const
    },
    {
      title: 'Attendance %',
      value: '98.1%',
      change: '+1.5% improvement',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'orange' as const
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} fixed z-[100] h-full`}>
        <SideBar />
      </div>

      <div className={`transition-all duration-300 ${isSidebarOpen ? "pl-64" : "pl-16"} flex-1 w-full relative min-h-screen`}>
        {/* <DynamicNavbar /> */}

        <main className="max-w-[1600px] mx-auto p-8">
          {/* Metrics Grid */}
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FilterHeader />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                trend={metric.trend}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <LeaderBoard />
          </div>

          {/* Secondary Content */}
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <ReportsAccordion />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;