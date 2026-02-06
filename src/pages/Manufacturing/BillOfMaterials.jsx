import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Save, MoreHorizontal, ArrowLeft, ArrowRight, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const BillOfMaterials = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Draft"); // Draft, Submitted, Cancelled
    const [isDirty, setIsDirty] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        itemCode: "FG-100",
        itemName: "Finished Widget X",
        quantity: 1.0,
        uom: "Nos",
        currency: "USD",
        rate: 500.00
    });

    // BOM Items (Child Table)
    const [items, setItems] = useState([
        { id: 1, itemCode: "RM-001", itemName: "Steel Sheet 2mm", qty: 2.5, uom: "Sheet", rate: 50, amount: 125 },
        { id: 2, itemCode: "RM-002", itemName: "Plastic Granules", qty: 0.5, uom: "Kg", rate: 200, amount: 100 },
        { id: 3, itemCode: "CNS-01", itemName: "Lubricant Oil", qty: 0.1, uom: "Litre", rate: 50, amount: 5 },
    ]);

    // Derived Totals
    const totalCost = items.reduce((sum, item) => sum + item.amount, 0);

    const handleItemChange = (id, field, value) => {
        setIsDirty(true);
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const updates = { [field]: value };
                if (field === 'qty' || field === 'rate') {
                    // Recalculate amount if qty or rate changes
                    const q = field === 'qty' ? parseFloat(value) || 0 : item.qty;
                    const r = field === 'rate' ? parseFloat(value) || 0 : item.rate;
                    updates.amount = q * r;
                }
                return { ...item, ...updates };
            }
            return item;
        }));
    };

    const addItem = () => {
        const newItem = { id: Date.now(), itemCode: "", itemName: "", qty: 1, uom: "Nos", rate: 0, amount: 0 };
        setItems([...items, newItem]);
        setIsDirty(true);
    };

    const deleteItem = (id) => {
        setItems(items.filter(i => i.id !== id));
        setIsDirty(true);
    };

    const handleSave = () => {
        setStatus("Draft");
        setIsDirty(false);
        toast.success("BOM saved successfully");
    };

    const handleSubmit = () => {
        if (items.some(i => !i.itemCode)) {
            toast.error("Please ensure all items have an Item Code");
            return;
        }
        setStatus("Submitted");
        setIsDirty(false);
        toast.success("BOM Submitted Permanently");
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans space-y-4">
            {/* Top Navigation / Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="hover:underline cursor-pointer" onClick={() => navigate('/manufacturing')}>Manufacturing</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">Bill of Materials</span>
            </div>

            {/* Header / Actions Area */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            BOM-FG-100-001
                            <Badge className={`${status === 'Submitted' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-orange-100 text-orange-700 hover:bg-orange-100'} border-none`}>
                                {status === 'Submitted' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                                {status}
                            </Badge>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Default BOM for {formData.itemCode}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isDirty && <Button variant="ghost" className="text-slate-500">Not Saved</Button>}
                    <Button
                        onClick={() => navigate('/manufacturing/work-order')}
                        className="bg-blue-600 hover:bg-blue-700 text-white mr-2"
                    >
                        Next Step: Work Orders <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {status === 'Draft' ? (
                        <>
                            <Button variant="outline" onClick={handleSave} className="border-slate-300">
                                <Save className="w-4 h-4 mr-2" /> Save
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setStatus('Draft')}>
                            Cancel / Amend
                        </Button>
                    )}
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-5 h-5 text-slate-600" /></Button>
                </div>
            </div>

            {/* Main Form Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: BOM Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 border-slate-200 shadow-sm bg-white">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Item</label>
                                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-slate-700">
                                    {formData.itemCode}: {formData.itemName}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Quantity</label>
                                <Input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="bg-white"
                                    disabled={status === 'Submitted'}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Project</label>
                                <Input className="bg-white" placeholder="Optional" disabled={status === 'Submitted'} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Currency</label>
                                <Input className="bg-white" value={formData.currency} disabled />
                            </div>
                        </div>
                    </Card>

                    {/* Items Table Section */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                        <Tabs defaultValue="materials" className="w-full">
                            <div className="px-4 pt-4 border-b border-slate-100">
                                <TabsList className="bg-transparent space-x-4">
                                    <TabsTrigger value="materials" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-2 pb-2">Materials</TabsTrigger>
                                    <TabsTrigger value="operations" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-2 pb-2">Operations</TabsTrigger>
                                    <TabsTrigger value="costing" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-2 pb-2">Costing</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="materials" className="p-0 m-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow>
                                                <TableHead className="w-[50px]">#</TableHead>
                                                <TableHead className="w-[200px]">Item Code</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead>UOM</TableHead>
                                                <TableHead>Rate</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item, index) => (
                                                <TableRow key={item.id} className="group">
                                                    <TableCell className="text-slate-500 text-xs">{index + 1}</TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={item.itemCode}
                                                            onChange={(e) => handleItemChange(item.id, 'itemCode', e.target.value)}
                                                            className="h-8 border-transparent hover:border-slate-300 focus:border-blue-500 bg-transparent px-2"
                                                            placeholder="Select Item..."
                                                            disabled={status === 'Submitted'}
                                                        />
                                                        <div className="text-[10px] text-slate-400 px-2 truncate max-w-[180px]">{item.itemName}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            value={item.qty}
                                                            onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                                                            className="h-8 w-20 border-transparent hover:border-slate-300 bg-transparent px-2 text-right"
                                                            disabled={status === 'Submitted'}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-xs text-slate-500">{item.uom}</TableCell>
                                                    <TableCell className="text-xs text-slate-500 text-right">{item.rate.toFixed(2)}</TableCell>
                                                    <TableCell className="text-sm font-medium text-right text-slate-700">{item.amount.toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        {status === 'Draft' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                                                                onClick={() => deleteItem(item.id)}
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                {status === 'Draft' && (
                                    <div className="p-3 border-t border-slate-100">
                                        <Button variant="outline" size="sm" className="text-slate-600 gap-2" onClick={addItem}>
                                            <Plus className="w-3 h-3" /> Add Row
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="costing" className="p-6">
                                <div className="space-y-4 max-w-sm">
                                    <h3 className="font-semibold text-slate-800">Cost Breakdown</h3>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Operating Cost</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Raw Material Cost</span>
                                        <span>${totalCost.toFixed(2)}</span>
                                    </div>
                                    <div className="h-px bg-slate-200 my-2"></div>
                                    <div className="flex justify-between font-bold text-slate-900">
                                        <span>Total Cost</span>
                                        <span>${totalCost.toFixed(2)}</span>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>

                {/* Right Sidebar: Settings & Status */}
                <div className="space-y-6">
                    <Card className="p-4 border-slate-200 shadow-sm bg-white">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            Settings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked readOnly className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-slate-600">Is Active</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked readOnly className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-slate-600">Is Default</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-slate-600">With Operations</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-slate-200 shadow-sm bg-white">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Connections</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded cursor-pointer group">
                                <span className="text-sm text-slate-600 group-hover:text-blue-600 group-hover:underline">Work Orders</span>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-700">0</Badge>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded cursor-pointer group">
                                <span className="text-sm text-slate-600 group-hover:text-blue-600 group-hover:underline">Stock Entry</span>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-700">0</Badge>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BillOfMaterials;
