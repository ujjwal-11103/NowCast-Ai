import { createContext, useContext, useState, useEffect } from "react";

const ForecastContext = createContext();

export const useForecast = () => useContext(ForecastContext);

export const ForecastProvider = ({ children }) => {
  // 1. Initialize State (Empty initially)
  const [globalData, setGlobalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const [forecastSum, setForecastSum] = useState(null);
  const [forecastValue, setForecastValue] = useState(null);
  const [yoyGrowth, setYoyGrowth] = useState(null);
  const [parentLevelForecast, setParentLevelForecast] = useState(null);
  const [accuracyLevel, setAccuracyLevel] = useState("95%");

  const [filters, setFilters] = useState({
    channel: null, chain: null, depot: null, subCat: null, sku: null,
  });

  // 2. FETCH DATA FROM API ON MOUNT
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/planning/data");
        const result = await response.json();

        if (result.success && result.data) {

          // 3. MAP API DATA TO APP STRUCTURE
          const mappedData = result.data.map(item => ({
            ...item,

            // Standardize Date (Ensure it's a string, API sends ISO)
            Date: item.Date,

            // Standardize Key (Construct manually to match Chatbot logic)
            // Format: Channel_Chain_Depot_SubCat_SKU
            key: `${item.Channel}_${item.Chain}_${item.Depot}_${item.SubCat}_${item.SKU}`,

            // Map Metrics (Handle Typo in API 'ActualForecsat')
            actual: item.ActualForecsat !== null ? Number(item.ActualForecsat) : 0,

            // Map Baseline Forecast
            // If Predicted is null, default to 0
            forecast: item.PredictedForecast !== null ? Number(item.PredictedForecast) : 0,

            // Map Consensus
            // If Consensus is 0 or null, fallback to Predicted (Baseline) so graph lines overlap initially
            ConsensusForecast: (item.ConsensusForecast && item.ConsensusForecast !== 0)
              ? Number(item.ConsensusForecast)
              : (item.PredictedForecast !== null ? Number(item.PredictedForecast) : 0),

            // Ensure Price is a number
            Price: Number(item.Price) || 0,

            isEdited: false
          }));

          setGlobalData(mappedData);
        } else {
          console.error("API returned success: false or no data");
        }
      } catch (error) {
        console.error("Error fetching planning data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 4. FUNCTION TO UPDATE DATA FROM CHATBOT
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
            // Update Consensus with new value from Chatbot API
            // The chatbot API returns 'forecast' field as the new consensus value
            ConsensusForecast: update.forecast,
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
          // Map the chatbot response format to App format
          actual: 0, // New forecast record usually has no history
          forecast: item.forecast, // Baseline
          ConsensusForecast: item.forecast, // Consensus
          Price: item.Price || 0,
          Period: "Forecast",
          isEdited: true
        }));

      return [...updatedExistingData, ...newRecords];
    });
  };

  return (
    <ForecastContext.Provider value={{
      globalData,
      setGlobalData,
      isLoading, // Expose loading state
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