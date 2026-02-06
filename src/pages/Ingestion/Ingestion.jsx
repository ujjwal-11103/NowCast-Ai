import React from "react";
import {
  Clock,
  CheckCircle,
  Database,
  Cloud,
  FileText,
  Activity,
  ArrowUpRight,
  TrendingDown,
  Layers,
  Server,
  Shield,
  FileDigit,
  Globe,
  Box,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Utility for Safe Tailwind Classes ---
const colorVariants = {
  indigo: {
    bgLight: "bg-indigo-50",
    bgSoft: "bg-indigo-500/5",
    bgHover: "group-hover:bg-indigo-500/10",
    text: "text-indigo-600",
    border: "border-indigo-100",
    bar: "bg-indigo-500"
  },
  blue: {
    bgLight: "bg-blue-50",
    bgSoft: "bg-blue-500/5",
    bgHover: "group-hover:bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-100",
    bar: "bg-blue-500"
  },
  amber: {
    bgLight: "bg-amber-50",
    bgSoft: "bg-amber-500/5",
    bgHover: "group-hover:bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-100",
    bar: "bg-amber-500"
  },
  violet: {
    bgLight: "bg-violet-50",
    bgSoft: "bg-violet-500/5",
    bgHover: "group-hover:bg-violet-500/10",
    text: "text-violet-600",
    border: "border-violet-100",
    bar: "bg-violet-500"
  },
  emerald: {
    bgLight: "bg-emerald-50",
    bgSoft: "bg-emerald-500/5",
    bgHover: "group-hover:bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-100",
    bar: "bg-emerald-500"
  },
  rose: {
    bgLight: "bg-rose-50",
    bgSoft: "bg-rose-500/5",
    bgHover: "group-hover:bg-rose-500/10",
    text: "text-rose-600",
    border: "border-rose-100",
    bar: "bg-rose-500"
  }
};

// --- Components ---

const MetricCard = ({ title, value, subtext, icon: Icon, color, trend }) => {
  const theme = colorVariants[color] || colorVariants.indigo;

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100/60 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 transition-all ${theme.bgSoft} ${theme.bgHover}`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl ${theme.bgLight} ${theme.text}`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
            5.2%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{title}</h3>
        <div className="text-3xl font-extrabold text-slate-800 font-heading tracking-tight mb-1">{value}</div>
        <p className="text-xs font-bold text-slate-400">{subtext}</p>
      </div>
    </div>
  );
};

const DataSourceCard = ({ title, status, records, icon: Icon, color }) => {
  const theme = colorVariants[color] || colorVariants.indigo;
  const statusColor = status === 'Connected'
    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
    : 'bg-amber-50 text-amber-600 border-amber-100';

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100/60 hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full relative overflow-hidden cursor-default">
      <div className={`absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity ${theme.bar}`}></div>

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 ${theme.bgLight} ${theme.text}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
            {status}
          </div>
        </div>

        <h4 className="font-bold text-slate-800 text-base font-heading mb-1">{title}</h4>
        <p className="text-xs text-slate-400 font-medium">Auto-sync enabled</p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
        <span className="text-2xl font-extrabold text-slate-700 tracking-tight">{records}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase">Records</span>
      </div>
    </div>
  );
};

