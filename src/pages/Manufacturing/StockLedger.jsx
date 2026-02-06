import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const StockLedger = () => {
    const navigate = useNavigate();

    const ledgerEntries = [
        { date: "2024-02-05 15:00", itemCode: "FG-100", itemName: "Finished Widget X", warehouse: "Finished Goods - M", qtyChange: 10, balance: 10, voucherType: "Stock Entry (Manufacture)", voucherNo: "STE-2024-002" },
        { date: "2024-02-05 15:00", itemCode: "RM-001", itemName: "Steel Sheet 2mm", warehouse: "Work In Progress - M", qtyChange: -25, balance: 25, voucherType: "Stock Entry (Manufacture)", voucherNo: "STE-2024-002" },
        { date: "2024-02-05 14:45", itemCode: "RM-001", itemName: "Steel Sheet 2mm", warehouse: "Work In Progress - M", qtyChange: 25, balance: 50, voucherType: "Stock Entry (Transfer)", voucherNo: "STE-2024-001" },
        { date: "2024-02-05 14:45", itemCode: "RM-001", itemName: "Steel Sheet 2mm", warehouse: "Stores - M", qtyChange: -25, balance: 975, voucherType: "Stock Entry (Transfer)", voucherNo: "STE-2024-001" },
        { date: "2024-02-01 09:00", itemCode: "RM-001", itemName: "Steel Sheet 2mm", warehouse: "Stores - M", qtyChange: 1000, balance: 1000, voucherType: "Purchase Receipt", voucherNo: "PR-2024-100" },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans space-y-4">
            {/* Nav */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="hover:underline cursor-pointer" onClick={() => navigate('/stock')}>Stock</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">Stock Ledger</span>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-slate-900">Stock Ledger</h1>
                <div className="flex gap-2">
                    <Button onClick={() => navigate('/dashboard')} className="bg-slate-800 text-white hover:bg-slate-900">
                        Back to Dashboard
                    </Button>
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
                </div>
            </div>

            <Card className="p-4 bg-white border-slate-200 flex gap-4 items-center mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search Item, Warehouse or Voucher..." className="pl-9 bg-slate-50" />
                </div>
                <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Warehouse</TableHead>
                            <TableHead>Voucher</TableHead>
                            <TableHead className="text-right">Qty Change</TableHead>
                            <TableHead className="text-right">Balance Qty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ledgerEntries.map((entry, i) => (
                            <TableRow key={i} className="hover:bg-slate-50">
                                <TableCell className="text-xs text-slate-500">{entry.date}</TableCell>
                                <TableCell>
                                    <div className="font-medium text-slate-700">{entry.itemCode}</div>
                                    <div className="text-[10px] text-slate-400">{entry.itemName}</div>
                                </TableCell>
                                <TableCell className="text-xs text-slate-600">{entry.warehouse}</TableCell>
                                <TableCell>
                                    <div className="text-xs font-medium text-blue-600 hover:underline cursor-pointer">{entry.voucherNo}</div>
                                    <div className="text-[10px] text-slate-500">{entry.voucherType}</div>
                                </TableCell>
                                <TableCell className={`text-right font-medium ${entry.qtyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {entry.qtyChange > 0 ? '+' : ''}{entry.qtyChange}
                                </TableCell>
                                <TableCell className="text-right text-slate-700 font-bold">{entry.balance}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default StockLedger;
