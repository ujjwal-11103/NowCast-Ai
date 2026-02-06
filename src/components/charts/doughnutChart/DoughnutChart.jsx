import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./DoughnutChart.module.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ data, options }) => {
  return (
    <div className={styles.pieChart}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
