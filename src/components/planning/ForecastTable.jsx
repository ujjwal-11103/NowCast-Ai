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

    console.log("global data ", data);


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
                // Store metadata if available on any item in group
                salesInputOct: null, salesInputNov: null, salesInputDec: null
            }
        }

        // LY Logic (2023)
        if (item.Date.includes('2023-10')) acc[key].LYOct += Number(item.actual) || 0
        if (item.Date.includes('2023-11')) acc[key].LYNov += Number(item.actual) || 0
        if (item.Date.includes('2023-12')) acc[key].LYDec += Number(item.actual) || 0

        // Forecast Logic (2024) & Metadata Capture
        if (item.Date.includes('2024-10')) {
            acc[key].ForecastOct += Number(item.forecast) || 0;
            if (item.salesInput) acc[key].salesInputOct = item.salesInput;
        }
        if (item.Date.includes('2024-11')) {
            acc[key].ForecastNov += Number(item.forecast) || 0;
            if (item.salesInput) acc[key].salesInputNov = item.salesInput;
        }
        if (item.Date.includes('2024-12')) {
            acc[key].ForecastDec += Number(item.forecast) || 0;
            if (item.salesInput) acc[key].salesInputDec = item.salesInput;
        }

        return acc
    }, {})

    const tableData = Object.values(groupedData).map(item => ({ ...item }))

    // State for Inputs and Consensus
    const [teamInputs, setTeamInputs] = useState({});
    const [consensusValues, setConsensusValues] = useState({});

    // --- AUTO-FILL & SYNC EFFECT ---
    // This runs whenever 'data' changes (i.e. Chatbot updates Context)
    useEffect(() => {
        const nextInputs = { ...teamInputs };
        const nextConsensus = {};
        console.log("runned");


        tableData.forEach(row => {

            console.log("row", row);

            // 1. Calculate Consensus Base (Forecast + Existing Inputs)
            let conOct = row.ForecastOct;
            let conNov = row.ForecastNov;
            let conDec = row.ForecastDec;

            // 2. Check for API Updates (Metadata attached to row)
            // If API sent updates, we populate the 'Sales' input fields

            // OCT
            if (row.salesInputOct) {
                if (!nextInputs[row.name]) nextInputs[row.name] = { sales: {}, marketing: {}, finance: {} };
                nextInputs[row.name].sales = {
                    ...nextInputs[row.name].sales,
                    oct: {
                        value: row.salesInputOct.value, // The delta
                        comment: row.salesInputOct.comment,
                        owner: row.salesInputOct.owner
                    }
                };
            }
            // NOV
            if (row.salesInputNov) {
                if (!nextInputs[row.name]) nextInputs[row.name] = { sales: {}, marketing: {}, finance: {} };
                nextInputs[row.name].sales = {
                    ...nextInputs[row.name].sales,
                    nov: {
                        value: row.salesInputNov.value,
                        comment: row.salesInputNov.comment,
                        owner: row.salesInputNov.owner
                    }
                };
            }
            // DEC
            if (row.salesInputDec) {
                if (!nextInputs[row.name]) nextInputs[row.name] = { sales: {}, marketing: {}, finance: {} };
                nextInputs[row.name].sales = {
                    ...nextInputs[row.name].sales,
                    dec: {
                        value: row.salesInputDec.value,
                        comment: row.salesInputDec.comment,
                        owner: row.salesInputDec.owner
                    }
                };
            }

            // 3. Calculate Final Consensus (Forecast + Inputs)
            // We read from 'nextInputs' to ensure we capture both manual and API inputs
            const getVal = (t, m) => parseFloat(nextInputs[row.name]?.[t]?.[m]?.value) || 0;

            conOct += getVal('sales', 'oct') + getVal('marketing', 'oct') + getVal('finance', 'oct');
            conNov += getVal('sales', 'nov') + getVal('marketing', 'nov') + getVal('finance', 'nov');
            conDec += getVal('sales', 'dec') + getVal('marketing', 'dec') + getVal('finance', 'dec');

            nextConsensus[row.name] = {
                oct: Math.round(conOct),
                nov: Math.round(conNov),
                dec: Math.round(conDec)
            };
        });

        setTeamInputs(nextInputs);
        setConsensusValues(nextConsensus);

    }, [data, selections]); // Dependency on data ensures it updates when Chatbot acts


    // Handle MANUAL input changes (User typing)
    const handleTeamInputChange = (itemName, team, month, field, value) => {
        setTeamInputs(prev => {
            const newInputs = { ...prev };
            if (!newInputs[itemName]) newInputs[itemName] = { sales: {}, marketing: {}, finance: {} };
            if (!newInputs[itemName][team]) newInputs[itemName][team] = {};
            if (!newInputs[itemName][team][month]) newInputs[itemName][team][month] = {};

            newInputs[itemName][team][month][field] = value;

            // Recalculate Consensus for this row immediately
            const row = tableData.find(r => r.name === itemName);
            if (row) {
                const getVal = (t, m) => parseFloat(newInputs[itemName]?.[t]?.[m]?.value) || 0;

                // Helper to recalc a specific month
                const calcMonth = (m, base) => base + getVal('sales', m) + getVal('marketing', m) + getVal('finance', m);

                setConsensusValues(curr => ({
                    ...curr,
                    [itemName]: {
                        oct: Math.round(calcMonth('oct', row.ForecastOct)),
                        nov: Math.round(calcMonth('nov', row.ForecastNov)),
                        dec: Math.round(calcMonth('dec', row.ForecastDec))
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
                                {/* Keep your existing Headers exactly as you sent them */}
                                <TableRow>
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]">{itemLevel}</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Last Year Values</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Baseline Forecast</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Consensus</TableHead>
                                    <TableHead colSpan={9} className="text-center border-r border-gray-200 bg-blue-50">Sales Team</TableHead>
                                    <TableHead colSpan={9} className="text-center border-r border-gray-200 bg-green-50">Marketing Team</TableHead>
                                    <TableHead colSpan={9} className="text-center bg-purple-50">Finance Team</TableHead>
                                </TableRow>
                                {/* ... Row 2 and Row 3 Headers (Month Names and Input Labels) - Keep same as previous version ... */}
                                {/* I am omitting them here for brevity, but assume they are identical to your provided code */}
                                <TableRow>
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]"></TableHead>
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
                                                {consensusValues[row.name]?.oct.toLocaleString() || Math.round(row.ForecastOct).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono font-semibold bg-yellow-50">
                                                {consensusValues[row.name]?.nov.toLocaleString() || Math.round(row.ForecastNov).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono font-semibold bg-yellow-50">
                                                {consensusValues[row.name]?.dec.toLocaleString() || Math.round(row.ForecastDec).toLocaleString()}
                                            </TableCell>

                                            {/* Sales Inputs - now controlled by teamInputs state */}
                                            {['oct', 'nov', 'dec'].map(month => (
                                                <TeamInputCell
                                                    key={`sales-${month}`}
                                                    row={row} team="sales" month={month}
                                                    activeInputs={activeInputs}
                                                    handleInputFocus={handleInputFocus}
                                                    handleTeamInputChange={handleTeamInputChange}
                                                    setActiveInputs={setActiveInputs}
                                                    colorClass="blue"
                                                    // Pass values from state so they show up when API populates them
                                                    value={teamInputs[row.name]?.sales?.[month]?.value || ""}
                                                    comment={teamInputs[row.name]?.sales?.[month]?.comment || ""}
                                                    owner={teamInputs[row.name]?.sales?.[month]?.owner || ""}
                                                />
                                            ))}

                                            {/* Marketing & Finance Inputs (Manual for now) */}
                                            {['oct', 'nov', 'dec'].map(month => (
                                                <TeamInputCell key={`mkt-${month}`} row={row} team="marketing" month={month} activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="green" value="" comment="" owner="" />
                                            ))}
                                            {['oct', 'nov', 'dec'].map(month => (
                                                <TeamInputCell key={`fin-${month}`} row={row} team="finance" month={month} activeInputs={activeInputs} handleInputFocus={handleInputFocus} handleTeamInputChange={handleTeamInputChange} setActiveInputs={setActiveInputs} colorClass="purple" value="" comment="" owner="" />
                                            ))}

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

// Updated Helper Component to accept 'value', 'comment', 'owner' props
const TeamInputCell = ({ row, team, month, activeInputs, handleInputFocus, handleTeamInputChange, setActiveInputs, colorClass, value, comment, owner }) => {
    const borderColors = { blue: "border-blue-200 focus:ring-blue-300", green: "border-green-200 focus:ring-green-300", purple: "border-purple-200 focus:ring-purple-300" };
    const btnColors = { blue: "bg-blue-600", green: "bg-green-600", purple: "bg-purple-600" };

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
                            placeholder="Val"
                            value={value} // Controlled input
                        />
                    </div>
                    <div className="flex-1 min-w-[120px] p-1">
                        <input
                            type="text"
                            className={`w-full p-2 text-sm border rounded-md focus:ring-2 ${borderColors[colorClass]}`}
                            onChange={(e) => handleTeamInputChange(row.name, team, month, 'comment', e.target.value)}
                            onFocus={() => handleInputFocus(row.name, team, month)}
                            placeholder="Cmnt"
                            value={comment} // Controlled input
                        />
                    </div>
                    <div className="flex-1 min-w-[120px] p-1">
                        <input
                            type="text"
                            className={`w-full p-2 text-sm border rounded-md focus:ring-2 ${borderColors[colorClass]}`}
                            onChange={(e) => handleTeamInputChange(row.name, team, month, 'owner', e.target.value)}
                            onFocus={() => handleInputFocus(row.name, team, month)}
                            placeholder="Ownr"
                            value={owner} // Controlled input
                        />
                    </div>
                </div>
                {activeInputs[`${row.name}-${team}-${month}`] && (
                    <div className="p-1 border-t border-gray-200">
                        <button className={`w-full text-white px-3 py-1 rounded text-sm ${btnColors[colorClass]}`} onClick={() => setActiveInputs(prev => ({ ...prev, [`${row.name}-${team}-${month}`]: false }))}>
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