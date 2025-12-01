import { createContext, useContext, useState, useEffect } from "react";
import initialData from "../../jsons/Planning/JF_censored.json";

const ForecastContext = createContext();

export const useForecast = () => useContext(ForecastContext);

export const ForecastProvider = ({ children }) => {
  // Initialize state with your JSON file
  const [globalData, setGlobalData] = useState(initialData);

  const [forecastSum, setForecastSum] = useState(null);
  const [forecastValue, setForecastValue] = useState(null);
  const [yoyGrowth, setYoyGrowth] = useState(null);
  const [parentLevelForecast, setParentLevelForecast] = useState(null);
  const [accuracyLevel, setAccuracyLevel] = useState("95%");

  const [filters, setFilters] = useState({
    channel: null, chain: null, depot: null, subCat: null, sku: null,
  });

  // FUNCTION TO UPDATE DATA FROM API
  // 'updatedRecords' is the array returned by your API (consensus_data)
  const updateForecastData = (updatedRecords) => {
    if (!updatedRecords || updatedRecords.length === 0) return;

    // Create a map for faster lookup: Key -> New Record
    // The API doc says the response has a "key" field, just like your JSON
    const updatesMap = new Map(updatedRecords.map(item => [item.key, item]));

    setGlobalData(prevData => {
      // Iterate through the existing 1000+ rows
      return prevData.map(row => {
        // If this row's key exists in the API response, replace/update it
        if (updatesMap.has(row.key)) {
          const update = updatesMap.get(row.key);

          return {
            ...row,
            // Update the forecast value. 
            // The API returns 'forecast' key with the new number [cite: 325]
            forecast: update.forecast !== undefined ? update.forecast : row.forecast,

            // You might also want to track that this was edited
            isEdited: true
          };
        }
        // Otherwise, leave the row alone
        return row;
      });
    });
  };

  return (
    <ForecastContext.Provider value={{
      globalData,
      setGlobalData,
      updateForecastData, // Expose this function
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