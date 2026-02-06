import React from "react";
import styles from "./CardComponent.module.scss";
import { Chart } from "primereact/chart";

const CardComponent = ({ image, cardDetails, chart, customClass }) => {
  return (
    <div className={`${styles.card} ${customClass}`}>
      {image && <img src={image} alt="image" />}
      {cardDetails &&
        cardDetails?.length > 0 &&
        cardDetails?.map((item, index) => (
          <div key={index} className={styles.cardDetails}>
            <div className={styles.cardHeader}>
              <p>{item?.title}</p>
            </div>
            <div className={styles.cardBody}>
              <p className={`${styles.value} ${item?.flag == 1 && styles.greenText} ${item?.flag == -1 && styles.redText}`}>{item?.value}</p>
              {item?.growth && (
                <p
                  className={
                    item?.growth > 0 ? styles.growthGreen : styles.growthRed
                  }
                >
                  {item?.growth > 0 ? (
                    <i
                      className={`pi pi-sort-up-fill ${styles.growthGreen}`}
                    ></i>
                  ) : (
                    <i
                      className={`pi pi-sort-down-fill ${styles.growthRed}`}
                    ></i>
                  )}
                  {`${Math.abs(item?.growth)}`}{item?.sign}
                </p>
              )}
            </div>
            <div className={styles.description}>
              {item?.desc?.length > 0 && <p>{item?.desc}</p>}
            </div>
            <div className={styles.description}>
              {item?.descLY?.length > 0 && <p>{item?.descLY}</p>}
            </div>
          </div>
        ))}
      {chart && <div className={styles.chart}>{chart}</div>}
    </div>
  );
};

export default CardComponent;
