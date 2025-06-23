import React, { useEffect, useState } from 'react';
import { useForecast } from '@/context/ForecastContext/ForecastContext';
import Plot from 'react-plotly.js';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import sampleData from '../../jsons/Planning/JF_censored.json';
import SideBar from '@/components/Sidebar/SideBar';
import { useSidebar } from '@/context/sidebar/SidebarContext';
import Filters from '@/components/planning/Filters';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Norms = () => {
    const { accuracyLevel, filters } = useForecast();
    const [processedData, setProcessedData] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [plotData, setPlotData] = useState([]);
    const [tableData, setTableData] = useState(null);
    const [columnDefs, setColumnDefs] = useState([]);
    const [displayLevel, setDisplayLevel] = useState('Channel');

    // Determine which level to show and which columns to display
    const getDisplayConfig = () => {
        const displayLevels = [];
        let displayLevel = 'Channel';

        if (filters.chain === 'All') {
            displayLevel = 'Channel';
            displayLevels.push('Channel');
        } else if (filters.depot === 'All') {
            displayLevel = 'Chain';
            displayLevels.push('Channel', 'Chain');
        } else if (filters.subCat === 'All') {
            displayLevel = 'Depot';
            displayLevels.push('Channel', 'Chain', 'Depot');
        } else if (filters.sku === 'All') {
            displayLevel = 'SubCat';
            displayLevels.push('Channel', 'Chain', 'Depot', 'SubCat');
        } else {
            displayLevel = 'SKU';
            displayLevels.push('Channel', 'Chain', 'Depot', 'SubCat', 'SKU');
        }

        return { displayLevel, displayLevels };
    };

    // Process data calculations
    const processData = (data) => {
        const serviceLevels = {
            "90%": 1.28,
            "95%": 1.645,
            "98%": 2.054,
            "99%": 2.326,
            "99.5%": 2.576
        };

        const Z_val = serviceLevels[accuracyLevel] || 1.645;

        // Calculate residuals
        const residuals = data
            .filter(item => item.forecast && item.actual)
            .map(item => item.forecast - item.actual);

        // Calculate safety stock
        const calculateSafetyStock = (forecast, actual) => {
            if (!forecast || !actual) return 0;
            const residual = forecast - actual;
            const stdError = residuals.length > 1
                ? Math.sqrt(residuals.map(r => Math.pow(r, 2)).reduce((a, b) => a + b, 0) / (residuals.length - 1))
                : Math.abs(residual);
            return stdError * Z_val;
        };

        return data.map(item => ({
            ...item,
            safety_stock: calculateSafetyStock(item.forecast, item.actual),
            inventory: item.actual * 1.2 + (item.forecast || 0) * 0.3,
            norms: (item.forecast || 0) * 1.1 + calculateSafetyStock(item.forecast, item.actual),
            days_in_hand: ((item.forecast || 0) > 0
                ? (item.actual * 1.2) / (item.forecast / 30)
                : 0).toFixed(1)
        }));
    };

    // Group data by level while maintaining all items at that level
    const groupDataByLevel = (data, level, parentFilters) => {
        // Filter by parent levels only (excluding the current level and above)
        const filteredData = data.filter(item => {
            // Always filter by Channel if specified
            if (parentFilters.channel && item.Channel !== parentFilters.channel) return false;

            // Only filter by Chain if we're not showing Chains
            if (level !== 'Chain' && parentFilters.chain && parentFilters.chain !== "All" && item.Chain !== parentFilters.chain) return false;

            // Only filter by Depot if we're not showing Depots
            if (level !== 'Depot' && parentFilters.depot && parentFilters.depot !== "All" && item.Depot !== parentFilters.depot) return false;

            // Only filter by SubCat if we're not showing SubCats
            if (level !== 'SubCat' && parentFilters.subCat && parentFilters.subCat !== "All" && item.SubCat !== parentFilters.subCat) return false;

            return true;
        });

        // Group by the display level
        return filteredData.reduce((acc, item) => {
            const key = item[level];
            if (!acc[key]) {
                acc[key] = {
                    ...item,
                    [level]: key,
                    actual: 0,
                    forecast: 0,
                    safety_stock: 0,
                    inventory: 0,
                    norms: 0,
                    days_in_hand: 0,
                    count: 0
                };
            }

            acc[key].actual += item.actual || 0;
            acc[key].forecast += item.forecast || 0;
            acc[key].safety_stock += item.safety_stock || 0;
            acc[key].inventory += item.inventory || 0;
            acc[key].norms += item.norms || 0;
            acc[key].days_in_hand += parseFloat(item.days_in_hand) || 0;
            acc[key].count++;

            return acc;
        }, {});
    };

    // Main data processing effect
    useEffect(() => {
        const { displayLevel, displayLevels } = getDisplayConfig();
        setDisplayLevel(displayLevel);

        // Process all data first
        const processed = processData(sampleData);
        setProcessedData(processed);

        // Get parent filters (exclude the display level)
        const parentFilters = {
            channel: filters.channel,
            chain: displayLevel === 'Channel' ? 'All' : filters.chain,
            depot: displayLevel === 'Chain' || displayLevel === 'Channel' ? 'All' : filters.depot,
            subCat: displayLevel === 'Depot' || displayLevel === 'Chain' || displayLevel === 'Channel' ? 'All' : filters.subCat
        };

        // Group data by display level
        const groupedData = groupDataByLevel(processed, displayLevel, parentFilters);

        // Convert to array and calculate averages
        const finalData = Object.values(groupedData).map(item => ({
            ...item,
            days_in_hand: (item.days_in_hand / item.count).toFixed(1)
        }));

        // For table data (January only)
        const janData = processed.filter(item => item.Date === "2024-01-01");
        const groupedJanData = groupDataByLevel(janData, displayLevel, parentFilters);
        const finalJanData = Object.values(groupedJanData).map(item => ({
            ...item,
            days_in_hand: (item.days_in_hand / item.count).toFixed(1)
        }));
        setTableData(finalJanData);

        // Update column definitions
        const metricColumns = [
            {
                headerName: 'Inventory LY',
                field: 'actual',
                valueFormatter: params => Math.floor(params.value),
                width: 120
            },
            {
                headerName: 'Norms LY',
                field: 'inventory',
                valueFormatter: params => Math.floor(params.value),
                width: 120
            },
            {
                headerName: 'User Norms',
                field: 'norms',
                width: 120
            },
            {
                headerName: 'Days in Hand',
                field: 'days_in_hand',
                width: 120
            }
        ];

        const hierarchyColumns = displayLevels.map(level => ({
            headerName: level,
            field: level,
            width: 150,
            sortable: true,
            cellStyle: { borderRight: '1px solid #d1d5db' },
            // pinned: level === displayLevels[0] ? 'left' : null
        }));

        // Add pinned to the last hierarchy column (right before metrics)
        // if (hierarchyColumns.length > 0) {
        //     hierarchyColumns[hierarchyColumns.length - 4].pinned = 'left';
        // }

        setColumnDefs([...hierarchyColumns, ...metricColumns]);

        // Prepare plot data
        const dates = [...new Set(processed.map(item => item.Date))].sort();
        const traces = [
            {
                x: dates,
                y: dates.map(date => {
                    const items = processed.filter(d => d.Date === date);
                    return items.reduce((sum, item) => sum + (item.actual || 0), 0);
                }),
                name: 'Actual',
                type: 'bar'
            },
            {
                x: dates,
                y: dates.map(date => {
                    const items = processed.filter(d => d.Date === date);
                    return items.reduce((sum, item) => sum + (item.forecast || 0), 0);
                }),
                name: 'Forecast',
                type: 'bar'
            },
            {
                x: dates,
                y: dates.map(date => {
                    const items = processed.filter(d => d.Date === date);
                    return items.reduce((sum, item) => sum + (item.norms || 0), 0);
                }),
                name: 'Norms',
                type: 'line',
                line: { color: 'red', width: 3 }
            },
            {
                x: dates,
                y: dates.map(date => {
                    const items = processed.filter(d => d.Date === date);
                    return items.reduce((sum, item) => sum + (item.inventory || 0), 0);
                }),
                name: 'Inventory',
                type: 'line',
                line: { color: 'green', width: 3 }
            }
        ];

        setPlotData(traces);
    }, [filters, accuracyLevel]);

    const layout = {
        title: 'Inventory Norms Overview',
        barmode: 'group',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Quantity' },
        showlegend: true
    };

    // Update the defaultColDef to include column borders
    const defaultColDef = {
        sortable: true,
        resizable: true,
        filter: true,
        editable: true,
        cellStyle: {
            borderRight: '1px solid #d1d5db', // Vertical border for cells
        },
        headerClass: 'header-cell' // Add class for header borders
    };

    // Add this to your component's CSS (or in a style tag)
    <style>{`
    .ag-theme-alpine .ag-cell {
        border-right: 1px solid #d1d5db;
    }
    .ag-theme-alpine .header-cell {
        border-right: 1px solid #d1d5db;
    }
    .ag-theme-alpine .ag-header-cell:last-child,
    .ag-theme-alpine .ag-cell:last-child {
        border-right: none; // Remove border from last column
    }
`}</style>

    // // Calculate dynamic height based on row count
    // const tableHeight = tableData
    //     ? Math.min(300, 40 + (tableData.length * 35) + (tableData.length > 10 ? 17 : 0))
    //     : 300;

    // Calculate dynamic dimensions based on content
    const calculateTableDimensions = () => {
        // Height calculation (same as before)
        const rowCount = tableData?.length || 0;
        const height = Math.min(
            300, // max height
            40 + // header
            (rowCount * 35) + // rows
            (rowCount > 10 ? 17 : 0) // pagination controls if needed
        );

        // Width calculation based on visible columns
        const visibleColumns = columnDefs.length;
        const columnWidth = 150; // base width for hierarchy columns
        const metricWidth = 120; // width for metric columns
        const hierarchyColumns = Math.min(visibleColumns - 4, 5); // max 5 hierarchy cols
        const width = Math.min(
            '100%', // max width
            (hierarchyColumns * columnWidth) + // hierarchy columns
            (4 * metricWidth) + // metric columns
            20 // padding/margin
        );

        return { height, width };
    };

    const { height, width } = calculateTableDimensions();

    const { isSidebarOpen, toggleSidebar } = useSidebar(); // Get sidebar state and toggle function


    return (
        <div>
            <div className="flex">
                <div
                    className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"
                        } fixed`}>
                    <SideBar />
                </div>

                <div className={`main transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} w-full`}>
                    <div className="p-4">
                        <h1 className="text-2xl font-bold mb-4">Norms (Service Level: {accuracyLevel})</h1>

                        <Filters
                            showFilters={true}
                        />

                        {/* Plotly Graph */}
                        <Plot
                            data={plotData}
                            layout={layout}
                            style={{ width: '100%', height: '400px' }}
                            config={{ responsive: true }}
                        />

                        {/* Ag-Grid Table with dynamic height */}
                        {/* Ag-Grid Table with dynamic dimensions */}
                        <div
                            className="ag-theme-alpine mb-16"
                            style={{
                                height: `${height}px`,
                                width: `${width}px`,
                                border: '1px solid #d1d5db',
                                minWidth: '300px' // ensure minimum readable width
                            }}
                        >
                            <AgGridReact
                                columnDefs={columnDefs}
                                rowData={tableData || []}
                                defaultColDef={defaultColDef}
                                modules={[ClientSideRowModelModule]}
                                onGridReady={params => setGridApi(params.api)}
                                pagination={true}
                                paginationPageSize={10}
                                suppressCellFocus={true}
                                headerHeight={40}
                                rowHeight={35}
                                suppressHorizontalScroll={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Norms;