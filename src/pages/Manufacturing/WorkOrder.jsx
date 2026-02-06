import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, CheckCircle, AlertCircle, Box, ArrowRight, Save, MoreHorizontal } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const WorkOrder = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Not Started"); // Not Started, In Process, Completed
    const [producedQty, setProducedQty] = useState(0);
    const [targetQty, setTargetQty] = useState(10);
    const [isStartMetadataOpen, setIsStartMetadataOpen] = useState(false);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

    // Form Data
    const formData = {
        name: "WO-2024-001",
        itemToManufacture: "FG-100",
        itemName: "Finished Widget X",
        bomNo: "BOM-FG-100-001",
        warehouses: {
            source: "Stores - M",
            wip: "Work In Progress - M",
            fg: "Finished Goods - M"
        }
    };

    // Required Items (Mocked from BOM)
    const requiredItems = [
        { code: "RM-001", name: "Steel Sheet 2mm", perItem: 2.5, required: 25, transferred: 0 },
        { code: "RM-002", name: "Plastic Granules", perItem: 0.5, required: 5, transferred: 0 },
        { code: "CNS-01", name: "Lubricant Oil", perItem: 0.1, required: 1, transferred: 0 },
    ];

    const handleStart = (qtyToStart) => {
        setStatus("In Process");
        setIsStartMetadataOpen(false);
        toast.success(`Production started for ${qtyToStart} units`);
        // In a real app, this would create Stock Entries for Material Transfer
        navigate('/manufacturing/issue-materials'); // Guide user to next step
    };

    const handleFinish = (qtyFinished) => {
        const newProduced = producedQty + parseFloat(qtyFinished);
        setProducedQty(newProduced);

        if (newProduced >= targetQty) {
            setStatus("Completed");
            toast.success("Work Order Completed!");
        } else {
            toast.success(`Registered production of ${qtyFinished} units`);
        }
        setIsFinishModalOpen(false);
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans space-y-4">
            {/* Top Navigation */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="hover:underline cursor-pointer" onClick={() => navigate('/manufacturing')}>Manufacturing</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">{formData.name}</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        {formData.name}
                        <Badge className={`${status === 'Completed' ? 'bg-green-100 text-green-700' :
                            status === 'In Process' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'} border-none`}
                        >
                            {status === 'Completed' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                                status === 'In Process' ? <Play className="w-3 h-3 mr-1" /> :
                                    <AlertCircle className="w-3 h-3 mr-1" />}
                            {status}
                        </Badge>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manufacture {formData.itemToManufacture} from {formData.bomNo}</p>
                </div>

                <div className="flex gap-2">
                    {status === 'Not Started' && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsStartMetadataOpen(true)}>
                            Start Production
                        </Button>
                    )}
                    {status === 'In Process' && (
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsFinishModalOpen(true)}>
                            Finish Production
                        </Button>
                    )}
                    <Button
                        onClick={() => navigate('/manufacturing/issue-materials')}
                        className="bg-blue-600 hover:bg-blue-700 text-white ml-2"
                    >
                        Next Step: Issue Materials <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-5 h-5 text-slate-600" /></Button>
                </div>
            </div>

            {/* Progress Bar (if In Process) */}
            {(status === 'In Process' || status === 'Completed') && (
                <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                    <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(producedQty / targetQty) * 100}%` }}
                    ></div>
                    <div className="text-right text-xs text-slate-500 mt-1">
                        Produced {producedQty} of {targetQty}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 border-slate-200 shadow-sm bg-white grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500 uppercase">Item To Manufacture</Label>
                            <div className="font-medium text-slate-800">{formData.itemToManufacture}</div>
                            <div className="text-xs text-slate-500">{formData.itemName}</div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500 uppercase">Qty To Manufacture</Label>
                            <div className="font-bold text-xl text-slate-800">{targetQty}</div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500 uppercase">BOM No</Label>
                            <div className="text-sm text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => navigate('/manufacturing/bom')}>{formData.bomNo}</div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500 uppercase">Company</Label>
                            <div className="text-sm text-slate-800">Midocean Demo</div>
                        </div>
                    </Card>

                    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-800">Required Items</h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item Code</TableHead>
                                    <TableHead className="text-right">Required Qty</TableHead>
                                    <TableHead className="text-right">Transferred Qty</TableHead>
                                    <TableHead className="w-[50px]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requiredItems.map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="font-medium text-slate-700">{item.code}</div>
                                            <div className="text-xs text-slate-400">{item.name}</div>
                                        </TableCell>
                                        <TableCell className="text-right">{item.required}</TableCell>
                                        <TableCell className={`text-right ${item.transferred < item.required ? 'text-red-500 font-medium' : 'text-green-600'}`}>
                                            {item.transferred}
                                        </TableCell>
                                        <TableCell>
                                            <div className={`w-2 h-2 rounded-full ${item.transferred >= item.required ? 'bg-green-500' : 'bg-red-400'}`}></div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-4 bg-yellow-50 text-xs text-yellow-800 border-t border-yellow-100 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>Material Transfer for Manufacture is pending.</span>
                            <Button variant="link" className="h-auto p-0 text-yellow-800 underline ml-1" onClick={() => navigate('/manufacturing/issue-materials')}>Create Stock Entry</Button>
                        </div>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <Card className="p-4 border-slate-200 shadow-sm bg-white space-y-4">
                        <h3 className="text-sm font-bold text-slate-800">Warehouses</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="text-slate-500 text-xs uppercase">Source Warehouse</div>
                                <div className="font-medium text-slate-700">{formData.warehouses.source}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs uppercase">WIP Warehouse</div>
                                <div className="font-medium text-slate-700">{formData.warehouses.wip}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs uppercase">Target Warehouse</div>
                                <div className="font-medium text-slate-700">{formData.warehouses.fg}</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* POPUPS / DIALOGS */}

            {/* 1. Start Production Modal */}
            <Dialog open={isStartMetadataOpen} onOpenChange={setIsStartMetadataOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Start Production</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Qty to Manufacture</Label>
                            <Input type="number" defaultValue={targetQty} />
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
                            This will change status to <b>In Process</b> and allow Material Transfer.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStartMetadataOpen(false)}>Cancel</Button>
                        <Button onClick={() => handleStart(targetQty)}>Start</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 2. Finish Production Modal */}
            <Dialog open={isFinishModalOpen} onOpenChange={setIsFinishModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Finish Production</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Produced Quantity</Label>
                            <Input type="number" defaultValue={targetQty - producedQty} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="closeWO" className="rounded border-slate-300" defaultChecked={producedQty + (targetQty - producedQty) >= targetQty} />
                            <Label htmlFor="closeWO" className="font-normal">Close Work Order?</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFinishModalOpen(false)}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleFinish(targetQty - producedQty)}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default WorkOrder;
