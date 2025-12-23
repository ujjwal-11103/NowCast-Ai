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
            oosData: item['OOS_Days'] !== null && item['OOS_Days'] !== undefined ? Number(item['OOS_Days']) : 0,
            seasonalityData: item['Seasonality'] !== null && item['Seasonality'] !== undefined ? Number(item['Seasonality']) : 0,
            trendsData: item['Trend'] !== null && item['Trend'] !== undefined ? Number(item['Trend']) : 0,
            upperBand: item['Upper_CL'] !== undefined ? Number(item['Upper_CL']) : (Number(item.PredictedForecast) * 1.15),
            lowerBand: item['Lower_CL'] !== undefined ? Number(item['Lower_CL']) : (Number(item.PredictedForecast) * 0.85),
            // New fields for Trend/Summary: Map directly from API
            Recent_Trend_Category: item.Recent_Trend_Category,
            Long_Term_Trend_Category: item["Long-term_Trend_Category"],
            Forecast_Summary: item.Forecast_Summary,
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

    // --- PRE-PROCESS RECORDS TO ENSURE KEYS AND TYPES MATCH ---
    const sanitizedRecords = recordsToProcess.map(record => {
      // Ensure key matches the format used in fetchInitialData
      // Added fallback for SubCategory just in case
      const key = record.key || `${record.Chain}_${record.Depot}_${record.SubCat || record.SubCategory}_${record.SKU}`;

      // Determine the new consensus value. 
      // If the API returns 'ConsensusForecast', use it. 
      // If not, but returns 'PredictedForecast' (common in ML updates), use that as the new consensus.
      let newConsensus = record.ConsensusForecast;
      if (newConsensus === undefined || newConsensus === null) {
        newConsensus = record.PredictedForecast;
      }

      return {
        ...record,
        key,
        ConsensusForecast: newConsensus !== undefined && newConsensus !== null ? Number(newConsensus) : 0,
        PredictedForecast: record.PredictedForecast !== undefined ? Number(record.PredictedForecast) : undefined
      };
    });

    setGlobalData(prevData => {
      const getUniqueId = (k, d) => `${k}_${String(d).substring(0, 10)}`;

      // Helper set for fast existing key check
      const existingKeySet = new Set(prevData.map(row => getUniqueId(row.key, row.Date)));

      // --- SMART KEY MATCHING ---
      // If the constructed key doesn't match an existing record, search for a semantic match (SKU + Date)
      // and adopt the existing key to ensure WE UPDATE instead of INSERT (preventing duplicates).
      const finalUpdates = sanitizedRecords.map(update => {
        const currentId = getUniqueId(update.key, update.Date);
        if (existingKeySet.has(currentId)) {
          return update; // Exact match found
        }

        // Fuzzy match: Look for same SKU and Date
        // Normalize Date comparison (first 10 chars)
        const updateDate = String(update.Date).substring(0, 10);

        // Relaxed Match: Prioritize SKU and Date. 
        // We assume that for a single Date, an SKU only appears once in the flat list (or at least within the same context).
        const strictMatch = prevData.find(row => {
          const rowDate = String(row.Date).substring(0, 10);
          return row.SKU === update.SKU && rowDate === updateDate;
        });

        if (strictMatch) {
          console.log(`SmartMatch (Relaxed): Linked update for ${update.SKU} (${updateDate}) to existing key ${strictMatch.key}`);
          return { ...update, key: strictMatch.key };
        }

        return update; // True new record
      });


      // Build Map from final updates
      const updatesMap = new Map(
        finalUpdates.map(item => [getUniqueId(item.key, item.Date), item])
      );

      const updatedExistingData = prevData.map(row => {
        const rowId = getUniqueId(row.key, row.Date);
        if (updatesMap.has(rowId)) {
          const update = updatesMap.get(rowId);
          return {
            ...row,
            ConsensusForecast: update.ConsensusForecast, // Now guaranteed to be a number (or 0)
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

      // Upsert logic - only add if truly new (not in existingKeys)
      // Note: We used 'finalUpdates' which might have corrected keys now.
      // Re-evaluate existing keys against the FINAL update keys.
      const newRecords = finalUpdates
        .filter(item => !existingKeySet.has(getUniqueId(item.key, item.Date)))
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