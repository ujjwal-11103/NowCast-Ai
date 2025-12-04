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

  // 2. UPDATE DATA FROM CHATBOT
  const updateForecastData = (updatedRecords, metadata) => {
    if (!updatedRecords || updatedRecords.length === 0) return;
    console.log(`Merging ${updatedRecords.length} records from Chatbot...`);

    setGlobalData(prevData => {
      const getUniqueId = (k, d) => `${k}_${String(d).substring(0, 10)}`;

      const updatesMap = new Map(
        updatedRecords.map(item => [getUniqueId(item.key, item.Date), item])
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

      // Upsert logic for new rows
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

  return (
    <ForecastContext.Provider value={{
      globalData, setGlobalData, isLoading,
      updateForecastData,
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