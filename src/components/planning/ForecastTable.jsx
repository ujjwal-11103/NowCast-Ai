import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useSidebar } from '@/context/sidebar/SidebarContext'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Table2, CornerDownRight } from 'lucide-react';
import WaterfallChart from './WaterfallChart'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const ForecastTable = forwardRef(({ data, selections, onPivotRequest, tableData, teamInputs, consensusValues, handleTeamInputChange, onDrillDown }, ref) => {

    // 1. Determine Hierarchy (Re-calculate for display purposes)
    // 1. Determine Hierarchy (Re-calculate for display purposes)
    const getItemLevel = () => {
        const selectionMap = {}
        selections.forEach(sel => { selectionMap[sel.field] = sel.value })

        if (!selectionMap.Channel || selectionMap.Channel === 'All') return 'Channel';
        if (!selectionMap.Chain) return 'Chain';

        // Chain is 'All' -> Show Depots
        const isChainAll = selectionMap.Chain === 'All';
        const isDepotSpecific = selectionMap.Depot && selectionMap.Depot !== 'All';
        if (isChainAll && !isDepotSpecific) return 'Depot';

        if (!selectionMap.Depot) return 'Depot';

        // Depot is 'All' -> Show SubCats
        const isDepotAll = selectionMap.Depot === 'All';
        const isSubCatSpecific = selectionMap.SubCat && selectionMap.SubCat !== 'All';
        if (isDepotAll && !isSubCatSpecific) return 'SubCat';

        if (!selectionMap.SubCat) return 'SubCat';

        // SubCat is 'All' -> Show SKUs
        if (selectionMap.SubCat === 'All' && (!selectionMap.SKU || selectionMap.SKU === 'All')) return 'SKU';

        return 'SKU';
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
                                                <div className="flex items-center w-full justify-between">
                                                    <span
                                                        onClick={() => toggleItemExpansion(row.name)}
                                                        className="font-medium text-gray-800 hover:text-indigo-600 hover:underline cursor-pointer transition-colors flex-1 truncate mr-2"
                                                        title={`Expand ${row.name}`}
                                                    >
                                                        {row.name}
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleItemExpansion(row.name); }}
                                                        className="p-1 hover:bg-gray-200 rounded-full transition-colors focus:outline-none"
                                                        title="Toggle Expansion"
                                                    >
                                                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expandedItems[row.name] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
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
                                            <ExpandedRowContent
                                                row={row}
                                                itemLevel={itemLevel}
                                                globalData={data}
                                                teamInputs={teamInputs}
                                                consensusValues={consensusValues}
                                                handleTeamInputChange={handleTeamInputChange}
                                                handleInputFocus={handleInputFocus}
                                                activeInputs={activeInputs}
                                                setActiveInputs={setActiveInputs}
                                            />
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

// Helper to determine next level
const getNextLevel = (currentLevel) => {
    const levels = ['Channel', 'Chain', 'Depot', 'SubCat', 'SKU'];
    const idx = levels.indexOf(currentLevel);
    if (idx >= 0 && idx < levels.length - 1) return levels[idx + 1];
    return null;
}

const ExpandedRowContent = ({ row, itemLevel, globalData, teamInputs, consensusValues, handleTeamInputChange, handleInputFocus, activeInputs, setActiveInputs }) => {
    const nextLevel = getNextLevel(itemLevel);

    // Aggregation Logic (Replicated from Planning.jsx for robustness)
    const getChildRows = () => {
        if (!nextLevel || !globalData) return [];

        // Filter for children of this row
        const filtered = globalData.filter(item => item[itemLevel] === row.name);

        // Group by next level
        const grouped = filtered.reduce((acc, item) => {
            const key = item[nextLevel] || "Unassigned"; // Handle missing keys
            if (!acc[key]) {
                acc[key] = {
                    name: key,
                    LYOct: 0, LYNov: 0, LYDec: 0,
                    ForecastOct: 0, ForecastNov: 0, ForecastDec: 0,
                    // Initialize as null to find first non-null later
                    Recent_Trend_Category: null,
                    Long_Term_Trend_Category: null,
                    Forecast_Summary: null,
                }
            }

            // Capture first valid occurrence of metadata for this group
            if (!acc[key].Recent_Trend_Category && item.Recent_Trend_Category) {
                acc[key].Recent_Trend_Category = item.Recent_Trend_Category;
            }
            if (!acc[key].Long_Term_Trend_Category) {
                const ltt = item.Long_Term_Trend_Category || item["Long-term_Trend_Category"];
                if (ltt) acc[key].Long_Term_Trend_Category = ltt;
            }
            if (!acc[key].Forecast_Summary && item.Forecast_Summary) {
                acc[key].Forecast_Summary = item.Forecast_Summary;
            }

            // LY Logic
            if (item.Date && item.Date.includes('2023-10')) acc[key].LYOct += Number(item.actual) || 0
            if (item.Date && item.Date.includes('2023-11')) acc[key].LYNov += Number(item.actual) || 0
            if (item.Date && item.Date.includes('2023-12')) acc[key].LYDec += Number(item.actual) || 0

            // Forecast Logic
            if (item.Date && item.Date.includes('2024-10')) acc[key].ForecastOct += Number(item.forecast) || 0;
            if (item.Date && item.Date.includes('2024-11')) acc[key].ForecastNov += Number(item.forecast) || 0;
            if (item.Date && item.Date.includes('2024-12')) acc[key].ForecastDec += Number(item.forecast) || 0;

            return acc;
        }, {});

        return Object.values(grouped);
    };

    const childRows = nextLevel ? getChildRows() : [];

    if (childRows.length > 0) {
        return (
            <TableRow>
                <TableCell colSpan={37} className="p-0 border-0">
                    <div className="w-full bg-slate-50/50 pl-4 border-l-4 border-indigo-100">
                        <Table>
                            {/* Inner headers matching outer headers widths if possible, or just a simplified clean header */}
                            <TableHeader className="bg-transparent">
                                <TableRow className="border-b border-gray-200">
                                    <TableHead className="w-[180px]">{nextLevel}</TableHead>
                                    <TableHead className="text-right">LY Oct</TableHead>
                                    <TableHead className="text-right">LY Nov</TableHead>
                                    <TableHead className="text-right">LY Dec</TableHead>
                                    <TableHead className="text-right">Fcst Oct</TableHead>
                                    <TableHead className="text-right">Fcst Nov</TableHead>
                                    <TableHead className="text-right">Fcst Dec</TableHead>
                                    <TableHead className="text-center min-w-[120px]">Recent Trend</TableHead>
                                    <TableHead className="text-center min-w-[120px]">Long Term Trend</TableHead>
                                    <TableHead className="text-center min-w-[120px]">Forecast Summary</TableHead>
                                    <TableHead className="text-center" colSpan={9}>Team Inputs (View Only)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {childRows.map(child => (
                                    <TableRow key={child.name} className="hover:bg-gray-50">
                                        <TableCell className="font-medium max-w-[180px] truncate" title={child.name}>{child.name}</TableCell>
                                        <TableCell className="text-right font-mono text-xs">{Math.round(child.LYOct).toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-xs">{Math.round(child.LYNov).toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-xs">{Math.round(child.LYDec).toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-xs">{Math.round(child.ForecastOct).toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-xs">{Math.round(child.ForecastNov).toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-xs">{Math.round(child.ForecastDec).toLocaleString()}</TableCell>

                                        {/* Intelligence Columns Content */}
                                        <TableCell className="text-center border-r border-gray-200 text-xs font-medium text-orange-800 bg-orange-50/20">
                                            {child.Recent_Trend_Category || "Stable"}
                                        </TableCell>
                                        <TableCell className="text-center border-r border-gray-200 text-xs font-medium text-indigo-800 bg-indigo-50/20">
                                            {child.Long_Term_Trend_Category || "Upward"}
                                        </TableCell>
                                        <TableCell className="text-center border-r border-gray-200 text-xs font-medium text-teal-800 bg-teal-50/20 max-w-[200px] truncate">
                                            {child.Forecast_Summary || "Normal"}
                                        </TableCell>
                                        {/* Simplified Inputs Display - Non-editable in this view primarily to avoid state complexity, or editable if we match keys? */}
                                        {/* Start: Editable Inputs matching main table structure but ignoring complex layout to fit */}
                                        {['oct', 'nov', 'dec'].map(m => (
                                            <React.Fragment key={m}>
                                                <TableCell className="p-1 min-w-[60px] text-xs text-center border-l bg-blue-50/30">
                                                    {teamInputs[child.name]?.sales?.[m]?.value || "-"}
                                                </TableCell>
                                                <TableCell className="p-1 min-w-[60px] text-xs text-center bg-green-50/30">
                                                    {teamInputs[child.name]?.marketing?.[m]?.value || "-"}
                                                </TableCell>
                                                <TableCell className="p-1 min-w-[60px] text-xs text-center bg-purple-50/30">
                                                    {teamInputs[child.name]?.finance?.[m]?.value || "-"}
                                                </TableCell>
                                            </React.Fragment>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TableCell>
            </TableRow>
        )
    }

    // If it's a breakdown level (e.g. Channel -> Depots), show children as inline rows
    // Note: In a real implementation with known hierarchy, you'd map over children here.
    // For this mock, we'll pretend we "drill down" by just showing hypothetical child rows or just the charts.
    // If the user request implies hierarchical expansion is ALREADY handled by the parent passed-in data structure or logic,
    // we should respect that.
    // However, looking at line 347, the previous logic tried to `row.children.map`.
    // If we want "inline within the table", we simply return a React Fragment of TableRows found in children.

    if (row.children && row.children.length > 0) {
        return (
            <>
                {row.children.map(child => (
                    <TableRow key={child.name} className="bg-slate-50 hover:bg-slate-100/80 transition-colors border-l-4 border-l-indigo-400">
                        {/* 1. Name Column (Indented & clean) */}
                        <TableCell className="sticky left-0 bg-slate-50 z-20 border-r border-gray-200 pl-8 h-12 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center gap-2">
                                <CornerDownRight className="w-4 h-4 text-indigo-300" />
                                <span className="text-slate-700 font-medium text-sm">{child.name}</span>
                            </div>
                        </TableCell>

                        {/* 2. LY Values */}
                        <TableCell className="text-right border-r border-gray-200 font-mono text-sm text-slate-600">{Math.round(child.LYOct).toLocaleString()}</TableCell>
                        <TableCell className="text-right border-r border-gray-200 font-mono text-sm text-slate-600">{Math.round(child.LYNov).toLocaleString()}</TableCell>
                        <TableCell className="text-right border-r border-gray-200 font-mono text-sm text-slate-600">{Math.round(child.LYDec).toLocaleString()}</TableCell>

                        {/* 3. Forecast Values */}
                        <TableCell className="text-right border-r border-gray-200 font-mono text-sm text-slate-600">{Math.round(child.ForecastOct).toLocaleString()}</TableCell>
                        <TableCell className="text-right border-r border-gray-200 font-mono text-sm text-slate-600">{Math.round(child.ForecastNov).toLocaleString()}</TableCell>
                        <TableCell className="text-right border-r border-gray-200 font-mono text-sm text-slate-600">{Math.round(child.ForecastDec).toLocaleString()}</TableCell>

                        {/* 4. Consensus Values */}
                        <TableCell className="text-right border-r border-gray-200 font-mono text-sm font-semibold text-slate-800 bg-yellow-50">
                            {(consensusValues[child.name]?.oct ?? Math.round(child.ForecastOct)).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right border-r border-gray-200 font-mono text-sm font-semibold text-slate-800 bg-yellow-50">
                            {(consensusValues[child.name]?.nov ?? Math.round(child.ForecastNov)).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right border-r border-gray-200 font-mono text-sm font-semibold text-slate-800 bg-yellow-50">
                            {(consensusValues[child.name]?.dec ?? Math.round(child.ForecastDec)).toLocaleString()}
                        </TableCell>

                        {/* 5. Intelligence Columns (Placeholders) */}
                        <TableCell className="text-center border-r border-gray-200 text-xs text-slate-300">-</TableCell>
                        <TableCell className="text-center border-r border-gray-200 text-xs text-slate-300">-</TableCell>
                        <TableCell className="text-center border-r border-gray-200 text-xs text-slate-300">-</TableCell>

                        {/* 6. Inputs */}
                        {['oct', 'nov', 'dec'].map(month => (
                            <TeamInputCell
                                key={`child-sales-${month}`}
                                row={child} team="sales" month={month}
                                activeInputs={activeInputs}
                                handleInputFocus={handleInputFocus}
                                handleTeamInputChange={handleTeamInputChange}
                                setActiveInputs={setActiveInputs}
                                colorClass="blue"
                                value={teamInputs[child.name]?.sales?.[month]?.value || ""}
                                comment={teamInputs[child.name]?.sales?.[month]?.comment || ""}
                                owner={teamInputs[child.name]?.sales?.[month]?.owner || ""}
                            />
                        ))}
                        {['oct', 'nov', 'dec'].map(month => (
                            <TeamInputCell
                                key={`child-mkt-${month}`}
                                row={child} team="marketing" month={month}
                                activeInputs={activeInputs}
                                handleInputFocus={handleInputFocus}
                                handleTeamInputChange={handleTeamInputChange}
                                setActiveInputs={setActiveInputs}
                                colorClass="green"
                                value={teamInputs[child.name]?.marketing?.[month]?.value || ""}
                                comment={teamInputs[child.name]?.marketing?.[month]?.comment || ""}
                                owner={teamInputs[child.name]?.marketing?.[month]?.owner || ""}
                            />
                        ))}
                        {['oct', 'nov', 'dec'].map(month => (
                            <TeamInputCell
                                key={`child-fin-${month}`}
                                row={child} team="finance" month={month}
                                activeInputs={activeInputs}
                                handleInputFocus={handleInputFocus}
                                handleTeamInputChange={handleTeamInputChange}
                                setActiveInputs={setActiveInputs}
                                colorClass="purple"
                                value={teamInputs[child.name]?.finance?.[month]?.value || ""}
                                comment={teamInputs[child.name]?.finance?.[month]?.comment || ""}
                                owner={teamInputs[child.name]?.finance?.[month]?.owner || ""}
                            />
                        ))}
                    </TableRow>
                ))}
            </>
        );
    }

    // If no children and we are asked NOT to show charts (blue chart) in this flow:
    return null;
};

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