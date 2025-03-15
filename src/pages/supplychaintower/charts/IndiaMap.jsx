import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import indiaStatesGeoJson from "../../../jsons/supplychaintower/india.json";

const IndiaMap = () => {
    const [stateData, setStateData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://api.jsonbin.io/v3/b/67a7458cacd3cb34a8da8a68",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-Master-Key":
                                "$2a$10$rsDhc9gxYUsPY0GNViOo4.giROGm4dymgXT0d5tNGzMF5yqyUiAz.",
                            "X-Access-Key":
                                "$2a$10$ZOp.4aBBqUsDfvIeAVl3AO6BOOugE/3AJy0RmvXV5EucEOd4lahkW",
                        },
                    }
                );
                setStateData(response.data.record);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    const getColor = (totalAlerts) => {
        if (totalAlerts === 0) return "green";
        if (totalAlerts >= 1 && totalAlerts <= 5) return "yellow";
        if (totalAlerts >= 6 && totalAlerts <= 10) return "orange";
        return "red";
    };

    const mapData = useMemo(() => {
        const locations = [];
        const zValues = [];
        const hoverTexts = [];
        const colors = [];

        indiaStatesGeoJson.features.forEach((feature) => {
            const stateName = feature.properties.NAME_1;
            const stateInfo = stateData.find((state) => state.State === stateName);

            if (stateInfo) {
                const { Total_Alerts, Item, Days_on_Hand, Inventory_Alert } = stateInfo;

                let hoverText = `<b>${stateName}</b><br>Total Alerts: ${Total_Alerts}`;

                if (Item.length > 0) {
                    Item.forEach((item, index) => {
                        hoverText += `<br>Alert ${index + 1}: ${item} | DOH: ${Days_on_Hand[index]} | ${Inventory_Alert[index]}`;
                    });
                } else {
                    hoverText += "<br>No Alerts";
                }

                locations.push(stateName);
                zValues.push(Total_Alerts);
                colors.push(getColor(Total_Alerts));
                hoverTexts.push(hoverText);
            } else {
                locations.push(stateName);
                zValues.push(0);
                colors.push("lightgray");
                hoverTexts.push("<b>No Data</b>");
            }
        });

        return {
            type: "choropleth",
            geojson: indiaStatesGeoJson,
            locations: locations,
            z: zValues,
            text: hoverTexts,
            hoverinfo: "text",
            colorscale: [
                [0, "green"],
                [0.33, "yellow"],
                [0.66, "orange"],
                [1, "red"],
            ],
            colorbar: {
                title: {
                    text: "Alert Level",
                    side: "right",
                    font: {
                        size: 14,
                        color: "black",
                    },
                },
            },
            featureidkey: "properties.NAME_1",
        };
    }, [stateData]);

    return (

        <div className="w-full h-[600px] overflow-hidden rounded-lg border border-gray-200">
            <Plot
                data={[mapData]}
                layout={{
                    title: {
                        text: "India Supply Chain Alerts",
                        font: { size: 18, color: "black" },
                        x: 0.5,
                    },
                    geo: {
                        scope: "asia",
                        showcountries: false,
                        showcoastlines: false,
                        showland: true,
                        landcolor: "lightgray",
                        countrycolor: "black",
                        center: { lon: 78.9629, lat: 22.5937 },
                        projection: { type: "mercator" },
                        lataxis: { range: [6, 37] },
                        lonaxis: { range: [68, 97] },
                        fitbounds: "locations",
                    },
                    margin: { t: 50, r: 10, l: 10, b: 10 },
                }}
                config={{ responsive: true }}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
};

export default IndiaMap;
