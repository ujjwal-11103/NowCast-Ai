import React, { forwardRef, useImperativeHandle, useMemo, useRef, useEffect, useCallback } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

// Register Handsontable modules
registerAllModules();

const ForecastTable = forwardRef(({ data, selections, onPivotRequest, tableData, teamInputs, consensusValues, handleTeamInputChange }, ref) => {
    const hotRef = useRef(null);
    const [expandedItems, setExpandedItems] = React.useState({});

    // Helper to determine next level
    const getItemLevel = () => {
        const selectionMap = {};
        selections.forEach(sel => { selectionMap[sel.field] = sel.value });
        if (!selectionMap.Channel || selectionMap.Channel === 'All') return 'Channel';
        if (!selectionMap.Chain) return 'Chain';
        if (selectionMap.Chain === 'All' && (!selectionMap.Depot || selectionMap.Depot === 'All')) return 'Depot';
        if (!selectionMap.Depot) return 'Depot';
        if (selectionMap.Depot === 'All' && (!selectionMap.SubCat || selectionMap.SubCat === 'All')) return 'SubCat';
        return 'SKU';
    };
    const currentLevel = getItemLevel();

    const getNextLevel = (lvl) => {
        const levels = ['Channel', 'Chain', 'Depot', 'SubCat', 'SKU'];
        const idx = levels.indexOf(lvl);
        return (idx >= 0 && idx < levels.length - 1) ? levels[idx + 1] : null;
    };

    // 1. Prepare Columns Configuration and Headers
    const { columns, nestedHeaders } = useMemo(() => {
        const cols = [
            {
                data: 'name',
                title: 'Hierarchy',
                readOnly: true,
                className: 'htLeft htMiddle font-bold',
                renderer: (instance, td, row, col, prop, value, cellProperties) => {
                    const rowData = instance.getSourceDataAtRow(row);
                    const level = rowData?.__level || 0;
                    const hasChildren = rowData?.__hasChildren;
                    const isExpanded = rowData?.__isExpanded;

                    let padding = level * 20;
                    let icon = '';
                    if (hasChildren) {
                        icon = isExpanded ? '▼ ' : '▶ ';
                    } else if (level > 0) {
                        icon = '↳ ';
                    }

                    td.innerHTML = `<div style="padding-left: ${padding}px; cursor: pointer;">${icon}${value}</div>`;
                    td.className = 'htLeft htMiddle font-bold';
                    return td;
                }
            },

            // LY Values
            { data: 'LYOct', type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight' },
            { data: 'LYNov', type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight' },
            { data: 'LYDec', type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight' },

            // Baseline Forecast
            { data: 'ForecastOct', type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight' },
            { data: 'ForecastNov', type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight' },
            { data: 'ForecastDec', type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight' },

            // Consensus
            { data: 'ConsensusOct', type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight bg-yellow-50 font-semibold' },
            { data: 'ConsensusNov', type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight bg-yellow-50 font-semibold' },
            { data: 'ConsensusDec', type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight bg-yellow-50 font-semibold' },

        ];

        // Team Inputs Generator
        const teams = [
            { key: 'sales', color: 'bg-blue-50', label: 'Sales' },
            { key: 'marketing', color: 'bg-green-50', label: 'Marketing' },
            { key: 'finance', color: 'bg-purple-50', label: 'Finance' }
        ];
        const months = ['oct', 'nov', 'dec'];

        teams.forEach(team => {
            months.forEach(month => {
                cols.push(
                    { data: `${team.key}_${month}_value`, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight ' + team.color },
                    { data: `${team.key}_${month}_comment`, type: 'text', className: 'htLeft ' + team.color },
                    { data: `${team.key}_${month}_owner`, type: 'text', className: 'htLeft ' + team.color }
                );
            });
        });

        // Add Intelligence Columns at the end
        cols.push(
            { data: 'Recent_Trend_Category', readOnly: true, className: 'htCenter text-xs text-orange-800 bg-orange-50' },
            { data: 'Long_Term_Trend_Category', readOnly: true, className: 'htCenter text-xs text-indigo-800 bg-indigo-50' },
            { data: 'Forecast_Summary', readOnly: true, className: 'htLeft text-xs text-teal-800 bg-teal-50' }
        );

        // Nested Headers
        const topHeader = [
            { label: 'Hierarchy', colspan: 1 },
            { label: 'Last Year Values', colspan: 3 },
            { label: 'Baseline Forecast', colspan: 3 },
            { label: 'Consensus', colspan: 3 },
            { label: 'Sales Team', colspan: 9 },
            { label: 'Marketing Team', colspan: 9 },
            { label: 'Finance Team', colspan: 9 },
            { label: 'Intelligence', colspan: 3 },
        ];

        const midHeader = [
            'Name',
            'Oct', 'Nov', 'Dec', // LY
            'Oct', 'Nov', 'Dec', // Base
            'Oct', 'Nov', 'Dec', // Cons
            // Sales
            'Oct', 'Oct', 'Oct', 'Nov', 'Nov', 'Nov', 'Dec', 'Dec', 'Dec',
            // Mkt
            'Oct', 'Oct', 'Oct', 'Nov', 'Nov', 'Nov', 'Dec', 'Dec', 'Dec',
            // Fin
            'Oct', 'Oct', 'Oct', 'Nov', 'Nov', 'Nov', 'Dec', 'Dec', 'Dec',
            'R. Trend', 'L. Trend', 'Summary', // Intel
        ];

        const bottomHeader = [
            '',
            '', '', '',
            '', '', '',
            '', '', '',
            // Sales
            'Val', 'Cmnt', 'Ownr', 'Val', 'Cmnt', 'Ownr', 'Val', 'Cmnt', 'Ownr',
            // Mkt
            'Val', 'Cmnt', 'Ownr', 'Val', 'Cmnt', 'Ownr', 'Val', 'Cmnt', 'Ownr',
            // Fin
            'Val', 'Cmnt', 'Ownr', 'Val', 'Cmnt', 'Ownr', 'Val', 'Cmnt', 'Ownr',
            '', '', '', // Intel
        ];

        return { columns: cols, nestedHeaders: [topHeader, midHeader, bottomHeader] };
    }, [selections]);

    // 2. Data Preparation with Hierarchy
    // 2. Data Processing & Recursion
    const filteredGlobalData = useMemo(() => {
        if (!data) return [];
        return data.filter(item => {
            return selections.every(sel => {
                if (sel.value === 'All') return true;
                if (!sel.value) return true;
                return item[sel.field] === sel.value;
            });
        });
    }, [data, selections]);

    const aggregateGroup = useCallback((rows, key) => {
        const acc = {
            name: key,
            LYOct: 0, LYNov: 0, LYDec: 0,
            ForecastOct: 0, ForecastNov: 0, ForecastDec: 0,
            // Metadata - first non-null wins
            Recent_Trend_Category: null,
            Long_Term_Trend_Category: null,
            Forecast_Summary: null
        };

        rows.forEach(item => {
            // LY (2023)
            if (item.Date && item.Date.includes('2023-10')) acc.LYOct += Number(item.actual) || 0;
            if (item.Date && item.Date.includes('2023-11')) acc.LYNov += Number(item.actual) || 0;
            if (item.Date && item.Date.includes('2023-12')) acc.LYDec += Number(item.actual) || 0;

            // Forecast (2024)
            if (item.Date && item.Date.includes('2024-10')) acc.ForecastOct += Number(item.forecast) || 0;
            if (item.Date && item.Date.includes('2024-11')) acc.ForecastNov += Number(item.forecast) || 0;
            if (item.Date && item.Date.includes('2024-12')) acc.ForecastDec += Number(item.forecast) || 0;

            // Intelligence
            if (!acc.Recent_Trend_Category && item.Recent_Trend_Category) acc.Recent_Trend_Category = item.Recent_Trend_Category;
            if (!acc.Long_Term_Trend_Category && item.Long_Term_Trend_Category) acc.Long_Term_Trend_Category = item.Long_Term_Trend_Category;
            if (!acc.Forecast_Summary && item.Forecast_Summary) acc.Forecast_Summary = item.Forecast_Summary;
        });

        return acc;
    }, []);

    const processLevel = useCallback((subsetData, level, depth) => {
        if (!subsetData || subsetData.length === 0) return [];

        // Group by current level
        const groups = {};
        subsetData.forEach(item => {
            const key = item[level] || 'Unassigned';
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        const result = [];
        const nextLevel = getNextLevel(level);

        Object.keys(groups).sort().forEach(key => {
            const groupRows = groups[key];
            const agg = aggregateGroup(groupRows, key);

            const isExpanded = !!expandedItems[key];

            const rowData = {
                ...agg,
                __level: depth,
                __hasChildren: !!nextLevel,
                __isExpanded: isExpanded,
                ConsensusOct: consensusValues[key]?.oct ?? agg.ForecastOct,
                ConsensusNov: consensusValues[key]?.nov ?? agg.ForecastNov,
                ConsensusDec: consensusValues[key]?.dec ?? agg.ForecastDec,
            };

            // Map Team Inputs
            ['sales', 'marketing', 'finance'].forEach(team => {
                ['oct', 'nov', 'dec'].forEach(month => {
                    const input = teamInputs[key]?.[team]?.[month];
                    rowData[`${team}_${month}_value`] = input?.value ?? '';
                    rowData[`${team}_${month}_comment`] = input?.comment ?? '';
                    rowData[`${team}_${month}_owner`] = input?.owner ?? '';
                });
            });

            result.push(rowData);

            if (isExpanded && nextLevel) {
                const children = processLevel(groupRows, nextLevel, depth + 1);
                result.push(...children);
            }
        });

        return result;
    }, [expandedItems, getNextLevel, aggregateGroup, consensusValues, teamInputs]);

    const hotData = useMemo(() => {
        return processLevel(filteredGlobalData, currentLevel, 0);
    }, [processLevel, filteredGlobalData, currentLevel]);

    const handleCellMouseDown = useCallback((event, coords, TD) => {
        if (coords.col === 0 && coords.row >= 0) {
            const rowData = hotRef.current?.hotInstance?.getSourceDataAtRow(coords.row);
            if (rowData && rowData.__hasChildren) {
                setExpandedItems(prev => ({
                    ...prev,
                    [rowData.name]: !prev[rowData.name]
                }));
            }
        }
    }, []);

    // 3. Change Handler (Batched)
    const onAfterChange = useCallback((changes, source) => {
        if (!changes || source === 'loadData') return;

        const batchUpdates = [];

        changes.forEach(([row, prop, oldValue, newValue]) => {
            if (oldValue === newValue) return;

            // Parse prop: e.g., 'sales_oct_value'
            const parts = prop.split('_');
            if (parts.length === 3) {
                const [team, month, field] = parts;
                const rowData = hotRef.current?.hotInstance?.getSourceDataAtRow(row);
                if (rowData && rowData.name) {
                    batchUpdates.push({
                        itemName: rowData.name,
                        team,
                        month,
                        field,
                        value: newValue
                    });
                }
            }
        });

        if (batchUpdates.length > 0) {
            handleTeamInputChange(batchUpdates);
        }
    }, [handleTeamInputChange]);

    // 4. Dynamic Height Calculation
    const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleExportSelection = () => {
        console.log("Export Selection Clicked");
        const hot = hotRef.current?.hotInstance;
        console.log("Hot Instance:", hot);

        if (!hot) {
            console.error("Hot instance not found");
            return;
        }

        const selected = hot.getSelected();
        console.log("Selected:", selected);

        if (!selected || selected.length === 0) {
            alert("Please select a range of cells to export.");
            return;
        }

        const [r1, c1, r2, c2] = selected[0];
        const startRow = Math.min(r1, r2);
        const endRow = Math.max(r1, r2);
        const startCol = Math.min(c1, c2);
        const endCol = Math.max(c1, c2);

        const dataToExport = [];

        // 1. Prepare Headers (Hierarchy + Selection Headers)
        const headerRow = ['Hierarchy'];

        // Flatten Top Header (nestedHeaders[0]) to map column indices to Top Labels
        const topHeaderMap = {};
        let colIndexCounter = 0;
        if (nestedHeaders[0]) {
            nestedHeaders[0].forEach(h => {
                for (let i = 0; i < (h.colspan || 1); i++) {
                    topHeaderMap[colIndexCounter + i] = h.label;
                }
                colIndexCounter += (h.colspan || 1);
            });
        }

        for (let c = startCol; c <= endCol; c++) {
            const top = topHeaderMap[c] || '';
            const mid = nestedHeaders[1][c] || '';
            const bot = nestedHeaders[2][c] || '';

            // Construct composite header: "Last Year Values - Oct" or "Sales Team - Oct - Val"
            const parts = [top, mid, bot].filter(p => p && p.trim() !== '');
            headerRow.push(parts.join(' - '));
        }
        dataToExport.push(headerRow);

        // 2. Prepare Data Rows
        for (let r = startRow; r <= endRow; r++) {
            const rowData = [];
            // Column 0 is always Hierarchy Name in our visual grid
            const name = hot.getDataAtCell(r, 0);
            rowData.push(name);

            for (let c = startCol; c <= endCol; c++) {
                rowData.push(hot.getDataAtCell(r, c));
            }
            dataToExport.push(rowData);
        }

        // 3. Generate Excel
        const ws = XLSX.utils.aoa_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Selection");
        XLSX.writeFile(wb, "Forecast_Selection.xlsx");
    };

    useImperativeHandle(ref, () => ({
        getTableData: () => tableData,
    }));

    const heightStyles = `
        .handsontable .ht_master .wtHolder {
            height: auto !important;
            overflow-y: visible !important;
            overflow-x: auto !important;
        }
    `;

    return (
        <div className="w-full flex flex-col space-y-4">
            <style>{heightStyles}</style>
            <Card className="w-full h-auto overflow-hidden border border-blue-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-3xl p-0 flex flex-col bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-500">
                <div className="p-6 border-b border-blue-100/50 flex justify-between items-center shrink-0">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Forecast Data (Q4 2024)</h3>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onPivotRequest(tableData)} className="flex items-center gap-2 border-slate-200 hover:bg-white hover:shadow-sm transition-all rounded-full h-9">
                            <Table2 className="w-4 h-4 text-indigo-600" /> <span className="text-slate-700 font-medium">Pivot Analysis</span>
                        </Button>
                        <Button variant="outline" onClick={handleExportSelection} className="flex items-center gap-2 border-slate-200 hover:bg-white hover:shadow-sm transition-all rounded-full h-9">
                            <Download className="w-4 h-4 text-indigo-600" /> <span className="text-slate-700 font-medium">Export Selection</span>
                        </Button>
                    </div>
                </div>

                <div className="w-full relative pb-4">
                    <HotTable
                        ref={hotRef}
                        data={hotData}
                        columns={columns}
                        nestedHeaders={nestedHeaders}
                        colHeaders={true}
                        rowHeaders={true}
                        width="100%"
                        fixedColumnsLeft={1}
                        licenseKey="non-commercial-and-evaluation"
                        afterChange={onAfterChange}
                        afterOnCellMouseDown={handleCellMouseDown}
                        autoColumnSize={true}
                        autoWrapRow={true}
                        autoWrapCol={true}
                        manualColumnResize={true}
                        multiColumnSorting={true}
                        filters={true}
                        dropdownMenu={true}
                        contextMenu={true}
                        className="htCustomTheme"
                        outsideClickDeselects={false}
                        stretchH="none"
                        renderAllRows={true}
                    />
                </div>
            </Card>
        </div>
    );
});

ForecastTable.displayName = 'ForecastTable';
export default ForecastTable;