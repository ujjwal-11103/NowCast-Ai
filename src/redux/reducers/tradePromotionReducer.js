import { ImageUtils } from "../../utils/ImageUtils";

const roiData = [4.1, 5.2, 4.8, 3.5, 6.7, 7.3, 6.9, 6.5, 6.5, 5.9, 5.9, 5.9];
const budgetData = [63, 61, 63, 69, 72, 68, 64, 66, 52, 41, 54, 59];
const spentData = [64, 65, 76, 64, 52, 54, 50, 47, 50, 55];

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const currentDate = new Date();
const currentMonth = currentDate.getMonth();


const comboChartData = {
  labels: labels,
  datasets: [
    {
      label: "ROI",
      data: roiData,
      backgroundColor: labels.map((label, index) => {
        return index <= currentMonth ? "#2249FF" : "#BFCAFF";
      }),
      barThickness: 5,
      borderRadius: 6,
      order: 2,
      yAxisID: "y1",
    },
    {
      label: "Spent",
      data: spentData,
      borderColor: "#FF7000",
      borderWidth: 1,
      type: "line",
      order: 1,
      yAxisID: "y",
    },
    {
      label: "Budget",
      data: budgetData,
      borderColor: "#1B1B1C",
      borderWidth: 1,
      type: "line",
      order: 0,
      yAxisID: "y",
    },
  ],
};

const initialState = {
  chartData: {
    comboChart: {
      type: "bar",
      data: comboChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Trend (Budget vs Spent vs ROI)",
            align: "start",
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Budget/Spends",
            },
            ticks: {
              callback: function (value, index, ticks) {
                return value + "K";
              },
            },
          },
          y1: {
            title: {
              display: true,
              text: "ROI",
            },
            type: "linear",
            display: true,
            position: "right",
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    },
  },
  cardsTradeData: [
    {
      image: ImageUtils.Budget,
      cardDetails: [
        {
          title: "Allocated Budget",
          value: "$ 3M",
          growth: null,
          desc: "",
        },
        {
          title: "Actual Spent",
          value: "$ 3.7M",
          growth: null,
          desc: "",
        },
      ],
    },
    {
      image: ImageUtils.Sales,
      cardDetails: [
        {
          title: "Total Sales",
          value: "$ 12.3M",
          growth: null,
          desc: "",
        },
        {
          title: "Optimal",
          value: "$ 15.7M",
          growth: null,
          desc: "",
        },
      ],
    },
    {
      image: ImageUtils.ROI,
      cardDetails: [
        {
          title: "Actual ROI",
          value: "10",
          growth: null,
          desc: "",
        },
        {
          title: "Optimal ROI",
          value: "11.2",
          growth: null,
          desc: "",
        },
      ],
    },
  ],
  tilesTopData: [
    {
      image: ImageUtils.Walmart,
      navPath: '/',
      navText: "Invest More",
      flag: 1,
      tileDetails: [
        {
          title: "Current Spends",
          value: "$ 30K",
        },
        {
          title: "Sales",
          value: "$ 31K",
        },
        {
          title: "ROI",
          value: "9.7",
        },
        {
          title: "Optimal ROI",
          value: "8-9",
        },
      ],
    },
    {
      image: ImageUtils.Kroger,
      navPath: '/',
      navText: "Invest More",
      flag: 1,
      tileDetails: [
        {
          title: "Current Spends",
          value: "$ 30K",
        },
        {
          title: "Sales",
          value: "$ 32K",
        },
        {
          title: "ROI",
          value: "9.7",
        },
        {
          title: "Optimal ROI",
          value: "8-9",
        },
      ],
    },
  ],
  tilesLeastData: [
    {
      image: ImageUtils.Walmart,
      navPath: '/',
      navText: "Optimize Now",
      flag: 0,
      tileDetails: [
        {
          title: "Current Spends",
          value: "$ 30K",
        },
        {
          title: "Sales",
          value: "$ 29K",
        },
        {
          title: "ROI",
          value: "7",
        },
        {
          title: "Optimal ROI",
          value: "8-9",
        },
      ],
    },
    {
      image: ImageUtils.Kroger,
      navPath: '/',
      navText: "Optimize Now",
      flag: 0,
      tileDetails: [
        {
          title: "Current Spends",
          value: "$ 30K",
        },
        {
          title: "Sales",
          value: "$ 29K",
        },
        {
          title: "ROI",
          value: "6",
        },
        {
          title: "Optimal ROI",
          value: "8-9",
        },
      ],
    },
  ],
  productOptimData: [
    {
      image: ImageUtils.Chips,
      navPath: '/',
      navText: "Optimize Now",
      flag: 0,
      productName: "Product 1",
      productDetails: [
        {
          title: "Current Spends",
          value: "$ 30K",
        },
        {
          title: "Sales",
          value: "$ 31K",
        },
        {
          title: "ROI",
          value: "9.7",
        },
        {
          title: "Optimal ROI",
          value: "8-9",
        },
      ],
    },
    {
      image: ImageUtils.Chocolate,
      navPath: '/',
      navText: "Optimize Now",
      flag: 0,
      productName: "Product 2",
      productDetails: [
        {
          title: "Current Spends",
          value: "$ 30K",
        },
        {
          title: "Sales",
          value: "$ 32K",
        },
        {
          title: "ROI",
          value: "9.7",
        },
        {
          title: "Optimal ROI",
          value: "8-9",
        },
      ],
    },
  ],
  productTrackData: [
    {
      image: ImageUtils.Chocolate,
      navPath: '/',
      navText: "Invest More",
      flag: 1,
      productName: "Product 3",
      productDetails: [
        {
          title: "Current Spends",
          value: "$ 30K",
        },
        {
          title: "Sales",
          value: "$ 29K",
        },
        {
          title: "ROI",
          value: "7",
        },
        {
          title: "Optimal ROI",
          value: "8-9",
        },
      ],
    },
    {
      image: ImageUtils.Chips,
      navPath: '/',
      navText: "Invest More",
      flag: 1,
      productName: "Product 4",
      productDetails: [
        {
          title: "Current Spends",
          value: "$ 30K",
        },
        {
          title: "Sales",
          value: "$ 29K",
        },
        {
          title: "ROI",
          value: "6",
        },
        {
          title: "Optimal ROI",
          value: "8-9",
        },
      ],
    },
  ],
};

const tradePromotionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CHART_DATA":
      return { ...state, chartData: action.payload };
    case "SET_CARDS_DATA":
      return { ...state, cardsData: action.payload };
    default:
      return state;
  }
};

export default tradePromotionReducer;
