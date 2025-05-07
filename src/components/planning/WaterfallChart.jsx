import React from 'react';
import Plot from 'react-plotly.js';

export const WaterfallChart = ({ data }) => {
    // Safely handle undefined/null data
    if (!data || !Array.isArray(data)) {
        return (
            <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No data available</span>
            </div>
        );
    }

    const measures = ["absolute", "relative", "relative", "relative", "total"];
    const labels = data.map(d => d?.label || '');
    const values = data.map(d => Number(d?.value) || 0);
    const text = values.map(v => v?.toString() || '0');

    console.log("Data in chart:", { data, labels, values, text });

    return (
        <Plot
            data={[{
                type: 'waterfall',
                orientation: 'v',
                measure: measures,
                x: labels,
                y: values,
                text: text,
                connector: { line: { color: 'rgb(63, 63, 63)' } },
                increasing: { marker: { color: '#4CAF50' } }, // Green for positive
                decreasing: { marker: { color: '#F44336' } }, // Red for negative
                totals: { marker: { color: '#2196F3' } } // Blue for totals
            }]}
            layout={{
                title: 'Forecast to Consensus',
                waterfallgap: 0.3,
                showlegend: false,
                margin: { t: 30, b: 30, l: 40, r: 30 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)'
            }}
            config={{ 
                displayModeBar: false,
                responsive: true
            }}
            style={{ width: '100%', height: '400px' }}
            useResizeHandler={true}
        />
    );
};

export default WaterfallChart;