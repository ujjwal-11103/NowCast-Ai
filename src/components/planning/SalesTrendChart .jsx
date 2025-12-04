import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { groupBy } from 'lodash';
import { useForecast } from '@/context/ForecastContext/ForecastContext';

const SalesTrendChart = () => {
    const { filters, globalData, whatIfData } = useForecast();

    const {
        chartDates, chartActuals, chartForecasts, chartConsensus, chartWhatIf, // New Data Array
        showConsensusLine, showWhatIfLine // New Flag
    } = useMemo(() => {
        if (!globalData) return { chartDates: [], chartActuals: [], chartForecasts: [], chartConsensus: [], chartWhatIf: [], showConsensusLine: false, showWhatIfLine: false };

        // 1. Helper to filter any dataset
        const filterLogic = (item) => {
            if (filters.channel && filters.channel !== "All" && item.Channel !== filters.channel) return false;
            if (filters.chain && filters.chain !== "All" && item.Chain !== filters.chain) return false;
            if (filters.depot && filters.depot !== "All" && item.Depot !== filters.depot) return false;
            if (filters.subCat && filters.subCat !== "All" && item.SubCat !== filters.subCat) return false;
            if (filters.sku && filters.sku !== "All" && item.SKU !== filters.sku) return false;
            return true;
        };

        // 2. Filter Global Data
        const filteredData = globalData.filter(filterLogic);

        // 3. Filter What-If Data (if exists)
        const filteredWhatIf = whatIfData ? whatIfData.filter(filterLogic) : [];
        const showWhatIfLine = filteredWhatIf.length > 0;

        const hasConsensusData = filteredData.some(item => item.isEdited === true);

        // 4. Combine Dates (Global + WhatIf) to ensure x-axis covers everything
        const allDates = new Set([
            ...filteredData.map(d => d.Date.substring(0, 10)),
            ...filteredWhatIf.map(d => d.Date.substring(0, 10))
        ]);
        const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));


        // 5. Group Data
        const groupedGlobal = groupBy(filteredData, d => d.Date.substring(0, 10));
        const groupedWhatIf = groupBy(filteredWhatIf, d => d.Date.substring(0, 10));

        // 6. Aggregation
        const actualsData = sortedDates.map(date => {
            const dayData = groupedGlobal[date] || [];
            const hasValidActual = dayData.some(d => d.actual > 0 || d.Period === "History");
            if (!hasValidActual) return null;
            return dayData.reduce((sum, entry) => sum + (Number(entry.actual) || 0), 0);
        });

        const forecastsData = sortedDates.map(date => {
            const dayData = groupedGlobal[date] || [];
            const allNull = dayData.every(d => d.forecast === null); // logic dependent on your data
            const sum = dayData.reduce((acc, item) => acc + (Number(item.forecast) || 0), 0);
            return sum > 0 ? sum : null;
        });

        const consensusData = sortedDates.map(date => {
            const dayData = groupedGlobal[date] || [];
            const sum = dayData.reduce((acc, item) => {
                const val = item.ConsensusForecast !== undefined ? Number(item.ConsensusForecast) : (Number(item.forecast) || 0);
                return acc + val;
            }, 0);
            return sum > 0 ? sum : null;
        });

        // 7. What-If Aggregation
        // Logic: For a specific date, if we have What-If data, plot it.
        // If we DON'T have What-If data for a date, do we show the Baseline? 
        // Usually for comparison, you want to show the full line. 
        // Approach: If WhatIf exists for this date, use it. Else use Baseline.

        const whatIfChartData = sortedDates.map(date => {
            const whatIfDay = groupedWhatIf[date];
            const globalDay = groupedGlobal[date] || [];

            // If specific What-If records exist for this date, sum them up
            if (whatIfDay && whatIfDay.length > 0) {
                return whatIfDay.reduce((sum, item) => sum + item.whatIfForecast, 0);
            }

            // If NO What-If record, check if we should show Baseline (to make a continuous line)
            // Only if it's a forecast period
            // However, usually What-If is sparse. Let's try showing ONLY the points returned first.
            // If you want a full line, we'd need to merge datasets deeper.
            // Let's stick to "Show only updated points" or "Connect gaps".
            return null;
        });

        return {
            chartDates: sortedDates, chartActuals: actualsData, chartForecasts: forecastsData, chartConsensus: consensusData, chartWhatIf: whatIfChartData,
            showConsensusLine: hasConsensusData, showWhatIfLine
        };
    }, [filters, globalData, whatIfData]);

    // 8. Define Traces
    const chartTraces = [
        {
            x: chartDates, y: chartActuals, type: 'scatter', mode: 'lines+markers', name: 'Actual Sales',
            line: { color: '#3b82f6', width: 2 }, connectgaps: false
        },
        {
            x: chartDates, y: chartForecasts, type: 'scatter', mode: 'lines+markers', name: 'Baseline Forecast',
            line: { color: '#22c55e', dash: 'dot', width: 2 }, connectgaps: false
        }
    ];

    if (showConsensusLine) {
        chartTraces.push({
            x: chartDates, y: chartConsensus, type: 'scatter', mode: 'lines+markers', name: 'Consensus (Updated)',
            line: { color: '#f97316', width: 2 }, connectgaps: false
        });
    }

    // 9. Add What-If Trace
    if (showWhatIfLine) {
        chartTraces.push({
            x: chartDates, y: chartWhatIf, type: 'scatter', mode: 'lines+markers', name: 'What-If Scenario',
            line: { color: '#9333ea', width: 3, dash: 'dashdot' }, // Purple
            connectgaps: true // Connect points to see the trend of the scenario
        });
    }

    return (
        <Plot
            data={chartTraces}
            layout={{
                title: getChartTitle(filters),
                plot_bgcolor: '#ffffff', paper_bgcolor: '#ffffff',
                font: { family: 'Inter, sans-serif', size: 12 },
                margin: { t: 40, r: 20, l: 60, b: 50 },
                xaxis: { title: 'Date', tickangle: -45, gridcolor: '#f3f4f6' },
                yaxis: { title: 'Sales Volume', gridcolor: '#f3f4f6' },
                legend: { orientation: 'h', x: 0, y: 1.1 },
                hovermode: 'x unified', autosize: true,
            }}
            style={{ width: '100%', height: '100%' }} useResizeHandler={true}
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