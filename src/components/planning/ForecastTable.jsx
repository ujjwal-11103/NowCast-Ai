import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import WaterfallSection from './WaterfallSection'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useSidebar } from '@/context/sidebar/SidebarContext'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


import { ChevronDown, Table2 } from 'lucide-react';
import WaterfallChart from './WaterfallChart'


const ForecastTable = forwardRef(({ data, selections, onPivotRequest }, ref) => {
    // Define the hierarchy levels in order from most general to most specific
    const hierarchyLevels = ['Channel', 'Chain', 'Depot', 'SubCat', 'SKU']

    // Determine which level to show in Item column
    const getItemLevel = () => {
        // Create a map of selection values for easy lookup
        const selectionMap = {}
        selections.forEach(sel => {
            selectionMap[sel.field] = sel.value
        })

        // Special case: If all levels below Channel are "All", show Channels
        if (selectionMap.Chain === 'All') return 'Channel'
        if (selectionMap.Depot === 'All') return 'Chain'
        if (selectionMap.SubCat === 'All') return 'Depot'
        if (selectionMap.SKU === 'All') return 'SubCat'

        // Default to most specific level if no "All" selections
        return 'SKU'
    }

    const itemLevel = getItemLevel()

    // Filter data based on selections (excluding the item level)
    const filteredData = data.filter(item => {
        return selections.every(sel => {
            // Skip filtering for the item level we're showing
            if (sel.field === itemLevel) return true

            // Include all if "All" is selected
            if (sel.value === 'All') return true

            // Otherwise filter by exact match
            return item[sel.field] === sel.value
        })
    })

    // Group data by the item level and calculate sums
    const groupedData = filteredData.reduce((acc, item) => {
        const key = item[itemLevel]
        if (!acc[key]) {
            acc[key] = {
                name: key,
                LYJan: 0,
                LYFeb: 0,
                ForecastJan: 0,
                ForecastFeb: 0
            }
        }

        // Sum values based on date
        if (item.Date.includes('2024-01')) acc[key].LYJan += item.actual || 0
        if (item.Date.includes('2024-02')) acc[key].LYFeb += item.actual || 0
        if (item.Date.includes('2025-01')) acc[key].ForecastJan += item.forecast || 0
        if (item.Date.includes('2025-02')) acc[key].ForecastFeb += item.forecast || 0

        return acc
    }, {})

    // Convert to array and calculate L2F/L2A ratio
    const tableData = Object.values(groupedData).map(item => ({
        ...item,
        //previosuly there was a cloumn for L2FL2A so calculating here 
        // L2FL2A: (item.LYJan + item.LYFeb) > 0
        //     ? ((item.ForecastJan + item.ForecastFeb) / (item.LYJan + item.LYFeb)).toFixed(2)
        //     : 'N/A'
    }))
    
    
    // State to track team inputs and consensus values
    const [teamInputs, setTeamInputs] = useState({});
    const [consensusValues, setConsensusValues] = useState(
        tableData.reduce((acc, item) => {
            acc[item.name] = {
                jan: Math.round(item.ForecastJan),
                feb: Math.round(item.ForecastFeb)
            };
            return acc;
        }, {})
    );
    console.log("old Consensus ", consensusValues);
    console.log("tableData", tableData);


    // Handle input changes for team fields
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

            // Calculate new consensus values
            const salesJan = parseFloat(newInputs[itemName]?.sales?.jan?.value) || 0;
            const salesFeb = parseFloat(newInputs[itemName]?.sales?.feb?.value) || 0;
            const marketingJan = parseFloat(newInputs[itemName]?.marketing?.jan?.value) || 0;
            const marketingFeb = parseFloat(newInputs[itemName]?.marketing?.feb?.value) || 0;
            const financeJan = parseFloat(newInputs[itemName]?.finance?.jan?.value) || 0;
            const financeFeb = parseFloat(newInputs[itemName]?.finance?.feb?.value) || 0;

            // Original forecast values
            const originalJan = Math.round(tableData.find(item => item.name === itemName)?.ForecastJan || 0);
            const originalFeb = Math.round(tableData.find(item => item.name === itemName)?.ForecastFeb || 0);

            setConsensusValues(prev => ({
                ...prev,
                [itemName]: {
                    jan: originalJan + salesJan + marketingJan + financeJan,
                    feb: originalFeb + salesFeb + marketingFeb + financeFeb
                }
            }));

            console.log("New Inputs ", newInputs);
            console.log("New Consensus ", consensusValues);
            return newInputs;

        });
    };

    const { isSidebarOpen, toggleSidebar } = useSidebar(); // Get sidebar state and toggle function

    // logic for submit buttons

    const [activeInputs, setActiveInputs] = useState({});

    // Helper function to update active inputs
    const handleInputFocus = (itemName, team, month) => {
        setActiveInputs(prev => ({
            ...prev,
            [`${itemName}-${team}-${month}`]: true
        }));
    };

    //logic for integrating waterfall charts directly into the table after every item
    const [expandedItems, setExpandedItems] = useState({});

    const toggleItemExpansion = (itemName) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemName]: !prev[itemName]
        }));
    };

    // Expose the table data via ref
    useImperativeHandle(ref, () => ({
        getTableData: () => tableData,
        getFilteredData: () => filteredData,
        getGroupedData: () => groupedData
    }));

    return (
        <div className={`space-y-4 ${isSidebarOpen ? "w-[76.6vw]" : "w-[90.6vw]"}`}>
            <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200 p-0">
                <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Forecast Data & Team Comments</h3>
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
                                {/* First Header Row */}
                                <TableRow>
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]">
                                        {itemLevel}
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center border-r border-gray-200">
                                        Last Year Values
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center border-r border-gray-200">
                                        Baseline Forecast
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center border-r border-gray-200">
                                        Consensus
                                    </TableHead>
                                    <TableHead colSpan={6} className="text-center border-r border-gray-200 bg-blue-50">
                                        Sales Team
                                    </TableHead>
                                    <TableHead colSpan={6} className="text-center border-r border-gray-200 bg-green-50">
                                        Marketing Team
                                    </TableHead>
                                    <TableHead colSpan={6} className="text-center bg-purple-50">
                                        Finance Team
                                    </TableHead>
                                </TableRow>

                                {/* Second Header Row */}
                                <TableRow>
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]"></TableHead>

                                    {/* Last Year */}
                                    <TableHead className="text-center border-r border-gray-200">Jan</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Feb</TableHead>

                                    {/* Baseline Forecast */}
                                    <TableHead className="text-center border-r border-gray-200">Jan</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Feb</TableHead>

                                    {/* Consensus */}
                                    <TableHead className="text-center border-r border-gray-200">Jan</TableHead>
                                    <TableHead className="text-center border-r border-gray-200">Feb</TableHead>

                                    {/* Sales Team */}
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Jan</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Feb</TableHead>

                                    {/* Marketing Team */}
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Jan</TableHead>
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Feb</TableHead>

                                    {/* Finance Team */}
                                    <TableHead colSpan={3} className="text-center border-r border-gray-200">Jan</TableHead>
                                    <TableHead colSpan={3} className="text-center">Feb</TableHead>
                                </TableRow>

                                {/* Third Header Row */}
                                <TableRow>
                                    <TableHead className="border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[150px]"></TableHead>

                                    {/* Last Year */}
                                    <TableHead className="text-center border-r border-gray-200"></TableHead>
                                    <TableHead className="text-center border-r border-gray-200"></TableHead>

                                    {/* Baseline Forecast */}
                                    <TableHead className="text-center border-r border-gray-200"></TableHead>
                                    <TableHead className="text-center border-r border-gray-200"></TableHead>

                                    {/* Consensus */}
                                    <TableHead className="text-center border-r border-gray-200"></TableHead>
                                    <TableHead className="text-center border-r border-gray-200"></TableHead>

                                    {/* Sales Team */}
                                    <TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Owner</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Owner</TableHead>

                                    {/* Marketing Team */}
                                    <TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Owner</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Owner</TableHead>

                                    {/* Finance Team */}
                                    <TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Owner</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[80px]">Value</TableHead>
                                    <TableHead className="text-center border-r border-gray-200 min-w-[120px]">Comment</TableHead>
                                    <TableHead className="text-center min-w-[120px]">Owner</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {tableData.map((row) => (
                                    <>
                                        {/* Main Data Row */}
                                        <TableRow key={row.name} className="bg-white hover:bg-gray-50 group">
                                            {/* Item Level - Make clickable */}
                                            <TableCell className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 min-w-[180px] border-r border-gray-200">
                                                <button
                                                    onClick={() => toggleItemExpansion(row.name)}
                                                    className="flex items-center w-full text-left font-medium text-gray-800 hover:text-indigo-600 transition-colors"
                                                >
                                                    {row.name}
                                                    <ChevronDown
                                                        className={`ml-2 h-4 w-4 transition-transform ${expandedItems[row.name] ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </button>
                                            </TableCell>

                                            {/* Last Year Values */}
                                            <TableCell className="text-right border-r border-gray-200 font-mono">
                                                {Math.round(row.LYJan).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono">
                                                {Math.round(row.LYFeb).toLocaleString()}
                                            </TableCell>

                                            {/* Baseline Forecast */}
                                            <TableCell className="text-right border-r border-gray-200 font-mono">
                                                {Math.round(row.ForecastJan).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono">
                                                {Math.round(row.ForecastFeb).toLocaleString()}
                                            </TableCell>

                                            {/* Consensus */}
                                            <TableCell className="text-right border-r border-gray-200 font-mono">
                                                {consensusValues[row.name]?.jan.toLocaleString() || Math.round(row.ForecastJan).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-mono">
                                                {consensusValues[row.name]?.feb.toLocaleString() || Math.round(row.ForecastFeb).toLocaleString()}
                                            </TableCell>

                                            {/* Sales Team - Jan */}
                                            <TableCell colSpan={3} className="border-r border-gray-200 p-0">
                                                <div className="flex flex-col">
                                                    <div className="flex">
                                                        <div className="flex-1 min-w-[100px] p-1">
                                                            <input
                                                                type="number"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 border-blue-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'sales', 'jan', 'value', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'sales', 'jan')}
                                                                placeholder="Value"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[150px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 border-blue-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'sales', 'jan', 'comment', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'sales', 'jan')}
                                                                placeholder="Comment"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[120px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 border-blue-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'sales', 'jan', 'owner', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'sales', 'jan')}
                                                                placeholder="Owner"

                                                            />
                                                        </div>
                                                    </div>
                                                    {activeInputs[`${row.name}-sales-jan`] && (
                                                        <div className="p-1 border-t border-gray-200">
                                                            <button
                                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                                onClick={() => {
                                                                    console.log('Submitting sales jan data for', row.name);
                                                                    setActiveInputs(prev => ({
                                                                        ...prev,
                                                                        [`${row.name}-sales-jan`]: false
                                                                    }));
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Sales Team - Feb */}
                                            <TableCell colSpan={3} className="border-r border-gray-200 p-0">
                                                <div className="flex flex-col">
                                                    <div className="flex">
                                                        <div className="flex-1 min-w-[100px] p-1">
                                                            <input
                                                                type="number"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 border-blue-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'sales', 'feb', 'value', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'sales', 'feb')}
                                                                placeholder="Value"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[150px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 border-blue-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'sales', 'feb', 'comment', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'sales', 'feb')}
                                                                placeholder="Comment"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[120px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 border-blue-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'sales', 'feb', 'owner', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'sales', 'feb')}
                                                                placeholder="Owner"

                                                            />
                                                        </div>
                                                    </div>
                                                    {activeInputs[`${row.name}-sales-feb`] && (
                                                        <div className="p-1 border-t border-gray-200">
                                                            <button
                                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                                onClick={() => {
                                                                    console.log('Submitting sales feb data for', row.name);
                                                                    setActiveInputs(prev => ({
                                                                        ...prev,
                                                                        [`${row.name}-sales-feb`]: false
                                                                    }));
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Marketing Team - Jan */}
                                            <TableCell colSpan={3} className="border-r border-gray-200 p-0">
                                                <div className="flex flex-col">
                                                    <div className="flex">
                                                        <div className="flex-1 min-w-[80px] p-1">
                                                            <input
                                                                type="number"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500 border-green-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'marketing', 'jan', 'value', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'marketing', 'jan')}
                                                                placeholder="Value"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[120px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500 border-green-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'marketing', 'jan', 'comment', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'marketing', 'jan')}
                                                                placeholder="Comment"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[120px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500 border-green-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'marketing', 'jan', 'owner', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'marketing', 'jan')}
                                                                placeholder="Owner"

                                                            />
                                                        </div>
                                                    </div>
                                                    {activeInputs[`${row.name}-marketing-jan`] && (
                                                        <div className="p-1 border-t border-gray-200">
                                                            <button
                                                                className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                                onClick={() => {
                                                                    console.log('Submitting marketing jan data for', row.name);
                                                                    setActiveInputs(prev => ({
                                                                        ...prev,
                                                                        [`${row.name}-marketing-jan`]: false
                                                                    }));
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Marketing Team - Feb */}
                                            <TableCell colSpan={3} className="border-r border-gray-200 p-0">
                                                <div className="flex flex-col">
                                                    <div className="flex">
                                                        <div className="flex-1 min-w-[80px] p-1">
                                                            <input
                                                                type="number"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500 border-green-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'marketing', 'feb', 'value', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'marketing', 'feb')}
                                                                placeholder="Value"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[120px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500 border-green-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'marketing', 'feb', 'comment', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'marketing', 'feb')}
                                                                placeholder="Comment"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[120px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500 border-green-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'marketing', 'feb', 'owner', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'marketing', 'feb')}
                                                                placeholder="Owner"

                                                            />
                                                        </div>
                                                    </div>
                                                    {activeInputs[`${row.name}-marketing-feb`] && (
                                                        <div className="p-1 border-t border-gray-200">
                                                            <button
                                                                className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                                onClick={() => {
                                                                    console.log('Submitting marketing feb data for', row.name);
                                                                    setActiveInputs(prev => ({
                                                                        ...prev,
                                                                        [`${row.name}-marketing-feb`]: false
                                                                    }));
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Finance Team - Jan */}
                                            <TableCell colSpan={3} className="border-r border-gray-200 p-0">
                                                <div className="flex flex-col">
                                                    <div className="flex">
                                                        <div className="flex-1 min-w-[80px] p-1">
                                                            <input
                                                                type="number"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-500 border-purple-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'finance', 'jan', 'value', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'finance', 'jan')}
                                                                placeholder="Value"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[120px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-500 border-purple-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'finance', 'jan', 'comment', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'finance', 'jan')}
                                                                placeholder="Comment"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[120px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-500 border-purple-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'finance', 'jan', 'owner', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'finance', 'jan')}
                                                                placeholder="Owner"

                                                            />
                                                        </div>
                                                    </div>
                                                    {activeInputs[`${row.name}-finance-jan`] && (
                                                        <div className="p-1 border-t border-gray-200">
                                                            <button
                                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                                onClick={() => {
                                                                    console.log('Submitting finance jan data for', row.name);
                                                                    setActiveInputs(prev => ({
                                                                        ...prev,
                                                                        [`${row.name}-finance-jan`]: false
                                                                    }));
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Finance Team - Feb */}
                                            <TableCell colSpan={3} className="p-0">
                                                <div className="flex flex-col">
                                                    <div className="flex">
                                                        <div className="flex-1 min-w-[80px] p-1">
                                                            <input
                                                                type="number"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-500 border-purple-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'finance', 'feb', 'value', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'finance', 'feb')}
                                                                placeholder="Value"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[120px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-500 border-purple-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'finance', 'feb', 'comment', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'finance', 'feb')}
                                                                placeholder="Comment"

                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[120px] p-1">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-500 border-purple-200"
                                                                onChange={(e) => handleTeamInputChange(row.name, 'finance', 'feb', 'owner', e.target.value)}
                                                                onFocus={() => handleInputFocus(row.name, 'finance', 'feb')}
                                                                placeholder="Owner"

                                                            />
                                                        </div>
                                                    </div>
                                                    {activeInputs[`${row.name}-finance-feb`] && (
                                                        <div className="p-1 border-t border-gray-200">
                                                            <button
                                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                                onClick={() => {
                                                                    console.log('Submitting finance feb data for', row.name);
                                                                    setActiveInputs(prev => ({
                                                                        ...prev,
                                                                        [`${row.name}-finance-feb`]: false
                                                                    }));
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Waterfall Charts Row - Only shown when expanded */}
                                        {expandedItems[row.name] && (
                                            <TableRow className="bg-white">
                                                <TableCell colSpan={17} className="p-0">
                                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* January Waterfall */}
                                                        <div className="border rounded-lg overflow-hidden">
                                                            <div className="px-4 py-3 bg-gray-100 font-medium">
                                                                {row.name} - Jan Waterfall
                                                            </div>
                                                            <div className="p-4">
                                                                <WaterfallChart
                                                                    data={[
                                                                        { label: "Forecast", value: row.ForecastJan },
                                                                        { label: "Sales", value: teamInputs[row.name]?.sales?.jan?.value || 0 },
                                                                        { label: "Marketing", value: teamInputs[row.name]?.marketing?.jan?.value || 0 },
                                                                        { label: "Finance", value: teamInputs[row.name]?.finance?.jan?.value || 0 },
                                                                        { label: "Consensus", value: consensusValues[row.name]?.jan }
                                                                    ]}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* February Waterfall */}
                                                        <div className="border rounded-lg overflow-hidden">
                                                            <div className="px-4 py-3 bg-gray-100 font-medium">
                                                                {row.name} - Feb Waterfall
                                                            </div>
                                                            <div className="p-4">
                                                                <WaterfallChart
                                                                    data={[
                                                                        { label: "Forecast", value: row.ForecastFeb },
                                                                        { label: "Sales", value: teamInputs[row.name]?.sales?.feb?.value || 0 },
                                                                        { label: "Marketing", value: teamInputs[row.name]?.marketing?.feb?.value || 0 },
                                                                        { label: "Finance", value: teamInputs[row.name]?.finance?.feb?.value || 0 },
                                                                        { label: "Consensus", value: consensusValues[row.name]?.feb }
                                                                    ]}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                ))}
                            </TableBody >
                        </Table>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Card>


            {/* Previosuly there was a separate component for displaying waterfall charts but later integrated this in the above table  */}
            {/* <WaterfallSection
                tableData={tableData}
                consensusValues={consensusValues}
                teamInputs={teamInputs}
            /> */}
        </div>



    )
});

ForecastTable.displayName = 'ForecastTable';

export default ForecastTable