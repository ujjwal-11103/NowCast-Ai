import { createContext, useContext, useState, useEffect } from "react";

const ForecastContext = createContext();

export const useForecast = () => useContext(ForecastContext);

export const ForecastProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [whatIfData, setWhatIfData] = useState([]);

  const [forecastSum, setForecastSum] = useState(null);
  const [forecastValue, setForecastValue] = useState(null);
  const [yoyGrowth, setYoyGrowth] = useState(null);
  const [parentLevelForecast, setParentLevelForecast] = useState(null);

  // --- NEW STATE VARIABLES ---
  const [accuracy, setAccuracy] = useState(null);
  const [bias, setBias] = useState(null);
  // ---------------------------

  const [accuracyLevel, setAccuracyLevel] = useState("95%");

  const [filters, setFilters] = useState({
    channel: null, chain: null, depot: null, subCat: null, sku: null,
  });

  // 1. FETCH DATA FROM API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://20.235.178.245:3001/api/planning/data");
        // const response = await fetch("http://localhost:3001/api/planning/data");
        const result = await response.json();

        if (result.success && result.data) {
          const mappedData = result.data.map(item => ({
            ...item,
            Date: item.Date,
            key: `${item.Chain}_${item.Depot}_${item.SubCat}_${item.SKU}`,
            actual: item.ActualForecast !== null ? Number(item.ActualForecast) : 0,
            forecast: item.PredictedForecast !== null ? Number(item.PredictedForecast) : 0,
            ConsensusForecast: (item.ConsensusForecast && item.ConsensusForecast !== 0)
              ? Number(item.ConsensusForecast)
              : (item.PredictedForecast !== null ? Number(item.PredictedForecast) : 0),
            Price: Number(item.Price) || 0,
            // OOS, Seasonality, and Trends data from API with correct field names
            oosData: item['OOS Days'] !== null && item['OOS Days'] !== undefined ? Number(item['OOS Days']) : 0,
            seasonalityData: item['Seasonal Break'] !== null && item['Seasonal Break'] !== undefined ? Number(item['Seasonal Break']) : 0,
            trendsData: item['TrendAnalysis'] !== null && item['TrendAnalysis'] !== undefined ? Number(item['TrendAnalysis']) : 0,
            isEdited: false
          }));
          setGlobalData(mappedData);
        }
      } catch (error) {
        console.error("Error fetching planning data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. UPDATE DATA FROM CHATBOT
  const updateForecastData = (updatedRecords, metadata, parsedFilters) => {
    if (!updatedRecords || updatedRecords.length === 0) return;

    // --- NEW: CLIENT-SIDE FILTERING ---
    let recordsToProcess = updatedRecords;

    // Check if the user specifically requested SKUs
    if (parsedFilters?.SKU && parsedFilters.SKU.length > 0) {
      console.log(`Filtering update for requested SKUs: ${parsedFilters.SKU.join(", ")}`);

      // Keep only records that match the requested SKUs
      recordsToProcess = updatedRecords.filter(record =>
        parsedFilters.SKU.includes(record.SKU)
      );
    }
    // You can add similar logic for Depot, Chain, etc. if needed
    // ----------------------------------

    if (recordsToProcess.length === 0) {
      console.warn("No records matched the requested SKU filter.");
      return;
    }

    console.log(`Merging ${recordsToProcess.length} records from Chatbot...`);

    setGlobalData(prevData => {
      const getUniqueId = (k, d) => `${k}_${String(d).substring(0, 10)}`;

      // Use 'recordsToProcess' instead of 'updatedRecords'
      const updatesMap = new Map(
        recordsToProcess.map(item => [getUniqueId(item.key, item.Date), item])
      );

      const updatedExistingData = prevData.map(row => {
        const rowId = getUniqueId(row.key, row.Date);
        if (updatesMap.has(rowId)) {
          const update = updatesMap.get(rowId);
          return {
            ...row,
            ConsensusForecast: update.ConsensusForecast,
            forecast: update.PredictedForecast !== undefined ? update.PredictedForecast : row.forecast,
            salesInput: metadata ? {
              value: metadata.value,
              owner: metadata.owner,
              comment: metadata.reason
            } : null,
            isEdited: true
          };
        }
        return row;
      });

      // Upsert logic
      const existingKeys = new Set(prevData.map(row => getUniqueId(row.key, row.Date)));
      const newRecords = recordsToProcess
        .filter(item => !existingKeys.has(getUniqueId(item.key, item.Date)))
        .map(item => ({
          // ... (Same mapping as before) ...
          ...item,
          actual: 0,
          forecast: item.PredictedForecast || 0,
          ConsensusForecast: item.ConsensusForecast || 0,
          Price: item.Price || 0,
          Period: "Forecast",
          isEdited: true,
          salesInput: metadata ? {
            value: metadata.value,
            owner: metadata.owner,
            comment: metadata.reason
          } : null
        }));

      return [...updatedExistingData, ...newRecords];
    });
  };

  // 3. FUNCTION TO HANDLE WHAT-IF SCENARIO
  const handleWhatIfScenario = (scenarioRecords) => {
    if (!scenarioRecords || scenarioRecords.length === 0) return;

    console.log("Processing What-If Scenario...", scenarioRecords.length);

    // We map the API's 'New_Forecast' to a structure the chart can read
    // We need to match these records to existing data to get dates/keys if needed,
    // or just store them as a separate overlay layer.
    // Based on the API response, 'updated_records' has Date, SKU, Depot etc.

    const mappedScenario = scenarioRecords.map(item => ({
      ...item,
      // Construct Key to match chart grouping
      key: `${item.Channel}_${item.Chain}_${item.Depot}_${item.SubCat}_${item.SKU}`,
      // Handle Negative Forecast Rule
      whatIfForecast: item.New_Forecast < 0 ? 0 : item.New_Forecast,
      isScenario: true
    }));

    setWhatIfData(mappedScenario);
  };

  return (
    <ForecastContext.Provider value={{
      globalData, setGlobalData, isLoading,
      updateForecastData,
      whatIfData, setWhatIfData, handleWhatIfScenario,
      forecastSum, setForecastSum,
      forecastValue, setForecastValue,
      yoyGrowth, setYoyGrowth,
      parentLevelForecast, setParentLevelForecast,
      filters, setFilters,
      accuracyLevel, setAccuracyLevel,
      accuracy, setAccuracy, // Export new state
      bias, setBias          // Export new state
    }}>
      {children}
    </ForecastContext.Provider>
  );
};