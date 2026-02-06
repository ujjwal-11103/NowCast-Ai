import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import styles from "./SearchBar.module.scss";

const SearchBar = ({ label, placeholder, customClass }) => {
  const [inputedValue, setInputedValue] = useState("");

  const onChange = (e) => {
    setInputedValue(e.value);
  };

  return (
    <div className={`${styles.searchBar} ${customClass}`}>
      {label && <label>{label}</label>}
      <div className="p-inputgroup flex-1">
        <InputText placeholder={placeholder} value={inputedValue} onChange={(e) => onChange(e)} className={styles.searchBox} />
        <span className={`pi pi-search p-inputgroup-addon ${styles.searchIcon}`}></span>
      </div>
    </div>
  );
};

export default SearchBar;
