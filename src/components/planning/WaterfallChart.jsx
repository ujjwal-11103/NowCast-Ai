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

    // Dynamic Data Processing
    const processedData = [...data];

    // Arrays for Plotly
    const measures = processedData.map((_, i) => i === 0 ? "absolute" : "relative");
    const labels = processedData.map(d => d.label);
    const values = processedData.map(d => Number(d.value) || 0);
    const text = values.map(v => (v > 0 ? '+' : '') + Math.round(v).toLocaleString());

    // Add Final Total Column automatically
    measures.push("total");
    labels.push("Final");
    values.push(0); // Plotly calculates this
    text.push(""); // Optional text for total, or let Plotly handle it

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
                increasing: { marker: { color: '#10B981' } }, // Green-500
                decreasing: { marker: { color: '#EF4444' } }, // Red-500
                totals: { marker: { color: '#3B82F6' } }, // Blue-500
                textposition: 'outside',
                hoverinfo: 'x+y+delta',
            }]}
            layout={{
                title: false,
                waterfallgap: 0.3,
                showlegend: false,
                margin: { t: 20, b: 70, l: 40, r: 20 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)'
            }}
            config={{
                displayModeBar: false,
                responsive: true
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
        />
    );
};

export default WaterfallChart;