import ForecastData from '@/jsons/Planning/Forecast_input.json';

// Standard profit margin assumption since cost data is missing in the forecast input
// This replaces the random self-generated margin.
const STANDARD_MARGIN_PCT = 0.35;

/**
 * Async function to fetch reporting data. 
 * Allows swapping the JSON import for a real API call (axios.get) easily in the future.
 * 
 * @returns {Promise<Array>}
 */
export const fetchReportingData = async () => {
    // Simulate network delay or implementation of axios.get('/api/forecast-data')
    // In a real scenario: const response = await axios.get('/api/reporting'); return response.data;

    return new Promise((resolve) => {
        setTimeout(() => {
            const transformedData = ForecastData.map((item, index) => {
                // Safety defaults
                const actual = Number(item.actual) || 0;
                const forecast = Number(item.forecast) || 0;
                const price = Number(item.Price) || 0;

                const salesVal = actual * price;
                const forecastVal = forecast * price;

                // Deterministic Variance
                const variance = salesVal - forecastVal;

                // Deterministic Profit (Standard Margin) - NO RANDOM values
                const profit = salesVal * STANDARD_MARGIN_PCT;

                // Deterministic Growth (Accuracy/Error)
                let growthPct = 0;
                if (forecast !== 0) {
                    growthPct = ((actual - forecast) / forecast) * 100;
                }

                return {
                    id: index,
                    date: item.Date,
                    month: new Date(item.Date).toLocaleString('default', { month: 'short' }),
                    year: new Date(item.Date).getFullYear(),
                    day: new Date(item.Date).getDate(),

                    region: item.Depot || "Unknown",
                    depot: item.Depot || "Unknown", // Alias for explicit user search
                    channel: item.Channel || "Unknown",
                    product_category: item.SubCat || "General",
                    subcategory: item.SubCat || "General", // Alias
                    sku: item.SKU,
                    chain: item.Chain,

                    sales: parseFloat(salesVal.toFixed(2)),
                    revenue: parseFloat(salesVal.toFixed(2)), // Assuming Net Rev ~ Sales for now
                    profit: parseFloat(profit.toFixed(2)),
                    units: actual,
                    forecast_units: forecast,
                    forecast_sales: parseFloat(forecastVal.toFixed(2)),
                    price: price,
                    consensus_forecast: Number(item.ConsensusForecast) || 0,
                    period: item.Period || "Unknown",
                    unique_key: item.key_new,
                    budget_variance: parseFloat(variance.toFixed(2)),
                    growth_pct: parseFloat(growthPct.toFixed(2))
                };
            });
            resolve(transformedData);
        }, 800); // Small delay to mimic API
    });
};

/**
 * Alias for fetching new data
 */
export const fetchNewReportingData = fetchReportingData;

/**
 * @deprecated Use fetchReportingData instead
 */
export const loadReportingData = fetchReportingData;
