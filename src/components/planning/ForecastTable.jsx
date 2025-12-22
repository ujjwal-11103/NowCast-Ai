import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
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

    // 3. Group & Sum Data (Oct, Nov, Dec)
    const groupedData = filteredData.reduce((acc, item) => {
        const key = item[itemLevel]
        if (!acc[key]) {
            acc[key] = {
                name: key,
                LYOct: 0, LYNov: 0, LYDec: 0,
                ForecastOct: 0, ForecastNov: 0, ForecastDec: 0,
                // Metadata storage
                salesInputOct: null, salesInputNov: null, salesInputDec: null,
                // Arrays to store raw items for accurate consensus diff calculation
                itemsOct: [], itemsNov: [], itemsDec: []
            }
        }

        // LY Logic (2023)
        if (item.Date.includes('2023-10')) acc[key].LYOct += Number(item.actual) || 0
        if (item.Date.includes('2023-11')) acc[key].LYNov += Number(item.actual) || 0
        if (item.Date.includes('2023-12')) acc[key].LYDec += Number(item.actual) || 0

        // Forecast Logic (2024) & Metadata Capture
        // We accumulate the raw items into arrays so we can sum their ConsensusForecast later
        if (item.Date.includes('2024-10')) {
            acc[key].ForecastOct += Number(item.forecast) || 0;
            acc[key].itemsOct.push(item);
            if (item.salesInput) acc[key].salesInputOct = item.salesInput;
        }
        if (item.Date.includes('2024-11')) {
            acc[key].ForecastNov += Number(item.forecast) || 0;
            acc[key].itemsNov.push(item);
            if (item.salesInput) acc[key].salesInputNov = item.salesInput;
        }
        if (item.Date.includes('2024-12')) {
            acc[key].ForecastDec += Number(item.forecast) || 0;
            acc[key].itemsDec.push(item);
            if (item.salesInput) acc[key].salesInputDec = item.salesInput;
        }

        return acc
    }, {})

    const tableData = Object.values(groupedData).map(item => ({ ...item }))

    const [teamInputs, setTeamInputs] = useState({});
    const [consensusValues, setConsensusValues] = useState({});

    // --- AUTO-FILL & SYNC EFFECT ---
    // This runs whenever 'data' changes (Initial Load OR Chatbot Update)
    useEffect(() => {
        const nextInputs = {};
        const nextConsensus = {};

        tableData.forEach(row => {
            // Helper to process a month
            const processMonth = (items, baselineSum, salesInputMetadata) => {
                // Default: Consensus = Baseline
                let consensusSum = baselineSum;
                let inputData = null;

                // If we have items for this month
                if (items && items.length > 0) {
                    // 1. Calculate the True Consensus from the Data (which API updated)
                    // Note: We use 'ConsensusForecast' if available, else 'forecast'
                    const dataConsensus = items.reduce((sum, item) =>
                        sum + (item.ConsensusForecast !== undefined ? Number(item.ConsensusForecast) : Number(item.forecast)), 0);

                    // 2. If Chatbot updated this row, we will have salesInputMetadata
                    // OR if the Data Consensus differs from Baseline (Manual or API)
                    if (salesInputMetadata) {
                        // The Delta is what we show in the Input Box
                        const delta = dataConsensus - baselineSum;

                        inputData = {
                            value: Math.round(delta), // Show +20, -50, etc.
                            comment: salesInputMetadata.comment,
                            owner: salesInputMetadata.owner
                        };

                        // Set Consensus to the Data Value
                        consensusSum = dataConsensus;
                    }
                }

                return { consensus: consensusSum, input: inputData };
            };

            const octResult = processMonth(row.itemsOct, row.ForecastOct, row.salesInputOct);
            const novResult = processMonth(row.itemsNov, row.ForecastNov, row.salesInputNov);
            const decResult = processMonth(row.itemsDec, row.ForecastDec, row.salesInputDec);

            // Update Inputs State (Only if inputData exists)
            if (octResult.input || novResult.input || decResult.input) {
                if (!nextInputs[row.name]) nextInputs[row.name] = { sales: {}, marketing: {}, finance: {} };
                if (octResult.input) nextInputs[row.name].sales.oct = octResult.input;
                if (novResult.input) nextInputs[row.name].sales.nov = novResult.input;
                if (decResult.input) nextInputs[row.name].sales.dec = decResult.input;
            }

            // Update Consensus State
            nextConsensus[row.name] = {
                oct: Math.round(octResult.consensus),
                nov: Math.round(novResult.consensus),
                dec: Math.round(decResult.consensus)
            };
        });

        setTeamInputs(nextInputs);
        setConsensusValues(nextConsensus);

    }, [data, selections]);


    // Handle MANUAL input changes
    const handleTeamInputChange = (itemName, team, month, field, value) => {
        setTeamInputs(prev => {
            const newInputs = { ...prev };
            if (!newInputs[itemName]) newInputs[itemName] = { sales: {}, marketing: {}, finance: {} };
            if (!newInputs[itemName][team]) newInputs[itemName][team] = {};
            if (!newInputs[itemName][team][month]) newInputs[itemName][team][month] = {};

            newInputs[itemName][team][month][field] = value;

            // Recalculate Consensus for this row immediately (Client Side Calc)
            const row = tableData.find(r => r.name === itemName);
            if (row) {
                const getVal = (t, m) => parseFloat(newInputs[itemName]?.[t]?.[m]?.value) || 0;
                const calcMonth = (m, base) => base + getVal('sales', m) + getVal('marketing', m) + getVal('finance', m);

                setConsensusValues(curr => ({
                    ...curr,
                    [itemName]: {
                        ...curr[itemName], // Keep other months
                        [month]: Math.round(calcMonth(month, row[`Forecast${month.charAt(0).toUpperCase() + month.slice(1)}`]))
                    }
                }));
            }
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
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]">{itemLevel}</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Last Year Values</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Baseline Forecast</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Consensus</TableHead>
                                    <TableHead colSpan={9} className="text-center border-r border-gray-200 bg-blue-50">Sales Team</TableHead>
                                    <TableHead colSpan={9} className="text-center border-r border-gray-200 bg-green-50">Marketing Team</TableHead>
                                    <TableHead colSpan={9} className="text-center bg-purple-50">Finance Team</TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]"></TableHead>
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
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]"></TableHead>
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
                                            {['oct', 'nov', 'dec'].map(month => (<TeamInputCell key={`mkt-${month}`} row={row} team="marketing" month={month} activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="green" value="" comment="" owner="" />))}
                                            {['oct', 'nov', 'dec'].map(month => (<TeamInputCell key={`fin-${month}`} row={row} team="finance" month={month} activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="purple" value="" comment="" owner="" />))}
                                        </TableRow>
                                        {/* Waterfall Charts */}
                                        {expandedItems[row.name] && (
                                            <TableRow className="bg-white">
                                                <TableCell colSpan={37} className="p-0">
                                                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {['oct', 'nov', 'dec'].map(m => (
                                                            <div key={m} className="border rounded-lg overflow-hidden">
                                                                <div className="px-4 py-3 bg-gray-100 font-medium capitalize">{row.name} - {m} Waterfall</div>
                                                                <div className="p-4">
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