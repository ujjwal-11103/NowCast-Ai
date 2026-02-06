import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, Tooltip, Legend, Title } from "chart.js";
import {
  ChoroplethController,
  GeoFeature,
  ProjectionScale,
  ColorScale,
} from "chartjs-chart-geo";
import styles from "./GeoChart.module.scss";
import * as topojson from "topojson-client";

ChartJS.register(
  ChoroplethController,
  GeoFeature,
  ProjectionScale,
  ColorScale,
  Tooltip,
  Legend,
  Title
);

const GeoChart = ({ data, options }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    chartRef.current = new ChartJS(canvasRef.current.getContext("2d"), {
      type: "choropleth",
      data: data,
      options: options,
    });

    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options]); // Depend on data and options if needed

  return (
    <div className={styles.geoChart}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GeoChart;
