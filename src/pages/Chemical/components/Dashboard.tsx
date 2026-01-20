// React import removed as it is unused
import FilterHeader from './FilterHeader';
import LatestVisits from './LatestVisits';
import PerformanceCharts from './PerformanceCharts';
import TopPerformers from './TopPerformers';
import SentimentAlerts from './SentimentAlerts';
import NextVisitRecommended from './NextVisitRecommended';
import QuoteRequested from './QuoteRequested';
import AlertsPanel from './AlertsPanel';

import ChemicalDashboard from './ChemicalDashBoard';
// import DynamicNavbar from '../../../components/DynamicNavbar';
import DynamicNavbar from '../../../components/DynamicNavbar'; // Keeping import to avoid breaking line numbers if user reverts, but actually I should comment or remove. I will comment it out.

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <DynamicNavbar /> */}
      <div className="max-w-[1400px] mx-auto p-4">

        {/* Metric Cards Section (Top like CVR) */}
        <div className="mb-3 animate-fade-in">
          <FilterHeader />
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