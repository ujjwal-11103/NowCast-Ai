import { createContext, useContext, useState, useEffect } from "react";
// 1. Import the NEW data file
import initialData from "../../jsons/Planning/Forecast_input.json";

const ForecastContext = createContext();

export const useForecast = () => useContext(ForecastContext);

export const ForecastProvider = ({ children }) => {
  // 2. Process data on load to standardise keys
  const processedData = initialData.map(item => ({
    ...item,
    // The app expects "key", but new data has "key_new".
    // We map it here so the rest of the app doesn't break.
    key: item.key_new || `${item.Channel}_${item.Chain}_${item.Depot}_${item.SubCat}_${item.SKU}`
  }));

  const [globalData, setGlobalData] = useState(processedData);

  const [forecastSum, setForecastSum] = useState(null);
  const [forecastValue, setForecastValue] = useState(null);
  const [yoyGrowth, setYoyGrowth] = useState(null);
  const [parentLevelForecast, setParentLevelForecast] = useState(null);
  const [accuracyLevel, setAccuracyLevel] = useState("95%");

  const [filters, setFilters] = useState({
    channel: null, chain: null, depot: null, subCat: null, sku: null,
  });

  // FUNCTION TO UPDATE DATA FROM CHATBOT
  const updateForecastData = (updatedRecords) => {
    if (!updatedRecords || updatedRecords.length === 0) return;

    setGlobalData(prevData => {
      const existingKeys = new Set(prevData.map(row => row.key));
      const updatesMap = new Map(updatedRecords.map(item => [item.key, item]));

      const updatedExistingData = prevData.map(row => {
        if (updatesMap.has(row.key)) {
          const update = updatesMap.get(row.key);
          return {
            ...row,
            forecast: update.forecast !== undefined ? update.forecast : row.forecast,
            isEdited: true
          };
        }
        return row;
      });

      const newRecords = updatedRecords.filter(item => !existingKeys.has(item.key));
      return [...updatedExistingData, ...newRecords];
    });
  };

  return (
    <ForecastContext.Provider value={{
      globalData,
      setGlobalData,
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