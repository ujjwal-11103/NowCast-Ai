// React import removed as it is unused
import { TrendingUp, BarChart3 } from 'lucide-react';

const PerformanceCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* Trend Line Chart */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 h-full min-h-[400px]">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <TrendingUp className="text-blue-600" size={22} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Visit Analytics</h3>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Visits Trend</h4>
          <div className="h-56 flex items-end justify-center space-x-8">
            {/* Simulated line chart with bars */}
            {[
              { month: 'JC1', value: 65 },
              { month: 'JC2', value: 78 },
              { month: 'JC3', value: 82 },
              { month: 'JC4', value: 74 },
              { month: 'JC5', value: 88 },
            ].map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-10 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg mb-2 transition-all duration-300 hover:from-blue-600 hover:to-blue-500 shadow-sm"
                  style={{ height: `${data.value * 2}px` }}
                ></div>
                <span className="text-xs font-medium text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Chemicals Bar Chart */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 h-full min-h-[400px]">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-teal-50 rounded-xl">
            <BarChart3 className="text-teal-600" size={22} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Top Products</h3>
        </div>
        <div>
          <div className="space-y-4">
            {[
              { name: 'Toluene', percentage: 85, color: 'bg-teal-500' },
              { name: 'Tergada', percentage: 72, color: 'bg-teal-500' },
              { name: 'XYZ Compound', percentage: 58, color: 'bg-teal-500' },
              { name: 'Benzene', percentage: 45, color: 'bg-teal-500' },
              { name: 'Hydrochloric Acid', percentage: 40, color: 'bg-teal-500' },
              { name: 'Sulfuric Acid', percentage: 30, color: 'bg-teal-500' },
            ].map((chemical, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                  <span>{chemical.name}</span>
                  <span>{chemical.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${chemical.color} h-2.5 rounded-full transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: `${chemical.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;