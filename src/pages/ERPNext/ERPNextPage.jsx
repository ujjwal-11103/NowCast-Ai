import React from 'react';
import { Card } from "@/components/ui/card";
import { Hammer, Package, LayoutDashboard, Settings, Users, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ERPNextPage = () => {
    const navigate = useNavigate();

    const modules = [
        { title: "Dashboard", icon: LayoutDashboard, link: "/dashboard", color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Manufacturing", icon: Hammer, link: "/manufacturing", color: "text-orange-600", bg: "bg-orange-50" },
        { title: "Stock", icon: Package, link: "/stock", color: "text-green-600", bg: "bg-green-50" },
        // Placeholders for future expansion
        { title: "HR", icon: Users, link: "#", color: "text-purple-600", bg: "bg-purple-50", disabled: true },
        { title: "Accounting", icon: FileText, link: "#", color: "text-teal-600", bg: "bg-teal-50", disabled: true },
        { title: "Settings", icon: Settings, link: "#", color: "text-slate-600", bg: "bg-slate-50", disabled: true },
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900">ERPNext Modules</h1>
                <p className="text-slate-500">Select a module to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, idx) => (
                    <Card
                        key={idx}
                        className={`p-6 flex items-center gap-4 transition-all border-slate-200 ${module.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md hover:-translate-y-1'}`}
                        onClick={() => !module.disabled && navigate(module.link)}
                    >
                        <div className={`p-4 rounded-xl ${module.bg}`}>
                            <module.icon className={`w-8 h-8 ${module.color}`} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-slate-800">{module.title}</h3>
                            <p className="text-sm text-slate-500">{module.disabled ? 'Coming Soon' : 'View Module'}</p>
                        </div>
                        {!module.disabled && <ArrowRight className="w-5 h-5 text-slate-300" />}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ERPNextPage;
