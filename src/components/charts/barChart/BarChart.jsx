import React from "react";
import { Bar } from "react-chartjs-2";
import styles from "./BarChart.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

const BarChart = ({ data, options }) => {
  return (
    <div className={styles.barChart}>
      <Bar type="bar" data={data} options={options} />
    </div>
  );
};

export default BarChart;
