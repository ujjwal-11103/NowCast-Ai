

const seasonalityLineChartData = {
  labels: ["Jan 1", "Mar 1", "May 1", "Jul 1", "Sep 1", "Nov 1", "Jan 1"],
  datasets: [
    {
      data: [-1, -3, 9, -11, 4, -12, 2, -13, 4, -10, 6, -8, 10, -3, 8, -1],
      borderColor: "#1B1B1C",
      backgroundColor: "#1B1B1C",
      tension: 0.4,
    },
  ],
};

  
const stateData = [
    { state: "California", totalSales: 3.1, target: 2.8 },
    { state: "Texas", totalSales: 2.0, target: 2.0 },
    { state: "Florida", totalSales: 1.7, target: 2.0 },
    { state: "New York", totalSales: 2.9, target: 2.8 },
    { state: "San Francisco", totalSales: 2.2, target: 2.8 },
    // Add more states similarly
  ];
const initialState = {
  chartData: {
    salesDoughnutChart: {
      data: {
        labels: [
          "Brand 1",
          "Brand 2",
          "Brand 3",
          "Brand 4",
          "Brand 5",
          "Brand 6",
        ],
        datasets: [
          {
            label: "Percentage",
            data: [28.3, 10.4, 27, 23.3, 11, 11],
            backgroundColor: [
              "#FF7000",
              "#A0A0A0",
              "#434343",
              "#00FF68",
              "#2249FF",
              "#FFD822",
            ],
            spacing: 0,
            hoverOffset: 4,
            radius: "70%",
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
                      text: `${label} ${value}% | $ 32M`,
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
    seasonalityLineChart: {
      data: seasonalityLineChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
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
    salesGeoChart: {
      data: {},
      options: {
        showOutline: true,
        showGraticule: false,
        scales: {
          xy: {
            projection: "albersUsa",
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const state = stateData[tooltipItem.dataIndex];
                return `${state.state}: Total Sales: $${state.totalSales}M, Target: $${state.target}M`;
              },
            },
          },
        },
      },
    },
  },
  cardSalesData: [
    {
      cardDetails: [
        {
          title: "Total Value",
          value: "$ 123M",
          growth: 13.2,
          desc: "LYTD $ 111M",
        },
        {
          title: "Total Volume",
          value: "$ 25M",
          growth: 13.2,
          desc: "LYTD $ 21.5M",
        },
      ],
    },
  ],
};

const teresaReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TABLE_DATA":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default teresaReducer;
