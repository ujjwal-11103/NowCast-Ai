import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { groupBy } from 'lodash';
import { useForecast } from '@/context/ForecastContext/ForecastContext';

const SalesTrendChart = () => {
    const { filters, globalData } = useForecast();

    const {
        chartDates,
        chartActuals,
        chartForecasts,
        chartConsensus,
        showConsensusLine
    } = useMemo(() => {
        if (!globalData) return { chartDates: [], chartActuals: [], chartForecasts: [], chartConsensus: [], showConsensusLine: false };

        // 2. Filter Data
        const filteredData = globalData.filter((item) => {
            if (filters.channel && filters.channel !== "All" && item.Channel !== filters.channel) return false;
            if (filters.chain && filters.chain !== "All" && item.Chain !== filters.chain) return false;
            if (filters.depot && filters.depot !== "All" && item.Depot !== filters.depot) return false;
            if (filters.subCat && filters.subCat !== "All" && item.SubCat !== filters.subCat) return false;
            if (filters.sku && filters.sku !== "All" && item.SKU !== filters.sku) return false;
            return true;
        });

        // 3. CHECK FOR UPDATES
        const hasConsensusData = filteredData.some(item => item.isEdited === true);

        // 4. Group by Date FIRST (Before Cleaning)
        // We need to sum up values for each date BEFORE we decide if it's null or 0.
        // If we map to null too early, the sum might break.
        const grouped = groupBy(filteredData, 'Date');
        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

        // 5. Aggregate and Clean
        const actualsData = sortedDates.map(date => {
            // Sum up actuals for this date
            const sum = grouped[date].reduce((acc, item) => acc + (Number(item.actual) || 0), 0);
            // Logic: If sum is 0, return null so line breaks/stops. 
            // Exception: If it's a valid 0 (e.g., no sales), you might want 0. 
            // Usually for history, we want 0. For future, we want null.
            // Let's assume Actuals should always show unless purely missing.
            return sum;
        });

        const forecastsData = sortedDates.map(date => {
            const sum = grouped[date].reduce((acc, item) => acc + (Number(item.forecast) || 0), 0);
            // FIX: If sum is 0, return NULL to hide the line.
            return sum > 0 ? sum : null;
        });

        const consensusData = sortedDates.map(date => {
            const sum = grouped[date].reduce((acc, item) => {
                const val = item.ConsensusForecast !== undefined ? Number(item.ConsensusForecast) : (Number(item.forecast) || 0);
                return acc + val;
            }, 0);
            // FIX: If sum is 0, return NULL to hide the line.
            return sum > 0 ? sum : null;
        });

        return {
            chartDates: sortedDates,
            chartActuals: actualsData,
            chartForecasts: forecastsData,
            chartConsensus: consensusData,
            showConsensusLine: hasConsensusData
        };
    }, [filters, globalData]);

    // 6. Define Traces
    const chartTraces = [
        {
            x: chartDates,
            y: chartActuals,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Actual Sales',
            line: { color: '#3b82f6', width: 2 },
            connectgaps: true // Keeps blue line connected even if there are 0s
        },
        {
            x: chartDates,
            y: chartForecasts,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Baseline Forecast',
            line: { color: '#22c55e', dash: 'dot', width: 2 },
            connectgaps: false // <--- CRITICAL: Do NOT connect gaps for Forecast
        }
    ];

    if (showConsensusLine) {
        chartTraces.push({
            x: chartDates,
            y: chartConsensus,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Consensus (Chatbot)',
            line: { color: '#f97316', width: 2 },
            connectgaps: false // <--- Do NOT connect gaps
        });
    }

    return (
        <Plot
            data={chartTraces}
            layout={{
                title: getChartTitle(filters),
                plot_bgcolor: '#ffffff',
                paper_bgcolor: '#ffffff',
                font: { family: 'Inter, sans-serif', size: 12 },
                margin: { t: 40, r: 20, l: 60, b: 50 },
                xaxis: { title: 'Date', tickangle: -45, gridcolor: '#f3f4f6' },
                yaxis: { title: 'Sales Volume', gridcolor: '#f3f4f6' },
                legend: { orientation: 'h', x: 0, y: 1.1 },
                hovermode: 'x unified',
                autosize: true,
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
        />
    );
};

// Title Helper (No changes)
function getChartTitle(filters) {
    const parts = [];
    if (filters.channel) parts.push(`Channel: ${filters.channel === "All" ? "All" : filters.channel}`);
    if (filters.chain) parts.push(`Chain: ${filters.chain === "All" ? "All" : filters.chain}`);
    if (filters.depot) parts.push(`Depot: ${filters.depot === "All" ? "All" : filters.depot}`);
    if (filters.sku) parts.push(`SKU: ${filters.sku === "All" ? "All" : filters.sku}`);
    return parts.length > 0 ? `Trend: ${parts.join(' | ')}` : 'Sales Trend & Forecast';
}

export default SalesTrendChart;