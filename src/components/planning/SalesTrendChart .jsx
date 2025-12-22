import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { groupBy } from 'lodash';
import { useForecast } from '@/context/ForecastContext/ForecastContext';

const SalesTrendChart = ({ chartToggle = { oos: false, seasonalityTrends: false }, customTitle, hideLegend = false, manualConsensus = null }) => {
    const { filters, globalData, whatIfData } = useForecast();

    const {
        chartDates, chartActuals, chartForecasts, chartConsensus, chartWhatIf, chartOOS, chartSeasonality, chartTrends,
        chartUpperBand, chartLowerBand,
        showConsensusLine, showWhatIfLine
    } = useMemo(() => {
        if (!globalData) return { chartDates: [], chartActuals: [], chartForecasts: [], chartConsensus: [], chartWhatIf: [], chartOOS: [], chartSeasonality: [], chartTrends: [], chartUpperBand: [], chartLowerBand: [], showConsensusLine: false, showWhatIfLine: false };

        // 1. Helper to filter any dataset
        const filterLogic = (item) => {
            if (filters.channel && filters.channel !== "All" && item.Channel !== filters.channel) return false;
            if (filters.chain && filters.chain !== "All" && item.Chain !== filters.chain) return false;
            // Removed strict checks for undefined filters to be safe, but existing logic is fine.
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

        const hasConsensusData = filteredData.some(item => item.isEdited === true) || (manualConsensus !== null);

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
            const historyRows = dayData.filter(d => d.Period === "History");
            if (historyRows.length === 0) return null;

            return historyRows.reduce((sum, entry) =>
                sum + (Number(entry.actual) || 0), 0
            );
        });

        const forecastsData = sortedDates.map(date => {
            const dayData = groupedGlobal[date] || [];

            // Lock baseline to ONLY unedited forecast rows
            const baselineRows = dayData.filter(d => !d.isEdited);

            if (baselineRows.length === 0) return null;

            const sum = baselineRows.reduce((sum, entry) =>
                sum + (Number(entry.forecast) || 0), 0
            );

            return sum > 0 ? sum : null;
        });

        const consensusData = sortedDates.map(date => {
            // Check manual override first
            if (manualConsensus && manualConsensus.hasOwnProperty(date)) {
                return manualConsensus[date];
            }

            const dayData = groupedGlobal[date] || [];
            // Only show consensus for dates from October onwards (forecast period)
            const dateObj = new Date(date);
            const month = dateObj.getMonth(); // 0-11, so October = 9
            const isOctoberOrLater = month >= 9; // October (9) onwards

            if (!isOctoberOrLater) return null;

            const sum = dayData.reduce((acc, item) => {
                // Only count if item has been edited
                if (item.isEdited) {
                    const val = item.ConsensusForecast !== undefined ? Number(item.ConsensusForecast) : (Number(item.forecast) || 0);
                    return acc + val;
                }
                return acc;
            }, 0);
            return sum > 0 ? sum : null;
        });

        // OOS Data - Using mapped OOS Days values from API
        const oosData = sortedDates.map(date => {
            const dayData = groupedGlobal[date] || [];
            // Sum OOS Days values for the date
            const sum = dayData.reduce((acc, item) => acc + (Number(item.oosData) || 0), 0);
            return sum >= 0 ? sum : null;
        });

        // Seasonality Data - Using mapped Seasonal Break values from API
        const seasonalityData = sortedDates.map(date => {
            const dayData = groupedGlobal[date] || [];
            // Sum Seasonal Break values for the date
            const sum = dayData.reduce((acc, item) => acc + (Number(item.seasonalityData) || 0), 0);
            return sum >= 0 ? sum : null;
        });



        // Trends Data - Using mapped TrendAnalysis values from API
        const trendsData = sortedDates.map(date => {
            const dayData = groupedGlobal[date] || [];
            // Sum TrendAnalysis values for the date
            const sum = dayData.reduce((acc, item) => acc + (Number(item.trendsData) || 0), 0);
            return sum >= 0 ? sum : null;
        });

        // 7a. Confidence Intervals (Upper/Lower Band)
        const upperBandData = sortedDates.map(date => {
            const dayData = groupedGlobal[date] || [];
            const baselineRows = dayData.filter(d => !d.isEdited);
            if (baselineRows.length === 0) return null;

            // Check if data has bands
            const hasBand = baselineRows.some(d => d.upperBand !== null && d.upperBand !== undefined);
            if (!hasBand) return null;

            const sum = baselineRows.reduce((sum, entry) => sum + (Number(entry.upperBand) || 0), 0);
            return sum > 0 ? sum : null;
        });

        const lowerBandData = sortedDates.map(date => {
            const dayData = groupedGlobal[date] || [];
            const baselineRows = dayData.filter(d => !d.isEdited);
            if (baselineRows.length === 0) return null;

            const hasBand = baselineRows.some(d => d.lowerBand !== null && d.lowerBand !== undefined);
            if (!hasBand) return null;

            const sum = baselineRows.reduce((sum, entry) => sum + (Number(entry.lowerBand) || 0), 0);
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
                const sum = whatIfDay.reduce((sum, item) => sum + item.whatIfForecast, 0);
                return sum;
            }

            // If NO What-If record, check if we should show Baseline (to make a continuous line)
            // Only if it's a forecast period
            // However, usually What-If is sparse. Let's try showing ONLY the points returned first.
            // If you want a full line, we'd need to merge datasets deeper.
            // Let's stick to "Show only updated points" or "Connect gaps".
            return null;
        });

        return {
            chartDates: sortedDates,
            chartActuals: actualsData,
            chartForecasts: forecastsData,
            chartConsensus: consensusData,
            chartWhatIf: whatIfChartData,
            chartOOS: oosData,
            chartSeasonality: seasonalityData,
            chartTrends: trendsData,
            chartUpperBand: upperBandData,
            chartLowerBand: lowerBandData,
            showConsensusLine: hasConsensusData,
            showWhatIfLine
        };
    }, [filters, globalData, whatIfData, chartToggle, manualConsensus]);

    // 8. Define Traces - Actual and Baseline always visible, OOS/Seasonality/Trend toggleable
    const chartTraces = [];

    // Confidence Interval Traces (Background)
    const hasConfidenceData = chartUpperBand && chartLowerBand && chartUpperBand.some(v => v !== null);
    if (hasConfidenceData) {
        chartTraces.push({
            x: chartDates,
            y: chartLowerBand,
            type: 'scatter',
            mode: 'lines',
            line: { width: 0 },
            marker: { color: "444" },
            showlegend: false,
            hoverinfo: 'skip',
            yaxis: 'y1'
        });
        chartTraces.push({
            x: chartDates,
            y: chartUpperBand,
            type: 'scatter',
            mode: 'lines',
            line: { width: 0 },
            marker: { color: "444" },
            fill: 'tonexty',
            fillcolor: 'rgba(34, 197, 94, 0.15)', // Light transparent green matching baseline
            name: 'Confidence Interval',
            hoverinfo: 'skip',
            yaxis: 'y1'
        });
    }

    // Always show Actual Sales (Primary - Left Y-axis)
    chartTraces.push({
        x: chartDates,
        y: chartActuals,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Actual Sales',
        line: { color: '#3b82f6', width: 2 },
        connectgaps: false,
        yaxis: 'y1'
    });

    // Always show Baseline Forecast (Primary - Left Y-axis)
    chartTraces.push({
        x: chartDates,
        y: chartForecasts,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Baseline Forecast',
        line: { color: '#22c55e', width: 2, dash: 'dot' },
        connectgaps: false,
        yaxis: 'y1'
    });

    // Show Consensus if it has been edited
    if (showConsensusLine) {
        chartTraces.push({
            x: chartDates,
            y: chartConsensus,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Consensus (Updated)',
            line: { color: '#f97316', width: 2 },
            connectgaps: false,
            yaxis: 'y1'
        });
    }

    // Toggle: OOS Days (Secondary Y-axis - only when OOS is on, use dual axes)
    if (chartToggle.oos) {
        chartTraces.push({
            x: chartDates,
            y: chartOOS,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'OOS Days',
            line: { color: '#ef4444', width: 2, dash: 'dot' },
            connectgaps: false,
            yaxis: 'y2'
        });
    }

    // Toggle: Seasonality & Trend (Primary Y-axis)
    if (chartToggle.seasonalityTrends) {
        chartTraces.push({
            x: chartDates,
            y: chartSeasonality,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Seasonality',
            line: { color: '#eab308', width: 2, dash: 'dash' },
            connectgaps: false,
            yaxis: 'y1'
        });
        chartTraces.push({
            x: chartDates,
            y: chartTrends,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Trend Analysis',
            line: { color: '#06b6d4', width: 2, dash: 'dashdot' },
            connectgaps: false,
            yaxis: 'y1'
        });
    }

    // Show What-If if it exists
    if (showWhatIfLine) {
        chartTraces.push({
            x: chartDates,
            y: chartWhatIf,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'What-If Scenario',
            line: { color: '#9333ea', width: 3, dash: 'dashdot' },
            connectgaps: true,
            yaxis: 'y1'
        });
    }

    // Build layout based on whether OOS is toggled
    const layoutConfig = {
        title: customTitle !== undefined ? customTitle : 'OOS Days Analysis',
        plot_bgcolor: '#ffffff',
        paper_bgcolor: '#ffffff',
        font: { family: 'Inter, sans-serif', size: 12 },
        margin: { t: 40, r: chartToggle.oos ? 80 : 20, l: 60, b: 50 },
        xaxis: { title: 'Date', tickangle: -45, gridcolor: '#f3f4f6' },
        yaxis: {
            title: 'Sales Volume',
            titlefont: { color: '#3b82f6' },
            tickfont: { color: '#3b82f6' },
            gridcolor: '#f3f4f6',
            side: 'left'
        },
        legend: { orientation: 'h', x: 0, y: 1.1, visible: !hideLegend },
        hovermode: 'x unified',
        autosize: true,
    };

    // Only add yaxis2 if OOS is toggled on
    if (chartToggle.oos) {
        layoutConfig.yaxis2 = {
            title: 'OOS Days',
            titlefont: { color: '#ef4444' },
            tickfont: { color: '#ef4444' },
            gridcolor: '#f3f4f6',
            overlaying: 'y',
            side: 'right'
        };
    }

    return (
        <Plot
            data={chartTraces}
            layout={layoutConfig}
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