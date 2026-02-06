import React, { useState } from "react";
import styles from "./ButtonComponent.module.scss";
import { Button } from "primereact/button";

const ButtonComponent = ({ label, customClass, submitEvent, img }) => {
  return (
    <div className={`${styles.buttonContainer} ${customClass}`}>
      <Button
        onClick={submitEvent}
        label={label}
        icon="pi pi-sparkles" 
        className={styles.button}
      />
    </div>
  );
};

export default ButtonComponent;
