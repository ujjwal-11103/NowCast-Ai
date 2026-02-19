import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CardComponent from "../../components/cards/CardComponent";
import BarChart from "../../components/charts/barChart/BarChart";
import TileComponent from "../../components/tiles/TileComponent";
import ProductCard from "../../components/productCards/ProductCard";
import Dropdown from "../../components/filters/dropDown/Dropdown";
import SearchBar from "../../components/filters/searchBar/SearchBar";
import { TradePromotionService } from "../../services/trade-promotion/trade-promotion.service";
import { ImageUtils } from "../../utils/ImageUtils";
import Header from "../../components/header/Header"; // Keeping as comment if needed reference, but replacing
import { UtilityService } from "../../utils/utils";
import { ROUTE_CONSTANTS } from "../../constants/RouteConstants";
import ButtonComponent from "../../components/button/ButtonComponent";
// New Imports
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesFilters from "@/components/common/SalesFilters";
import { toast } from "sonner";

import moment from "moment";
import { Channels, Products } from "../../constants/Constants";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { FaCheckCircle } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const TradePromotion = () => {
  // SideBar moved to Layout

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
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Sort By");
  const [selectedTrackPerformance, setSelectedTrackPerformance] =
    useState("Sort By");

  // New Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'Fabric Wash',
    brand: 'B1',
    view: 'MOM',
    time: 'Oct-2023 - Sep-2024'
  });

  const filterConfig = [
    { key: 'category', label: 'Category', options: ['Fabric Wash', 'Dish Wash', 'Hair Care'] },
    { key: 'brand', label: 'Brand', options: ['B1', 'B2', 'B3'] },
    { key: 'view', label: 'View', options: ['MOM', 'QOQ', 'YOY'] },
    { key: 'time', label: 'Time Period', options: ['Oct-2023 - Sep-2024', 'Jan-2024 - Dec-2024'] }
  ];

  const handleNewFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Map to API structure immediately or via useEffect.
      // The component expects array for some, let's just simulate single selection for now or adapt.
      const apiFilters = {
        selectedCategory: newFilters.category ? [newFilters.category] : [],
        selectedBrands: newFilters.brand ? [newFilters.brand] : [],
        selectedMode: newFilters.view || 'MOM',
        selectedTimePeriod: newFilters.time || 'Oct-2023 - Sep-2024'
      };

      handleFilterChange(apiFilters); // Call the original handler
      return newFilters;
    });
  };

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
        isComingSoon: true,
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
        flag: 0,
        isComingSoon: true,
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
    toast.info("Coming soon!", {
      description: "This feature is under development."
    });
    // navigate(ROUTE_CONSTANTS.TPOPTIMISATION);
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

  useEffect(() => {
    // Initial fetch with default values
    const apiFilters = {
      selectedCategory: [filters.category],
      selectedBrands: [filters.brand],
      selectedMode: filters.view,
      selectedTimePeriod: filters.time
    };
    handleFilterChange(apiFilters);
  }, []);


  return (
    <>
      {showIntegrationLoader ? <Dialog header="" visible={showDialog} closable={false} modal style={{ width: '300px', textAlign: 'center' }}>
        {!showSuccess ? (
          <>
            <ProgressSpinner style={{ width: '50px', height: '70px' }} strokeWidth="4" animationDuration="1s" />
            <div className="mt-4 text-slate-600 font-semibold">Integration Running... {progress}%</div>
          </>
        ) : (
          <div className="success-container">
            <FaCheckCircle style={{ color: 'green', fontSize: '48px' }} />
            <div className="success-text">Completed!</div>
          </div>
        )}
      </Dialog> : null}
      <div className="bg-slate-50 relative min-h-screen p-8 font-sans overflow-x-hidden">

        {/* Background Decoration */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-100/40 to-blue-100/40 rounded-full blur-[120px]" />
          <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-rose-100/30 to-amber-100/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-teal-100/30 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-[1600px] mx-auto space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          {/* Header Section */}
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 font-[Montserrat]">Trade Promotion Overview</h1>
                <p className="text-slate-500 font-medium text-lg">Optimize your trade promotion spend for maximum ROI.</p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-10 px-4 text-sm rounded-full border border-slate-200 font-medium shadow-sm transition-all duration-300 ${showFilters
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <Filter className={`w-3.5 h-3.5 mr-2 ${showFilters ? 'text-indigo-700' : 'text-slate-500'}`} />
                  Filters
                  <ChevronDown className={`w-3.5 h-3.5 ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180 text-indigo-700' : 'text-slate-500'
                    }`} />
                </Button>
              </div>
            </div>

            <SalesFilters
              showFilters={showFilters}
              config={filterConfig}
              filters={filters}
              onFilterChange={handleNewFilterChange}
              onReset={() => setFilters({ category: '', brand: '', view: '', time: '' })}
            />
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

            {/* Optimize/Alert Banner */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm border border-orange-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path d="M3 6l9-4 9 4v16l-9-4-9 4V6z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">You are not getting a good ROI on your spends.</h3>
                  <p className="text-slate-600 text-sm">Check how you can improve your allocation strategy.</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 relative z-10">
                <ButtonComponent
                  label="Optimize Now"
                  customClass="!bg-orange-500 hover:!bg-orange-600 !text-white !border-none !rounded-xl !px-6 !py-2.5 !shadow-lg !shadow-orange-500/20 !font-semibold transition-transform active:scale-95"
                  submitEvent={optimizeNowButton}
                />
              </div>
            </div>

            {/* Main Grid Content */}
            <div className="grid grid-cols-12 gap-3">

              {/* Left Column (Cards + Chart) */}
              <div className="col-span-12 xl:col-span-8 flex flex-col gap-3 h-full">
                {/* Metric Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                  {data?.cardsTradeData?.map((card, index) => (
                    <div key={index} className="bg-white border border-slate-200/60 rounded-2xl p-1 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                      <CardComponent
                        image={card?.image}
                        cardDetails={card?.cardDetails}
                        chart={card?.chart}
                        customClass="!h-full"
                      />
                    </div>
                  ))}
                </div>

                {/* Combo Chart */}
                {data?.chartData?.comboChart && (
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex-1 min-h-[450px] flex flex-col relative overflow-hidden">
                    <h4 className="font-bold text-slate-700 mb-4 font-[Montserrat]">Trend (Budget vs ROI)</h4>
                    <div className="flex-1 w-full min-h-0 relative z-10">
                      <BarChart
                        data={data?.chartData?.comboChart?.data}
                        options={{
                          ...data?.chartData?.comboChart?.options,
                          maintainAspectRatio: false,
                          plugins: {
                            ...data?.chartData?.comboChart?.options.plugins,
                            legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 8 } },
                            title: { display: false }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (Top/Bottom Channels) */}
              <div className="col-span-12 xl:col-span-4 flex flex-col gap-3 h-full">

                {/* Least Performing */}
                <div className="flex-1 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col">
                  <h5 className="font-bold text-slate-700 mb-3 px-2 font-[Montserrat] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Least Performing Channels
                  </h5>
                  <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1 max-h-[400px] xl:max-h-none">
                    {data?.tilesLeastData?.map((tile, index) => (
                      <div key={index} className="transform transition-transform hover:scale-[1.01]">
                        <TileComponent
                          image={tile?.image}
                          title={tile?.title}
                          titleName={tile.titleName}
                          navPath={tile?.navPath}
                          navText={tile?.navText}
                          flag={tile?.flag}
                          tileDetails={tile?.tileDetails}
                          isComingSoon={tile?.isComingSoon}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Performing */}
                <div className="flex-1 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col">
                  <h5 className="font-bold text-slate-700 mb-3 px-2 font-[Montserrat] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Top Performing Channels
                  </h5>
                  <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1 max-h-[400px] xl:max-h-none">
                    {data?.tilesTopData?.map((tile, index) => (
                      <div key={index} className="transform transition-transform hover:scale-[1.01]">
                        <TileComponent
                          image={tile?.image}
                          title={tile?.title}
                          titleName={tile.titleName}
                          navPath={tile?.navPath}
                          navText={tile?.navText}
                          flag={tile?.flag}
                          tileDetails={tile?.tileDetails}
                          isComingSoon={tile?.isComingSoon}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Section: Product Attention */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {/* Products needing attention */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h4 className="font-bold text-slate-800 text-lg font-[Montserrat]">Products that need attention</h4>

                  <div className="flex items-center gap-4">
                    <Dropdown
                      singleMode={true}
                      options={["Product Names", "Current Spends", "Recommended Spends", "Current ROI", "Optimal ROI"]}
                      placeholder="Sort By"
                      onChange={(option) => handleSort(option)}
                      value={selectedOption}
                      customClass="w-40"
                    />
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        onChange={handleSearch}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 bg-slate-50 transition-all font-sans"
                      />
                      <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Product List Header */}
                <div className="grid grid-cols-12 gap-4 mb-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-3">Product Name</div>
                  <div className="col-span-9 grid grid-cols-4 text-center">
                    <div>Current Spends</div>
                    <div>Rec. Spends</div>
                    <div>Current ROI</div>
                    <div>Optimal ROI</div>
                  </div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                  {filteredData?.map((product, index) => (
                    <div key={index} className="transition-all hover:-translate-y-1 hover:shadow-md duration-300">
                      <ProductCard
                        image={product?.image}
                        navPath={product?.navPath}
                        navText={product?.navText}
                        flag={product?.flag}
                        productName={product?.productName}
                        productNameTitle={product?.productNameTitle}
                        productDetails={product?.productDetails}
                        isComingSoon={true}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Products on Track */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h4 className="font-bold text-slate-800 text-lg font-[Montserrat]">Products that are doing well</h4>

                  <div className="flex items-center gap-4">
                    <Dropdown
                      singleMode={true}
                      options={["Product Names", "Current Spends", "Recommended Spends", "Current ROI", "Optimal ROI"]}
                      placeholder="Sort By"
                      onChange={(option) => handleTrackPerformanceSort(option)}
                      value={selectedTrackPerformance}
                      customClass="w-40"
                    />
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        onChange={handleSearchTrackPerformance}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 bg-slate-50 transition-all font-sans"
                      />
                      <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Product List Header */}
                <div className="grid grid-cols-12 gap-4 mb-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-3">Product Name</div>
                  <div className="col-span-9 grid grid-cols-4 text-center">
                    <div>Current Spends</div>
                    <div>Rec. Spends</div>
                    <div>Current ROI</div>
                    <div>Optimal ROI</div>
                  </div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                  {filteredTrackPerformanceData?.map((product, index) => (
                    <div key={index} className="transition-all hover:-translate-y-1 hover:shadow-md duration-300">
                      <ProductCard
                        image={product?.image}
                        navPath={product?.navPath}
                        navText={product?.navText}
                        flag={product?.flag}
                        productName={product?.productName}
                        productNameTitle={product?.productNameTitle}
                        productDetails={product?.productDetails}
                        isComingSoon={true}
                      />
                    </div>
                  ))}
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
