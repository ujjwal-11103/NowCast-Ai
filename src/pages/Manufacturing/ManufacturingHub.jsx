import React from 'react';
import { Card } from "@/components/ui/card";
import { Hammer, Users, FileText, Settings, BarChart3, AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ManufacturingHub = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Production",
            items: [
                { label: "Work Order", link: "/manufacturing/work-order" },
                { label: "Production Plan", link: "/manufacturing/production-plan" },
                { label: "Timesheet", link: "#" },
            ]
        },
        {
            title: "Bill of Materials",
            items: [
                { label: "Bill of Materials", link: "/manufacturing/bom" },
                { label: "BOM Browser", link: "#" },
                { label: "Item Group", link: "#" },
            ]
        },
        {
            title: "Reports",
            items: [
                { label: "Production Analytics", link: "#" },
                { label: "BOM Search", link: "#" },
                { label: "Work Order Summary", link: "#" },
            ]
        }
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Manufacturing Hub</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <Card key={idx} className="p-4 border-slate-200 bg-white">
                        <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">{section.title}</h3>
                        <div className="space-y-2">
                            {section.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer text-slate-600 hover:text-blue-600 transition-colors"
                                    onClick={() => item.link !== '#' && navigate(item.link)}
                                >
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                    <span className={item.link === '#' ? 'opacity-50' : ''}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-6 bg-blue-50 border-blue-100 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-blue-900">Manufacturing Settings</h3>
                    <p className="text-sm text-blue-700">Configure default workstations, hourly rates, and operation defaults.</p>
                </div>
            </Card>
        </div>
    );
};

export default ManufacturingHub;
