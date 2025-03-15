import React from 'react';
import Plot from 'react-plotly.js';
import ChannelCreditData from '../../../jsons/supplychaintower/charts/channel_credit[1].json';

const getColor = (percentage) => {
    if (percentage < 75) return '#A8E6A2';
    if (percentage < 93) return '#FFD97D';
    return '#FF9999';
};

const formatIndian = (num) => {
    num = Number(num);
    if (num >= 1e7) return `${(num / 1e7).toFixed(2)} Cr`;
    if (num >= 1e5) return `${(num / 1e5).toFixed(2)} Lakh`;
    return num.toLocaleString('en-IN');
};

const ChannelCredit = () => {
    const channelData = ChannelCreditData.map(item => ({
        ...item,
        Utilization_Percentage: (item.Credit_Utilization / item.Credit_Limit) * 100,
    }));

    const channels = channelData.map(item => item.Channel);
    const creditLimits = channelData.map(item => item.Credit_Limit);
    const creditUtilizations = channelData.map(item => item.Credit_Utilization);
    const barColors = channelData.map(item => getColor(item.Utilization_Percentage));

    return (
        <div className="border bg-white rounded-xl shadow-card p-4">
            <Plot
                data={[
                    {
                        y: channels,
                        x: creditLimits,
                        name: 'Credit Limit',
                        type: 'bar',
                        orientation: 'h',
                        marker: {
                            color: 'lightgray',
                            line: { width: 1.5, color: 'black' },
                        },
                        opacity: 0.6,
                    },
                    {
                        y: channels,
                        x: creditUtilizations,
                        name: 'Credit Utilization',
                        type: 'bar',
                        orientation: 'h',
                        marker: {
                            color: barColors,
                            line: { width: 1.5, color: 'black' },
                        },
                        text: channelData.map(item => `${item.Utilization_Percentage.toFixed(0)}%`),
                        textposition: 'outside',
                        textfont: { size: 16 },
                    },
                    {
                        y: channels,
                        x: creditUtilizations.map(value => value / 2),
                        mode: 'text',
                        text: channelData.map(item => `₹${formatIndian(item.Credit_Utilization)}`),
                        textposition: 'middle center',
                        textfont: { size: 16, color: 'white' },
                        showlegend: false,
                    },
                ]}
                layout={{
                    title: {
                        text: 'Channel Credit Utilization Analysis', // Adding Title
                        font: { size: 20, family: 'Arial, sans-serif' }, // Adjust font size if needed
                        x: 0.5, // Center the title
                        xanchor: 'center',
                    },
                    barmode: 'overlay',
                    xaxis: {
                        title: 'Credit',
                        showgrid: true,
                        showline: true,
                        linewidth: 0.5,
                        linecolor: 'black',
                    },
                    yaxis: {
                        title: 'Channel',
                        showgrid: false,
                        zeroline: false,
                        categoryorder: 'total ascending',
                    },
                    plot_bgcolor: 'white',
                    font: { family: 'Arial, sans-serif', size: 16 },
                    showlegend: false,
                    responsive: true,
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default ChannelCredit;
