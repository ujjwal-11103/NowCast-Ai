
import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';

const CustomerMap = ({ customerData }) => {
    // Add window resize listener to force re-layout when sidebar toggles
    React.useEffect(() => {
        const handleResize = () => {
            window.dispatchEvent(new Event('resize'));
        };
        // Small timeout to allow sidebar transition to complete
        const timeoutId = setTimeout(handleResize, 350);
        return () => clearTimeout(timeoutId);
    }, [customerData]); // Also trigger when data changes, or pass a sidebarOpen prop if available

    const data = useMemo(() => {
        if (!customerData) return [];
        return [{
            type: 'scattergeo',
            lat: customerData.map(customer => customer.Lat),
            lon: customerData.map(customer => customer.Long),
            mode: 'markers',
            marker: {
                size: 10,
                color: customerData.map(customer => {
                    const alert = customer.Alert || 'No Alert';
                    if (alert === 'No Alert') {
                        return '#22c55e'; // Vibrant Green
                    } else if (alert === 'Lower than Geo Growth') {
                        return '#eab308'; // Rich Yellow
                    } else if (alert === 'Regulars not selling') {
                        return '#ef4444'; // Bright Red
                    } else {
                        return '#22c55e';
                    }
                }),
                opacity: 0.9,
                line: {
                    color: '#ffffff',
                    width: 1.5
                }
            },
            text: customerData.map(customer =>
                `<b>${customer.Customer}</b><br>` +
                `<span style="color:#64748b">Target Achieved:</span> <b>${(customer?.Target_Acheived || 0).toLocaleString()}</b><br>` +
                `<span style="color:#64748b">Total Target:</span> <b>${(customer?.Total_Target || 0).toLocaleString()}</b><br>` +
                `<span style="color:${customer.Alert === 'Regulars not selling' ? '#ef4444' : '#22c55e'}">${customer.Alert}</span>`
            ),
            hoverinfo: 'text',
            hoverlabel: {
                bgcolor: '#ffffff',
                bordercolor: '#e2e8f0',
                font: { family: 'Montserrat, sans-serif', size: 12 }
            }
        }];
    }, [customerData]);

    const INITIAL_LATAXIS_RANGE = [-59, 85];
    const INITIAL_LONAXIS_RANGE = [-180, 180];

    const [layout, setLayout] = useState({
        autosize: true,
        dragmode: 'pan',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        geo: {
            scope: 'world',
            projection: { type: 'mercator', scale: 1.6 }, // High scale to completely fill the container width
            showland: true,
            landcolor: '#E5E7EB',
            showlakes: true,
            lakecolor: '#FFFFFF',
            showsubunits: true,
            subunitcolor: '#FFFFFF',
            showcountries: true,
            countrycolor: '#FFFFFF',
            showocean: true,
            oceancolor: '#F8FAFC',
            bgcolor: 'rgba(0,0,0,0)',
            lataxis: { showgrid: false, range: [-59, 85] }, // Crop Antarctica to fill height better
            lonaxis: { showgrid: false, range: [-180, 180] }
        },
        modebar: {
            orientation: 'h', // Horizontal toolbar at top
            bgcolor: 'transparent',
            color: '#334155', // Darker slate for better visibility on light map
            activecolor: '#2563EB'
        },
        margin: { t: 0, b: 0, l: 0, r: 0 }, // No margins so map fills entire space
        showlegend: false
    });

    // Auto-zoom logic removed to allow full map view as requested
    /*
    React.useEffect(() => {
       // ... (logic removed)
    }, [customerData]);
    */

    const handleRelayout = (event) => {
        // Enforce max zoom out (reset size) constraint
        const newLatRange = event['geo.lataxis.range'];
        const newLonRange = event['geo.lonaxis.range'];

        if (newLatRange && newLonRange) {
            const latSpan = newLatRange[1] - newLatRange[0];
            const lonSpan = newLonRange[1] - newLonRange[0];
            const maxLatSpan = INITIAL_LATAXIS_RANGE[1] - INITIAL_LATAXIS_RANGE[0];
            const maxLonSpan = INITIAL_LONAXIS_RANGE[1] - INITIAL_LONAXIS_RANGE[0];

            // If zoomed out more than initial (allow tiny margin for error)
            if (latSpan > maxLatSpan + 1 || lonSpan > maxLonSpan + 1) {
                setLayout(prev => ({
                    ...prev,
                    geo: {
                        ...prev.geo,
                        lataxis: { ...prev.geo.lataxis, range: INITIAL_LATAXIS_RANGE },
                        lonaxis: { ...prev.geo.lonaxis, range: INITIAL_LONAXIS_RANGE }
                    }
                }));
            }
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}>
            <Plot
                data={data}
                layout={layout}
                onRelayout={handleRelayout}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{
                    displayModeBar: true,
                    scrollZoom: true,
                    displaylogo: false,
                    // Define explicit buttons including custom zoom buttons
                    modeBarButtons: [[
                        {
                            name: 'Zoom In',
                            icon: {
                                width: 20, height: 20,
                                path: 'M 10 3 L 10 9 L 4 9 L 4 11 L 10 11 L 10 17 L 12 17 L 12 11 L 18 11 L 18 9 L 12 9 L 12 3 Z'
                            },
                            click: (gd) => {
                                // Small zoom in (15% reduction in span)
                                const geo = layout.geo;
                                const latRange = geo.lataxis.range;
                                const lonRange = geo.lonaxis.range;
                                const factor = 0.85;

                                const latSpan = latRange[1] - latRange[0];
                                const lonSpan = lonRange[1] - lonRange[0];
                                const latCenter = (latRange[0] + latRange[1]) / 2;
                                const lonCenter = (lonRange[0] + lonRange[1]) / 2;

                                setLayout(prev => ({
                                    ...prev,
                                    geo: {
                                        ...prev.geo,
                                        lataxis: { ...prev.geo.lataxis, range: [latCenter - (latSpan * factor) / 2, latCenter + (latSpan * factor) / 2] },
                                        lonaxis: { ...prev.geo.lonaxis, range: [lonCenter - (lonSpan * factor) / 2, lonCenter + (lonSpan * factor) / 2] }
                                    }
                                }));
                            }
                        },
                        {
                            name: 'Zoom Out',
                            icon: {
                                width: 20, height: 20,
                                path: 'M 4 9 L 4 11 L 18 11 L 18 9 Z'
                            },
                            click: (gd) => {
                                // Small zoom out (15% increase in span)
                                const geo = layout.geo;
                                const latRange = geo.lataxis.range;
                                const lonRange = geo.lonaxis.range;
                                const factor = 1 / 0.85;

                                const latSpan = latRange[1] - latRange[0];
                                const lonSpan = lonRange[1] - lonRange[0];
                                const latCenter = (latRange[0] + latRange[1]) / 2;
                                const lonCenter = (lonRange[0] + lonRange[1]) / 2;

                                // Constraint Check
                                const nextLatSpan = latSpan * factor;
                                const nextLonSpan = lonSpan * factor;
                                const maxLatSpan = INITIAL_LATAXIS_RANGE[1] - INITIAL_LATAXIS_RANGE[0];
                                const maxLonSpan = INITIAL_LONAXIS_RANGE[1] - INITIAL_LONAXIS_RANGE[0];

                                if (nextLatSpan > maxLatSpan || nextLonSpan > maxLonSpan) {
                                    // Reset to max if exceeding
                                    setLayout(prev => ({
                                        ...prev,
                                        geo: {
                                            ...prev.geo,
                                            lataxis: { ...prev.geo.lataxis, range: INITIAL_LATAXIS_RANGE },
                                            lonaxis: { ...prev.geo.lonaxis, range: INITIAL_LONAXIS_RANGE }
                                        }
                                    }));
                                } else {
                                    setLayout(prev => ({
                                        ...prev,
                                        geo: {
                                            ...prev.geo,
                                            lataxis: { ...prev.geo.lataxis, range: [latCenter - nextLatSpan / 2, latCenter + nextLatSpan / 2] },
                                            lonaxis: { ...prev.geo.lonaxis, range: [lonCenter - nextLonSpan / 2, lonCenter + nextLonSpan / 2] }
                                        }
                                    }));
                                }
                            }
                        },
                        'resetGeo',
                        'hoverClosestGeo',
                        'toImage'
                    ]],
                    toImageButtonOptions: {
                        format: 'png',
                        filename: 'geography_performance',
                        height: 500,
                        width: 700,
                        scale: 2
                    }
                }}
            />
        </div>
    );
};

export default CustomerMap;
