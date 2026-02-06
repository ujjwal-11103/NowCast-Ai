import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SalesFilters from "@/components/common/SalesFilters";

import LatestVisits from './LatestVisits';
import PerformanceCharts from './PerformanceCharts';
import TopPerformers from './TopPerformers';
import SentimentAlerts from './SentimentAlerts';
import NextVisitRecommended from './NextVisitRecommended';
import QuoteRequested from './QuoteRequested';
import AlertsPanel from './AlertsPanel';

import ChemicalDashboard from './ChemicalDashBoard';
// import DynamicNavbar from '../../../components/DynamicNavbar';
// import DynamicNavbar from '../../../components/DynamicNavbar';

const Dashboard = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ state: '', area: '', product: '', customer: '', time: '' });

  const filterConfig = [
    { key: 'state', label: 'State', options: ['California', 'Texas', 'New York', 'Florida'] },
    { key: 'area', label: 'Area', options: ['North', 'South', 'East', 'West'] },
    { key: 'product', label: 'Product', options: ['Chemicals A', 'Solvents B', 'Polymers C'] },
    { key: 'customer', label: 'Customer', options: ['TechChem', 'Global Industries', 'Acme Corp'] },
    { key: 'time', label: 'Time Period', options: ['Last 30 Days', 'Last Quarter', 'YTD'] }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-50 relative min-h-screen p-8 font-sans overflow-x-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-100/40 to-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-rose-100/30 to-amber-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-teal-100/30 rounded-full blur-[100px]" />
      </div>

      {/* <DynamicNavbar /> */}
      <div className="max-w-[1600px] mx-auto space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">

        {/* Metric Cards Section (Top like CVR) */}
        {/* Header + Filters */}
        <div className="mb-6 animate-fade-in">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Sales Visit Dashboard</h1>
              <p className="text-slate-500 font-medium text-lg">Monitor sales visits and key account performance.</p>
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

        <div className="mb-4 animate-slide-up stagger-1">
          <ChemicalDashboard />
        </div>

        {/* Main Content Grid */}

        {/* Top Section: Charts & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 animate-slide-up stagger-2 items-stretch">
          <div className="lg:col-span-2 h-full">
            <PerformanceCharts />
          </div>
          <div className="lg:col-span-1 h-full">
            <AlertsPanel />
          </div>
        </div>

        {/* Latest Visits Section */}
        <div className="mb-4 animate-slide-up stagger-3">
          <LatestVisits />
        </div>

        {/* Bottom Section: 4 Equal Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 animate-slide-up stagger-4 items-stretch">
          <div className="h-full"><TopPerformers /></div>
          <div className="h-full"><SentimentAlerts /></div>
          <div className="h-full"><NextVisitRecommended /></div>
          <div className="h-full"><QuoteRequested /></div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;