const QualityMetricRow = ({ label, value, target, status, icon: Icon }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-shadow">
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl ${status === 'good' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
        <Icon size={18} />
      </div>
      <div>
        <h4 className="font-bold text-slate-700 text-sm">{label}</h4>
        <p className="text-xs text-slate-400 font-medium">Target: {target}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-lg font-extrabold text-slate-800">{value}</div>
      {status === 'good' && <div className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1"><CheckCircle size={10} /> Passing</div>}
    </div>
  </div>
)

const IngestionChart = () => (
  <div className="relative h-48 w-full mt-4">
    <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
      {[35, 55, 45, 70, 60, 85, 95, 75, 65].map((h, i) => (
        <div key={i} className="w-full bg-indigo-50 rounded-t-lg relative group overflow-hidden" style={{ height: `${h}%` }}>
          <div className="absolute bottom-0 left-0 w-full bg-indigo-500/20 h-0 group-hover:h-full transition-all duration-500 ease-out"></div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity">
            {h}k
          </div>
        </div>
      ))}
    </div>
    {/* Line overlay mock */}
    <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" preserveAspectRatio="none">
      <path d="M0 120 C 50 100, 100 130, 200 80 S 300 100, 400 40 L 500 20" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" className="drop-shadow-md" />
    </svg>
  </div>
);

const Ingestion = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] p-6 pb-20 font-sans text-slate-900 overflow-x-hidden">
      {/* Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[45rem] h-[45rem] bg-indigo-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-60 animate-blob"></div>
        <div className="absolute bottom-[0%] left-[0%] w-[40rem] h-[40rem] bg-emerald-100/40 rounded-full blur-[100px] mix-blend-multiply opacity-60 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight mb-2 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                <Database size={28} />
              </div>
              Data Ingestion
            </h1>
            <p className="text-slate-500 font-medium text-lg">Centralized pipeline monitoring & quality assurance.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100">
              <Clock className="text-indigo-500" size={16} />
              <span className="text-sm font-bold text-slate-600 mb-0">Updated: 16:33:18</span>
            </div>
            <Button className="rounded-full bg-slate-900 px-6 font-bold shadow-lg shadow-slate-300">
              View Logs
            </Button>
          </div>
        </header>

        {/* 3-Column Split Layout System Status */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden relative group hover:shadow-lg transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">

            {/* 1. Overall Status Column */}
            <div className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                    <Activity size={20} />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Active</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight font-heading mb-2">System Healthy</h2>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  <CheckCircle size={14} className="inline text-emerald-500 mr-1" />
                  All 4 pipelines operational.
                </p>
              </div>
            </div>

            {/* 2. Data Freshness Column */}
            <div className="p-8 relative hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                      <Clock size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Freshness</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">2m ago</span>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">Up to Date</div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[98%] rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Schema Status Column */}
            <div className="p-8 relative hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <Layers size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Schema</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">v2.4.0</span>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">Passed</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <Check size={12} className="text-emerald-500" /> Integrity
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <Check size={12} className="text-emerald-500" /> Types
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Data Sources Grid */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-indigo-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-800 font-heading">Connected Data Sources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DataSourceCard
              title="ERP Database"
              status="Connected"
              records="9,020"
              icon={Server}
              color="indigo"
            />
            <DataSourceCard
              title="Salesforce API"
              status="Connected"
              records="1,367"
              icon={Cloud}
              color="blue"
            />
            <DataSourceCard
              title="Partner FTP Files"
              status="Delayed"
              records="968"
              icon={FileText}
              color="amber"
            />
            <DataSourceCard
              title="Web Analytics Feed"
              status="Connected"
              records="32,604"
              icon={Globe}
              color="violet"
            />
          </div>
        </section>

        {/* Split Section: Volume & Quality */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Custom Data Volume Section (Restored Trend Logic) */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1.5 bg-indigo-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800 font-heading">Volume Analysis</h2>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex-1 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Box size={16} /> Total Records Ingested
                  </p>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-5xl font-extrabold text-slate-900 tracking-tighter">74,505</h3>
                    <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 flex items-center gap-1">
                      <TrendingDown size={12} /> 3.4%
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Peak Volume</div>
                  <div className="text-xl font-bold text-slate-800 flex items-center gap-2 justify-end">
                    <Activity size={18} className="text-indigo-500" /> 12k / hr
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-700">Ingestion Trend (7 Days)</h4>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
                <IngestionChart />
              </div>
            </div>
          </div>

          {/* Data Quality Section (Restored Individual Cards Style) */}
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1.5 bg-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800 font-heading">Data Quality</h2>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex-1 flex flex-col gap-4">
              {/* Quality Score Card */}
              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 relative z-10">Overall Quality Score</div>
                <div className="text-5xl font-extrabold text-slate-900 tracking-tight relative z-10">98.5%</div>
                <div className="text-[10px] font-bold text-slate-500 mt-2 bg-white/60 px-2 py-1 rounded-full relative z-10">High Fidelity</div>
              </div>

              <div className="flex-1 space-y-3 mt-2">
                <QualityMetricRow
                  label="Data Completeness"
                  value="97.8%"
                  target=">95%"
                  status="good"
                  icon={CheckCircle}
                />
                <QualityMetricRow
                  label="Unique IDs Found"
                  value="561"
                  target="Unique"
                  status="good"
                  icon={FileDigit}
                />
                <QualityMetricRow
                  label="Update Timeliness"
                  value="93.9%"
                  target=">90%"
                  status="good"
                  icon={Clock}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Ingestion;
