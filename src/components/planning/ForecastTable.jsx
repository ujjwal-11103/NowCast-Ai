import React, { forwardRef, useImperativeHandle, useMemo, useRef, useEffect, useCallback } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table2, Download, Upload, Calculator } from 'lucide-react';
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { HyperFormula } from 'hyperformula';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Register Handsontable modules
registerAllModules();

const ForecastTable = forwardRef(({ data, selections, onPivotRequest, tableData, teamInputs, consensusValues, handleTeamInputChange }, ref) => {
    const hotRef = useRef(null);
    const fileInputRef = useRef(null);
    const [expandedItems, setExpandedItems] = React.useState({});
    const [isFormulaDialogOpen, setIsFormulaDialogOpen] = React.useState(false);
    const [formula, setFormula] = React.useState('');

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

    // Custom Numeric Renderer to force integer rounding visually
    const numericRenderer = (instance, td, row, col, prop, value, cellProperties) => {
        Handsontable.renderers.NumericRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
        if (value !== null && value !== undefined && value !== '') {
            const num = Number(value);
            if (!isNaN(num)) {
                td.innerHTML = Math.round(num).toLocaleString();
            }
        }
        if (cellProperties.className) {
            td.className = cellProperties.className;
        }
        return td;
    };

    // 1. Prepare Columns Configuration and Headers
    const { columns, nestedHeaders } = useMemo(() => {
        const cols = [
            {
                data: 'name',
                title: 'Hierarchy',
                readOnly: true,
                className: 'htLeft htMiddle font-bold text-slate-800',
                renderer: (instance, td, row, col, prop, value, cellProperties) => {
                    const rowData = instance.getSourceDataAtRow(row);
                    const level = rowData?.__level || 0;
                    const hasChildren = rowData?.__hasChildren;
                    const isExpanded = rowData?.__isExpanded;

                    // Match indentation from reference image (Level 0: 12px, Level 1: 32px, etc.)
                    let padding = level * 20 + 8;

                    let iconHtml = '';
                    // Only show triangles for items with children, solid black/dark style
                    if (hasChildren) {
                        const icon = isExpanded ? '▼' : '▶';
                        // Use a darker color for the icon to match the image
                        iconHtml = `<span class="mr-1 inline-block w-4 text-center text-[10px] text-slate-700 font-bold">${icon}</span>`;
                    } else {
                        // Whitespace for alignment if no icon, matching indentation of siblings
                        iconHtml = `<span class="mr-1 inline-block w-4"></span>`;
                    }

                    // No '↳' icon, just clean text.
                    td.innerHTML = `<div class="flex items-center h-full" style="padding-left: ${padding}px; cursor: pointer;">${iconHtml}<span class="truncate">${value}</span></div>`;

                    // Base styles
                    td.className = 'htLeft htMiddle font-bold text-slate-800 border-r border-slate-200 bg-white';

                    return td;
                }
            },

            // LY Values (Replaced Grey with Deep Blue/Indigo)
            { data: 'LYOct', type: 'numeric', numericFormat: { pattern: '0,0' }, renderer: numericRenderer, readOnly: true, className: 'htRight htMiddle text-blue-900 font-mono tracking-tight bg-blue-50/10' },
            { data: 'LYNov', type: 'numeric', numericFormat: { pattern: '0,0' }, renderer: numericRenderer, readOnly: true, className: 'htRight htMiddle text-blue-900 font-mono tracking-tight bg-blue-50/10' },
            { data: 'LYDec', type: 'numeric', numericFormat: { pattern: '0,0' }, renderer: numericRenderer, readOnly: true, className: 'htRight htMiddle text-blue-900 font-mono tracking-tight bg-blue-50/10 border-r border-blue-100' },

            // Baseline Forecast
            { data: 'ForecastOct', type: 'numeric', numericFormat: { pattern: '0,0' }, renderer: numericRenderer, readOnly: true, className: 'htRight htMiddle text-indigo-600 font-mono font-medium bg-indigo-50/20' },
            { data: 'ForecastNov', type: 'numeric', numericFormat: { pattern: '0,0' }, renderer: numericRenderer, readOnly: true, className: 'htRight htMiddle text-indigo-600 font-mono font-medium bg-indigo-50/20' },
            { data: 'ForecastDec', type: 'numeric', numericFormat: { pattern: '0,0' }, renderer: numericRenderer, readOnly: true, className: 'htRight htMiddle text-indigo-600 font-mono font-medium bg-indigo-50/20 border-r border-indigo-100' },

            // Consensus
            { data: 'ConsensusOct', type: 'numeric', numericFormat: { pattern: '0,0' }, renderer: numericRenderer, readOnly: true, className: 'htRight htMiddle text-violet-700 font-bold bg-violet-50/30' },
            { data: 'ConsensusNov', type: 'numeric', numericFormat: { pattern: '0,0' }, renderer: numericRenderer, readOnly: true, className: 'htRight htMiddle text-violet-700 font-bold bg-violet-50/30' },
            { data: 'ConsensusDec', type: 'numeric', numericFormat: { pattern: '0,0' }, renderer: numericRenderer, readOnly: true, className: 'htRight htMiddle text-violet-700 font-bold bg-violet-50/30 border-r border-violet-200' },
        ];

        // Team Inputs Generator
        const teams = [
            { key: 'sales', color: 'bg-emerald-50/20', border: 'border-emerald-100', text: 'text-emerald-800' },
            { key: 'marketing', color: 'bg-amber-50/20', border: 'border-amber-100', text: 'text-amber-800' },
            { key: 'finance', color: 'bg-fuchsia-50/20', border: 'border-fuchsia-100', text: 'text-fuchsia-800' }
        ];
        const months = ['oct', 'nov', 'dec'];

        teams.forEach(team => {
            months.forEach((month, idx) => {
                const isCheck = idx === 2; // Last month in group gets a border
                const borderClass = isCheck ? 'border-r ' + team.border : '';

                cols.push(
                    {
                        data: `${team.key}_${month}_value`,
                        type: 'numeric',
                        numericFormat: { pattern: '0,0' },
                        renderer: numericRenderer,
                        className: `htRight htMiddle font-medium ${team.text} ${team.color} input-cell`
                    },
                    {
                        data: `${team.key}_${month}_comment`,
                        type: 'text',
                        className: `htLeft htMiddle text-xs text-indigo-300 ${team.color}`
                    },
                    {
                        data: `${team.key}_${month}_owner`,
                        type: 'text',
                        className: `htLeft htMiddle text-xs text-indigo-300 ${team.color} ${borderClass}`
                    }
                );
            });
        });

        // Add Intelligence Columns at the end
        cols.push(
            { data: 'Recent_Trend_Category', readOnly: true, className: 'htCenter htMiddle text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-50/30 rounded-l-md' },
            { data: 'Long_Term_Trend_Category', readOnly: true, className: 'htCenter htMiddle text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50/30' },
            { data: 'Forecast_Summary', readOnly: true, className: 'htLeft htMiddle text-[10px] text-indigo-500 bg-indigo-50/30 italic px-2' }
        );

        // Nested Headers - styled objects (Removed Greys)
        const topHeader = [
            { label: 'Hierarchy', colspan: 1, className: 'htCenter htMiddle font-bold text-indigo-950 bg-indigo-50 border-b-2 border-indigo-200' },
            { label: 'Last Year (Actuals)', colspan: 3, className: 'htCenter htMiddle font-bold text-blue-700 bg-blue-50 border-b-2 border-blue-200' },
            { label: 'System Baseline', colspan: 3, className: 'htCenter htMiddle font-bold text-indigo-700 bg-indigo-50 border-b-2 border-indigo-200' },
            { label: 'Final Consensus', colspan: 3, className: 'htCenter htMiddle font-extrabold text-violet-700 bg-violet-50 border-b-2 border-violet-300 shadow-sm' },
            { label: 'Sales Input', colspan: 9, className: 'htCenter htMiddle font-bold text-emerald-700 bg-emerald-50 border-b-2 border-emerald-200' },
            { label: 'Marketing Input', colspan: 9, className: 'htCenter htMiddle font-bold text-amber-700 bg-amber-50 border-b-2 border-amber-200' },
            { label: 'Finance Input', colspan: 9, className: 'htCenter htMiddle font-bold text-fuchsia-700 bg-fuchsia-50 border-b-2 border-fuchsia-200' },
            { label: 'AI Insights', colspan: 3, className: 'htCenter htMiddle font-bold text-indigo-800 bg-indigo-100 border-b-2 border-indigo-200' },
        ];

        const midHeader = [
            { label: 'Segments', className: 'bg-indigo-50 text-indigo-400 text-xs font-semibold' },
            // LY
            { label: 'Oct', className: 'bg-blue-50/50 text-blue-600 text-xs' }, { label: 'Nov', className: 'bg-blue-50/50 text-blue-600 text-xs' }, { label: 'Dec', className: 'bg-blue-50/50 text-blue-600 text-xs border-r border-blue-200' },
            // Base
            { label: 'Oct', className: 'bg-indigo-50/30 text-indigo-600 text-xs' }, { label: 'Nov', className: 'bg-indigo-50/30 text-indigo-600 text-xs' }, { label: 'Dec', className: 'bg-indigo-50/30 text-indigo-600 text-xs border-r border-indigo-100' },
            // Cons
            { label: 'Oct', className: 'bg-violet-50/30 text-violet-700 font-bold text-xs' }, { label: 'Nov', className: 'bg-violet-50/30 text-violet-700 font-bold text-xs' }, { label: 'Dec', className: 'bg-violet-50/30 text-violet-700 font-bold text-xs border-r border-violet-200' },
            // Inputs...
            // Sales
            { label: 'Oct', colspan: 3, className: 'bg-emerald-50/20 text-emerald-600 text-xs border-r border-emerald-50' },
            { label: 'Nov', colspan: 3, className: 'bg-emerald-50/20 text-emerald-600 text-xs border-r border-emerald-50' },
            { label: 'Dec', colspan: 3, className: 'bg-emerald-50/20 text-emerald-600 text-xs border-r border-emerald-100' },
            // Mkt
            { label: 'Oct', colspan: 3, className: 'bg-amber-50/20 text-amber-600 text-xs border-r border-amber-50' },
            { label: 'Nov', colspan: 3, className: 'bg-amber-50/20 text-amber-600 text-xs border-r border-amber-50' },
            { label: 'Dec', colspan: 3, className: 'bg-amber-50/20 text-amber-600 text-xs border-r border-amber-100' },
            // Fin
            { label: 'Oct', colspan: 3, className: 'bg-fuchsia-50/20 text-fuchsia-600 text-xs border-r border-fuchsia-50' },
            { label: 'Nov', colspan: 3, className: 'bg-fuchsia-50/20 text-fuchsia-600 text-xs border-r border-fuchsia-50' },
            { label: 'Dec', colspan: 3, className: 'bg-fuchsia-50/20 text-fuchsia-600 text-xs border-r border-fuchsia-100' },
            // Intel
            { label: 'Trend', className: 'text-xs text-indigo-400 bg-indigo-50' }, { label: 'Long Term', className: 'text-xs text-indigo-400 bg-indigo-50' }, { label: 'Summary', className: 'text-xs text-indigo-400 bg-indigo-50' },
        ];

        const bottomHeader = [
            '',
            '', '', '',
            '', '', '',
            '', '', '',
            // Sales
            'Val', 'Cmnt', 'Owner', 'Val', 'Cmnt', 'Owner', 'Val', 'Cmnt', 'Owner',
            // Mkt
            'Val', 'Cmnt', 'Owner', 'Val', 'Cmnt', 'Owner', 'Val', 'Cmnt', 'Owner',
            // Fin
            'Val', 'Cmnt', 'Owner', 'Val', 'Cmnt', 'Owner', 'Val', 'Cmnt', 'Owner',
            '', '', '', // Intel
        ];

        return { columns: cols, nestedHeaders: [topHeader, midHeader, bottomHeader] };
    }, [selections]);

    // 2. Data Processing & Recursion
    // Use full data for aggregation ("Whole at each level"), but filter visibility
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

        // Group by current level to calculate totals for EVERYTHING at this level
        const groups = {};
        subsetData.forEach(item => {
            const key = item[level] || 'Unassigned';
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        const result = [];
        const nextLevel = getNextLevel(level);

        // Sorting keys for consistent order
        Object.keys(groups).sort().forEach(key => {

            // 1. Determining Visibility based on Filter Selections
            // We only show this row if it matches current filter OR contains data matching deeper filters
            let isVisible = true;

            // Check direct filter for this level
            const levelSelection = selections.find(s => s.field === level);
            if (levelSelection && levelSelection.value && levelSelection.value !== 'All') {
                if (key !== levelSelection.value) isVisible = false;
            }

            // Check if this branch contains relevant data for deeper selections
            // (Only if not already hidden by direct filter)
            if (isVisible) {
                // If we have deeper filters, does this group contain any matching rows?
                const hasMatchingRows = groups[key].some(item => {
                    return selections.every(sel => {
                        if (!sel.value || sel.value === 'All') return true;
                        // We checked current level above, but checking again is safe. 
                        // Crucially, this checks children levels.
                        return item[sel.field] === sel.value;
                    });
                });

                // If there are filters active and no rows match, hide this parent
                // (Except if "All" is selected essentially)
                const filtersActive = selections.some(s => s.value && s.value !== 'All');
                if (filtersActive && !hasMatchingRows) {
                    isVisible = false;
                }
            }

            if (!isVisible) return;

            // 2. Aggregate "Whole" Group (All data in this group, regardless of filters below)
            // This satisfies "i want to see whole at each level if filtered"
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
    }, [expandedItems, getNextLevel, aggregateGroup, consensusValues, teamInputs, selections]);

    const hotData = useMemo(() => {
        // Pass FULL data to start, filtering happens inside processLevel for Visibility only
        return processLevel(data || [], currentLevel, 0);
    }, [processLevel, data, currentLevel]);

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
            // Alert user for manual updates (Autofill, Edit, Paste, etc.)
            toast.success(`Successfully updated ${batchUpdates.length} value(s).`);
        }
    }, [handleTeamInputChange]);

    // 4. Dynamic Height Calculation
    const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // IMPORT LOGIC START
    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            // Read as array of arrays to get headers
            const dataRows = XLSX.utils.sheet_to_json(ws, { header: 1 });

            if (!dataRows || dataRows.length < 2) {
                alert("Invalid file format or empty file.");
                return;
            }

            const headerRow = dataRows[0];

            // Map Headers to Data Keys
            // We need to reconstruct the header string -> dataKey map
            const headerMap = {};

            // Re-generate headers mapping from current columns configuration
            // Note: columns are flattened in 'columns'
            // We skip index 0 which is 'Hierarchy' usually

            // Helper to get nested header label at col index
            const getNestedLabel = (level, colIndex) => {
                const headerRow = nestedHeaders[level];
                // HandsonTable nestedHeaders is complex (objects with colspans)
                // We need to flatten it mentally
                let currentIdx = 0;
                for (let h of headerRow) {
                    let colspan = h.colspan || 1;
                    let label = h.label || h; // h can be string or object
                    if (colIndex >= currentIdx && colIndex < currentIdx + colspan) {
                        return label;
                    }
                    currentIdx += colspan;
                }
                return '';
            };

            for (let i = 0; i < columns.length; i++) {
                // Skip Hierarchy column (index 0)
                if (i === 0) continue;

                const top = getNestedLabel(0, i);
                const mid = getNestedLabel(1, i);
                const bot = getNestedLabel(2, i);
                const headerString = [top, mid, bot].filter(p => p && p.trim() !== '').join(' - ');

                headerMap[headerString] = columns[i].data;
            }

            // Detect Hierarchy Column Index in the uploaded file
            const hierarchyIdx = headerRow.findIndex(h => h && h.toLowerCase().includes('hierarchy'));

            if (hierarchyIdx === -1) {
                alert("Could not find 'Hierarchy' column in the uploaded file.");
                return;
            }

            const batchUpdates = [];

            // Iterate Data Rows
            for (let r = 1; r < dataRows.length; r++) {
                const row = dataRows[r];
                const itemName = row[hierarchyIdx];
                if (!itemName) continue;

                // Iterate columns in the uploaded row
                row.forEach((cellValue, cIdx) => {
                    if (cIdx === hierarchyIdx) return; // Skip Name

                    const headerName = headerRow[cIdx];
                    const dataKey = headerMap[headerName];

                    if (dataKey) {
                        // Check if it's an editable field
                        // Format: team_month_field, e.g. sales_oct_value
                        const parts = dataKey.split('_');
                        if (parts.length === 3) {
                            const [team, month, field] = parts;
                            // We only care if it's a value/comment/owner update
                            // Assuming we push the update even if same (or we could optimize)

                            // Basic validation: Check if value changed? 
                            // For now, let's just push. Processing happens in parent.
                            batchUpdates.push({
                                itemName: itemName,
                                team,
                                month,
                                field,
                                value: cellValue
                            });
                        }
                    }
                });
            }

            if (batchUpdates.length > 0) {
                console.log("Importing batch updates:", batchUpdates.length);
                handleTeamInputChange(batchUpdates);
                alert(`Successfully imported ${batchUpdates.length} updates.`);
            } else {
                alert("No matching editable columns found to update.");
            }

            // Clear input
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsBinaryString(file);
    };

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

        // Accessing nestedHeaders from closure
        // Flatten Top Header to map column indices to Labels
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
            const mid = nestedHeaders[1][c]?.label || nestedHeaders[1][c] || '';
            const bot = nestedHeaders[2][c] || '';

            const parts = [top, mid, bot].filter(p => p && p.trim() !== '');
            headerRow.push(parts.join(' - '));
        }
        dataToExport.push(headerRow);

        // 2. Prepare Data Rows
        for (let r = startRow; r <= endRow; r++) {
            const rowData = [];
            const name = hot.getDataAtCell(r, 0); // Hierarchy Name
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

    const handleApplyFormula = () => {
        const hot = hotRef.current?.hotInstance;
        if (!hot) return;

        const selected = hot.getSelected();
        if (!selected || selected.length === 0) {
            toast.error("Please select cells to update.");
            return;
        }

        const formulaStr = formula.trim();
        const operator = formulaStr.charAt(0);
        const isPercentage = formulaStr.includes('%');

        // Parse operand: remove operator (if present) and '%' (if present)
        let rawOperandStr = formulaStr;
        if (['+', '-', '*', '/'].includes(operator)) {
            rawOperandStr = rawOperandStr.substring(1);
        }
        rawOperandStr = rawOperandStr.replace('%', '').trim();
        const operand = parseFloat(rawOperandStr);

        // Support simple absolute value if no operator (e.g. "500")
        const isAbsolute = !['+', '-', '*', '/'].includes(operator);

        if (isNaN(operand)) {
            toast.error("Invalid numeric operand.");
            return;
        }

        const batchUpdates = [];

        // Iterate selection ranges
        selected.forEach(([r1, c1, r2, c2]) => {
            const startRow = Math.min(r1, r2);
            const endRow = Math.max(r1, r2);
            const startCol = Math.min(c1, c2);
            const endCol = Math.max(c1, c2);

            for (let r = startRow; r <= endRow; r++) {
                const rowData = hot.getSourceDataAtRow(r);
                const itemName = rowData?.name;
                if (!itemName) continue;

                for (let c = startCol; c <= endCol; c++) {
                    const prop = hot.colToProp(c);
                    if (typeof prop !== 'string') continue;

                    // Check if editable field e.g. 'sales_oct_value'
                    const parts = prop.split('_');
                    if (parts.length === 3 && parts[2] === 'value') {
                        const [team, month] = parts;

                        // Current Value (remove commas)
                        const currentValStr = hot.getDataAtCell(r, c);
                        const currentVal = typeof currentValStr === 'string'
                            ? parseFloat(currentValStr.replace(/,/g, ''))
                            : Number(currentValStr);

                        let newVal = 0;

                        if (isAbsolute) {
                            newVal = operand;
                        } else {
                            const base = isNaN(currentVal) ? 0 : currentVal;
                            let effectiveOperand = operand;

                            if (isPercentage) {
                                if (operator === '+' || operator === '-') {
                                    // +10% means + (10% of base)
                                    effectiveOperand = base * (operand / 100);
                                } else {
                                    // *50% means * 0.5
                                    effectiveOperand = operand / 100;
                                }
                            }

                            switch (operator) {
                                case '+': newVal = base + effectiveOperand; break;
                                case '-': newVal = base - effectiveOperand; break;
                                case '*': newVal = base * effectiveOperand; break;
                                case '/':
                                    if (effectiveOperand === 0) newVal = base; // avoid div/0
                                    else newVal = base / effectiveOperand;
                                    break;
                                default: newVal = base;
                            }
                        }

                        batchUpdates.push({
                            itemName,
                            team,
                            month,
                            field: 'value',
                            value: newVal
                        });
                    }
                }
            }
        });

        if (batchUpdates.length > 0) {
            handleTeamInputChange(batchUpdates);
            toast.success(`Updated ${batchUpdates.length} cells with formula.`);
            setIsFormulaDialogOpen(false);
            setFormula('');
        } else {
            toast.info("No editable cells found in selection.");
        }
    };

    const customThemeStyles = `
        /* Premium HOT Theme (No Grey) */
        .htCustomTheme {
            font-family: 'Inter', system-ui, sans-serif !important;
        }

        /* Headers with Specificity */
        .htCustomTheme .handsontable th {
            font-weight: 600 !important;
            vertical-align: middle !important;
            padding: 4px 8px !important; /* Reduced padding used to help with alignment */
            height: 32px !important;
            border-bottom: 2px solid #e0e7ff !important; /* Indigo-100 */
            border-right: 1px solid #e0e7ff !important;
        }

        /* Body Cells with Specificity - Strict Height Sync */
        .htCustomTheme .handsontable td {
            height: 32px !important;
            line-height: 32px !important;
            padding: 0 8px !important;
            vertical-align: middle !important;
            color: #1e1b4b !important; /* Indigo-950 */
            border-bottom: 1px solid #e0e7ff !important;
            border-right: 1px solid #e0e7ff !important;
            font-size: 13px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
        }

        /* Hierarchy column specific alignment */
        .htCustomTheme .handsontable td div {
             height: 100%;
             display: flex;
             align-items: center;
        }

        /* Hover Effects */
        .htCustomTheme .handsontable tr:hover td {
            background-color: #dbeafe !important; /* blue-100 matching image */
        }
        
        .handsontable .current-row .td {
             background-color: #bfdbfe !important; /* blue-200 matching image selection */
        }

        /* Scrollbars */
        .htCustomTheme .wtHolder {
            height: auto !important;
             scrollbar-width: thin;
             scrollbar-color: #a5b4fc transparent; /* Indigo-300 */
             padding-bottom: 20px !important; /* Space above scrollbar */
        }
        .htCustomTheme .wtHolder::-webkit-scrollbar {
             height: 8px; width: 8px;
        }
        .htCustomTheme .wtHolder::-webkit-scrollbar-thumb {
            background-color: #a5b4fc;
            border-radius: 4px;
        }

        /* Sticky Columns Shadow */
          .handsontable .ht_master tr td:first-child, 
          .handsontable .ht_master tr th:first-child {
               border-right: 1px solid #c7d2fe !important; /* Indigo-200 */
               box-shadow: 4px 0 8px rgba(79, 70, 229, 0.05) !important;
               position: relative;
               z-index: 10;
          }
    `;

    const [selectionSummary, setSelectionSummary] = React.useState('');

    const updateSelectionSummary = () => {
        const hot = hotRef.current?.hotInstance;
        if (!hot) return;

        const selected = hot.getSelected();
        if (!selected || selected.length === 0) {
            setSelectionSummary("No cells selected");
            return;
        }

        let totalCells = 0;
        let summaryParts = [];

        selected.forEach(([r1, c1, r2, c2]) => {
            const rows = Math.abs(r2 - r1) + 1;
            const cols = Math.abs(c2 - c1) + 1;
            totalCells += rows * cols;
            // A simple A1-style like notation is hard with nested headers, so we stick to count/dim
            if (selected.length === 1) {
                summaryParts.push(`${rows} row(s) x ${cols} column(s)`);
            }
        });

        if (selected.length > 1) {
            setSelectionSummary(`${totalCells} cells selected (multiple ranges)`);
        } else {
            setSelectionSummary(`${totalCells} cell${totalCells !== 1 ? 's' : ''} selected (${summaryParts[0]})`);
        }
    };

    return (
        <div className="w-full flex flex-col space-y-4">
            {/* Hidden Input for Import */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept=".xlsx, .xls"
            />
            <style>{customThemeStyles}</style>
            <Card className="w-full h-auto overflow-hidden border-0 shadow-[0_4px_30px_rgb(0,0,0,0.05)] rounded-3xl p-0 flex flex-col bg-white ring-1 ring-indigo-50">
                {/* Header Section */}
                <div className="p-6 border-b border-indigo-100 flex justify-between items-center shrink-0 bg-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Table2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-indigo-950 tracking-tight">Forecast Data (Q4 2024)</h3>
                            <p className="text-xs text-indigo-500 font-medium">Detailed hierarchy and consensus view</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Dialog open={isFormulaDialogOpen} onOpenChange={(open) => {
                            if (open) updateSelectionSummary();
                            setIsFormulaDialogOpen(open);
                        }}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:text-indigo-800 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all rounded-full h-9 px-4 font-medium shadow-sm">
                                    <Calculator className="w-4 h-4" /> Formula
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white">
                                <DialogHeader>
                                    <DialogTitle>Apply Formula</DialogTitle>
                                    <DialogDescription>
                                        Update selected cells. Use <code>+10</code>, <code>-5</code>, <code>*1.1</code>, or just <code>500</code>.
                                        <div className="mt-2 p-2 bg-slate-100 rounded-md text-slate-700 font-medium text-xs border border-slate-200">
                                            📍 {selectionSummary}
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="formula" className="text-right">
                                            Formula
                                        </Label>
                                        <Input
                                            id="formula"
                                            value={formula}
                                            onChange={(e) => setFormula(e.target.value)}
                                            placeholder="+100 or *1.2"
                                            className="col-span-3 bg-white"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleApplyFormula}>Apply update</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="sm" onClick={() => onPivotRequest(tableData)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-all rounded-full h-9 px-4 font-medium">
                            <Table2 className="w-4 h-4" /> Pivot Analysis
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleImportClick} className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:text-indigo-800 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all rounded-full h-9 px-4 font-medium shadow-sm">
                            <Upload className="w-4 h-4" /> Import Selection
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportSelection} className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:text-indigo-800 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all rounded-full h-9 px-4 font-medium shadow-sm">
                            <Download className="w-4 h-4" /> Export Selection
                        </Button>
                    </div>
                </div>

                <div className="w-full relative pb-6 px-0 bg-white">
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
                        formulas={{ engine: HyperFormula }}
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