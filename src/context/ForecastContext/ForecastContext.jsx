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

  // 1. FETCH DATA FROM API
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
            key: `${item.Channel}_${item.Chain}_${item.Depot}_${item.SubCat}_${item.SKU}`,
            actual: item.ActualForecsat !== null ? Number(item.ActualForecsat) : 0,
            forecast: item.PredictedForecast !== null ? Number(item.PredictedForecast) : 0,
            ConsensusForecast: (item.ConsensusForecast && item.ConsensusForecast !== 0)
              ? Number(item.ConsensusForecast)
              : (item.PredictedForecast !== null ? Number(item.PredictedForecast) : 0),
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

  // 2. FUNCTION TO UPDATE DATA FROM CHATBOT (FIXED DATE MATCHING)
  const updateForecastData = (updatedRecords, metadata) => { // Accept metadata
    if (!updatedRecords || updatedRecords.length === 0) return;

    console.log(`Merging ${updatedRecords.length} records from Chatbot...`);

    setGlobalData(prevData => {

      const getUniqueId = (k, d) => `${k}_${String(d).substring(0, 10)}`;

      const updatesMap = new Map(
        updatedRecords.map(item => [
          getUniqueId(item.key, item.Date),
          item
        ])
      );

      const updatedExistingData = prevData.map(row => {
        const rowId = getUniqueId(row.key, row.Date);

        if (updatesMap.has(rowId)) {
          const update = updatesMap.get(rowId);

          return {
            ...row,
            ConsensusForecast: update.ConsensusForecast,
            forecast: update.PredictedForecast !== undefined ? update.PredictedForecast : row.forecast,

            // USE METADATA HERE
            salesInput: metadata ? {
              value: metadata.value, // e.g. 100
              owner: metadata.owner, // e.g. CurrentUser
              comment: metadata.reason // e.g. collapse
            } : null,

            isEdited: true
          };
        }
        return row;
      });

      // 3. Add New Rows (Upsert)
      // Check existing keys using the Key+Date combination
      const existingKeys = new Set(prevData.map(row => getUniqueId(row.key, row.Date)));

      const newRecords = updatedRecords
        .filter(item => !existingKeys.has(getUniqueId(item.key, item.Date)))
        .map(item => ({
          ...item,
          actual: 0,
          forecast: item.PredictedForecast || 0,
          ConsensusForecast: item.ConsensusForecast || 0,
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