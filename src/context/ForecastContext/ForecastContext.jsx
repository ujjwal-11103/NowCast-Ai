import { createContext, useContext, useState } from "react";

const ForecastContext = createContext();

export const useForecast = () => useContext(ForecastContext);

export const ForecastProvider = ({ children }) => {
  const [forecastSum, setForecastSum] = useState(null);
  const [forecastValue, setForecastValue] = useState(null); // NEW
  const [yoyGrowth, setYoyGrowth] = useState(null);
  const [parentLevelForecast, setParentLevelForecast] = useState(null);
  const [accuracyLevel, setAccuracyLevel] = useState("95%"); // Add this line


  // Add filters
  const [filters, setFilters] = useState({
    channel: null,
    chain: null,
    depot: null,
    subCat: null,
    sku: null,
  });


  return (
    <ForecastContext.Provider value={{
      forecastSum,
      setForecastSum,
      forecastValue,
      setForecastValue,
      yoyGrowth,
      setYoyGrowth,
      parentLevelForecast,
      setParentLevelForecast,
      filters,
      setFilters,
      accuracyLevel, // Add these
      setAccuracyLevel,
    }}>
      {children}
    </ForecastContext.Provider>
  );
};
