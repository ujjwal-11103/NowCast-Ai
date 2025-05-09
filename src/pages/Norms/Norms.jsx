import React, { useEffect, useState } from 'react';
import { useForecast } from '@/context/ForecastContext/ForecastContext';
import Plot from 'react-plotly.js'; // Note: import Plot, not Plotly
import { AgGridReact } from 'ag-grid-react';

//  Correct AG Grid imports
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';

// Register the required module
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Import styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import sampleData from '../../jsons/Planning/JF_censored.json';


const Norms = () => {
    const { accuracyLevel, filters } = useForecast();
    const [processedData, setProcessedData] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [plotData, setPlotData] = useState([]); // State for plot data
    const [tableData, setTableData] = useState(null); // Separate state for table data (Only showing "2024-01-01")



    // Process data based on filters and accuracy level
    useEffect(() => {
        // Filter data based on current selections
        const filteredData = sampleData.filter(item => {
            if (filters.channel && item.Channel !== filters.channel) return false;
            if (filters.chain && filters.chain !== "All" && item.Chain !== filters.chain) return false;
            if (filters.depot && filters.depot !== "All" && item.Depot !== filters.depot) return false;
            if (filters.subCat && filters.subCat !== "All" && item.SubCat !== filters.subCat) return false;
            if (filters.sku && filters.sku !== "All" && item.SKU !== filters.sku) return false;
            return true;
        });

        // Process data similar to Python logic
        const processData = (data) => {
            const serviceLevels = {
                "90%": 1.28,
                "95%": 1.645,
                "98%": 2.054,
                "99%": 2.326,
                "99.5%": 2.576
            };

            const Z_val = serviceLevels[accuracyLevel] || 1.645;

            // First calculate all residuals
            const residuals = data
                .filter(item => item.forecast && item.actual)
                .map(item => item.forecast - item.actual);

            // Then calculate standard error
            const calculateSafetyStock = (forecast, actual) => {
                if (!forecast || !actual) return 0;
                const residual = forecast - actual;
                const stdError = residuals.length > 1
                    ? Math.sqrt(residuals.map(r => Math.pow(r, 2)).reduce((a, b) => a + b, 0) / (residuals.length - 1))
                    : Math.abs(residual);
                return stdError * Z_val;
            };

            // Process items
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
        const processed = processData(filteredData);
        setProcessedData(processed);

        // Filter table data to only show 2024-01-01
        const tableDataFor2024 = processed.filter(item => item.Date === "2024-01-01");
        setTableData(tableDataFor2024);

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

    const columnDefs = [
        // {
        //     field: 'Date',
        //     headerName: 'Date',
        //     pinned: 'left',
        //     width: 120,
        //     sortable: true,
        //     cellStyle: { borderRight: '1px solid #d1d5db' } // Gray border
        // },
        {
            field: 'Channel',
            headerName: 'Channel',
            width: 150,
            sortable: true,
            cellStyle: { borderRight: '1px solid #d1d5db' }
        },
        {
            field: 'Chain',
            headerName: 'Chain',
            width: 150,
            sortable: true,
            cellStyle: { borderRight: '1px solid #d1d5db' }
        },
        {
            field: 'Depot',
            headerName: 'Depot',
            width: 150,
            sortable: true,
            cellStyle: { borderRight: '1px solid #d1d5db' }
        },
        {
            field: 'SubCat',
            headerName: 'Sub Category',
            width: 150,
            sortable: true,
            cellStyle: { borderRight: '1px solid #d1d5db' }
        },
        {
            field: 'SKU',
            headerName: 'SKU',
            width: 150,
            sortable: true,
            cellStyle: { borderRight: '1px solid #d1d5db' }
        },
        {
            field: 'actual',
            headerName: 'Inventory LY',
            width: 120,
            sortable: true,
            cellStyle: { borderRight: '1px solid #d1d5db' },
            valueFormatter: params => Math.floor(params.value) // Trims decimals
        },
        {
            field: 'inventory',
            headerName: 'Norms LY',
            width: 120,
            sortable: true,
            cellStyle: { borderRight: '1px solid #d1d5db' },
            valueFormatter: params => Math.floor(params.value) // Trims decimals
        },
        // {
        //     field: 'forecast',
        //     headerName: 'Forecast',
        //     width: 120,
        //     sortable: true,
        //     cellStyle: { borderRight: '1px solid #d1d5db' }
        // },
        {
            field: 'norms',
            headerName: 'User Norms',
            width: 120,
            sortable: true,
            cellStyle: { borderRight: '1px solid #d1d5db' }
        },

        {
            field: 'days_in_hand',
            headerName: 'Days in Hand',
            width: 150,
            sortable: true
        }
    ];

    const defaultColDef = {
        sortable: true, // Enable sorting for all columns
        resizable: true,
        filter: true,
        editable: true,
        cellStyle: { borderRight: '1px solid #d1d5db' } // Default border for all cells
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Norms (Service Level: {accuracyLevel})</h1>

            {/* Plotly Graph */}
            <Plot
                data={plotData}
                layout={layout}
                style={{ width: '100%', height: '400px' }}
                config={{ responsive: true }}
            />

            {/* Ag-Grid Table */}
            <div className="ag-theme-alpine mb-16" style={{ height: '300px', width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    // rowData={processedData || []}
                    rowData={tableData || []}
                    defaultColDef={defaultColDef}
                    modules={[ClientSideRowModelModule]}
                    onGridReady={params => setGridApi(params.api)}
                    pagination={true}
                    paginationPageSize={10} // Show 10 rows per page
                    suppressCellFocus={true}
                    // domLayout='autoHeight' // Adjusts height based on rows
                    headerHeight={40} // Slightly taller headers
                    rowHeight={35} // Compact but readable rows
                    suppressHorizontalScroll={true} // Prevent horizontal scrolling
                />
            </div>
        </div>
    );
};

export default Norms;