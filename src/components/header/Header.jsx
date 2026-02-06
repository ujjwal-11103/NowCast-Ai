import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import Dropdown from "../filters/dropDown/Dropdown";
import SelectSwitch from "../filters/toggles/SelectSwitch";
import { ImageUtils } from "../../utils/ImageUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addBrand, setPage } from "../../redux/pageSlice";
import { CEOService } from "../../services/ceo-service/ceo.service";
import { ROUTE_CONSTANTS } from "../../constants/RouteConstants";

const options = [
  { value: ROUTE_CONSTANTS.HOME, label: "Business Overview" },
  { value: ROUTE_CONSTANTS.TRADEPROMOTION, label: "Trade Promotion Overview" },
  // { value: ROUTE_CONSTANTS.TERESA, label: "Forecasting" },
  { value: ROUTE_CONSTANTS.NEPTUNE, label: "Marketing Mix Modelling" },
  { value: ROUTE_CONSTANTS.ALFRED, label: "Sales Overview" },
  { value: "http://52.172.103.179:8282", label: "Explainable Forecasting" },
  { value: ROUTE_CONSTANTS.TPOPTIMISATION, label: "Trade Promotion Optimisation" },
];

const Header = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [timePeriodList, setTimePeriodList] = useState([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("");
  const [selectedMode, setSelectedMode] = useState("MOM");
  const [filterChanged, setFilterChanged] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPage = useSelector((state) => state.page.currentPage);
  const selectedBrandsfromRedux = useSelector(
    (state) => state.page.selectedBrands
  );
  // console.log("currentPage", currentPage);
  useEffect(() => {
    if (selectedBrandsfromRedux.length > 0 && currentPage == "/neptune") {
      setSelectedBrands(selectedBrandsfromRedux);
    }
  }, [selectedBrandsfromRedux]);
  // console.log("selectedBrandsfromRedux", selectedBrandsfromRedux);
  var filterValue = {
    selectedCategory,
    selectedBrands,
    selectedMode,
    selectedTimePeriod,
  };

  useEffect(() => {
    getCategories();
    getTimePeriodList();
    const currentPath = location.pathname;
    if (currentPath !== currentPage) {
      dispatch(setPage(currentPath));
    }
  }, [location.pathname, currentPage, dispatch]);

  const handlePageChange = (e) => {
    const selectedPage = e.target.value;
    if (selectedPage.startsWith("http")) {
      window.location.href = selectedPage;
    } else {
      localStorage.setItem("selective", false);
      dispatch(setPage(selectedPage));
      navigate(selectedPage);
    }
  };

  const getCategories = async () => {
    try {
      const data = await CEOService.Categories();
      setCategoryList(data);
      if (selectedCategory?.length <= 0) {
        setSelectedCategory(data);
        filterValue.selectedCategory = data;
        onFilterChange(filterValue);
      }
      getBrands(data);
    } catch (error) {
      return error;
    }
  };

  const getBrands = async (category) => {
    try {
      const data = await CEOService.Brands({ categories: category });
      setBrandList(data);
      if (selectedBrands?.length <= 0) {
        if (currentPage !== "/neptune") {
          setSelectedBrands(data);
        }
        filterValue.selectedBrands = data;
        onFilterChange(filterValue);
      }
    } catch (error) {
      return error;
    }
  };

  const getTimePeriodList = async () => {
    const data = await CEOService.Time();
    setTimePeriodList(data);
    if (selectedTimePeriod?.length <= 0) {
      setSelectedTimePeriod(data[data?.length - 1]);
      filterValue.selectedTimePeriod = data[data?.length - 1];
      onFilterChange(filterValue);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.value);
    getBrands(e.value);
    setFilterChanged(!filterChanged);
  };

  const handleBrandChange = (e) => {
    setSelectedBrands(e.value);
    getCategories(e.value);
    setFilterChanged(!filterChanged);
    dispatch(addBrand(e.value));
  };

  // console.log("selectedBrands", selectedBrands);

  const onSelectTime = (e) => {
    setFilterChanged(!filterChanged);
    setSelectedTimePeriod(e.value);
  };

  const onModeChange = (e) => {
    setFilterChanged(!filterChanged);
    setSelectedMode(e.value);
  };

  useEffect(() => {
    filterValue = {
      selectedCategory,
      selectedBrands,
      selectedMode,
      selectedTimePeriod,
    };
    onFilterChange(filterValue);
  }, [filterChanged]);

  const handleLogout = () => {
    navigate("/login");

  }

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <PrimeDropdown
            onChange={handlePageChange}
            value={currentPage}
            className={styles.pageSelector}
            options={options}
          />
        </div>


        <div className={styles.controls}>
          <div className={styles.filters}>
            <div className={styles.viewData}>
              <div className={styles.filterDetails}>
                Viewing Data from :
                <span>{selectedTimePeriod}</span>
              </div>
            </div>
            <Dropdown
              singleMode={false}
              label="Category"
              options={categoryList}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Select Category"
            />
            <Dropdown
              singleMode={false}
              label="Brand"
              options={brandList}
              value={selectedBrands}
              onChange={handleBrandChange}
              placeholder="Select Brand"
            />
            <SelectSwitch
              label="View"
              value={selectedMode}
              options={["MOM", "QOQ"]}
              onChange={onModeChange}
            />
            <Dropdown
              singleMode={true}
              label="Time Period"
              value={selectedTimePeriod}
              options={timePeriodList}
              onChange={onSelectTime}
              placeholder="Select Time"
              customClass={styles.timePeriodSelect}
            />
          </div>
          <button className={styles.settingButton} onClick={handleLogout}>
            <i className={`pi pi-sign-out ${styles.settingsIcon}`}></i>
          </button>
        </div>
      </header>
      {/* <div className={styles.detailsContainer}>
      
      </div> */}
    </div>
  );
};

export default Header;
