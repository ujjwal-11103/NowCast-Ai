import React, { useState } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import { Button } from "@/components/ui/button";
import { Download, X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

const PivotTableComponent = ({ tableData, onClose }) => {
    const [pivotState, setPivotState] = useState({});

    // Prepare data without formatting yet
    const processedData = tableData.map(item => ({
        ...item,
        LYTotal: item.LYJan + item.LYFeb,
        ForecastTotal: item.ForecastJan + item.ForecastFeb,
    }));

    // Custom renderer to format numbers in display only
    const formatNumber = (num) => {
        if (typeof num !== 'number') return num;
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(num);
    };

    // Create renderers with custom number formatting
    const PlotlyRenderers = createPlotlyRenderers(Plot);
    const renderers = {
        ...PivotTableUI.defaultProps.renderers,
        ...PlotlyRenderers,
        Table: (props) => {
            const FormattedTable = PivotTableUI.defaultProps.renderers.Table;
            return (
                <FormattedTable 
                    {...props} 
                    tableOptions={{
                        ...props.tableOptions,
                        cellRenderer: ({ value }) => {
                            // Format only for display, keep original for calculations
                            return typeof value === 'number' ? formatNumber(value) : value;
                        }
                    }}
                />
            );
        }
    };

    const downloadCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        const allFields = [
            ...new Set([
                ...(pivotState.rows || []),
                ...(pivotState.cols || []),
                ...(pivotState.vals || [])
            ])
        ];

        // Add headers
        csvContent += allFields.join(",") + "\r\n";

        // Add data rows with formatted numbers
        processedData.forEach(item => {
            const row = allFields.map(field => {
                const value = item[field];
                const formattedValue = typeof value === 'number' ? 
                    formatNumber(value) : 
                    value;
                return typeof formattedValue === 'string' && formattedValue.includes(',') ?
                    `"${formattedValue}"` :
                    formattedValue;
            });
            csvContent += row.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "pivot_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="w-full max-w-7xl max-h-[90vh] flex flex-col">
            <CardContent className="p-0 flex-1 flex flex-col">
                <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Pivot Table Analysis</h3>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={downloadCSV}
                            className="flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </Button>
                        <Button variant="outline"
                            className="flex items-center gap-1"
                            onClick={onClose}>
                            <X />
                            Close
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <PivotTableUI
                        data={processedData}  // Use unformatted data for calculations
                        onChange={s => setPivotState(s)}
                        {...pivotState}
                        renderers={renderers}
                        rendererName={pivotState.rendererName || "Table"}
                        unusedOrientationCutoff={Infinity}
                        hiddenAttributes={[]}
                        hiddenFromAggregators={[]}
                        hiddenFromDragDrop={[]}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default PivotTableComponent;