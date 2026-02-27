import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./TradePromotion.module.scss";
import CardComponent from "../../components/cards/CardComponent";
import BarChart from "../../components/charts/barChart/BarChart";
import TileComponent from "../../components/tiles/TileComponent";
import ProductCard from "../../components/productCards/ProductCard";
import Dropdown from "../../components/filters/dropDown/Dropdown";
import SearchBar from "../../components/filters/searchBar/SearchBar";
import { TradePromotionService } from "../../services/trade-promotion/trade-promotion.service";
import { ImageUtils } from "../../utils/ImageUtils";
import Header from "../../components/header/Header";
import { UtilityService } from "../../utils/utils";
import { ROUTE_CONSTANTS } from "../../constants/RouteConstants";
import ButtonComponent from "../../components/button/ButtonComponent";
import moment from "moment";
import { Channels, Products } from "../../constants/Constants";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { FaCheckCircle } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SideBar from "@/components/Sidebar/SideBar";
import { useSidebar } from "@/context/sidebar/SidebarContext";

const TradePromotion = () => {
  const { isSidebarOpen } = useSidebar();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState({});

  const [sortOption, setSortOption] = useState("");
  const [sortedData, setSortedData] = useState();
  const [trackPerfomancedData, setTrackPerfomancedData] = useState();
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showIntegrationLoader, setShowIntegrationLoader] = useState(false);
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("Sort By");
  const [selectedTrackPerformance, setSelectedTrackPerformance] =
    useState("Sort By");

  const fetchData = async (filters) => {
    const payload = {
      categories: filters?.selectedCategory,
      brands: filters?.selectedBrands,
      view: filters?.selectedMode,
      time_start: filters?.time_start,
      time_end: filters?.time_end,
    };
    const apis = [
      TradePromotionService.Budget(JSON.stringify(payload)),
      TradePromotionService.OnTrack(JSON.stringify(payload)),
      TradePromotionService.Optimisation(JSON.stringify(payload)),
      TradePromotionService.lowChannels(JSON.stringify(payload)),
      TradePromotionService.topChannels(JSON.stringify(payload)),
    ];
    try {
      const [
        BudgetData,
        OnTrackData,
        OptimisationData,
        LowChannelsData,
        TopChannelsData,
      ] = await Promise.all(apis);

      // console.log(
      //   BudgetData,
      //   OnTrackData,
      //   OptimisationData,
      //   LowChannelsData,
      //   TopChannelsData
      // );

      // Transformation logic
      const OnTracktransformedData = OnTrackData.map((item, index) => {
        return {
          row_id: index + 1,
          current_spend: UtilityService.formatNumberInThousands(
            item.current_spend
          ),
          recommended_spends: UtilityService.formatNumberInThousands(
            item.recommended_spends
          ),
          current_roi: item.current_roi,
          optimal_roi: item.optimal_roi,
          navPath: ROUTE_CONSTANTS.TPOPTIMISATION,
          navText: "Invest More",
          image:
            item.Image === "chocolate"
              ? ImageUtils.Chocolate
              : ImageUtils.Chips,
          flag: 1,
          productName: item.title,
          productNameTitle: Products[item.title],
          // Dynamically creating productDetails array based on provided values
          productDetails: [
            {
              title: "Current Spends",
              value: `$ ${UtilityService.formatNumberInThousands(
                item.current_spend
              )}`, // Assuming K means thousands
            },
            {
              title: "Recommended Spends",
              value: `$ ${UtilityService.formatNumberInThousands(
                item.recommended_spends
              )}`, // Assuming K means thousands
            },
            {
              title: "Current ROI",
              value: `${item.current_roi
                }`,
            },
            {
              title: "Optimal ROI",
              value: `${item.optimal_roi
                }`,
            },
          ],
          navText: "Invest More",
        };
      });

      const OptimisationDatatransformedData = OptimisationData.map(
        (item, index) => {
          return {
            row_id: index + 1,
            current_spend: UtilityService.formatNumberInThousands(
              item.current_spend
            ),
            recommended_spends: UtilityService.formatNumberInThousands(
              item.recommended_spends
            ),
            current_roi:
              item.current_roi
            ,
            optimal_roi:
              item.optimal_roi
            ,
            image:
              item.Image === "chocolate"
                ? ImageUtils.Chocolate
                : ImageUtils.Chips,
            flag: 0,
            productName: item.title,
            productNameTitle: Products[item.title],
            // Dynamically creating productDetails array based on provided values
            productDetails: [
              {
                title: "Current Spends",
                value: `$ ${UtilityService.formatNumberInThousands(
                  item.current_spend
                )}`, // Assuming K means thousands
              },
              {
                title: "Recommended Spends",
                value: `$ ${UtilityService.formatNumberInThousands(
                  item.recommended_spends
                )}`, // Assuming K means thousands
              },
              {
                title: "Current ROI",
                value: `${item.current_roi
                  }`,
              },
              {
                title: "Optimal ROI",
                value: `${item.optimal_roi
                  }`,
              },
            ],
            navText: "Optimise Now",
            navPath: ROUTE_CONSTANTS.TPOPTIMISATION,
          };
        }
      );

      const roiData = BudgetData[3][0].chart.bar.ROI;
      const budgetData = BudgetData[3][0].chart.bar.Budget;
      const spentData = BudgetData[3][0].chart.bar.Spent;

      const labels = BudgetData[3][0].chart.bar.labels;
      // const currentDate = new Date();
      // const currentMonth = currentDate.getMonth();

      const currentDate = moment();
      const formattedDate = moment("2024-09", "YYYY-MM").format("MMM-YYYY");

      const comboChartData = {
        labels: labels,
        datasets: [
          {
            label: "Budget",
            data: budgetData,
            backgroundColor: "#2249FF",
            barThickness: 5,
            borderRadius: 6,
            order: 2,
            yAxisID: "y",
            borderColor: "rgba(0,0,0,0)",
            borderWidth: 5,
            barThickness: 20,
            maxBarThickness: 20,
          },
          {
            label: "ROI",
            data: roiData,
            borderColor: "#0D0D0D",
            borderWidth: 1,
            type: "line",
            order: 0,
            yAxisID: "y1",
          },
          // {
          //   label: "ROI",
          //   data: roiData,
          //   backgroundColor:filters.selectedMode =="MOM" ? labels.map((label, index) => {
          //     const labelDate = moment(new Date(label), "MMM-YYYY");
          //     const isBeforeOrEqual = labelDate.isSameOrBefore(formattedDate, 'month');
          //     return isBeforeOrEqual ? "#2249FF":"#BFCAFF";
          //   }):labels.map((label, index) => {
          //     return index < labels.length-1 ? "#2249FF":"#BFCAFF";
          //   }),
          //   barThickness: 5,
          //   borderRadius: 6,
          //   order: 2,
          //   yAxisID: "y1",
          //   borderColor: "rgba(0,0,0,0)",
          //   borderWidth: 5,
          //   barThickness: 20,
          //   maxBarThickness: 20,
          // },
        ],
      };

      const tilesTopData = TopChannelsData.map((item) => ({
        image: ImageUtils[item.title.replace(/\s+/g, "")], // Remove spaces to match property name in ImageUtils
        titleName: Channels[item.title],
        title: item.title,
        navPath: ROUTE_CONSTANTS.TPOPTIMISATION,
        navText: "Invest More",
        flag: 1, // Assuming 'flag' is part of item, otherwise, define as needed
        tileDetails: [
          {
            title: "Current Spends",
            value: `$ ${(
              item.current_spend / 1000000
            ).toFixed(1)}M`,
          },
          {
            title: "Sales",
            value: `$ ${(item.sales / 1000000).toFixed(1)}M`,
          },
          {
            title: "ROI",
            value: `${item.roi}`,
          },
          {
            title: "Optimal ROI",
            value: "8.5-10",
          },
        ],
      }));

      const tilesLeastData = LowChannelsData.map((item, index) => ({
        image: ImageUtils[item.title.replace(/\s+/g, "")], // Converts title to match property name in ImageUtils
        title: item.title,
        titleName: Channels[item.title],
        navPath: ROUTE_CONSTANTS.TPOPTIMISATION,
        navText: "Optimize Now",
        flag: 0, // Assumes flag is part of LowChannelsData; adapt if necessary
        tileDetails: [
          {
            title: "Current Spends",
            value: `$ ${(item.current_spend / 1000000).toFixed(1)}M`,
          },
          {
            title: "Sales",
            value: `$ ${(item.sales / 1000000).toFixed(1)}M`,
          },
          {
            title: "ROI",
            value: `${item.roi}`,
          },
          {
            title: "Optimal ROI",
            value: "8.5-10",
          },
        ],
      }));

      const resData = {
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
                  text: "Trend (Budget vs ROI)",
                  align: "start",
                },
              },
              interaction: {
                intersect: false,
                mode: "index",
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: "Budget/Spends",
                  },
                  ticks: {
                    callback: function (value, index, ticks) {
                      return (value / 100000) + "M";
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
                value: `$ ${UtilityService.formatNumber(
                  BudgetData[0][0].value
                )}`,
                growth: null,
                desc: "",
                flag: 0,
              },
              {
                title: "Actual Spent",
                value: `$ ${UtilityService.formatNumber(
                  BudgetData[0][1].spent
                )}`,
                growth: null,
                desc: "",
                flag: BudgetData[0][0].value > BudgetData[0][1].value ? 1 : -1,
              },
            ],
          },
          {
            image: ImageUtils.Sales,
            cardDetails: [
              {
                title: "Total Sales",
                value: `$ ${UtilityService.formatNumber(
                  BudgetData[1][0].value
                )}`,
                growth: null,
                desc: "",
                flag: BudgetData[1][0].value > BudgetData[1][1].value ? 1 : -1,
              },
              {
                title: "Optimal",
                value: `$ ${UtilityService.formatNumber(
                  BudgetData[1][1].value
                )}`,
                growth: null,
                desc: "",
                flag: 0,
              },
            ],
          },
          {
            image: ImageUtils.ROI,
            cardDetails: [
              {
                title: "Actual ROI",
                value: `${BudgetData[2][0].actual
                  }`,
                growth: null,
                desc: "",
                flag:
                  BudgetData[2][0].actual > BudgetData[2][1].actual
                    ? 1
                    : BudgetData[2][0].actual == BudgetData[2][1].actual
                      ? 0
                      : -1,
              },
              {
                title: "Optimal ROI",
                value: `${BudgetData[2][1].actual
                  }`,
                growth: null,
                desc: "",
                flag: 0,
              },
            ],
          },
        ],
        tilesTopData: tilesTopData,
        tilesLeastData: tilesLeastData,
        productOptimData: OptimisationDatatransformedData,
        productTrackData: OnTracktransformedData,
      };
      setSortedData(resData?.productOptimData);
      setTrackPerfomancedData(resData?.productTrackData);
      setData(resData);
    } catch (error) {
      // console.log("some error occured", error);
    }
  };

  const handleFilterChange = (value) => {
    if (
      value?.selectedCategory?.length > 0 &&
      value?.selectedBrands?.length > 0 &&
      value?.selectedMode?.length > 0 &&
      value?.selectedTimePeriod?.length > 0
    ) {
      let filterChanged = false;
      if (Object?.keys(filterData)?.length > 0) {
        Object?.keys(filterData)?.forEach((item) => {
          if (filterData[item] != value[item]) {
            filterChanged = true;
          }
        });
      }
      if (filterChanged == true || Object?.keys(filterData)?.length <= 0) {
        const filterValues = {
          ...value,
          time_start: value?.selectedTimePeriod
            ?.split(" - ")[0]
            ?.replace(/-/g, " "),
          time_end: value?.selectedTimePeriod
            ?.split(" - ")[1]
            ?.replace(/-/g, " "),
        };
        setFilterData(filterValues);
        fetchData(filterValues);
      }
    }
  };

  const optimizeNowButton = () => {
    window.location.href = ROUTE_CONSTANTS.TPOPTIMISATION;
  };

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchKeywordT, setSearchKeywordT] = useState("");

  const handleSearch = (event) => {
    setSearchKeyword(event.target.value.toLowerCase());
  };

  const handleSearchTrackPerformance = (event) => {
    setSearchKeywordT(event.target.value.toLowerCase());
  };

  const filteredData = sortedData?.filter((product) =>
    product.productName.toLowerCase().includes(searchKeyword)
  );

  const filteredTrackPerformanceData = trackPerfomancedData?.filter((product) =>
    product.productName.toLowerCase().includes(searchKeywordT)
  );

  const parseSpendValue = (spend) => {
    if (typeof spend === "string") {
      if (spend.includes("K")) {
        return parseFloat(spend.replace("K", "")) * 1000;
      } else if (spend.includes("M")) {
        return parseFloat(spend.replace("M", "")) * 1000000;
      }
    }
    return parseFloat(spend);
  };

  const handleSort = (option) => {
    const sortedArray = [...sortedData];
    setSelectedOption(option.value);
    switch (option.value) {
      case "Product Names":
        sortedArray.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "Current Spends":
        sortedArray.sort(
          (a, b) =>
            parseSpendValue(b.current_spend) - parseSpendValue(a.current_spend)
        );
        break;
      case "Recommended Spends":
        sortedArray.sort(
          (a, b) =>
            parseSpendValue(b.recommended_spends) -
            parseSpendValue(a.recommended_spends)
        );
        break;
      case "Current ROI":
        sortedArray.sort(
          (a, b) =>
            parseSpendValue(b.current_roi) - parseSpendValue(a.current_roi)
        );
        break;
      case "Optimal ROI":
        sortedArray.sort(
          (a, b) =>
            parseSpendValue(b.optimal_roi) - parseSpendValue(a.optimal_roi)
        );
        break;
      default:
        break;
    }
    setSortedData(sortedArray);
  };

  const handleTrackPerformanceSort = (option) => {
    const sortedArray = [...trackPerfomancedData];
    setSelectedTrackPerformance(option.value);
    switch (option.value) {
      case "Product Names":
        sortedArray.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "Current Spends":
        sortedArray.sort(
          (a, b) =>
            parseSpendValue(b.current_spend) - parseSpendValue(a.current_spend)
        );
        break;
      case "Recommended Spends":
        sortedArray.sort(
          (a, b) =>
            parseSpendValue(b.recommended_spends) -
            parseSpendValue(a.recommended_spends)
        );
        break;
      case "Current ROI":
        sortedArray.sort(
          (a, b) =>
            parseSpendValue(b.current_roi) - parseSpendValue(a.current_roi)
        );
        break;
      case "Optimal ROI":
        sortedArray.sort(
          (a, b) =>
            parseSpendValue(b.optimal_roi) - parseSpendValue(a.optimal_roi)
        );
        break;
      default:
        break;
    }
    setTrackPerfomancedData(sortedArray);
  };

  useEffect(() => {
    if (location.pathname === '/trade-promotion/anaplan') {
      console.log('Location matched: ', location.pathname);
      setShowIntegrationLoader(true)
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setShowSuccess(true);
            setTimeout(() => {
              setShowDialog(false);
              setIsLoaded(true);
            }, 1000);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 30);

      // Cleanup interval when component unmounts or dependencies change
      return () => clearInterval(interval);
    } else {
      setShowIntegrationLoader(false)
    }
  }, [location.pathname]);


  return (
    <>
      {showIntegrationLoader ? <Dialog header="" visible={showDialog} closable={false} modal style={{ width: '300px', textAlign: 'center' }}>
        {!showSuccess ? (
          <>
            <ProgressSpinner style={{ width: '50px', height: '70px' }} strokeWidth="4" animationDuration="1s" />
            <div className={styles.progress_text}>Integration Running... {progress}%</div>
          </>
        ) : (
          <div className="success-container">
            <FaCheckCircle style={{ color: 'green', fontSize: '48px' }} />
            <div className="success-text">Completed!</div>
          </div>
        )}
      </Dialog> : null}
      <div className="flex">
        <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} fixed`}>
          <SideBar />
        </div>
        <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} w-full`}>
          <div className={styles.tradePromotion}>
            <div className={styles.header}>
              <Header onFilterChange={handleFilterChange} />
            </div>
            <div className={`row d-flex w-100 justify-content-center ${styles.optimize}`}>
              <div className={`col-7 d-flex align-items-center justify-content-between ${styles.optimizeDiv}`}>
                <div className={`d-flex align-items-center gap-3 ${styles.optimizeText}`}>
                  <div className={styles.icon}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.80218 8.45453C6.67951 8.46597 6.55634 8.43829 6.45036 8.37543C6.37292 8.29593 6.3358 8.18556 6.34946 8.07543C6.35232 7.98374 6.36327 7.89248 6.38218 7.80271C6.40048 7.69973 6.42413 7.59778 6.45308 7.49725L6.7749 6.38997C6.80809 6.28068 6.83002 6.16828 6.84036 6.05451C6.84036 5.93179 6.85672 5.84723 6.85672 5.79815C6.86356 5.57941 6.77016 5.3695 6.60308 5.22815C6.39755 5.07037 6.14162 4.99281 5.88308 5.00997C5.6978 5.01276 5.51396 5.04309 5.33762 5.09997C5.14489 5.15997 4.94216 5.23178 4.72944 5.31543L4.63672 5.67543C4.69944 5.65361 4.77582 5.62907 4.86308 5.60179C4.94633 5.57713 5.03263 5.56427 5.11944 5.56361C5.24122 5.55042 5.3638 5.58032 5.4658 5.64815C5.53508 5.73081 5.56759 5.83821 5.5558 5.94543C5.55549 6.03714 5.54544 6.12857 5.5258 6.21815C5.5067 6.31361 5.48216 6.41451 5.45216 6.52087L5.12762 7.63359C5.10146 7.73702 5.08053 7.84169 5.0649 7.94723C5.05215 8.03758 5.04577 8.12871 5.0458 8.21995C5.04446 8.44019 5.14517 8.64864 5.31852 8.78449C5.5272 8.94473 5.7868 9.02416 6.04941 9.00813C6.23434 9.01192 6.41863 8.98521 6.59488 8.92903C6.74942 8.87629 6.95579 8.80085 7.21398 8.70267L7.30126 8.35903C7.23132 8.38804 7.1593 8.41174 7.0858 8.42992C6.99284 8.45116 6.89741 8.45941 6.80218 8.45453Z"
                        fill="#FF2600"
                      />
                      <path
                        d="M7.14326 3.20455C6.99483 3.06823 6.79927 2.9949 6.5978 3.00001C6.39645 2.99546 6.20107 3.06872 6.05234 3.20455C5.77971 3.43962 5.74927 3.85121 5.98437 4.12386C6.00532 4.14816 6.02803 4.17087 6.05234 4.19183C6.36293 4.46963 6.83267 4.46963 7.14324 4.19183C7.41586 3.95443 7.44443 3.54099 7.20703 3.26837C7.1873 3.24565 7.16597 3.22433 7.14326 3.20455Z"
                        fill="#FF2600"
                      />
                      <path
                        d="M6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0ZM6 11.4545C2.98753 11.4545 0.545461 9.01247 0.545461 6C0.545461 2.98753 2.98753 0.545461 6 0.545461C9.01247 0.545461 11.4545 2.98753 11.4545 6C11.4545 9.01247 9.01247 11.4545 6 11.4545Z"
                        fill="#FF2600"
                      />
                    </svg>
                  </div>
                  <span>
                    <b>You are not getting a good ROI on your spends.</b> Check how
                    you can improve.
                  </span>
                </div>
                <ButtonComponent
                  label="Optimize Now"
                  customClass={styles.optimizeNowButton}
                  submitEvent={optimizeNowButton}
                />
              </div>
            </div>
            <div className={`container-fluid ${styles.content}`}>
              <div className={`row ${styles.topSection}`}>
                <div className={`col-7 ${styles.leftSide} ${styles.rightBorder}`}>
                  {/* <div className={`d-flex flex-column align-items-start ${styles.section}`}> */}
                  {/* <div className={`d-flex justify-content-around align-items gap-3 ${styles.rows}`}> */}
                  <div className="d-flex col-12 gap-1">
                    {data?.cardsTradeData?.map((card, index) => (
                      <div className="col-4">
                        <CardComponent
                          key={index}
                          image={card?.image}
                          cardDetails={card?.cardDetails}
                          chart={card?.chart}
                        />
                      </div>
                    ))}
                  </div>
                  {/* </div> */}
                  {/* </div> */}
                  {/* <div className={styles.charts}> */}
                  {data?.chartData?.comboChart && (
                    <div className={`col-12 ${styles.barChart}`}>
                      <BarChart
                        data={data?.chartData?.comboChart?.data}
                        options={data?.chartData?.comboChart?.options}
                      />
                    </div>
                  )}
                  {/* </div> */}
                </div>
                <div className={`col-5 d-flex ${styles.rightSide}`}>
                  <div className={`col-6 ${styles.section}`}>
                    <div className={styles.sectionHeadingLeast}>
                      <h4>Least Performing Channels</h4>
                    </div>
                    <div className={styles.columns}>
                      {data?.tilesLeastData?.map((tile, index) => (
                        <div className={`col-12 px-2 py-3`}>
                          <TileComponent
                            key={index}
                            image={tile?.image}
                            title={tile?.title}
                            titleName={tile.titleName}
                            navPath={tile?.navPath}
                            navText={tile?.navText}
                            flag={tile?.flag}
                            tileDetails={tile?.tileDetails}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`col-6 ${styles.section}`}>
                    <div className={styles.sectionHeadingTop}>
                      <h4>Top Performing Channels</h4>
                    </div>
                    <div className={styles.columns}>
                      {data?.tilesTopData?.map((tile, index) => (
                        <div className={`col-12 px-2 py-3`}>
                          <TileComponent
                            key={index}
                            image={tile?.image}
                            title={tile?.title}
                            titleName={tile.titleName}
                            navPath={tile?.navPath}
                            navText={tile?.navText}
                            flag={tile?.flag}
                            tileDetails={tile?.tileDetails}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`row ${styles.bottomSection}`}>
                <div className={`col-6 ${styles.productSection} ${styles.rightBorder}`}>
                  <div className={styles.section}>
                    <div className={`col-12 d-flex justify-content-between align-items-center ${styles.sectionHeading}`}>
                      {/* <h4>Room For Optimization</h4> */}
                      <h4 className={styles.additionalText}>Products that need attention</h4>
                      <div className={`d-flex align-items-center ${styles.productFilters}`}>
                        <Dropdown
                          singleMode={true}
                          options={[
                            "Product Names",
                            "Current Spends",
                            "Recommended Spends",
                            "Current ROI",
                            "Optimal ROI",
                          ]}
                          placeholder="Sort By"
                          onChange={(option) => handleSort(option)}
                          value={selectedOption}
                          customClass={styles.sortDropdown}
                        />
                        <input
                          type="text"
                          placeholder="Search products"
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                    <div className={`d-flex justify-content-around flex-wrap gap-3  ${styles.row}`}>
                      <div className={`d-flex gap-3 w-100 ${styles.cardLabels}`}>
                        <div className={`${styles.div1}`}></div>
                        <div className={`row ${styles.divmid}`}>
                          {filteredData?.[0]?.productDetails?.map((item, itemIndex) => (
                            <div key={itemIndex} className={`col-3 ${styles.filtered}`}>
                              <p>{item?.title}</p>
                            </div>
                          ))}
                        </div>


                        <div className={`${styles.div1}`}></div>
                      </div>

                      <div className={`d-flex justify-content-around flex-wrap gap-3 w-100 ${styles.rows}`}>
                        {filteredData?.map((product, index) => (
                          <ProductCard
                            key={index}
                            image={product?.image}
                            navPath={product?.navPath}
                            navText={product?.navText}
                            flag={product?.flag}
                            productName={product?.productName}
                            productNameTitle={product?.productNameTitle}
                            productDetails={product?.productDetails}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`col-6 ${styles.productSection} ${styles.rightBorder}`}>
                  <div className={styles.section}>
                    <div className={`col-12 d-flex justify-content-between align-items-center ${styles.sectionHeading}`}>
                      {/* <h4>On Track Performance</h4> */}
                      <h4 className={styles.additionalTextForGood}>Products that are doing well</h4>
                      <div className={`d-flex align-items-center ${styles.productFilters}`}>
                        <Dropdown
                          singleMode={true}
                          options={[
                            "Product Names",
                            "Current Spends",
                            "Recommended Spends",
                            "Current ROI",
                            "Optimal ROI",
                          ]}
                          placeholder="Sort By"
                          onChange={(option) => handleTrackPerformanceSort(option)}
                          value={selectedTrackPerformance}
                          customClass={styles.sortDropdown}
                        />
                        <input
                          type="text"
                          placeholder="Search products"
                          onChange={handleSearchTrackPerformance}
                        />
                      </div>
                    </div>

                    <div className={`d-flex justify-content-around flex-wrap gap-3  ${styles.row}`}>
                      <div className={`d-flex gap-3 w-100 ${styles.cardLabels}`}>
                        <div className={`${styles.div1}`}></div>
                        <div className={`row ${styles.divmid}`}>
                          {filteredData?.[0]?.productDetails?.map((item, itemIndex) => (
                            <div key={itemIndex} className={`col-3 `}>
                              <p>{item?.title}</p>
                            </div>
                          ))}
                        </div>


                        <div className={`${styles.div1}`}></div>
                      </div>
                      <div className={`d-flex justify-content-around flex-wrap gap-3 w-100 ${styles.rows}`}>
                        {filteredTrackPerformanceData?.map((product, index) => (
                          <ProductCard
                            key={index}
                            image={product?.image}
                            navPath={product?.navPath}
                            navText={product?.navText}
                            flag={product?.flag}
                            productName={product?.productName}
                            productNameTitle={product?.productNameTitle}
                            productDetails={product?.productDetails}
                          />
                        ))}

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default TradePromotion;

