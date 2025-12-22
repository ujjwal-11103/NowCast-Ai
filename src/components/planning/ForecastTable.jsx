import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useSidebar } from '@/context/sidebar/SidebarContext'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Table2 } from 'lucide-react';
import WaterfallChart from './WaterfallChart'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const ForecastTable = forwardRef(({ data, selections, onPivotRequest, tableData, teamInputs, consensusValues, handleTeamInputChange }, ref) => {

    // 1. Determine Hierarchy (Re-calculate for display purposes)
    const getItemLevel = () => {
        const selectionMap = {}
        selections.forEach(sel => { selectionMap[sel.field] = sel.value })
        if (selectionMap.Chain === 'All') return 'Channel'
        if (selectionMap.Depot === 'All') return 'Chain'
        if (selectionMap.SubCat === 'All') return 'Depot'
        if (selectionMap.SKU === 'All') return 'SubCat'
        return 'SKU'
    }
    const itemLevel = getItemLevel()

    const { isSidebarOpen } = useSidebar();
    const [activeInputs, setActiveInputs] = useState({});

    // Note: Local focus state is fine to keep here as it's UI specific
    const handleInputFocus = (itemName, team, month) => {
        setActiveInputs(prev => ({ ...prev, [`${itemName}-${team}-${month}`]: true }));
    };

    const [expandedItems, setExpandedItems] = useState({});
    const toggleItemExpansion = (itemName) => {
        setExpandedItems(prev => ({ ...prev, [itemName]: !prev[itemName] }));
    };

    useImperativeHandle(ref, () => ({
        getTableData: () => tableData,
        // filteredData and groupedData are no longer computed locally
        getFilteredData: () => [],
        getGroupedData: () => ({})
    }));

    return (
        <div className={`space-y-4 ${isSidebarOpen ? "w-[76.6vw]" : "w-[90.6vw]"}`}>
            <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200 p-0">
                <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Forecast Data (Q4 2024)</h3>
                    <Button variant="outline" onClick={() => onPivotRequest(tableData)} className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 transition-colors">
                        <Table2 className="w-4 h-4" /> Pivot Analysis
                    </Button>
                </div>

                <ScrollArea className="w-100 whitespace-nowrap rounded-b-md">
                    <div>
                        <Table>
                            <TableHeader className="bg-white">
                                <TableRow>
                                    <TableHead rowSpan={3} className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]">{itemLevel}</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Last Year Values</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Baseline Forecast</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Consensus</TableHead>
                                    <TableHead rowSpan={3} className="text-center border-r border-gray-200 min-w-[200px] bg-orange-50/50 text-orange-700">Recent Trend</TableHead>
                                    <TableHead rowSpan={3} className="text-center border-r border-gray-200 min-w-[200px] bg-indigo-50/50 text-indigo-700">Long Term Trend</TableHead>
                                    <TableHead rowSpan={3} className="text-center border-r border-gray-200 min-w-[200px] bg-teal-50/50 text-grey-700">Forecast Summary</TableHead>
                                    <TableHead colSpan={9} className="text-center border-r border-gray-200 bg-blue-50">Sales Team</TableHead>
                                    <TableHead colSpan={9} className="text-center border-r border-gray-200 bg-green-50">Marketing Team</TableHead>
                                    <TableHead colSpan={3} className="text-center bg-purple-50">Finance Team</TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="text-center border-r border-gray-200 font-semibold">Oct</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 font-semibold">Nov</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 font-semibold">Dec</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Oct</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Nov</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Dec</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Oct</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Nov</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Dec</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Oct</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Nov</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Dec</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Oct</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Nov</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Dec</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Oct</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Nov</TableHead>
                                    <TableHead colSpan={3} className="text-center">Dec</TableHead>
                                </TableRow>
                                <TableRow>
                                    {[...Array(9)].map((_, i) => <TableHead key={i} className="text-center border-r border-gray-200"></TableHead>)}
                                    {[1, 2, 3].map(i => (<React.Fragment key={`s${i}`}><TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead><TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead><TableHead className="text-center border-r border-gray-200 min-w-[120px]">Owner</TableHead></React.Fragment>))}
                                    {[1, 2, 3].map(i => (<React.Fragment key={`m${i}`}><TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead><TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead><TableHead className="text-center border-r border-gray-200 min-w-[120px]">Owner</TableHead></React.Fragment>))}
                                    {[1, 2, 3].map(i => (<React.Fragment key={`f${i}`}><TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead><TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead><TableHead className="text-center min-w-[120px]">Owner</TableHead></React.Fragment>))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {tableData.map((row) => (
                                    <React.Fragment key={row.name}>
                                        <TableRow className="bg-white hover:bg-gray-50 group">
                                            <TableCell className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 min-w-[180px] border-r border-gray-200">
                                                <button onClick={() => toggleItemExpansion(row.name)} className="flex items-center w-full text-left font-medium text-gray-800 hover:text-indigo-600 transition-colors">
                                                    {row.name}
                                                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${expandedItems[row.name] ? 'rotate-180' : ''}`} />
                                                </button>
                                            </TableCell>

                                            {/* LY Values */}
                                            <TableCell className="text-right border-r border-gray-200 font-mono">{Math.round(row.LYOct).toLocaleString()}</TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono">{Math.round(row.LYNov).toLocaleString()}</TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono">{Math.round(row.LYDec).toLocaleString()}</TableCell>

                                            {/* Forecast Values */}
                                            <TableCell className="text-right border-r border-gray-200 font-mono">{Math.round(row.ForecastOct).toLocaleString()}</TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono">{Math.round(row.ForecastNov).toLocaleString()}</TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono">{Math.round(row.ForecastDec).toLocaleString()}</TableCell>

                                            {/* Consensus Values (Calculated) */}
                                            <TableCell className="text-right border-r border-gray-200 font-mono font-semibold bg-yellow-50">
                                                {(consensusValues[row.name]?.oct ?? Math.round(row.ForecastOct)).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono font-semibold bg-yellow-50">
                                                {(consensusValues[row.name]?.nov ?? Math.round(row.ForecastNov)).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono font-semibold bg-yellow-50">
                                                {(consensusValues[row.name]?.dec ?? Math.round(row.ForecastDec)).toLocaleString()}
                                            </TableCell>

                                            {/* Intelligence Columns */}
                                            <TableCell className="text-center border-r border-gray-200 text-xs font-medium text-orange-800 bg-orange-50/20">{row.Recent_Trend_Category || "Stable"}</TableCell>
                                            <TableCell className="text-center border-r border-gray-200 text-xs font-medium text-indigo-800 bg-indigo-50/20">{row.Long_Term_Trend_Category || "Upward"}</TableCell>
                                            <TableCell className="text-center border-r border-gray-200 text-xs font-medium text-teal-800 bg-teal-50/20 max-w-[200px]">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="w-full truncate px-2 py-1 cursor-help hover:text-teal-900 transition-colors">
                                                            {row.Forecast_Summary || "Normal"}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-xs bg-teal-900 text-teal-50 border-teal-800 shadow-xl p-3">
                                                        <p className="font-semibold mb-1 text-teal-200 text-xs uppercase tracking-wider">Forecast Summary</p>
                                                        <p className="text-sm leading-relaxed">{row.Forecast_Summary || "Normal"}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>

                                            {/* Sales Inputs */}
                                            {['oct', 'nov', 'dec'].map(month => (
                                                <TeamInputCell
                                                    key={`sales-${month}`}
                                                    row={row} team="sales" month={month}
                                                    activeInputs={activeInputs}
                                                    handleInputFocus={handleInputFocus}
                                                    handleTeamInputChange={handleTeamInputChange}
                                                    setActiveInputs={setActiveInputs}
                                                    colorClass="blue"
                                                    value={teamInputs[row.name]?.sales?.[month]?.value || ""}
                                                    comment={teamInputs[row.name]?.sales?.[month]?.comment || ""}
                                                    owner={teamInputs[row.name]?.sales?.[month]?.owner || ""}
                                                />
                                            ))}
                                            {/* Marketing & Finance Inputs */}
                                            {['oct', 'nov', 'dec'].map(month => (
                                                <TeamInputCell
                                                    key={`mkt-${month}`}
                                                    row={row} team="marketing" month={month}
                                                    activeInputs={activeInputs}
                                                    handleInputFocus={handleInputFocus}
                                                    handleTeamInputChange={handleTeamInputChange}
                                                    setActiveInputs={setActiveInputs}
                                                    colorClass="green"
                                                    value={teamInputs[row.name]?.marketing?.[month]?.value || ""}
                                                    comment={teamInputs[row.name]?.marketing?.[month]?.comment || ""}
                                                    owner={teamInputs[row.name]?.marketing?.[month]?.owner || ""}
                                                />
                                            ))}
                                            {['oct', 'nov', 'dec'].map(month => (
                                                <TeamInputCell
                                                    key={`fin-${month}`}
                                                    row={row} team="finance" month={month}
                                                    activeInputs={activeInputs}
                                                    handleInputFocus={handleInputFocus}
                                                    handleTeamInputChange={handleTeamInputChange}
                                                    setActiveInputs={setActiveInputs}
                                                    colorClass="purple"
                                                    value={teamInputs[row.name]?.finance?.[month]?.value || ""}
                                                    comment={teamInputs[row.name]?.finance?.[month]?.comment || ""}
                                                    owner={teamInputs[row.name]?.finance?.[month]?.owner || ""}
                                                />
                                            ))}
                                        </TableRow>
                                        {/* Waterfall Charts */}
                                        {expandedItems[row.name] && (
                                            <TableRow className="bg-slate-50/50 shadow-inner">
                                                <TableCell colSpan={37} className="p-0">
                                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-6 w-1 bg-indigo-500 rounded-full"></div>
                                                                <h4 className="text-base font-semibold text-gray-800">
                                                                    {row.name} - Performance Analysis
                                                                </h4>
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                                                                Q4 2024 Waterfall
                                                            </span>
                                                        </div>
                                                        {/* Existing Waterfall Charts Grid */}
                                                        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            {['oct', 'nov', 'dec'].map(m => (
                                                                <div key={m} className="bg-white rounded-lg border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 group/chart">
                                                                    <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 group-hover/chart:bg-indigo-50/10 transition-colors">
                                                                        <span className="font-semibold text-sm text-gray-700 capitalize">{m} Waterfall</span>
                                                                        <span className="text-xs text-gray-400 font-mono">Unit: qty</span>
                                                                    </div>
                                                                    <div className="p-2">
                                                                        <WaterfallChart data={[
                                                                            { label: "Forecast", value: row[`Forecast${m.charAt(0).toUpperCase() + m.slice(1)}`] },
                                                                            { label: "Sales", value: parseFloat(teamInputs[row.name]?.sales?.[m]?.value) || 0 },
                                                                            { label: "Marketing", value: parseFloat(teamInputs[row.name]?.marketing?.[m]?.value) || 0 },
                                                                            { label: "Finance", value: parseFloat(teamInputs[row.name]?.finance?.[m]?.value) || 0 },
                                                                            { label: "Consensus", value: consensusValues[row.name]?.[m] }
                                                                        ]} />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Card>
        </div>
    )
});

// Helper Component
const TeamInputCell = ({ row, team, month, activeInputs, handleInputFocus, handleTeamInputChange, setActiveInputs, colorClass, value, comment, owner }) => {
    const borderColors = { blue: "border-blue-200 focus:ring-blue-300", green: "border-green-200 focus:ring-green-300", purple: "border-purple-200 focus:ring-purple-300" };
    const btnColors = { blue: "bg-blue-600", green: "bg-green-600", purple: "bg-purple-600" };
    return (
        <TableCell colSpan={3} className="border-r border-gray-200 p-0">
            <div className="flex flex-col">
                <div className="flex">
                    <div className="flex-1 min-w-[80px] p-1">
                        <input type="number" className={`w-full p-2 text-sm border rounded-md focus:ring-2 ${borderColors[colorClass]}`} onChange={(e) => handleTeamInputChange(row.name, team, month, 'value', e.target.value)} onFocus={() => handleInputFocus(row.name, team, month)} placeholder="Val" value={value} />
                    </div>
                    <div className="flex-1 min-w-[120px] p-1">
                        <input type="text" className={`w-full p-2 text-sm border rounded-md focus:ring-2 ${borderColors[colorClass]}`} onChange={(e) => handleTeamInputChange(row.name, team, month, 'comment', e.target.value)} onFocus={() => handleInputFocus(row.name, team, month)} placeholder="Cmnt" value={comment} />
                    </div>
                    <div className="flex-1 min-w-[120px] p-1">
                        <input type="text" className={`w-full p-2 text-sm border rounded-md focus:ring-2 ${borderColors[colorClass]}`} onChange={(e) => handleTeamInputChange(row.name, team, month, 'owner', e.target.value)} onFocus={() => handleInputFocus(row.name, team, month)} placeholder="Ownr" value={owner} />
                    </div>
                </div>
                {activeInputs[`${row.name}-${team}-${month}`] && (
                    <div className="p-1 border-t border-gray-200">
                        <button className={`w-full text-white px-3 py-1 rounded text-sm ${btnColors[colorClass]}`} onClick={() => setActiveInputs(prev => ({ ...prev, [`${row.name}-${team}-${month}`]: false }))}>Submit</button>
                    </div>
                )}
            </div>
        </TableCell>
    );
};

ForecastTable.displayName = 'ForecastTable';
export default ForecastTable;