import React from "react";
import Plot from "react-plotly.js";
import AgeBucketData from "../../../jsons/supplychaintower/charts/age_bucket[1].json";

const Age = () => {
    const colorMap = {
        "0-30 days": "#1f77b4",
        "31-60 days": "#ff7f0e",
        "61-90 days": "#2ca02c",
        "90+ days": "#d62728",
    };

    const trace = {
        x: AgeBucketData.map(item => item.Age_Bucket),
        y: AgeBucketData.map(item => item.Count),
        text: AgeBucketData.map(item => item.Liquidation_Risk_Simple),
        type: "bar",
        marker: {
            color: AgeBucketData.map(item => colorMap[item.Age_Bucket]),
            line: { width: 1, color: "black" },
            opacity: 0.9,
        },
        textposition: "auto",
        insidetextanchor: "middle",
        textangle: -90,
        textfont: { size: 14 },
    };

    const layout = {
        xaxis: {
            title: "Age Bucket",
            showline: true,
            linewidth: 0.5,
            linecolor: "black",
        },
        yaxis: {
            title: "Frequency",
        },
        plot_bgcolor: "white",
        uniformtext: {
            minsize: 15,
            mode: "show",
        },
        margin: { l: 40, r: 20, t: 50, b: 50 },
        responsive: true,
        annotations: [
            {
                text: "Inventory Aging Distribution",
                xref: "paper",
                yref: "paper",
                x: 0.5,
                y: 1.1,
                showarrow: false,
                font: {
                    size: 18,
                    weight: "bold",
                },
            },
        ],
    };

    return (
        <div style={{ width: "100%", height: "420px" }}>
            <Plot
                data={[trace]}
                layout={layout}
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                config={{ displayModeBar: false }}
            />
        </div>
    );
};

export default Age;
