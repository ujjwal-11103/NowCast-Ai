import { createContext, useContext, useState, useEffect } from "react";

const ForecastContext = createContext();

export const useForecast = () => useContext(ForecastContext);

export const ForecastProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [forecastSum, setForecastSum] = useState(null);
  const [forecastValue, setForecastValue] = useState(null);
  const [yoyGrowth, setYoyGrowth] = useState(null);
  const [parentLevelForecast, setParentLevelForecast] = useState(null);
  const [accuracyLevel, setAccuracyLevel] = useState("95%");

  const [filters, setFilters] = useState({
    channel: null, chain: null, depot: null, subCat: null, sku: null,
  });

  // 1. FETCH DATA FROM API ON MOUNT
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/planning/data");
        const result = await response.json();

        if (result.success && result.data) {
          const mappedData = result.data.map(item => ({
            ...item,
            Date: item.Date,
            // Construct Key manually to ensure consistency
            key: `${item.Channel}_${item.Chain}_${item.Depot}_${item.SubCat}_${item.SKU}`,

            // Map API fields to App State names
            actual: item.ActualForecsat !== null ? Number(item.ActualForecsat) : 0,

            // Baseline = PredictedForecast
            forecast: item.PredictedForecast !== null ? Number(item.PredictedForecast) : 0,

            // Consensus = ConsensusForecast (fallback to Predicted if missing)
            ConsensusForecast: (item.ConsensusForecast !== undefined && item.ConsensusForecast !== null)
              ? Number(item.ConsensusForecast)
              : (Number(item.PredictedForecast) || 0),

            Price: Number(item.Price) || 0,
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

  useEffect(() => {
    console.log("initial data ", globalData);
  }, [globalData])

  // 2. FUNCTION TO UPDATE DATA FROM CHATBOT (FIXED MAPPING)
  const updateForecastData = (updatedRecords) => {
    if (!updatedRecords || updatedRecords.length === 0) return;

    console.log(`Merging ${updatedRecords.length} records from Chatbot...`);

    setGlobalData(prevData => {
      const updatesMap = new Map(updatedRecords.map(item => [item.key, item]));
      const existingKeys = new Set(prevData.map(row => row.key));

      // A. Update Existing Rows
      const updatedExistingData = prevData.map(row => {
        if (updatesMap.has(row.key)) {
          const update = updatesMap.get(row.key);

          return {
            ...row,
            // --- CRITICAL FIX HERE ---
            // 1. Update Consensus with the API's 'ConsensusForecast' field
            ConsensusForecast: update.ConsensusForecast,

            // 2. Ensure Baseline (forecast) stays as 'PredictedForecast' (or row.forecast)
            // (This keeps the Green Line static)
            forecast: update.PredictedForecast !== undefined ? update.PredictedForecast : row.forecast,

            // 3. Mark as edited to trigger Orange Line
            isEdited: true
          };
        }
        return row;
      });

      // B. Add New Rows (Upsert)
      const newRecords = updatedRecords
        .filter(item => !existingKeys.has(item.key))
        .map(item => ({
          ...item,
          actual: 0,
          // Map correct fields for new records
          forecast: item.PredictedForecast || 0, // Baseline
          ConsensusForecast: item.ConsensusForecast || 0, // Consensus
          Price: item.Price || 0,
          Period: "Forecast",
          isEdited: true
        }));

      return [...updatedExistingData, ...newRecords];
    });
  };

  return (
    <ForecastContext.Provider value={{
      globalData, setGlobalData, isLoading,
      updateForecastData,
      forecastSum, setForecastSum,
      forecastValue, setForecastValue,
      yoyGrowth, setYoyGrowth,
      parentLevelForecast, setParentLevelForecast,
      filters, setFilters,
      accuracyLevel, setAccuracyLevel
    }}>
      {children}
    </ForecastContext.Provider>
  );
};