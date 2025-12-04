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
        // 1. Safety Check
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

        // 4. Clean Data 
        const cleaned = filteredData.map(d => ({
            ...d,
            // Ensure Date is a valid ISO string for sorting
            Date: new Date(d.Date).toISOString(),

            // Actuals Logic: Show only if History or > 0
            actual: (d.Period === "History" || d.actual > 0) ? Number(d.actual) : 0,

            // --- INSERT YOUR LOGIC HERE ---

            // Baseline Forecast (Green)
            // Show value only if Period is "Forecast" OR Date is >= Oct 2024. Else null.
            forecast: (d.Period === "Forecast" || d.Date >= "2024-10-01") ? Number(d.forecast) : null,

            // Consensus (Orange)
            // Show value only if Period is "Forecast" OR Date is >= Oct 2024. Else null.
            consensus: (d.Period === "Forecast" || d.Date >= "2024-10-01")
                ? (d.ConsensusForecast !== undefined ? Number(d.ConsensusForecast) : Number(d.forecast))
                : null

            // -----------------------------
        }));

        // 5. Group by Date
        const grouped = groupBy(cleaned, (d) => d.Date.substring(0, 10)); // Group by YYYY-MM-DD only

        const sortedDates = Object.keys(grouped).sort((a, b) => {
            return new Date(a).getTime() - new Date(b).getTime();
        });

        // 6. Aggregate Data
        const actualsData = sortedDates.map(date => {
            // Hide Actuals line if there is no history data for this date
            // We check if ALL rows for this date have 0 actuals and represent forecast period
            const dayData = grouped[date];

            // If any record has valid actual > 0 or is History, we sum it.
            // Otherwise return null to break the blue line.
            const hasValidActual = dayData.some(d => d.actual > 0 || d.Period === "History");

            if (!hasValidActual) return null;
            return dayData.reduce((sum, entry) => sum + (entry.actual || 0), 0);
        });

        const forecastsData = sortedDates.map(date => {
            const dayData = grouped[date];

            // If all rows have forecast as NULL for this date, return NULL
            const allNull = dayData.every(d => d.forecast === null);
            if (allNull) return null;

            // Otherwise sum the valid numbers
            return dayData.reduce((acc, item) => acc + (item.forecast || 0), 0);
        });

        const consensusData = sortedDates.map(date => {
            const dayData = grouped[date];

            const allNull = dayData.every(d => d.consensus === null);
            if (allNull) return null;

            return dayData.reduce((acc, item) => acc + (item.consensus || 0), 0);
        });

        return {
            chartDates: sortedDates,
            chartActuals: actualsData,
            chartForecasts: forecastsData,
            chartConsensus: consensusData,
            showConsensusLine: hasConsensusData
        };
    }, [filters, globalData]);

    // 7. Define Traces (Keep connectgaps: false)
    const chartTraces = [
        {
            x: chartDates,
            y: chartActuals,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Actual Sales',
            line: { color: '#3b82f6', width: 2 },
            connectgaps: false
        },
        {
            x: chartDates,
            y: chartForecasts,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Baseline Forecast',
            line: { color: '#22c55e', dash: 'dot', width: 2 },
            connectgaps: false
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
            connectgaps: false
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

// Title Helper
function getChartTitle(filters) {
    const parts = [];
    if (filters.channel) parts.push(`Channel: ${filters.channel === "All" ? "All" : filters.channel}`);
    if (filters.chain) parts.push(`Chain: ${filters.chain === "All" ? "All" : filters.chain}`);
    if (filters.depot) parts.push(`Depot: ${filters.depot === "All" ? "All" : filters.depot}`);
    if (filters.sku) parts.push(`SKU: ${filters.sku === "All" ? "All" : filters.sku}`);
    return parts.length > 0 ? `Trend: ${parts.join(' | ')}` : 'Sales Trend & Forecast';
}

export default SalesTrendChart;