import React from "react";
import {
    TrendingUp,
    Users,
    Package,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Zap,
    Calendar,
    Layers,
    BarChart2,
    PieChart,
    BrainCircuit,
    Sparkles,
    AlertTriangle,
    CheckCircle,
    Clock,
    Shield,
    Info,
    Server,
    Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Utility for Dynamic Tailwind Classes ---
const colorVariants = {
    indigo: {
        bgLight: "bg-indigo-50",
        bgSoft: "bg-indigo-500/5",
        bgHover: "hover:bg-indigo-500/10",
        text: "text-indigo-600",
        border: "border-indigo-100",
        iconUser: Users
    },
    violet: {
        bgLight: "bg-violet-50",
        bgSoft: "bg-violet-500/5",
        bgHover: "hover:bg-violet-500/10",
        text: "text-violet-600",
        border: "border-violet-100",
        iconUser: BarChart2
    },
    pink: {
        bgLight: "bg-pink-50",
        bgSoft: "bg-pink-500/5",
        bgHover: "hover:bg-pink-500/10",
        text: "text-pink-600",
        border: "border-pink-100",
        iconUser: Package
    },
    teal: {
        bgLight: "bg-teal-50",
        bgSoft: "bg-teal-500/5",
        bgHover: "hover:bg-teal-500/10",
        text: "text-teal-600",
        border: "border-teal-100",
        iconUser: Users
    },
    emerald: {
        bgLight: "bg-emerald-50",
        bgSoft: "bg-emerald-500/5",
        bgHover: "hover:bg-emerald-500/10",
        text: "text-emerald-600",
        border: "border-emerald-100",
        iconUser: Users
    },
    amber: {
        bgLight: "bg-amber-50",
        bgSoft: "bg-amber-500/5",
        bgHover: "hover:bg-amber-500/10",
        text: "text-amber-600",
        border: "border-amber-100",
        iconUser: Package
    },
    rose: {
        bgLight: "bg-rose-50",
        bgSoft: "bg-rose-500/5",
        bgHover: "hover:bg-rose-500/10",
        text: "text-rose-600",
        border: "border-rose-100",
        iconUser: AlertTriangle
    }
};


// --- Components ---

const StatCard = ({ title, value, subtext, trend, trendValue, icon: Icon, color, target }) => {
    const theme = colorVariants[color] || colorVariants.indigo;

    return (
        <div className={`bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100/60 relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
            {/* Background Blob */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 transition-all ${theme.bgSoft} group-${theme.bgHover}`}></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${theme.bgLight} ${theme.text}`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trendValue}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-slate-500 font-medium text-sm mb-1 uppercase tracking-wider">{title}</h3>
                <div className="text-3xl font-extrabold text-slate-800 tracking-tight font-heading mb-1">{value}</div>
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-slate-400 font-medium">{subtext}</p>
                    {target && <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">Target: {target}</span>}
                </div>
            </div>
        </div>
    );
};

const AlertItem = ({ type, message }) => {
    let icon, bgClass, textClass, borderClass;

    switch (type) {
        case 'warning':
            icon = AlertTriangle;
            bgClass = 'bg-amber-50';
            textClass = 'text-amber-700';
            borderClass = 'border-amber-100';
            break;
        case 'action':
            icon = Zap;
            bgClass = 'bg-violet-50';
            textClass = 'text-violet-700';
            borderClass = 'border-violet-100';
            break;
        case 'info':
        default:
            icon = Info;
            bgClass = 'bg-blue-50';
            textClass = 'text-blue-700';
            borderClass = 'border-blue-100';
            break;
    }

    const IconComp = icon;

    return (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${borderClass} ${bgClass} mb-3 last:mb-0 hover:scale-[1.01] transition-transform cursor-pointer`}>
            <div className={`p-1.5 rounded-full bg-white/60 ${textClass} mt-0.5 shadow-sm`}>
                <IconComp size={16} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className={`text-[10px] font-bold uppercase tracking-wider ${textClass} mb-0.5`}>
                        {type === 'action' ? 'Requires Action' : type}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">2m ago</span>
                </div>
                <p className="text-xs font-bold text-slate-700 leading-snug">{message}</p>
            </div>
        </div>
    );
}

