import { createContext, useContext, useState } from "react";

const ForecastContext = createContext();

export const useForecast = () => useContext(ForecastContext);

export const ForecastProvider = ({ children }) => {
  const [forecastSum, setForecastSum] = useState(null);
  const [forecastValue, setForecastValue] = useState(null); // NEW
  const [yoyGrowth, setYoyGrowth] = useState(null);
  const [parentLevelForecast, setParentLevelForecast] = useState(null);



  return (
    <ForecastContext.Provider value={{
      forecastSum,
      setForecastSum,
      forecastValue,
      setForecastValue,
      yoyGrowth,
      setYoyGrowth,
      parentLevelForecast,
      setParentLevelForecast
    }}>
      {children}
    </ForecastContext.Provider>
  );
};
