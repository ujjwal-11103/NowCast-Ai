import React from 'react';
import Plot from 'react-plotly.js';

const CustomerMap = ({ customerData }) => {
    return (
        <Plot
            data={[
                {
                    type: "scattermapbox",
                    lat: customerData.map((customer) => customer.Lat),
                    lon: customerData.map((customer) => customer.Long),
                    mode: "markers",
                    marker: {
                        size: 14,
                        color: customerData.map((customer) => {
                            if (customer.Alert === "No Alert") return "#22c55e";
                            else if (customer.Alert === "Lower than Geo Growth") return "#eab308";
                            else if (customer.Alert === "Regulars not selling") return "#ef4444";
                            else return "#22c55e";
                        }),
                        opacity: 0.8,
                    },
                    text: customerData.map(c => `Customer: ${c.Customer}<br>Target: ${c.Target_Acheived !== undefined ? c.Target_Acheived : 'N/A'}%`),
                    hoverinfo: "text",
                },
            ]}
            layout={{
                autosize: true,
                hovermode: "closest",
                mapbox: {
                    style: "carto-positron",
                    center: { lat: 37.0902, lon: -95.7129 },
                    zoom: 3,
                },
                margin: { t: 0, b: 0, l: 0, r: 0 },
                modebar: {
                    orientation: 'v',
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    color: '#64748b',
                    activecolor: '#0f172a'
                }
            }}
            config={{
                displayModeBar: true,
                displaylogo: false,
            }}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler
        />
    );
};

export default CustomerMap;
