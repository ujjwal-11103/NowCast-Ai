import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, Download, MoreHorizontal, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// Mock Data
const initialItems = [
    { itemCode: "RM-001", itemName: "Steel Sheet 2mm", group: "Raw Material", uom: "Sheet", actualQty: 1000, valuation: 50000 },
    { itemCode: "RM-002", itemName: "Plastic Granules", group: "Raw Material", uom: "Kg", actualQty: 500, valuation: 100000 },
    { itemCode: "SF-001", itemName: "Molded Casing", group: "Sub Assembly", uom: "Nos", actualQty: 250, valuation: 12500 },
    { itemCode: "FG-100", itemName: "Finished Widget X", group: "Finished Goods", uom: "Nos", actualQty: 0, valuation: 0 },
    { itemCode: "FG-101", itemName: "Finished Widget Y", group: "Finished Goods", uom: "Nos", actualQty: 12, valuation: 18000 },
    { itemCode: "CNS-01", itemName: "Lubricant Oil", group: "Consumables", uom: "Litre", actualQty: 50, valuation: 500 },
];

const StockOverview = ({ defaultGroupFilter = "" }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [groupFilter, setGroupFilter] = useState(defaultGroupFilter);

    // Filter logic
    const filteredItems = initialItems.filter(item =>
        (item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (groupFilter ? item.group === groupFilter : true)
    );

    const handleExport = () => toast.success("Stock details exported to CSV successfully");
    const handleAddItem = () => toast.info("Create New Item wizard would open here");
    const handleFilter = () => toast.info("Advanced Filter options would appear here");

    return (
        <div className="p-8 bg-slate-50 min-h-screen space-y-6 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Stock Overview</h1>
                    <p className="text-slate-500 text-sm">Manage your inventory and stock levels</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => window.location.href = defaultGroupFilter === 'Finished Goods' ? '/stock/ledger' : '/stock/item-view'}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Next Step: {defaultGroupFilter === 'Finished Goods' ? 'Stock Ledger' : 'Item Stock'} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="bg-white" onClick={handleExport}><Download className="w-4 h-4 mr-2" /> Export</Button>
                    <Button variant="outline" className="bg-white" onClick={handleAddItem}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
                </div>
            </div>

            {/* Filters Bar */}
            <Card className="p-4 bg-white border-slate-200 flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by Item Code or Name..."
                        className="pl-9 bg-slate-50 border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="text-slate-600" onClick={handleFilter}><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            </Card>

            {/* Data Table - Mimicking ERP List View */}
            <Card className="bg-white border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Item Code</th>
                                <th className="px-6 py-3 font-semibold">Item Name</th>
                                <th className="px-6 py-3 font-semibold">Item Group</th>
                                <th className="px-6 py-3 font-semibold">UOM</th>
                                <th className="px-6 py-3 font-semibold text-right">Actual Qty</th>
                                <th className="px-6 py-3 font-semibold text-right">Valuation ($)</th>
                                <th className="px-6 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td
                                        className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:underline"
                                        onClick={() => navigate('/stock/item-view')}
                                    >
                                        {item.itemCode}
                                    </td>
                                    <td
                                        className="px-6 py-4 font-medium text-slate-800 cursor-pointer"
                                        onClick={() => navigate('/stock/item-view')}
                                    >
                                        {item.itemName}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${item.group === 'Raw Material' ? 'bg-amber-100 text-amber-700' :
                                                item.group === 'Finished Goods' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {item.group}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{item.uom}</td>
                                    <td className="px-6 py-4 text-slate-800 font-bold text-right">{item.actualQty}</td>
                                    <td className="px-6 py-4 text-slate-600 text-right">{item.valuation.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredItems.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No items found matching your search.
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
                    <span>Showing {filteredItems.length} items</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default StockOverview;
