import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";

import styles from "./BoxChart.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BoxPlotController,
  BoxAndWiskers,
  Title,
  Tooltip,
  Legend
);

const BoxChart = ({ data, options }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    chartRef.current = new ChartJS(canvasRef.current.getContext("2d"), {
      type: "boxplot",
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
    <div className={styles.boxChart}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BoxChart;
