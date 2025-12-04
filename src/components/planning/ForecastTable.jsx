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

const ForecastTable = forwardRef(({ data, selections, onPivotRequest }, ref) => {

    // 1. Determine Hierarchy
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

    // 2. Filter Data
    const filteredData = data.filter(item => {
        return selections.every(sel => {
            if (sel.field === itemLevel) return true
            if (sel.value === 'All') return true
            return item[sel.field] === sel.value
        })
    })

    // 3. Group & Sum Data (UPDATED FOR OCT, NOV, DEC)
    const groupedData = filteredData.reduce((acc, item) => {
        const key = item[itemLevel]
        if (!acc[key]) {
            acc[key] = {
                name: key,
                // Initialize 3 months for LY
                LYOct: 0, LYNov: 0, LYDec: 0,
                // Initialize 3 months for Forecast
                ForecastOct: 0, ForecastNov: 0, ForecastDec: 0
            }
        }

        // LOGIC: Summing based on specific date strings
        // Assuming LY is 2023 and Forecast is 2024 based on your data
        if (item.Date.includes('2023-10')) acc[key].LYOct += Number(item.actual) || 0
        if (item.Date.includes('2023-11')) acc[key].LYNov += Number(item.actual) || 0
        if (item.Date.includes('2023-12')) acc[key].LYDec += Number(item.actual) || 0

        if (item.Date.includes('2024-10')) acc[key].ForecastOct += Number(item.forecast) || 0
        if (item.Date.includes('2024-11')) acc[key].ForecastNov += Number(item.forecast) || 0
        if (item.Date.includes('2024-12')) acc[key].ForecastDec += Number(item.forecast) || 0

        return acc
    }, {})

    const tableData = Object.values(groupedData).map(item => ({ ...item }))

    // 4. Initialize Consensus (Equal to Forecast initially)
    const [consensusValues, setConsensusValues] = useState(
        tableData.reduce((acc, item) => {
            acc[item.name] = {
                oct: Math.round(item.ForecastOct),
                nov: Math.round(item.ForecastNov),
                dec: Math.round(item.ForecastDec)
            };
            return acc;
        }, {})
    );

    const [teamInputs, setTeamInputs] = useState({});

    // 5. Handle Team Inputs (Updated for 3 months)
    const handleTeamInputChange = (itemName, team, month, field, value) => {
        setTeamInputs(prev => {
            const newInputs = {
                ...prev,
                [itemName]: {
                    ...prev[itemName],
                    [team]: {
                        ...prev[itemName]?.[team],
                        [month]: {
                            ...prev[itemName]?.[team]?.[month],
                            [field]: value
                        }
                    }
                }
            };

            // Helper to get value safely
            const getVal = (t, m) => parseFloat(newInputs[itemName]?.[t]?.[m]?.value) || 0;

            // Calculate for Oct
            const salesOct = getVal('sales', 'oct');
            const mktOct = getVal('marketing', 'oct');
            const finOct = getVal('finance', 'oct');

            // Calculate for Nov
            const salesNov = getVal('sales', 'nov');
            const mktNov = getVal('marketing', 'nov');
            const finNov = getVal('finance', 'nov');

            // Calculate for Dec
            const salesDec = getVal('sales', 'dec');
            const mktDec = getVal('marketing', 'dec');
            const finDec = getVal('finance', 'dec');

            // Get Baselines
            const row = tableData.find(item => item.name === itemName);
            const baseOct = Math.round(row?.ForecastOct || 0);
            const baseNov = Math.round(row?.ForecastNov || 0);
            const baseDec = Math.round(row?.ForecastDec || 0);

            setConsensusValues(prev => ({
                ...prev,
                [itemName]: {
                    oct: baseOct + salesOct + mktOct + finOct,
                    nov: baseNov + salesNov + mktNov + finNov,
                    dec: baseDec + salesDec + mktDec + finDec
                }
            }));

            return newInputs;
        });
    };

    const { isSidebarOpen } = useSidebar();
    const [activeInputs, setActiveInputs] = useState({});
    const handleInputFocus = (itemName, team, month) => {
        setActiveInputs(prev => ({ ...prev, [`${itemName}-${team}-${month}`]: true }));
    };

    const [expandedItems, setExpandedItems] = useState({});
    const toggleItemExpansion = (itemName) => {
        setExpandedItems(prev => ({ ...prev, [itemName]: !prev[itemName] }));
    };

    useImperativeHandle(ref, () => ({
        getTableData: () => tableData,
        getFilteredData: () => filteredData,
        getGroupedData: () => groupedData
    }));

    return (
        <div className={`space-y-4 ${isSidebarOpen ? "w-[76.6vw]" : "w-[90.6vw]"}`}>
            <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200 p-0">
                <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Forecast Data (Q4)</h3>
                    <Button
                        variant="outline"
                        onClick={() => onPivotRequest(tableData)}
                        className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                        <Table2 className="w-4 h-4" />
                        Pivot Analysis
                    </Button>
                </div>
                <ScrollArea className="w-100 whitespace-nowrap rounded-b-md">
                    <div className="">
                        <Table>
                            <TableHeader className="bg-white">
                                {/* Row 1: Main Categories */}
                                <TableRow>
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]">
                                        {itemLevel}
                                    </TableHead>
                                    {/* Updated ColSpans for 3 months */}
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Last Year Values</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Baseline Forecast '24</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Consensus</TableHead>
                                    <TableHead colSpan={9} className="text-center border-r border-gray-200 bg-blue-50">Sales Team</TableHead>
                                    <TableHead colSpan={9} className="text-center border-r border-gray-200 bg-green-50">Marketing Team</TableHead>
                                    <TableHead colSpan={9} className="text-center bg-purple-50">Finance Team</TableHead>
                                </TableRow>

                                {/* Row 2: Months */}
                                <TableRow>
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]"></TableHead>

                                    {/* LY */}
                                    <TableHead className="text-center border-r border-gray-200 font-semibold">Oct</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 font-semibold">Nov</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 font-semibold">Dec</TableHead>

                                    {/* Forecast */}
                                    <TableHead className="text-center border-r border-gray-200">Oct</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Nov</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Dec</TableHead>

                                    {/* Consensus */}
                                    <TableHead className="text-center border-r border-gray-200">Oct</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Nov</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Dec</TableHead>

                                    {/* Sales */}
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Oct</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Nov</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Dec</TableHead>

                                    {/* Marketing */}
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Oct</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Nov</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Dec</TableHead>

                                    {/* Finance */}
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Oct</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Nov</TableHead>
                                    <TableHead colSpan={3} className="text-center">Dec</TableHead>
                                </TableRow>

                                {/* Row 3: Input Labels */}
                                <TableRow>
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]"></TableHead>

                                    {/* Placeholders for non-input columns */}
                                    {[...Array(9)].map((_, i) => <TableHead key={i} className="text-center border-r border-gray-200"></TableHead>)}

                                    {/* Repeat Inputs for Sales (Oct, Nov, Dec) */}
                                    {[1, 2, 3].map((i) => (
                                        <React.Fragment key={`sales-${i}`}>
                                            <TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead>
                                            <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead>
                                            <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Owner</TableHead>
                                        </React.Fragment>
                                    ))}
                                    {/* Repeat Inputs for Marketing */}
                                    {[1, 2, 3].map((i) => (
                                        <React.Fragment key={`mkt-${i}`}>
                                            <TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead>
                                            <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead>
                                            <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Owner</TableHead>
                                        </React.Fragment>
                                    ))}
                                    {/* Repeat Inputs for Finance */}
                                    {[1, 2, 3].map((i) => (
                                        <React.Fragment key={`fin-${i}`}>
                                            <TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead>
                                            <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead>
                                            <TableHead className="text-center min-w-[120px]">Owner</TableHead>
                                        </React.Fragment>
                                    ))}
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

                                            {/* Consensus Values */}
                                            <TableCell className="text-right border-r border-gray-200 font-mono">
                                                {consensusValues[row.name]?.oct.toLocaleString() || Math.round(row.ForecastOct).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono">
                                                {consensusValues[row.name]?.nov.toLocaleString() || Math.round(row.ForecastNov).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono">
                                                {consensusValues[row.name]?.dec.toLocaleString() || Math.round(row.ForecastDec).toLocaleString()}
                                            </TableCell>

                                            {/* Sales Inputs (Oct, Nov, Dec) */}
                                            <TeamInputCell row={row} team="sales" month="oct" activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="blue" />
                                            <TeamInputCell row={row} team="sales" month="nov" activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="blue" />
                                            <TeamInputCell row={row} team="sales" month="dec" activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="blue" />

                                            {/* Marketing Inputs */}
                                            <TeamInputCell row={row} team="marketing" month="oct" activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="green" />
                                            <TeamInputCell row={row} team="marketing" month="nov" activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="green" />
                                            <TeamInputCell row={row} team="marketing" month="dec" activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="green" />

                                            {/* Finance Inputs */}
                                            <TeamInputCell row={row} team="finance" month="oct" activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="purple" />
                                            <TeamInputCell row={row} team="finance" month="nov" activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="purple" />
                                            <TeamInputCell row={row} team="finance" month="dec" activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="purple" />
                                        </TableRow>

                                        {/* Waterfall Charts (3 Charts Now) */}
                                        {expandedItems[row.name] && (
                                            <TableRow className="bg-white">
                                                <TableCell colSpan={37} className="p-0">
                                                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {/* Oct Waterfall */}
                                                        <div className="border rounded-lg overflow-hidden">
                                                            <div className="px-4 py-3 bg-gray-100 font-medium">{row.name} - Oct Waterfall</div>
                                                            <div className="p-4">
                                                                <WaterfallChart data={[
                                                                    { label: "Forecast", value: row.ForecastOct },
                                                                    { label: "Sales", value: teamInputs[row.name]?.sales?.oct?.value || 0 },
                                                                    { label: "Marketing", value: teamInputs[row.name]?.marketing?.oct?.value || 0 },
                                                                    { label: "Finance", value: teamInputs[row.name]?.finance?.oct?.value || 0 },
                                                                    { label: "Consensus", value: consensusValues[row.name]?.oct }
                                                                ]} />
                                                            </div>
                                                        </div>
                                                        {/* Nov Waterfall */}
                                                        <div className="border rounded-lg overflow-hidden">
                                                            <div className="px-4 py-3 bg-gray-100 font-medium">{row.name} - Nov Waterfall</div>
                                                            <div className="p-4">
                                                                <WaterfallChart data={[
                                                                    { label: "Forecast", value: row.ForecastNov },
                                                                    { label: "Sales", value: teamInputs[row.name]?.sales?.nov?.value || 0 },
                                                                    { label: "Marketing", value: teamInputs[row.name]?.marketing?.nov?.value || 0 },
                                                                    { label: "Finance", value: teamInputs[row.name]?.finance?.nov?.value || 0 },
                                                                    { label: "Consensus", value: consensusValues[row.name]?.nov }
                                                                ]} />
                                                            </div>
                                                        </div>
                                                        {/* Dec Waterfall */}
                                                        <div className="border rounded-lg overflow-hidden">
                                                            <div className="px-4 py-3 bg-gray-100 font-medium">{row.name} - Dec Waterfall</div>
                                                            <div className="p-4">
                                                                <WaterfallChart data={[
                                                                    { label: "Forecast", value: row.ForecastDec },
                                                                    { label: "Sales", value: teamInputs[row.name]?.sales?.dec?.value || 0 },
                                                                    { label: "Marketing", value: teamInputs[row.name]?.marketing?.dec?.value || 0 },
                                                                    { label: "Finance", value: teamInputs[row.name]?.finance?.dec?.value || 0 },
                                                                    { label: "Consensus", value: consensusValues[row.name]?.dec }
                                                                ]} />
                                                            </div>
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

// Helper Component to reduce repetition
const TeamInputCell = ({ row, team, month, activeInputs, handleInputFocus, handleTeamInputChange, setActiveInputs, colorClass }) => {
    const borderColors = {
        blue: "border-blue-200 focus:ring-blue-300 focus:border-blue-500",
        green: "border-green-200 focus:ring-green-300 focus:border-green-500",
        purple: "border-purple-200 focus:ring-purple-300 focus:border-purple-500"
    };

    const btnColors = {
        blue: "bg-blue-600 hover:bg-blue-700",
        green: "bg-green-600 hover:bg-green-700",
        purple: "bg-purple-600 hover:bg-purple-700"
    };

    return (
        <TableCell colSpan={3} className="border-r border-gray-200 p-0">
            <div className="flex flex-col">
                <div className="flex">
                    <div className="flex-1 min-w-[80px] p-1">
                        <input
                            type="number"
                            className={`w-full p-2 text-sm border rounded-md focus:ring-2 ${borderColors[colorClass]}`}
                            onChange={(e) => handleTeamInputChange(row.name, team, month, 'value', e.target.value)}
                            onFocus={() => handleInputFocus(row.name, team, month)}
                            placeholder="Value"
                        />
                    </div>
                    <div className="flex-1 min-w-[120px] p-1">
                        <input
                            type="text"
                            className={`w-full p-2 text-sm border rounded-md focus:ring-2 ${borderColors[colorClass]}`}
                            onChange={(e) => handleTeamInputChange(row.name, team, month, 'comment', e.target.value)}
                            onFocus={() => handleInputFocus(row.name, team, month)}
                            placeholder="Comment"
                        />
                    </div>
                    <div className="flex-1 min-w-[120px] p-1">
                        <input
                            type="text"
                            className={`w-full p-2 text-sm border rounded-md focus:ring-2 ${borderColors[colorClass]}`}
                            onChange={(e) => handleTeamInputChange(row.name, team, month, 'owner', e.target.value)}
                            onFocus={() => handleInputFocus(row.name, team, month)}
                            placeholder="Owner"
                        />
                    </div>
                </div>
                {activeInputs[`${row.name}-${team}-${month}`] && (
                    <div className="p-1 border-t border-gray-200">
                        <button
                            className={`w-full text-white px-3 py-1 rounded text-sm transition-colors ${btnColors[colorClass]}`}
                            onClick={() => {
                                console.log(`Submitting ${team} ${month} data for`, row.name);
                                setActiveInputs(prev => ({
                                    ...prev,
                                    [`${row.name}-${team}-${month}`]: false
                                }));
                            }}
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
        </TableCell>
    );
};

ForecastTable.displayName = 'ForecastTable';

export default ForecastTable;