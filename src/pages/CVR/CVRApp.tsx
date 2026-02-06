import React, { useState } from 'react';
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
import { ChevronDown, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SalesFilters from "@/components/common/SalesFilters";




function App() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ state: '', area: '', product: '', customer: '', time: '' });

  const filterConfig = [
    { key: 'state', label: 'State', options: ['California', 'Texas', 'New York', 'Florida'] },
    { key: 'area', label: 'Area', options: ['North', 'South', 'East', 'West'] },
    { key: 'product', label: 'Product', options: ['Electronics', 'Home', 'Apparel'] },
    { key: 'customer', label: 'Customer', options: ['Walmart', 'Target', 'Best Buy'] },
    { key: 'time', label: 'Time Period', options: ['Last 30 Days', 'Last Quarter', 'YTD'] }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };




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
      color: 'cyan' as const
    }
  ];

  return (
    <div className="bg-slate-50 relative min-h-screen p-8 font-sans overflow-x-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-100/40 to-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-rose-100/30 to-amber-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-teal-100/30 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-[1600px] mx-auto space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        {/* Metrics Grid */}
        {/* Header Section */}
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Salesman Rating</h1>
              <p className="text-slate-500 font-medium text-lg">Performance metrics and leaderboard analysis.</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 px-4 text-sm rounded-full border border-slate-200 font-medium shadow-sm transition-all duration-300 ${showFilters
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-white text-slate-900 hover:bg-slate-50'
                  }`}
              >
                <Filter className={`w-3.5 h-3.5 mr-2 ${showFilters ? 'text-indigo-700' : 'text-slate-500'}`} />
                Filters
                <ChevronDown className={`w-3.5 h-3.5 ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180 text-indigo-700' : 'text-slate-500'
                  }`} />
              </Button>
            </div>
          </div>

          <SalesFilters
            showFilters={showFilters}
            config={filterConfig}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={() => setFilters({ state: '', area: '', product: '', customer: '', time: '' })}
          />
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
  );
}

export default App;