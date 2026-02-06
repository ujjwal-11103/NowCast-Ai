import { ROUTE_CONSTANTS } from "../../constants/RouteConstants";

const NUMBER_CFG = [16, 14, 15, 14, 21, 24, 22, 21, 21, 19, 19, 15];

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

const salesBarChartData = {
  labels: labels,
  datasets: [
    {
      label: "Actual",
      data: labels.map((_, index) => {
        return index <= currentMonth ? NUMBER_CFG[index] : null;
      }),
      backgroundColor: "#2249FF",
      barThickness: 5,
      borderRadius: 6,
    },
    {
      label: "Forecast",
      data: labels.map((_, index) => {
        return index > currentMonth ? NUMBER_CFG[index] : null;
      }),
      backgroundColor: "#BFCAFF",
      barThickness: 5,
      borderRadius: 6,
    },
  ],
};

const profitBarChartData = {
  labels: ["Total Sales", "Price", "Distribution", "TPS", "MS", "Baseline"],
  datasets: [
    {
      data: [
        [5, 0],
        [5, 4],
        [4, 2.8],
        [2.8, 1.9],
        [1.9, 1.1],
        [1.1, 0],
      ],
      backgroundColor: [
        "",
        "#2249FF",
        "#00FF68",
        "#FFD822",
        "#FF7000",
        "#17BC90",
      ],
      barThickness: 50,
    },
  ],
};

const marketingBarChartData = {
  labels: ["TV", "Facebook", "Instagram", "Google Ads", "Print Media"],
  datasets: [
    {
      label: "Spends",
      data: [7, 9.5, 10, 13, 5],
      backgroundColor: "#FF7000",
      barThickness: 20,
      order: 1,
      yAxisID: "y",
      pointStyle: "rect",
    },
    {
      label: "ROI",
      data: [3.5, 5, 7, 6.2, 5],
      backgroundColor: "#2249FF",
      radius: 5,
      order: 0,
      type: "scatter",
      yAxisID: "y1",
    },
  ],
};

