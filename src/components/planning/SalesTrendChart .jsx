import Plot from 'react-plotly.js';
import rawData from "../../jsons/Planning/JF_censored.json";
import { useMemo } from 'react';
import { groupBy } from 'lodash';
import { useForecast } from '@/context/ForecastContext/ForecastContext';

const SalesTrendChart = () => {
    const { filters } = useForecast();

    const { dates, actuals, forecasts } = useMemo(() => {
        // Determine which filters are set to "All" or have specific values
        const filterConditions = {
            channel: filters.channel === "All" ? null : filters.channel,
            chain: filters.chain === "All" ? null : filters.chain,
            depot: filters.depot === "All" ? null : filters.depot,
            subCat: filters.subCat === "All" ? null : filters.subCat,
            sku: filters.sku === "All" ? null : filters.sku
        };

        // Filter data based on the selected filters
        const filteredData = rawData.filter((item) => {
            return (!filterConditions.channel || item.Channel === filterConditions.channel) &&
                   (!filterConditions.chain || item.Chain === filterConditions.chain) &&
                   (!filterConditions.depot || item.Depot === filterConditions.depot) &&
                   (!filterConditions.subCat || item.SubCat === filterConditions.subCat) &&
                   (!filterConditions.sku || item.SKU === filterConditions.sku);
        });

        // Clean and convert numeric values
        const cleaned = filteredData.map(d => ({
            ...d,
            Date: d.Date,
            actual: Number(d.actual),
            forecast: d.forecast ? Number(d.forecast) : 0,
        }));

        // Group by date and calculate sums
        const grouped = groupBy(cleaned, 'Date');
        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

        const actuals = sortedDates.map(date =>
            grouped[date].reduce((sum, entry) => sum + (entry.actual || 0), 0)
        );
        const forecasts = sortedDates.map(date =>
            grouped[date].reduce((sum, entry) => sum + (entry.forecast || 0), 0)
        );

        return { dates: sortedDates, actuals, forecasts };
    }, [filters]);

    return (
        <Plot
            data={[
                {
                    x: dates,
                    y: actuals,
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Actual Sales',
                    line: { color: '#a0aec0', width: 2 },
                },
                {
                    x: dates,
                    y: forecasts,
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Forecast',
                    line: { color: '#48bb78', dash: 'dot', width: 2 },
                },
            ]}
            layout={{
                title: getChartTitle(filters),
                plot_bgcolor: '#f7fafc',
                paper_bgcolor: '#f7fafc',
                font: { family: 'Arial', size: 12 },
                margin: { t: 40, r: 10, l: 50, b: 50 },
                xaxis: { title: 'Date', tickangle: -45 },
                yaxis: { title: 'Sales Volume' },
                legend: { orientation: 'h', x: 0, y: -0.2 },
                hovermode: 'x unified',
                responsive: true,
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
        />
    );
};

// Helper function to generate chart title based on filters
function getChartTitle(filters) {
    const parts = [];
    
    if (filters.channel) {
        parts.push(`Channel: ${filters.channel === "All" ? "All Channels" : filters.channel}`);
    }
    if (filters.chain) {
        parts.push(`Chain: ${filters.chain === "All" ? "All Chains" : filters.chain}`);
    }
    if (filters.depot) {
        parts.push(`Depot: ${filters.depot === "All" ? "All Depots" : filters.depot}`);
    }
    if (filters.subCat) {
        parts.push(`SubCat: ${filters.subCat === "All" ? "All SubCategories" : filters.subCat}`);
    }
    if (filters.sku) {
        parts.push(`SKU: ${filters.sku === "All" ? "All SKUs" : filters.sku}`);
    }

    return parts.length > 0 ? `Sales Trend (${parts.join(', ')})` : 'Sales Trend';
}

export default SalesTrendChart;