import Plot from 'react-plotly.js';
import rawData from "../../jsons/Planning/JF_censored.json";
import { useMemo } from 'react';
import { groupBy } from 'lodash';
import { useForecast } from '@/context/ForecastContext/ForecastContext';

const SalesTrendChart = () => {

    const { filters } = useForecast();


    const { dates, actuals, forecasts } = useMemo(() => {
        const filteredData = rawData.filter((item) => {
            return (!filters.channel || item.Channel === filters.channel) &&
                (!filters.chain || item.Chain === filters.chain) &&
                (!filters.depot || item.Depot === filters.depot) &&
                (!filters.subCat || item.SubCat === filters.subCat) &&
                (!filters.sku || item.SKU === filters.sku);
        });

        const cleaned = filteredData.map(d => ({
            ...d,
            Date: d.Date,
            actual: Number(d.actual),
            forecast: d.forecast ? Number(d.forecast) : 0,
        }));

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
                title: 'Sales Trend',
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
export default SalesTrendChart;
