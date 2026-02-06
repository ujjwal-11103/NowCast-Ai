import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Calendar } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ProductionPlan = () => {
    const navigate = useNavigate();

    const plans = [
        { id: "PRO-PLN-2024-001", item: "FG-100", plannedQty: 100, status: "Submitted", postingDate: "2024-02-01" },
        { id: "PRO-PLN-2024-002", item: "FG-101", plannedQty: 50, status: "Draft", postingDate: "2024-02-05" },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans space-y-4">
            {/* Nav */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="hover:underline cursor-pointer" onClick={() => navigate('/manufacturing')}>Manufacturing</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">Production Plan</span>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-slate-900">Production Plan</h1>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4 mr-2" /> Create Production Plan</Button>
            </div>

            <Card className="bg-white border-slate-200 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Plan ID</TableHead>
                            <TableHead>Item to Manufacture</TableHead>
                            <TableHead className="text-right">Planned Qty</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.map((plan, i) => (
                            <TableRow key={i} className="hover:bg-slate-50">
                                <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">{plan.id}</TableCell>
                                <TableCell>{plan.item}</TableCell>
                                <TableCell className="text-right font-bold">{plan.plannedQty}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={`${plan.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'} hover:bg-transparent`}>
                                        {plan.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-slate-500 text-xs">{plan.postingDate}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4 text-slate-400" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default ProductionPlan;
