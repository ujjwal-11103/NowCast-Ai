import React from "react";
import { Bar, Chart, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import styles from "./Charts.module.scss";

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CombinedChart = ({ type, data, options }) => {
  // Render the correct chart type based on the `type` prop
  let ChartComponent;

  switch (type) {
    case "bar":
      ChartComponent = Bar;
      break;
    case "doughnut":
      ChartComponent = Doughnut;
      break;
    case "line":
      ChartComponent = (props) => (
        <Chart type="line" data={props.data} options={props.options} />
      );
      break;
    case "scatter":
      ChartComponent = (props) => (
        <Chart type="scatter" data={props.data} options={props.options} />
      );
      break;
    default:
      return <div>Invalid chart type provided!</div>;
  }

  return (
    <div className={styles.chartContainer}>
      <ChartComponent data={data} options={options} />
    </div>
  );
};

export default CombinedChart;
