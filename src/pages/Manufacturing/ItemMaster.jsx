import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Save, Image as ImageIcon, BarChart3, History, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const ItemMaster = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    const itemData = {
        itemCode: "RM-001",
        itemName: "Steel Sheet 2mm",
        itemGroup: "Raw Material",
        stockUOM: "Sheet",
        totalStock: 1000,
        valuationRate: 50.00,
        standardSellingRate: 0.00,
    };

    const warehouseStock = [
        { warehouse: "Stores - M", stock: 950, value: 47500 },
        { warehouse: "Work In Progress - M", stock: 50, value: 2500 },
        { warehouse: "Finished Goods - M", stock: 0, value: 0 },
    ];

    const handleSave = () => toast.success("Item saved successfully");
    const handleChangeImage = () => toast.info("Image upload dialog would open here");

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans space-y-4">
            {/* Nav */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="hover:underline cursor-pointer" onClick={() => navigate('/stock')}>Stock</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">Item</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        {itemData.itemCode}
                        <Badge variant="outline" className="text-slate-600 border-slate-300">Enabled</Badge>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">{itemData.itemName}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => navigate('/manufacturing/bom')}
                        className="bg-blue-600 hover:bg-blue-700 text-white mr-2"
                    >
                        Next Step: Bill of Materials <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="border-slate-300" onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save</Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-5 h-5 text-slate-600" /></Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Image & Quick Stats */}
                <div className="space-y-6">
                    <Card className="p-6 border-slate-200 bg-white flex flex-col items-center text-center space-y-4">
                        <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                            <ImageIcon className="w-10 h-10 text-slate-300" />
                        </div>
                        <Button variant="outline" size="sm" className="w-full" onClick={handleChangeImage}>Change Image</Button>
                    </Card>

                    <Card className="p-4 border-slate-200 bg-white space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Total Stock</span>
                            <span className="font-bold text-slate-800">{itemData.totalStock} {itemData.stockUOM}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Valuation Rate</span>
                            <span className="font-bold text-slate-800">${itemData.valuationRate.toFixed(2)}</span>
                        </div>
                    </Card>
                </div>

                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 bg-white shadow-sm overflow-hidden min-h-[500px]">
                        <Tabs defaultValue="overview" className="w-full">
                            <div className="px-4 pt-4 border-b border-slate-100">
                                <TabsList className="bg-transparent space-x-4">
                                    <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-2 pb-2">Overview</TabsTrigger>
                                    <TabsTrigger value="inventory" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-2 pb-2">Inventory</TabsTrigger>
                                    <TabsTrigger value="sourcing" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-2 pb-2">Purchasing</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="overview" className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500 uppercase">Item Name</Label>
                                        <Input defaultValue={itemData.itemName} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500 uppercase">Item Group</Label>
                                        <Input defaultValue={itemData.itemGroup} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500 uppercase">Default UOM</Label>
                                        <Input defaultValue={itemData.stockUOM} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500 uppercase">Description</Label>
                                    <textarea className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" defaultValue="Standard cold rolled steel sheet 2mm thickness for casing manufacturing." />
                                </div>
                            </TabsContent>

                            <TabsContent value="inventory" className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead>Warehouse</TableHead>
                                            <TableHead className="text-right">Projected Qty</TableHead>
                                            <TableHead className="text-right">Actual Qty</TableHead>
                                            <TableHead className="text-right">Value</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {warehouseStock.map((wh, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-medium text-slate-700">{wh.warehouse}</TableCell>
                                                <TableCell className="text-right text-slate-500">{wh.stock}</TableCell>
                                                <TableCell className="text-right font-bold text-slate-800">{wh.stock}</TableCell>
                                                <TableCell className="text-right text-slate-600">${wh.value.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>

                            <TabsContent value="sourcing" className="p-6 flex flex-col items-center justify-center text-slate-400 space-y-3 min-h-[200px]">
                                <History className="w-10 h-10 opacity-20" />
                                <p>No purchase history found for this item.</p>
                            </TabsContent>

                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ItemMaster;
