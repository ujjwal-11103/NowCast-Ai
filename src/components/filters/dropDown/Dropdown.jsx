import React from "react";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import styles from "./Dropdown.module.scss";
import { Channels, Products } from "../../../constants/Constants";

const Dropdown = ({
  label,
  options,
  customClass,
  placeholder,
  onChange,
  value,
  singleMode,
  type
}) => {
  return (
    <div className={`${styles.dropdown} ${customClass}`}>
      {label && <label>{label}</label>}
      {singleMode ? (
        <PrimeDropdown
          value={value}
          options={options?.map((option) => ({ label: type == "channels" ? Channels[option]: type == "products" ?Products[option] : option, value: option })) || []}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.dropdownSelect}
        />
      ) : (
        <MultiSelect
          options={options?.map((option) => ({ label: type == "channels" ? Channels[option]: type == "products" ? Products[option] : option, value: option })) || []}
          display="chip"
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          className={styles.dropdownSelect}
        />
      )}
    </div>
  );
};

export default Dropdown;
