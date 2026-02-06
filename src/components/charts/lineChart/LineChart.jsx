import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import 'chartjs-adapter-date-fns';
import styles from "./LineChart.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ data, options }) => {
  console.log("data", data, "opt: ", options);
  return (
    <div className={styles.lineChart}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
