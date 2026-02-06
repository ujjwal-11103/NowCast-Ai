import React, { useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import styles from "./SelectSwitch.module.scss";

const SelectSwitch = ({ label, value, options, onChange }) => {

  return (
    <div className={styles.selectSwitch}>
      {label && <label>{label}</label>}
      <SelectButton value={value} onChange={onChange} options={options} className={styles.selectSwitch} />
    </div>
  );
};

export default SelectSwitch;
