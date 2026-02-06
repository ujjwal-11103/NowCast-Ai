import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { ArrowRight, Hammer, Package, ClipboardList, FileText, CheckCircle } from "lucide-react";

const ManufacturingDemoPage = () => {
    const location = useLocation();

    // optimize title generation based on path
    const getPageDetails = () => {
        const path = location.pathname;
        switch (path) {
            case '/dashboard': return { title: "Landing / Dashboard", icon: FileText, step: 1 };
            case '/stock': return { title: "Stock Overview", icon: Package, step: 2 };
            case '/stock/item-view': return { title: "View Item Stock", icon: Package, step: 3 };
            case '/manufacturing': return { title: "Manufacturing Hub", icon: Hammer, step: 4 };
            case '/manufacturing/bom': return { title: "Create Bill of Materials (BOM)", icon: ClipboardList, step: 5 };
            case '/manufacturing/work-order': return { title: "Create Work Order", icon: FileText, step: 6 };
            case '/manufacturing/issue-materials': return { title: "Issue Materials", icon: ArrowRight, step: 7 };
            case '/manufacturing/complete-production': return { title: "Complete Production", icon: CheckCircle, step: 8 };
            case '/stock/finished-goods': return { title: "View Finished Goods", icon: Package, step: 9 };
            case '/stock/ledger': return { title: "Stock Ledger", icon: FileText, step: 10 };
            default: return { title: "Manufacturing Demo", icon: Hammer, step: 0 };
        }
    };

    const { title, icon: Icon, step } = getPageDetails();

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                    <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
                    <p className="text-slate-500 font-medium">Step {step} of 10 in Manufacturing Workflow</p>
                </div>
            </div>

            <Card className="p-12 border-slate-200 shadow-sm bg-white min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Demo Content Placeholder</h2>
                <p className="text-slate-500 max-w-md">
                    This page represents <b>{title}</b>. The actual functionality and data visualization for this step will be integrated here from the 'midocean' demo system.
                </p>
            </Card>
        </div>
    );
};

export default ManufacturingDemoPage;