const initialState = {
  chartData: {
    salesBarChart: {
      data: salesBarChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Marketing Sales Trend",
            align: "start",
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value, index, ticks) {
                return value + "%";
              },
            },
          },
        },
      },
    },
    salesDoughnutChart: {
      data: {
        labels: [
          "US",
          "Competition 1",
          "Competition 2",
          "Competition 3",
          "Competition 4",
        ],
        datasets: [
          {
            label: "Percentage",
            data: [28.3, 10.4, 27, 23.3, 11],
            backgroundColor: [
              "#FF7000",
              "#A0A0A0",
              "#00FF68",
              "#2249FF",
              "#FFD822",
            ],
            spacing: 0,
            hoverOffset: 4,
            radius: "70%", // Optionally add a radius to customize the doughnut size
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "85%", // Makes the stripe thinner
        plugins: {
          legend: {
            position: "right",
            align: "center",
            labels: {
              usePointStyle: true,
              pointStyle: "rect",
              generateLabels: function (chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    return {
                      text: `${label}: ${value}%`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      strokeStyle: data.datasets[0].backgroundColor[i],
                      lineWidth: 1,
                      hidden:
                        isNaN(data.datasets[0].data[i]) ||
                        chart.getDatasetMeta(0).data[i].hidden,
                      index: i,
                    };
                  });
                }
                return [];
              },
            },
          },
          title: {
            display: true,
            text: "Competitors Market Share",
          },
        },
      },
    },
    profitBarChart: {
      type: "bar",
      data: profitBarChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Contribution of Levers in Sales",
            align: "start",
          },
        },
      },
    },
    marketingBarChart: {
      type: "bar",
      data: marketingBarChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
            },
          },
          title: {
            display: true,
            text: "Marketing Channel Wise Spends Vs ROI",
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
              text: "Spends",
            },
            ticks: {
              callback: function (value, index, ticks) {
                return "$ " + value + "K";
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
    marketingDoughnutChart: {
      data: {
        labels: ["Google Ads", "Print Media", "Instagram", "Facebook", "TV"],
        datasets: [
          {
            label: "Percentage",
            data: [28.3, 10.4, 27, 23.3, 11],
            backgroundColor: [
              "#FF7000",
              "#A0A0A0",
              "#00FF68",
              "#2249FF",
              "#FFD822",
            ],
            spacing: 0,
            hoverOffset: 4,
            radius: "70%", // Optionally add a radius to customize the doughnut size
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "85%", // Makes the stripe thinner
        plugins: {
          legend: {
            position: "right",
            align: "center",
            labels: {
              usePointStyle: true,
              pointStyle: "rect",
              generateLabels: function (chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    return {
                      text: `${label}: ${value}%`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      strokeStyle: data.datasets[0].backgroundColor[i],
                      lineWidth: 1,
                      hidden:
                        isNaN(data.datasets[0].data[i]) ||
                        chart.getDatasetMeta(0).data[i].hidden,
                      index: i,
                    };
                  });
                }
                return [];
              },
            },
          },
          title: {
            display: true,
            text: "Competitors Market Share",
          },
        },
      },
    },
  },
  cardsSalesData: [
    {
      cardDetails: [
        {
          title: "Current Value",
          value: "$ 12.3M",
          growth: 13.2,
          desc: "LYTD $ 11M",
        },
        {
          title: "Target",
          value: "$ 13.7M",
          growth: null,
          desc: "",
        },
      ],
    },
    {
      cardDetails: [
        {
          title: "Current Volume",
          value: "$ 2.3M",
          growth: 13.2,
          desc: "LYTD $ 2M",
        },
        {
          title: "Target",
          value: "$ 3.7M",
          growth: null,
          desc: "",
        },
      ],
    },
    {
      cardDetails: [
        {
          title: "Market Share",
          value: "28.3%",
          growth: 3.2,
          desc: "LYTD 25.1%",
        },
      ],
      chart: {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [
            {
              label: "Share",
              data: [28.3, 71.7],
              backgroundColor: ["#FF7000", "#E1E1E1"],
              spacing: 0,
              hoverOffset: 4,
              radius: "100%",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "80%",
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      },
    },
  ],
  cardsProfitLossData: [
    {
      cardDetails: [
        {
          title: "Gross Profit Margin",
          value: "$ 2.3M",
          growth: 13.2,
          desc: "LYTD $ 2M",
        },
      ],
    },
    {
      cardDetails: [
        {
          title: "COGS",
          value: "$ 2.3M",
          growth: -13.2,
          desc: "LYTD $ 2M",
        },
      ],
    },
  ],
  cardsMarketingData: [
    {
      cardDetails: [
        {
          title: "Current Spends",
          value: "$ 2.3M",
          growth: 13.2,
          desc: "LYTD $ 2M",
        },
        {
          title: "Budget",
          value: "$ 3.7M",
          growth: null,
          desc: "",
        },
      ],
    },
    {
      cardDetails: [
        {
          title: "ROI",
          value: "7.4",
          growth: 1.2,
          desc: "LYTD 6.2",
        },
      ],
    },
    {
      cardDetails: [
        {
          title: "CAC",
          value: "$ 3.1",
          growth: 0.2,
          desc: "LYTD $ 3.3",
        },
      ],
    },
  ],
  cardsPromotionData: [
    {
      title: "Marketing Spends",
      current: "$ 1.8M",
      optimal: "$ 2.1M",
      navPath: ROUTE_CONSTANTS.TRADEPROMOTION,
      flag: 0,
      text: "Marketing spends need to be raised.",
    },
    {
      title: "Trade Promotion Spends",
      current: "$ 1.7M",
      optimal: "$ 2.3M",
      navPath: ROUTE_CONSTANTS.TRADEPROMOTION,
      flag: 0,
      text: "Trade Promotion Spends need to be raised.",
    },
    {
      title: "Pricing",
      current: "$10 - $15",
      optimal: "$10 - $16",
      navPath: ROUTE_CONSTANTS.TRADEPROMOTION,
      flag: 1,
      text: "Pricing is in optimal range.",
    },
    {
      title: "Distribution",
      current: "92%",
      optimal: "92-93%",
      navPath: ROUTE_CONSTANTS.TRADEPROMOTION,
      flag: 1,
      text: "Distribution is in optimal range.",
    },
    {
      title: "Fill On Time",
      current: "61%",
      optimal: "89%",
      navPath: ROUTE_CONSTANTS.TRADEPROMOTION,
      flag: 0,
      text: "Fill On Time is lower than optimal.",
    },
  ],
};

const businessOverviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CHART_DATA":
      return { ...state, chartData: action.payload };
    case "SET_CARDS_DATA":
      return { ...state, cardsData: action.payload };
    default:
      return state;
  }
};

export default businessOverviewReducer;
