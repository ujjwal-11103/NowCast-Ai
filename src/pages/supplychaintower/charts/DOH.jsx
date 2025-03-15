import React from "react";
import Plot from "react-plotly.js";
import barData from "../../../jsons/supplychaintower/charts/barData.json";

const DOH = () => {
    // Count SKUs based on Days on Hand
    const skuCount = barData.reduce((acc, item) => {
        acc[item.Days_on_Hand] = (acc[item.Days_on_Hand] || 0) + 1;
        return acc;
    }, {});

    return (
        <div style={{ width: "100%", height: "400px" }}>
            <Plot
                data={[
                    {
                        x: Object.keys(skuCount),
                        y: Object.values(skuCount),
                        type: "bar",
                        marker: { color: "#1E40AF" },
                        width: 0.25,
                    },
                ]}
                layout={{
                    title: {
                        text: "Week on Hand vs Count of SKUs",
                        font: { size: 18 },
                        y: 0.95, // Adjust the position of the title
                    },
                    xaxis: { title: { text: "Week on Hand", font: { size: 14 } } },
                    yaxis: { title: { text: "Count of SKUs", font: { size: 14 }, standoff: 20 } },
                    margin: { l: 50, r: 50, b: 50, t: 50 },
                }}
                config={{ displayModeBar: false }}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
};

export default DOH;
