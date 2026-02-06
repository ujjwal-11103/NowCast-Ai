import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, CheckCircle, AlertCircle, ArrowRight, Download } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";

const StockEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine Type based on URL to simulate different pages
    const isMaterialIssue = location.pathname.includes('issue-materials');
    const entryType = isMaterialIssue ? "Material Transfer for Manufacture" : "Manufacture";
    const defaultSource = isMaterialIssue ? "Stores - M" : "Work In Progress - M";
    const defaultTarget = isMaterialIssue ? "Work In Progress - M" : "Finished Goods - M";

    const [status, setStatus] = useState("Draft");
    const [items, setItems] = useState([]);
    const [workOrder, setWorkOrder] = useState("");

    // Mock "Get Items" functionality
    const handleGetItems = () => {
        if (!workOrder) {
            toast.error("Please select a Work Order first");
            return;
        }

        toast.info("Fetching items from BOM...");

        // Simulating API delay
        setTimeout(() => {
            if (isMaterialIssue) {
                setItems([
                    { code: "RM-001", name: "Steel Sheet 2mm", qty: 25, uom: "Sheet", rate: 50, amount: 1250 },
                    { code: "RM-002", name: "Plastic Granules", qty: 5, uom: "Kg", rate: 200, amount: 1000 },
                    { code: "CNS-01", name: "Lubricant Oil", qty: 1, uom: "Litre", rate: 50, amount: 50 },
                ]);
            } else {
                // Manufacture Entry
                setItems([
                    { code: "FG-100", name: "Finished Widget X", qty: 10, uom: "Nos", rate: 230, amount: 2300, isFinishedItem: true },
                    { code: "RM-001", name: "Steel Sheet 2mm", qty: 25, uom: "Sheet", rate: 50, amount: 1250, isFinishedItem: false }, // Consumed
                    { code: "RM-002", name: "Plastic Granules", qty: 5, uom: "Kg", rate: 200, amount: 1000, isFinishedItem: false }, // Consumed
                ]);
            }
            toast.success("Items populated successfully");
        }, 800);
    };

    const handleSubmit = () => {
        if (items.length === 0) {
            toast.error("No items to transfer");
            return;
        }
        setStatus("Submitted");
        toast.success("Stock Entry Submitted");

        // If completing production, guide back to dashboard or stock
        if (!isMaterialIssue) {
            setTimeout(() => navigate('/stock/finished-goods'), 1500);
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans space-y-4">
            {/* Nav */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="hover:underline cursor-pointer" onClick={() => navigate('/manufacturing')}>Manufacturing</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">{entryType}</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        {status === 'Draft' ? 'New Stock Entry' : 'STE-2024-001'}
                        <Badge className={`${status === 'Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'} border-none`}>
                            {status === 'Submitted' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                            {status}
                        </Badge>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">{entryType}</p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={() => navigate(isMaterialIssue ? '/manufacturing/complete-production' : '/stock/finished-goods')}
                        className="bg-blue-600 hover:bg-blue-700 text-white mr-2"
                    >
                        Next Step: {isMaterialIssue ? 'Complete Production' : 'Finished Goods'} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {status === 'Draft' && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>
                            Submit
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Form */}
            <div className="space-y-6">
                <Card className="p-6 border-slate-200 bg-white grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500 uppercase">Stock Entry Type</Label>
                        <Input value={entryType} disabled readOnly className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500 uppercase">Work Order</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Select Work Order..."
                                value={workOrder}
                                onChange={(e) => setWorkOrder(e.target.value)}
                                list="wo-list"
                                disabled={status === 'Submitted'}
                            />
                            <datalist id="wo-list">
                                <option value="WO-2024-001" />
                                <option value="WO-2024-002" />
                            </datalist>
                            {status === 'Draft' && (
                                <Button variant="secondary" onClick={handleGetItems} disabled={!workOrder}>
                                    Get Items
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500 uppercase">Posting Date</Label>
                        <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} disabled={status === 'Submitted'} />
                    </div>
                </Card>

                {/* Logistics */}
                <Card className="p-6 border-slate-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500 uppercase">Default Source Warehouse</Label>
                        <Input defaultValue={defaultSource} disabled={status === 'Submitted'} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500 uppercase">Default Target Warehouse</Label>
                        <Input defaultValue={defaultTarget} disabled={status === 'Submitted'} />
                    </div>
                </Card>

                {/* Items Table */}
                <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800">Items</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead>Item Code</TableHead>
                                    <TableHead>Source WH</TableHead>
                                    <TableHead>Target WH</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Rate</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-slate-500 italic">
                                            No items yet. Select a Work Order and click "Get Items".
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item, index) => (
                                        <TableRow key={index} className={item.isFinishedItem ? "bg-green-50/50" : ""}>
                                            <TableCell className="text-xs">{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="font-medium text-slate-700">{item.code}</div>
                                                <div className="text-xs text-slate-400">{item.name}</div>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500">
                                                {item.isFinishedItem ? "" : defaultSource}
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500">
                                                {item.isFinishedItem ? defaultTarget : defaultSource === defaultTarget ? "" : defaultTarget}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">{item.qty}</TableCell>
                                            <TableCell className="text-right text-xs">{item.rate}</TableCell>
                                            <TableCell className="text-right text-sm">{item.amount}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StockEntry;