const SystemStatusRow = ({ label, value, status, icon: Icon }) => (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-slate-50 rounded-xl transition-colors group cursor-default">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all duration-300`}>
                <Icon size={18} />
            </div>
            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{label}</span>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 font-medium font-mono group-hover:text-slate-700">{value}</span>
            {status && (
                <div className={`relative flex h-2.5 w-2.5`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'good' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </div>
            )}
        </div>
    </div>
);


const Overall = () => {
    return (
        <div className="min-h-screen bg-[#F8F9FC] p-6 pb-20 font-sans text-slate-900 overflow-x-hidden">
            {/* Decorative Background Blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob"></div>
                <div className="absolute top-[10%] right-[-10%] w-[35rem] h-[35rem] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-pink-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-[1600px] mx-auto relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight mb-2">
                            Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Admin</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">Here's your executive summary & daily forecast digest.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <Calendar className="text-indigo-500" size={18} />
                            <span className="text-sm font-bold text-slate-600 font-mono">Oct 26, 2025</span>
                        </div>
                        <Button className="rounded-full bg-slate-900 hover:bg-slate-800 px-6 py-6 text-base font-bold shadow-lg shadow-slate-300 transition-all hover:scale-105 active:scale-95 group">
                            <Zap size={18} className="mr-2 fill-yellow-400 text-yellow-400 group-hover:animate-pulse" />
                            Run Forecast
                        </Button>
                    </div>
                </header>

                {/* Stats Grid - Re-added DOH and Service Level */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-800 font-heading flex items-center gap-2">
                            <div className="h-6 w-1 rounded-full bg-indigo-500"></div>
                            Key Performance Indicators
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Forecast Accuracy"
                            value="83.7%"
                            subtext="Last Cycle"
                            trend="down"
                            trendValue="1.3%"
                            target="85%"
                            icon={TrendingUp}
                            color="indigo"
                        />
                        <StatCard
                            title="Days on Hand (DOH)"
                            value="43.5 Days"
                            subtext="Inventory Health"
                            trend="up"
                            trendValue="+13.5"
                            target="30.0 Days"
                            icon={Package}
                            color="amber"
                        />
                        <StatCard
                            title="Service Level"
                            value="91.2%"
                            subtext="Fulfillment Rate"
                            trend="up"
                            trendValue="1.2%"
                            target="90%"
                            icon={Users}
                            color="emerald"
                        />
                        <StatCard
                            title="Accuracy (Lag 3)"
                            value="78.4%"
                            subtext="Long Term View"
                            trend="up"
                            trendValue="0.5%"
                            icon={Activity}
                            color="pink"
                        />
                    </div>
                </section>

                {/* Main Content Area: Alerts & System Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">

                    {/* Critical Alerts Column */}
                    <div className="lg:col-span-2 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-800 font-heading flex items-center gap-2">
                                <div className="h-6 w-1 rounded-full bg-rose-500"></div>
                                Critical Alerts & Actions
                            </h2>
                            <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 shadow-sm animate-pulse">3 Pending Actions</span>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex-1 relative overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>

                            <div className="relative z-10 grid grid-cols-1 gap-4">
                                <AlertItem
                                    type="warning"
                                    message="Source 'Partner FTP Files' delayed by 2 hours. Forecast run might be impacted."
                                />
                                <AlertItem
                                    type="action"
                                    message="Review 3 suggested stock transfer orders for North Region to prevent stockout."
                                />
                                <AlertItem
                                    type="action"
                                    message="Approve 12 low-risk PO recommendations before EOD."
                                />
                                <AlertItem
                                    type="info"
                                    message="New forecast cycle generated successfully for Q4 categories."
                                />
                            </div>
                        </div>
                    </div>

                    {/* System Status Column */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-800 font-heading flex items-center gap-2">
                                <div className="h-6 w-1 rounded-full bg-emerald-500"></div>
                                System Status
                            </h2>
                            <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 shadow-sm">
                                <Shield size={12} /> Protected
                            </span>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex-1 flex flex-col justify-center gap-2 relative overflow-hidden group hover:shadow-lg transition-shadow duration-500">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="text-center mb-6 relative z-10">
                                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)] ring-8 ring-emerald-50/50 group-hover:scale-110 transition-transform duration-500">
                                    <CheckCircle size={40} className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-800 font-heading tracking-tight">Fully Operational</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">All systems normal</p>
                            </div>

                            <div className="relative z-10 space-y-1">
                                <SystemStatusRow
                                    label="Data Ingestion"
                                    value="Success"
                                    status="good"
                                    icon={Database}
                                />
                                <SystemStatusRow
                                    label="Data Freshness"
                                    value="< 15m ago"
                                    status="good"
                                    icon={Clock}
                                />
                                <SystemStatusRow
                                    label="Last Update"
                                    value="15:10:23"
                                    icon={Activity}
                                />
                                <SystemStatusRow
                                    label="Server Uptime"
                                    value="99.99%"
                                    status="good"
                                    icon={Server}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Access Modules Navigation */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800 font-heading flex items-center gap-2">
                            <div className="h-6 w-1 rounded-full bg-indigo-500"></div>
                            Module Quick Access
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Supply Chain', 'Norms & Inventory', 'Planning', 'Data Health'].map((item, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-between group h-20">
                                <span className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{item}</span>
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300 shadow-sm group-hover:shadow-indigo-100">
                                    <ArrowUpRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Overall;
