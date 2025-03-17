import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import axios from "axios";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import indiaStatesTopoJson from "../../../jsons/supplychaintower/india_topo.json";
import indiaStatesGeoJson from "../../../jsons/supplychaintower/in.json";

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

    const colorScale = scaleLinear()
        .domain([0, 10, 20])
        .range(["green", "yellow", "red"]);

    const normalizeStateName = (name) => {
        return name?.trim().toLowerCase().replace(/\s+/g, " ").replace(/&/g, "and");
    };

    const getStateData = (stateName) => {
        if (!stateName) return null;
        const normalizedStateName = normalizeStateName(stateName);
        return (
            stateData.find((state) => normalizeStateName(state.State) === normalizedStateName) || null
        );
    };

    return (
        <div className="w-full h-[540px] flex justify-center items-center overflow-hidden rounded-lg border border-gray-200 relative">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 1000,
                    center: [78.9629, 22.5937],
                }}
                width={800}
                height={600}
            >
                <Geographies geography={indiaStatesGeoJson}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const stateName = geo.properties?.name || geo.properties?.st_nm;
                            if (!stateName) return null;

                            const stateInfo = getStateData(stateName);
                            const totalAlerts = stateInfo?.Total_Alerts || 0;

                            return (
                                <Tooltip key={geo.rsmKey}>
                                    <TooltipTrigger asChild>
                                        <Geography
                                            geography={geo}
                                            fill={colorScale(totalAlerts)}
                                            stroke="black"
                                            style={{
                                                default: { outline: "none" },
                                                hover: { fill: "blue", outline: "none" },
                                                pressed: { fill: "red", outline: "none" },
                                            }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white text-black p-2 shadow-md w-[250px] text-sm">
                                        <div className="font-bold">{stateName}</div>
                                        <div>Total Alerts: {totalAlerts}</div>
                                        {stateInfo?.Item.slice(0, 3).map((item, index) => (
                                            <div key={index} className="mt-2">
                                                <div className="font-semibold">Alert {index + 1}:</div>
                                                <div>Item: {item}</div>
                                                <div>DOH: {stateInfo.Days_on_Hand[index]}</div>
                                                <div>Inventory Alert: {stateInfo.Inventory_Alert[index]}</div>
                                            </div>
                                        ))}
                                        {stateInfo?.Item.length > 3 && (
                                            <div className="mt-2 text-blue-500 font-semibold">More alerts...</div>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })
                    }
                </Geographies>

            </ComposableMap>
        </div>
    );
};

export default IndiaMap;
