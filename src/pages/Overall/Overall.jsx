import React from "react";
import {
    ArrowRight,
    ArrowDownRight,
    ArrowUpRight,
    CheckCircle,
    Clock,
    Info,
    List,
    Shield,
    BarChart3,
    Package,
    FileText,
    LineChart,
    Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const KpiCard = ({ title, value, change, target, direction, positive = false }) => (
    <Card>
        <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{title}</p>
                <Info className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold mb-2">{value}</div>
            <div className="flex items-center">
                {direction === "up" ? (
                    <ArrowUpRight className={`h-4 w-4 mr-1 ${positive ? "text-green-600" : "text-red-600"}`} />
                ) : (
                    <ArrowDownRight className={`h-4 w-4 mr-1 ${positive ? "text-red-600" : "text-green-600"}`} />
                )}
                <span className={`text-sm ${positive ? "text-green-600" : "text-red-600"}`}>
                    {change} (Target: {target})
                </span>
            </div>
        </CardContent>
    </Card>
);

const ModuleCard = ({ icon, title, value, valueColor, lines, linkText }) => (
    <Card>
        <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
                {icon}
                <p className="font-medium">{title}</p>
            </div>
            <div className={`text-3xl font-bold mb-4 ${valueColor}`}>{value}</div>
            <div className="space-y-1 mb-4">
                {lines.map((line, index) => (
                    <p key={index} className="text-sm">{line}</p>
                ))}
            </div>
            <div className="flex items-center text-blue-600 text-sm">
                <ArrowRight className="h-4 w-4 mr-1" />
                <span>{linkText}</span>
            </div>
        </CardContent>
    </Card>
);

const AlertItem = ({ type, message }) => {
    const getAlertStyle = () => {
        switch (type) {
            case "warning":
                return {
                    borderColor: "border-l-yellow-500",
                    icon: <div className="bg-yellow-500 rounded-full p-1"><Info className="h-4 w-4 text-white" /></div>,
                };
            case "action":
                return {
                    borderColor: "border-l-purple-500",
                    icon: <div className="bg-purple-500 rounded-full p-1"><List className="h-4 w-4 text-white" /></div>,
                };
            case "info":
                return {
                    borderColor: "border-l-cyan-500",
                    icon: <div className="bg-cyan-500 rounded-full p-1"><Info className="h-4 w-4 text-white" /></div>,
                };
            default:
                return {
                    borderColor: "border-l-gray-500",
                    icon: <Info className="h-4 w-4" />,
                };
        }
    };

    const style = getAlertStyle();

    return (
        <div className={`flex items-center gap-3 border-l-4 pl-3 py-2 ${style.borderColor}`}>
            {style.icon}
            <div>
                <span className="font-medium capitalize">{type === "action" ? "Action" : type === "warning" ? "Warning" : "Info"}: </span>
                <span>{message}</span>
            </div>
        </div>
    );
};

const StatusItem = ({ label, value, icon, spacing = "" }) => (
    <div className={`flex items-center justify-between ${spacing}`}>
        <div className="flex items-center gap-2">
            {icon && <span>{icon}</span>}
            <span className="text-sm">{label}</span>
        </div>
        {value && <span className="font-medium">{value}</span>}
    </div>
);

const Overall = () => {
    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-black rounded-full p-2">
                    <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Overall Dashboard</h1>
            </div>
            <p className="text-sm text-muted-foreground mb-8">Status as of: 2025-05-05 15:25:23</p>

            <hr />
            <Separator className="my-2 " />

            {/* KPIs */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                    <LineChart className="h-5 w-5" />
                    <h2 className="text-xl font-bold">Key Performance Indicators</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCard title="Forecast Accuracy" value="83.7%" change="-1.3%" target="85%" direction="down" />
                    <KpiCard title="Days on Hand (DOH)" value="43.5 Days" change="+13.5 Days" target="30.0 Days" direction="up" />
                    <KpiCard title="Service Level" value="91.2%" change="+1.2%" target="90%" direction="up" positive={true} />
                </div>
            </div>

            {/* Modules */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                    <Package className="h-5 w-5" />
                    <h2 className="text-xl font-bold">Module Quick View</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ModuleCard
                        icon={<Package className="h-5 w-5" />}
                        title="Supply Chain"
                        value="7"
                        valueColor="text-blue-600"
                        lines={["High Priority Stock Alerts", "Inv. Value: ₹3.1M"]}
                        linkText="Go to Supply Chain Module..."
                    />
                    <ModuleCard
                        icon={<FileText className="h-5 w-5" />}
                        title="Norms & Inventory"
                        value="4"
                        valueColor="text-blue-600"
                        lines={["Norms Pending Review", "Avg DOH: 28.2 Days"]}
                        linkText="Go to Norms Module..."
                    />
                    <ModuleCard
                        icon={<LineChart className="h-5 w-5" />}
                        title="Planning"
                        value="9"
                        valueColor="text-blue-600"
                        lines={["Forecasts with Comments", "3 High Deviations"]}
                        linkText="Go to Planning Module..."
                    />
                    <ModuleCard
                        icon={<Database className="h-5 w-5" />}
                        title="Data Health"
                        value="2"
                        valueColor="text-blue-600"
                        lines={["Quality Issues Found", "Last Run: Success"]}
                        linkText="View Ingestion Details..."
                    />
                </div>
            </div>

            {/* Alerts and Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <div className="bg-black rounded-full p-1.5">
                                    <Info className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle>Critical Alerts & Actions</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <AlertItem type="warning" message="Source 'Partner FTP Files' delayed by 2 hours." />
                                <AlertItem type="action" message="Review 3 suggested stock transfer orders." />
                                <AlertItem type="action" message="Approve 12 low-risk PO recommendations." />
                                <AlertItem type="info" message="New forecast cycle generated successfully." />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                <CardTitle>System Status</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <StatusItem label="Data Ingestion:" value="Success" icon={<CheckCircle className="h-5 w-5 text-green-600" />} />
                                <Separator />
                                <StatusItem label="Data Freshness" icon={<Clock className="h-5 w-5" />} />
                                <StatusItem label="Last Update:" value="Apr 28, 15:10:23" spacing="mb-2" />
                                <StatusItem label="Age:" value="168.3h ago" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Overall;
