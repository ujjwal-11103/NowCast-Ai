import React, { useState } from "react";
import { ChevronDown, ChevronRight, TrendingUp, Target, Lightbulb, Package, DollarSign, LineChart, Calendar, Activity, RefreshCw, Filter } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Plot from 'react-plotly.js';
import Chatbot from "@/components/Chatbot/Chatbot";
import Filters from "@/components/planning/Filters";
import { useForecast } from "@/context/ForecastContext/ForecastContext";

const PlanningAnalyst = () => {
    const { filters, setFilters } = useForecast();
    const [showFilters, setShowFilters] = useState(true);
    const toggleFilters = () => setShowFilters(!showFilters);



    // Common layout configuration
    const commonLayout = {
        font: { family: 'Montserrat, sans-serif', size: 12, color: '#334155' },
        hoverlabel: {
            bgcolor: '#1e293b',
            bordercolor: '#475569',
            font: { family: 'Montserrat, sans-serif', size: 13, color: '#ffffff' }
        }
    };

    // LEVER 0 - Market Leadership Treemap (EXACT DATA)
    const treemapData = [{
        type: "treemap",
        labels: ["Market", "Cat 1", "Cat 2", "Our Brand", "Comp A", "Our Brand", "Comp B"],
        parents: ["", "Market", "Market", "Cat 1", "Cat 1", "Cat 2", "Cat 2"],
        values: [1500, 700, 500, 500, 200, 350, 150],
        marker: {
            colors: ['#084594', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7'],
            line: { color: '#ffffff', width: 2 }
        },
        textfont: { size: 14, color: '#ffffff' },
        hovertemplate: '<b>%{label}</b><br>Volume: %{value}<extra></extra>'
    }];

    // LEVER 0 - Channel Performance Bubble Chart (EXACT DATA)
    const channelBubbleData = [
        {
            x: ['Channel 1', 'Channel 2', 'Channel 3', 'Channel 4', 'Channel 5'],
            y: [14, 12, 12, 13, 17],
            mode: 'markers',
            marker: {
                size: [100, 80, 80, 90, 110],
                color: '#d3d3d3',
                line: { color: '#999', width: 2 }
            },
            name: 'Last Year',
            hovertemplate: '<b>%{x}</b><br>Last Year: %{y}<extra></extra>'
        },
        {
            x: ['Channel 1', 'Channel 2', 'Channel 3', 'Channel 4', 'Channel 5'],
            y: [15, 12, 5, 14, 18],
            mode: 'markers',
            marker: {
                size: [110, 80, 35, 95, 120],
                color: '#4169e1',
                line: { color: '#000', width: 2 }
            },
            name: 'Current Year',
            hovertemplate: '<b>%{x}</b><br>Current Year: %{y}<extra></extra>'
        }
    ];

    // LEVER 1 - Market Share Evolution (EXACT STREAMLIT DATA)
    const marketShareData = [
        {
            x: ['6-2025', '7-2025', '8-2025', '9-2025', '10-2025', '11-2025'],
            y: [45, 42, 38, 35, 33, 32],
            name: 'Our Brand',
            type: 'bar',
            marker: { color: '#1e3a8a' }, // Dark Blue
            hovertemplate: '<b>Our Brand</b><br>%{x}: %{y}%<extra></extra>',
            text: ['45%', '42%', '38%', '35%', '33%', '32%'],
            textposition: 'auto'
        },
        {
            x: ['6-2025', '7-2025', '8-2025', '9-2025', '10-2025', '11-2025'],
            y: [20, 22, 25, 28, 30, 30],
            name: 'Comp A',
            type: 'bar',
            marker: { color: '#60a5fa' }, // Light Blue
            hovertemplate: '<b>Comp A</b><br>%{x}: %{y}%<extra></extra>',
            text: ['20%', '22%', '25%', '28%', '30%', '30%'],
            textposition: 'auto'
        },
        {
            x: ['6-2025', '7-2025', '8-2025', '9-2025', '10-2025', '11-2025'],
            y: [15, 16, 18, 19, 21, 25],
            name: 'Comp B',
            type: 'bar',
            marker: { color: '#ef4444' }, // Red
            hovertemplate: '<b>Comp B</b><br>%{x}: %{y}%<extra></extra>',
            text: ['15%', '16%', '18%', '19%', '21%', '25%'],
            textposition: 'auto'
        },
        {
            x: ['6-2025', '7-2025', '8-2025', '9-2025', '10-2025', '11-2025'],
            y: [20, 20, 19, 18, 16, 13],
            name: 'Others',
            type: 'bar',
            marker: { color: '#fca5a5' }, // Pink/Light Red
            hovertemplate: '<b>Others</b><br>%{x}: %{y}%<extra></extra>',
            text: ['20%', '20%', '19%', '18%', '16%', '13%'],
            textposition: 'auto'
        }
    ];

    // LEVER 1 - Volume Flow Sankey (EXACT STREAMLIT - 7 STEPS)
    // const sankeyData = [{

    //     type: "sankey",
    //     orientation: "h",
    //     node: {
    //         pad: 15,
    //         thickness: 20,
    //         line: { color: "white", width: 1 },
    //         label: [
    //             // Step 1
    //             "brand1", "brand2",
    //             // Step 2
    //             "brand1", "brand2",
    //             // Step 3
    //             "brand1", "brand2",
    //             // Step 4
    //             "brand1", "brand2",
    //             // Step 5
    //             "brand1", "brand2",
    //             // Step 6
    //             "brand1", "brand2",
    //             // Step 7
    //             "brand1", "brand2"
    //         ],
    //         color: [
    //             // Step 1
    //             "#1e3a8a", "#ef4444",
    //             // Step 2
    //             "#1e3a8a", "#ef4444",
    //             // Step 3
    //             "#1e3a8a", "#ef4444",
    //             // Step 4
    //             "#1e3a8a", "#ef4444",
    //             // Step 5
    //             "#1e3a8a", "#ef4444",
    //             // Step 6
    //             "#1e3a8a", "#ef4444",
    //             // Step 7
    //             "#1e3a8a", "#ef4444"
    //         ]
    //     },
    //     link: {
    //         source: [
    //             // Step 1 to Step 2
    //             0, 0, 1,
    //             // Step 2 to Step 3
    //             2, 2, 3,
    //             // Step 3 to Step 4
    //             4, 4, 5,
    //             // Step 4 to Step 5
    //             6, 6, 7,
    //             // Step 5 to Step 6
    //             8, 8, 9,
    //             // Step 6 to Step 7
    //             10, 10, 11
    //         ],
    //         target: [
    //             // Step 1 to Step 2
    //             2, 3, 3,
    //             // Step 2 to Step 3
    //             4, 5, 5,
    //             // Step 3 to Step 4
    //             6, 7, 7,
    //             // Step 4 to Step 5
    //             8, 9, 9,
    //             // Step 5 to Step 6
    //             10, 11, 11,
    //             // Step 6 to Step 7
    //             12, 13, 13
    //         ],
    //         value: [
    //             // Step 1 to Step 2: brand1 retention (700), brand1 loss (100), brand2 retention (50)
    //             700, 100, 50,
    //             // Step 2 to Step 3: brand1 retention (650), brand1 loss (120), brand2 retention (150)
    //             650, 120, 150,
    //             // Step 3 to Step 4: brand1 retention (600), brand1 loss (150), brand2 retention (270)
    //             600, 150, 270,
    //             // Step 4 to Step 5: brand1 retention (550), brand1 loss (180), brand2 retention (420)
    //             550, 180, 420,
    //             // Step 5 to Step 6: brand1 retention (500), brand1 loss (200), brand2 retention (600)
    //             500, 200, 600,
    //             // Step 6 to Step 7: brand1 retention (450), brand1 loss (220), brand2 retention (800)
    //             450, 220, 800
    //         ],
    //         color: [
    //             // Retention flows (gray)
    //             "rgba(156, 163, 175, 0.5)",
    //             // Loss flows (red)
    //             "rgba(239, 68, 68, 0.6)",
    //             // Comp retention (light)
    //             "rgba(252, 165, 165, 0.4)",

    //             "rgba(156, 163, 175, 0.5)", "rgba(239, 68, 68, 0.6)", "rgba(252, 165, 165, 0.4)",
    //             "rgba(156, 163, 175, 0.5)", "rgba(239, 68, 68, 0.6)", "rgba(252, 165, 165, 0.4)",
    //             "rgba(156, 163, 175, 0.5)", "rgba(239, 68, 68, 0.6)", "rgba(252, 165, 165, 0.4)",
    //             "rgba(156, 163, 175, 0.5)", "rgba(239, 68, 68, 0.6)", "rgba(252, 165, 165, 0.4)",
    //             "rgba(156, 163, 175, 0.5)", "rgba(239, 68, 68, 0.6)", "rgba(252, 165, 165, 0.4)"
    //         ]
    //     }
    // }];
    const sankeyData = [
        {
            "arrangement": "snap",
            "link": {
                "color": [
                    "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(31, 119, 180, 0.4)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(31, 119, 180, 0.4)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(31, 119, 180, 0.4)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(31, 119, 180, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(239, 85, 59, 0.4)", "rgba(239, 85, 59, 0.4)", "rgba(239, 85, 59, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(239, 85, 59, 0.4)", "rgba(239, 85, 59, 0.4)", "rgba(239, 85, 59, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(239, 85, 59, 0.4)", "rgba(239, 85, 59, 0.4)", "rgba(239, 85, 59, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(31, 119, 180, 0.4)", "rgba(31, 119, 180, 0.4)", "rgba(31, 119, 180, 0.4)", "rgba(31, 119, 180, 0.4)", "rgba(31, 119, 180, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(230, 230, 230, 0.4)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(200, 200, 200, 0.1)", "rgba(239, 85, 59, 0.4)", "rgba(239, 85, 59, 0.4)", "rgba(239, 85, 59, 0.4)"
                ],
                "hovertemplate": "%{label}<br>Value: %{value:.2f}<extra></extra>",
                "label": [
                    "Retention: sku1", "Retention: sku2", "Retention: sku3", "Retention: sku4", "Retention: sku5", "Retention: sku6", "Retention: sku7",
                    "Switch: sku4 -> sku2", "Switch: sku4 -> sku5", "Switch: sku4 -> sku1",
                    "Switch: sku6 -> sku2", "Switch: sku6 -> sku5", "Switch: sku6 -> sku1",
                    "Switch: sku7 -> sku2", "Switch: sku7 -> sku5", "Switch: sku7 -> sku1",
                    "Switch: sku3 -> sku2", "Switch: sku3 -> sku5", "Switch: sku3 -> sku1",
                    "Retention: sku1", "Retention: sku2", "Retention: sku3", "Retention: sku4", "Retention: sku5", "Retention: sku6", "Retention: sku7",
                    "Switch: sku3 -> sku2", "Switch: sku3 -> sku6", "Switch: sku3 -> sku7",
                    "Switch: sku5 -> sku2", "Switch: sku5 -> sku4", "Switch: sku5 -> sku6", "Switch: sku5 -> sku7",
                    "Switch: sku1 -> sku2", "Switch: sku1 -> sku6", "Switch: sku1 -> sku7",
                    "Retention: sku1", "Retention: sku2", "Retention: sku3", "Retention: sku4", "Retention: sku5", "Retention: sku6", "Retention: sku7",
                    "Switch: sku2 -> sku4", "Switch: sku2 -> sku3", "Switch: sku2 -> sku5",
                    "Switch: sku6 -> sku4", "Switch: sku6 -> sku3", "Switch: sku6 -> sku5",
                    "Switch: sku7 -> sku4", "Switch: sku7 -> sku3", "Switch: sku7 -> sku5",
                    "Switch: sku1 -> sku4", "Switch: sku1 -> sku3", "Switch: sku1 -> sku5",
                    "Retention: sku1", "Retention: sku2", "Retention: sku3", "Retention: sku4", "Retention: sku5", "Retention: sku6", "Retention: sku7",
                    "Switch: sku4 -> sku2", "Switch: sku4 -> sku6", "Switch: sku4 -> sku7",
                    "Switch: sku3 -> sku2", "Switch: sku3 -> sku6", "Switch: sku3 -> sku7",
                    "Switch: sku5 -> sku2", "Switch: sku5 -> sku6", "Switch: sku5 -> sku7",
                    "Switch: sku1 -> sku2", "Switch: sku1 -> sku6", "Switch: sku1 -> sku7",
                    "Retention: sku1", "Retention: sku2", "Retention: sku3", "Retention: sku5", "Retention: sku6", "Retention: sku7",
                    "Switch: sku2 -> sku1", "Switch: sku6 -> sku1", "Switch: sku7 -> sku1", "Switch: sku3 -> sku1", "Switch: sku5 -> sku1",
                    "Retention: sku1", "Retention: sku2", "Retention: sku3", "Retention: sku5", "Retention: sku6", "Retention: sku7",
                    "Switch: sku2 -> sku4", "Switch: sku2 -> sku6", "Switch: sku2 -> sku3",
                    "Switch: sku7 -> sku4", "Switch: sku7 -> sku6", "Switch: sku7 -> sku3",
                    "Switch: sku5 -> sku4", "Switch: sku5 -> sku6", "Switch: sku5 -> sku3",
                    "Switch: sku1 -> sku4", "Switch: sku1 -> sku6", "Switch: sku1 -> sku3"
                ],
                "source": [0, 1, 2, 3, 4, 5, 6, 3, 3, 3, 5, 5, 5, 6, 6, 6, 2, 2, 2, 7, 8, 9, 10, 11, 12, 13, 9, 9, 9, 11, 11, 11, 11, 7, 7, 7, 14, 15, 16, 17, 18, 19, 20, 15, 15, 15, 19, 19, 19, 20, 20, 20, 14, 14, 14, 21, 22, 23, 24, 25, 26, 27, 24, 24, 24, 23, 23, 23, 25, 25, 25, 21, 21, 21, 28, 29, 30, 32, 33, 34, 29, 33, 34, 30, 32, 35, 36, 37, 39, 40, 41, 36, 36, 36, 41, 41, 41, 39, 39, 39, 35, 35, 35],
                "target": [7, 8, 9, 10, 11, 12, 13, 8, 11, 7, 8, 11, 7, 8, 11, 7, 8, 11, 7, 14, 15, 16, 17, 18, 19, 20, 15, 19, 20, 15, 17, 19, 20, 15, 19, 20, 21, 22, 23, 24, 25, 26, 27, 24, 23, 25, 24, 23, 25, 24, 23, 25, 24, 23, 25, 28, 29, 30, 31, 32, 33, 34, 29, 33, 34, 29, 33, 34, 29, 33, 34, 29, 33, 34, 35, 36, 37, 39, 40, 41, 35, 35, 35, 35, 35, 42, 43, 44, 46, 47, 48, 45, 47, 44, 45, 47, 44, 45, 47, 44, 45, 47, 44],
                "value": [2.5720425983560293, 3.3227382786979924, 0.21102326287185852, 0.0004826132321461605, 3.1603708907326276, 2.1343894771676744, 1.806783363861243, 0.0004243995174766479, 0.0004034457432163285, 0.00024120443567014475, 0.0872910614813144, 0.08298126111184585, 0.0496112515604047, 0.03320390695018665, 0.03156453851986522, 0.018871203449010634, 0.015112470693088263, 0.014366326349424892, 0.00858906481982164, 2.789541431597942, 3.728831133384927, 0.200528637379435, 0.0004826132321461605, 3.488555989504906, 2.1343894771676744, 1.806783363861243, 0.003140685773760327, 0.004300856771722421, 0.0030184621122050746, 0.01731488848350978, 0.00019086783455480092, 0.023711017513465035, 0.01664105823676669, 0.003980580860036371, 0.0054510095503054745, 0.0038256716450186926, 2.67280531354003, 3.5587416828624754, 0.200528637379435, 0.0028589487957753016, 3.488555989504906, 2.3260468819533484, 1.7529869463010768, 0.0016449588375654033, 0.008638423846603637, 0.08517662641202775, 0.00044166377893890303, 0.002319376529697025, 0.022869527090465944, 0.0011131538738790624, 0.005845675131475005, 0.05763955272876458, 0.0004979121539821966, 0.002614762221551684, 0.025782090443380694, 2.656442763940381, 3.5587416828624754, 0.21230723504646015, 0.00019588547072743872, 3.344631230084858, 2.3260468819533484, 1.7529869463010768, 0.0032676148921294583, 0.0007106508773751958, 0.002382486199908774, 0.0039245991288651885, 0.0008535338178901525, 0.0028615071155468534, 0.1722962499204992, 0.03747151522334529, 0.1256247909508424, 0.008405690239474966, 0.0018280952134277217, 0.006128764146746203, 2.656442763940381, 3.261518866161914, 0.15247552770972067, 2.97634756505785, 2.019532911124945, 1.8699763059033414, 0.09616154418767826, 0.05139421805606908, 0.028060602775822674, 0.007539959705217287, 0.04641091016783118, 2.860744751730208, 3.05061722532586, 0.15247552770972067, 2.8768164549784956, 2.019532911124945, 1.605771896520199, 0.001554497197784173, 0.01583643129588642, 0.0053151077335278, 0.0019473770445796695, 0.019838892484098293, 0.006658435154784359, 0.0007336160643291438, 0.007473709452077189, 0.002508366320964853, 0.00018640504181968254, 0.0018990002955245554, 0.0006373526312923759]
            },
            "node": {
                "color": [
                    "#1f77b4", "#e0e0e0", "#EF553B", "#e0e0e0", "#e0e0e0", "#e0e0e0", "#e0e0e0",
                    "#1f77b4", "#e0e0e0", "#EF553B", "#e0e0e0", "#e0e0e0", "#e0e0e0", "#e0e0e0",
                    "#1f77b4", "#e0e0e0", "#EF553B", "#e0e0e0", "#e0e0e0", "#e0e0e0", "#e0e0e0",
                    "#1f77b4", "#e0e0e0", "#EF553B", "#e0e0e0", "#e0e0e0", "#e0e0e0", "#e0e0e0",
                    "#1f77b4", "#e0e0e0", "#EF553B", "#e0e0e0", "#e0e0e0", "#e0e0e0", "#e0e0e0",
                    "#1f77b4", "#e0e0e0", "#EF553B", "#e0e0e0", "#e0e0e0", "#e0e0e0", "#e0e0e0",
                    "#1f77b4", "#e0e0e0", "#EF553B", "#e0e0e0", "#e0e0e0", "#e0e0e0", "#e0e0e0"
                ],
                "label": [
                    "brand1", "brand2", "brand2", "brand2", "brand2", "brand2", "brand2",
                    "brand1", "brand2", "brand2", "brand2", "brand2", "brand2", "brand2",
                    "brand1", "brand2", "brand2", "brand2", "brand2", "brand2", "brand2",
                    "brand1", "brand2", "brand2", "brand2", "brand2", "brand2", "brand2",
                    "brand1", "brand2", "brand2", "brand2", "brand2", "brand2", "brand2",
                    "brand1", "brand2", "brand2", "brand2", "brand2", "brand2", "brand2",
                    "brand1", "brand2", "brand2", "brand2", "brand2", "brand2", "brand2"
                ],
                "line": { "color": "white", "width": 0.5 },
                "pad": 20,
                "thickness": 15,
                "x": [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95]
            },
            "type": "sankey"
        }
    ]
    // LEVER 1 - Pricing Interaction (EXACT STREAMLIT DATA)
    const pricingInteractionData = [
        {
            x: [1, 2, 3, 4, 5, 6],
            y: [102, 103, 110, 115, 115, 112],
            name: 'Price Index',
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: '#3b82f6', size: 10, symbol: 'circle' },
            line: { color: '#3b82f6', width: 3 },
            yaxis: 'y',
            hovertemplate: '<b>Price Index</b><br>Period %{x}: %{y}<extra></extra>'
        },
        {
            x: [1, 2, 3, 4, 5, 6],
            y: [420, 410, 350, 190, 185, 250],
            name: 'Our Volume',
            type: 'scatter',
            mode: 'lines+markers',
            line: { dash: 'dot', color: '#10b981', width: 3 },
            marker: { color: '#10b981', size: 10, symbol: 'square' },
            yaxis: 'y2',
            hovertemplate: '<b>Our Volume</b><br>Period %{x}: %{y}<extra></extra>'
        }
    ];

    // LEVER 1 - Price Response Curve (EXACT STREAMLIT DATA - S-CURVE)
    const priceResponseData = [
        {
            x: [90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120],
            y: [950, 920, 880, 830, 770, 700, 650, 600, 520, 420, 300, 180, 80, 50, 30, 20],
            type: 'scatter',
            mode: 'lines',
            line: { shape: 'spline', color: '#ef4444', width: 4 },
            name: 'Volume Response',
            fill: 'tozeroy',
            fillcolor: 'rgba(239, 68, 68, 0.1)',
            hovertemplate: '<b>Price Index: %{x}</b><br>Volume: %{y}<extra></extra>'
        },
        {
            x: [115],
            y: [50],
            type: 'scatter',
            mode: 'markers+text',
            marker: { size: 18, color: '#ef4444', symbol: 'circle', line: { color: '#fff', width: 2 } },
            text: ['Current Point'],
            textposition: 'top center',
            textfont: { size: 12, color: '#ef4444', weight: 'bold' },
            name: 'Current',
            hovertemplate: '<b>Current Position</b><br>Index: 115<br>Volume: 50<extra></extra>'
        },
        {
            x: [105],
            y: [650],
            type: 'scatter',
            mode: 'markers+text',
            marker: { size: 18, color: '#10b981', symbol: 'star', line: { color: '#fff', width: 2 } },
            text: ['Optimal Sweet Spot'],
            textposition: 'top center',
            textfont: { size: 12, color: '#10b981', weight: 'bold' },
            name: 'Optimal',
            hovertemplate: '<b>Optimal Sweet Spot</b><br>Index: 105<br>Volume: 650<extra></extra>'
        }
    ];

    // LEVER 2 - Incentive Curve: Price Per Gram (EXACT STREAMLIT DATA)
    // const incentiveCurveData = [
    //     {
    //         x: ['12.00 ML', '130.00 ML', '250.00 ML', '500.00 ML', '1000.00 ML', '3785.41 ML', '3790.00 ML', '3800.00 ML'],
    //         y: [0.57, 0.48, 0.38, 0.30, 0.25, 0.23, 0.23, 0.23],
    //         name: ' Catogery 1 (Less Premium)',
    //         type: 'scatter',
    //         mode: 'lines+markers',
    //         line: { color: '#3b82f6', width: 3 },
    //         marker: { size: 10, color: '#3b82f6' },
    //         hovertemplate: '<b> Catogery 1</b><br>%{x}: $%{y}/g<extra></extra>'
    //     },
    //     {
    //         x: ['130.00 ML', '250.00 ML', '500.00 ML', '1000.00 ML'],
    //         y: [0.51, 0.45, 0.40, 0.36],
    //         name: ' Catogery 2 (More Premium)',
    //         type: 'scatter',
    //         mode: 'lines+markers',
    //         line: { color: '#f59e0b', width: 3 },
    //         marker: { size: 10, color: '#f59e0b' },
    //         hovertemplate: '<b> Catogery 2 (Premium)</b><br>%{x}: $%{y}/g<extra></extra>'
    //     }
    // ];

    const incentiveCurveData = [
        {
            "customdata": [
                ["12.00 ML", 0.5697847393981403, " Catogery 1"],
                ["130.00 ML", 0.5100629162885857, " Catogery 2"],
                ["130.00 ML", 0.48236945128493597, " Catogery 1"],
                ["250.00 ML", 0.4139711303548157, " Catogery 1"],
                ["250.00 ML", 0.44715308894887495, " Catogery 2"],
                ["500.00 ML", 0.3428118324282993, " Catogery 1"],
                ["500.00 ML", 0.36211082280127094, " Catogery 2"],
                ["1000.00 ML", 0.34426331866059756, " Catogery 2"],
                ["1000.00 ML", 0.3205113116719187, " Catogery 1"],
                ["3785.41 ML", 0.25040497136254836, " Catogery 1"],
                ["3790.00 ML", 0.25400822063784445, " Catogery 1"],
                ["3800.00 ML", 0.22994475263400305, " Catogery 1"]
            ],
            "hovertemplate": "<b>%{customdata[2]}</b><br>Content: %{x}<br>PPG: $%{y:.2f}<extra></extra>",
            "legendgroup": " Catogery 1",
            "line": {
                "color": "#636efa",
                "dash": "solid",
                "shape": "spline",
                "width": 3
            },
            "marker": {
                "symbol": "circle",
                "line": { "color": "white", "width": 2 },
                "opacity": 0.8,
                "size": 10
            },
            "mode": "lines+markers",
            "name": " Catogery 1",
            "orientation": "v",
            "showlegend": true,
            "x": [
                "12.00 ML", "130.00 ML", "250.00 ML", "500.00 ML",
                "1000.00 ML", "3785.41 ML", "3790.00 ML", "3800.00 ML"
            ],
            "xaxis": "x",
            "y": {
                "dtype": "f8",
                "bdata": "WDKvNK074j/R7XYeJN/eP2wsl8SAfto/N4c9CqHw1T/IQGjgQYPUP3KCsJKiBtA/HIAjsqtB0D/IlDlk1G7NPw=="
            },
            "yaxis": "y",
            "type": "scatter"
        },
        {
            "customdata": [
                ["12.00 ML", 0.5697847393981403, " Catogery 1"],
                ["130.00 ML", 0.5100629162885857, " Catogery 2"],
                ["130.00 ML", 0.48236945128493597, " Catogery 1"],
                ["250.00 ML", 0.4139711303548157, " Catogery 1"],
                ["250.00 ML", 0.44715308894887495, " Catogery 2"],
                ["500.00 ML", 0.3428118324282993, " Catogery 1"],
                ["500.00 ML", 0.36211082280127094, " Catogery 2"],
                ["1000.00 ML", 0.34426331866059756, " Catogery 2"],
                ["1000.00 ML", 0.3205113116719187, " Catogery 1"],
                ["3785.41 ML", 0.25040497136254836, " Catogery 1"],
                ["3790.00 ML", 0.25400822063784445, " Catogery 1"],
                ["3800.00 ML", 0.22994475263400305, " Catogery 1"]
            ],
            "hovertemplate": "<b>%{customdata[2]}</b><br>Content: %{x}<br>PPG: $%{y:.2f}<extra></extra>",
            "legendgroup": " Catogery 2",
            "line": {
                "color": "#EF553B",
                "dash": "solid",
                "shape": "spline",
                "width": 3
            },
            "marker": {
                "symbol": "circle",
                "line": { "color": "white", "width": 2 },
                "opacity": 0.8,
                "size": 10
            },
            "mode": "lines+markers",
            "name": " Catogery 2",
            "orientation": "v",
            "showlegend": true,
            "x": [
                "130.00 ML", "250.00 ML", "500.00 ML", "1000.00 ML"
            ],
            "xaxis": "x",
            "y": {
                "dtype": "f8",
                "bdata": "XpQLd29S4D+ez1X9J57cPw5iXd/SLNc/NgW3A2kI1j8="
            },
            "yaxis": "y",
            "type": "scatter"
        }
    ]

    // LEVER 2 - Market Potential: 24-Month Timeline (EXACT STREAMLIT DATA)
    // const marketPotentialData = [
    //     {
    //         x: ['2023-09', '2023-10', '2023-11', '2023-12', '2024-01', '2024-02', '2024-03', '2024-04',
    //             '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
    //             '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08'],
    //         y: [15000, 18000, 22000, 28000, 35000, 42000, 48000, 55000, 62000, 68000, 70000, 69000,
    //             65000, 60000, 55000, 50000, 45000, 42000, 40000, 38000, 36000, 35000, 34000, 33000],
    //         name: 'Sales Volume',
    //         type: 'bar',
    //         marker: { color: '#14b8a6' },
    //         yaxis: 'y',
    //         hovertemplate: '<b>Volume</b><br>%{x}: %{y}<extra></extra>'
    //     },
    //     {
    //         x: ['2023-09', '2023-10', '2023-11', '2023-12', '2024-01', '2024-02', '2024-03', '2024-04',
    //             '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
    //             '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08'],
    //         y: [0, 20, 22, 27, 25, 20, 14, 15, 13, 10, 3, -1, -6, -8, -8, -9, -10, -7, -5, -5, -5, -3, -3, -3],
    //         name: 'Growth %',
    //         type: 'scatter',
    //         mode: 'lines+markers',
    //         marker: { color: '#ec4899', size: 8 },
    //         line: { width: 3, color: '#ec4899' },
    //         yaxis: 'y2',
    //         hovertemplate: '<b>Growth</b><br>%{x}: %{y}%<extra></extra>'
    //     }
    // ];

    const marketPotentialData = [
        {
            "marker": {
                "color": "#13aa72"
            },
            "name": "Sales Volume",
            "offsetgroup": "1",
            "x": [
                "2023-09",
                "2023-10",
                "2023-11",
                "2023-12",
                "2024-01",
                "2024-02",
                "2024-03",
                "2024-04",
                "2024-05",
                "2024-06",
                "2024-07",
                "2024-08",
                "2024-09",
                "2024-10",
                "2024-11",
                "2024-12",
                "2025-01",
                "2025-02",
                "2025-03",
                "2025-04",
                "2025-05",
                "2025-06",
                "2025-07",
                "2025-08"
            ],
            "y": {
                "dtype": "f8",
                "bdata": "dy0hH1xS4UCxUGuae8XeQNV46SaFVNJAveMUHUHmz0AXt9EAjo7CQDvfT41HrL5A3LWEfIBMw0BDHOviFtiwQDIIrBy6Y6dAjZduEpN5vUD6XG3FkO3hQCuHFtlefsRAsVBrmo+mwkB4eqUs+9vOQNIA3gLHkOlA0t7gC0DM8ED5MeauZX7nQJeQD3pOZ+hAmbuWkHfK20Ar9pfd843HQL8OnDM+w9NA\u002f5B+++b84EC8BRIU+XfjQEA1XroBR+hA"
            },
            "type": "bar",
            "xaxis": "x",
            "yaxis": "y"
        },
        {
            "line": {
                "color": "#c333a6",
                "shape": "spline",
                "width": 4
            },
            "marker": {
                "color": "violet",
                "size": 10,
                "symbol": "circle"
            },
            "mode": "lines+markers+text",
            "name": "Growth %",
            "text": [
                "",
                "",
                "",
                "",
                "",
                "",
                "24.8%",
                "",
                "",
                "120.6%",
                "381.7%",
                "",
                "",
                "67.5%",
                "226.2%",
                "32.5%",
                "",
                "",
                "",
                "",
                "57.4%",
                "63.7%",
                "12.2%",
                "23.9%"
            ],
            "textposition": "top center",
            "x": [
                "2023-09",
                "2023-10",
                "2023-11",
                "2023-12",
                "2024-01",
                "2024-02",
                "2024-03",
                "2024-04",
                "2024-05",
                "2024-06",
                "2024-07",
                "2024-08",
                "2024-09",
                "2024-10",
                "2024-11",
                "2024-12",
                "2025-01",
                "2025-02",
                "2025-03",
                "2025-04",
                "2025-05",
                "2025-06",
                "2025-07",
                "2025-08"
            ],
            "y": {
                "dtype": "f8",
                "bdata": "uu6meYiNPsDtS4y5qfMlwECnR33B\u002fUPAUn1nA6i8KMA6OrQbWk1EwCmpaKjXUjLA3ZcC9wTAOEDukfb\u002fP4VLwP4UyKCMFTbAFB+6tIcoXkDFijruf9t3QMc4+KYcZFHA7GEoXh+gLsAl8SD39+JQQOgqrMQXRmxA8uEA9I4\u002fQEAOZmGnE087wBDQx\u002f9PIaK\u002fbT3fCFFdRMCr60CZNUFKwE0NFVw7tExAnJC9oiLfT0CkWpBaIWwoQIIF24OP8TdA"
            },
            "type": "scatter",
            "xaxis": "x",
            "yaxis": "y2"
        }
    ]









    // LEVER 2 - S-Curve: White Space Analysis (EXACT STREAMLIT DATA)
    // const sCurveData = [
    //     {
    //         x: ['12.00 ML', '130.00 ML', '250.00 ML', '500.00 ML', '1000.00 ML', '3785.41 ML', '3790.00 ML', '3800.00 ML'],
    //         y: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.35, 1.4],
    //         name: ' Catogery-1',
    //         type: 'scatter',
    //         mode: 'markers',
    //         marker: { size: 14, color: '#93c5fd', line: { color: '#3b82f6', width: 2 } },
    //         hovertemplate: '<b> Catogery-1</b><br>%{x}<br>API: %{y}<extra></extra>'
    //     },
    //     {
    //         x: ['130.00 ML', '250.00 ML', '500.00 ML', '1000.00 ML'],
    //         y: [0.95, 1.05, 1.15, 1.25],
    //         name: ' Catogery-2',
    //         type: 'scatter',
    //         mode: 'markers',
    //         marker: { size: 14, color: '#fca5a5', line: { color: '#ef4444', width: 2 } },
    //         hovertemplate: '<b> Catogery-2</b><br>%{x}<br>API: %{y}<extra></extra>'
    //     }
    // ];
    const sCurveData = [
        {
            "hovertemplate": " Catogery= Catogery-1\u003cbr\u003eTotal_Net_Content=%{x}\u003cbr\u003eAPI=%{y}\u003cbr\u003eMarket Share Volume=%{marker.size}\u003cextra\u003e\u003c\u002fextra\u003e",
            "legendgroup": " Catogery-1",
            "marker": {
                "color": "#636efa",
                "size": {
                    "dtype": "f8",
                    "bdata": "tuL5QrXPsD+\u002fBrCbtbZzPzUdtXdT3oA\u002f0uX93Z9jxT9MVcw6hCy6P8gKrwvDNc8\u002f19I4BvmvwD+31Z4f+lGjPw=="
                },
                "sizemode": "area",
                "sizeref": 6.77300508035448e-05,
                "symbol": "circle"
            },
            "mode": "markers",
            "name": " Catogery-1",
            "orientation": "v",
            "showlegend": true,
            "x": [
                "3800.00 ML",
                "3785.41 ML",
                "3790.00 ML",
                "1000.00 ML",
                "500.00 ML",
                "250.00 ML",
                "130.00 ML",
                "12.00 ML"
            ],
            "xaxis": "x",
            "y": {
                "dtype": "f8",
                "bdata": "NqxCaNaq4j+jDeOPDVTkP90\u002fUAvwnuQ\u002fVTnsjwoF6j9Caw+8gNTrP6Z9zeivzfA\u002f1Ktgy26U8z+8MeD3ySD3Pw=="
            },
            "yaxis": "y",
            "type": "scatter"
        },
        {
            "hovertemplate": " Catogery= Catogery-2\u003cbr\u003eTotal_Net_Content=%{x}\u003cbr\u003eAPI=%{y}\u003cbr\u003eMarket Share Volume=%{marker.size}\u003cextra\u003e\u003c\u002fextra\u003e",
            "legendgroup": " Catogery-2",
            "marker": {
                "color": "#EF553B",
                "size": {
                    "dtype": "f8",
                    "bdata": "cMyG4TQoeD\u002fC+LMSnvB4P9aini2IY6U\u002felHoNrnMmz8="
                },
                "sizemode": "area",
                "sizeref": 6.77300508035448e-05,
                "symbol": "circle"
            },
            "mode": "markers",
            "name": " Catogery-2",
            "orientation": "v",
            "showlegend": true,
            "x": [
                "1000.00 ML",
                "500.00 ML",
                "250.00 ML",
                "130.00 ML"
            ],
            "xaxis": "x",
            "y": {
                "dtype": "f8",
                "bdata": "ylKGH6vy6z+fs+TElWXtP\u002fZlFm19JvI\u002fF2HiATS09D8="
            },
            "yaxis": "y",
            "type": "scatter"
        }
    ]
    // LEVER 2 - CAGR Comparison (EXACT STREAMLIT DATA)
    // const cagrData = [
    //     {
    //         x: ['Long-Term (12M)', 'Short-Term (3M)'],
    //         y: [13.84, 34.94],
    //         type: 'bar',
    //         marker: {
    //             color: ['#14b8a6', '#3b82f6'],
    //             line: { color: '#fff', width: 2 }
    //         },
    //         text: ['13.84%', '34.94%'],
    //         textposition: 'outside',
    //         textfont: { size: 14, color: '#1e293b', weight: 'bold' },
    //         hovertemplate: '<b>%{x}</b><br>CAGR: %{y}%<extra></extra>'
    //     }
    // ];
    const cagrData = [
        {
            "hovertemplate": "\u003cb\u003e%{x}\u003c\u002fb\u003e\u003cbr\u003eCAGR: \u003cb\u003e%{y:.1f}%\u003c\u002fb\u003e\u003cextra\u003e\u003c\u002fextra\u003e",
            "marker": {
                "color": [
                    "#27AE60",
                    "#3498DB"
                ],
                "line": {
                    "color": [
                        "#1E8449",
                        "#2874A6"
                    ],
                    "width": 2
                },
                "opacity": 0.85
            },
            "text": [
                "13.8%",
                "34.9%"
            ],
            "textfont": {
                "color": "#333",
                "family": "Arial Black",
                "size": 16
            },
            "textposition": "outside",
            "width": 0.5,
            "x": [
                "Long-Term (12M)",
                "Short-Term (3M)"
            ],
            "y": [
                13.842271647240834,
                34.93626588167766
            ],
            "type": "bar"
        }
    ]

    // LEVER 3 - Optimal Budget Allocation (EXACT STREAMLIT DATA)
    // const lever3BarData = [
    //     {
    //         x: ["TV", "Digital", "Sponsorship"],
    //         y: [152, 45, 15],
    //         type: "bar",
    //         name: "Allocated Budget (Mn)",
    //         marker: { color: "#0A2472" },
    //         hovertemplate: '<b>%{x}</b><br>Budget: $%{y}M<extra></extra>'
    //     }
    // ];
    const lever3BarData = [
        {
            "connectgaps": false,
            "line": {
                "color": "#3498db",
                "width": 2
            },
            "marker": {
                "size": 6
            },
            "mode": "lines+markers",
            "name": "CORD",
            "x": [
                "GMA",
                "MINDANAO",
                "NoLUZON",
                "SoLUZON",
                "VISAYAS",
                "Total"
            ],
            "y": [
                440,
                450,
                448,
                452,
                446,
                449
            ],
            "type": "scatter",
            "xaxis": "x",
            "yaxis": "y"
        },
        {
            "connectgaps": false,
            "line": {
                "color": "#1abc9c",
                "width": 2
            },
            "marker": {
                "size": 6
            },
            "mode": "lines+markers",
            "name": "SMKT",
            "x": [
                "GMA",
                "MINDANAO",
                "NoLUZON",
                "SoLUZON",
                "VISAYAS",
                "Total"
            ],
            "y": [
                450,
                455,
                453,
                449,
                455,
                454
            ],
            "type": "scatter",
            "xaxis": "x",
            "yaxis": "y"
        },
        {
            "connectgaps": false,
            "line": {
                "color": "#9b59b6",
                "width": 2
            },
            "marker": {
                "size": 6
            },
            "mode": "lines+markers",
            "name": "WS\u002fHYBRID",
            "x": [
                "GMA",
                "MINDANAO",
                "NoLUZON",
                "SoLUZON",
                "VISAYAS",
                "Total"
            ],
            "y": [
                455,
                455,
                450,
                452,
                452,
                452
            ],
            "type": "scatter",
            "xaxis": "x",
            "yaxis": "y"
        },
        {
            "connectgaps": false,
            "line": {
                "color": "#f1c40f",
                "width": 2
            },
            "marker": {
                "size": 6
            },
            "mode": "lines+markers",
            "name": "DISCOUNTER",
            "x": [
                "GMA",
                "MINDANAO",
                "NoLUZON",
                "SoLUZON",
                "VISAYAS",
                "Total"
            ],
            "y": [
                null,
                446,
                500,
                480,
                null,
                495
            ],
            "type": "scatter",
            "xaxis": "x",
            "yaxis": "y"
        },
        {
            "connectgaps": false,
            "line": {
                "color": "#e67e22",
                "width": 2
            },
            "marker": {
                "size": 6
            },
            "mode": "lines+markers",
            "name": "E-COMMERCE",
            "x": [
                "GMA",
                "MINDANAO",
                "NoLUZON",
                "SoLUZON",
                "VISAYAS",
                "Total"
            ],
            "y": [
                446,
                460,
                435,
                447,
                467,
                440
            ],
            "type": "scatter",
            "xaxis": "x",
            "yaxis": "y"
        },
        {
            "connectgaps": false,
            "line": {
                "color": "#9b59b6",
                "width": 2
            },
            "marker": {
                "size": 6
            },
            "mode": "lines+markers",
            "name": "DS",
            "x": [
                "GMA",
                "MINDANAO",
                "NoLUZON",
                "SoLUZON",
                "VISAYAS",
                "Total"
            ],
            "y": [
                null,
                442,
                472,
                448,
                444,
                447
            ],
            "type": "scatter",
            "xaxis": "x",
            "yaxis": "y"
        },
        {
            "connectgaps": false,
            "line": {
                "color": "#005580",
                "width": 2
            },
            "marker": {
                "size": 6
            },
            "mode": "lines+markers",
            "name": "GROC",
            "x": [
                "GMA",
                "MINDANAO",
                "NoLUZON",
                "SoLUZON",
                "VISAYAS",
                "Total"
            ],
            "y": [
                474,
                474,
                448,
                453,
                464,
                465
            ],
            "type": "scatter",
            "xaxis": "x",
            "yaxis": "y"
        },
        {
            "connectgaps": true,
            "line": {
                "color": "#145A32",
                "width": 4
            },
            "marker": {
                "size": 6
            },
            "mode": "lines+markers",
            "name": "Grand Total",
            "x": [
                "GMA",
                "MINDANAO",
                "NoLUZON",
                "SoLUZON",
                "VISAYAS",
                "Total"
            ],
            "y": [
                450,
                452,
                449,
                453,
                449,
                451
            ],
            "type": "scatter",
            "xaxis": "x",
            "yaxis": "y"
        },
        {
            "cells": {
                "align": "center",
                "fill": {
                    "color": "white"
                },
                "font": {
                    "size": 10
                },
                "height": 25,
                "values": [
                    [
                        "CORD",
                        "SMKT",
                        "WS\u002fHYBRID",
                        "DISCOUNTER",
                        "E-COMMERCE",
                        "DS",
                        "GROC",
                        "\u003cb\u003e100%\u003c\u002fb\u003e"
                    ],
                    [
                        "60%",
                        "19%",
                        "20%",
                        "0%",
                        "0%",
                        "0%",
                        "0%",
                        "\u003cb\u003e100%\u003c\u002fb\u003e"
                    ],
                    [
                        "-5%",
                        "5%",
                        "9%",
                        "180%",
                        "21%",
                        "4%",
                        "16%",
                        "\u003cb\u003e-1%\u003c\u002fb\u003e"
                    ]
                ]
            },
            "header": {
                "align": "center",
                "fill": {
                    "color": "#eee"
                },
                "font": {
                    "size": 10
                },
                "values": [
                    "\u003cb\u003eChannel\u003c\u002fb\u003e",
                    "\u003cb\u003eContribution\u003c\u002fb\u003e",
                    "\u003cb\u003eCAGR\u003c\u002fb\u003e"
                ]
            },
            "type": "table",
            "domain": {
                "x": [
                    0.804,
                    1.0
                ],
                "y": [
                    0.224,
                    1.0
                ]
            }
        },
        {
            "cells": {
                "align": "center",
                "fill": {
                    "color": [
                        "#f9f9f9",
                        "white",
                        "white",
                        "white",
                        "white",
                        "white",
                        "white"
                    ]
                },
                "font": {
                    "size": 10
                },
                "height": 30,
                "line": {
                    "color": "darkgrey"
                },
                "values": [
                    [
                        "\u003cb\u003eContribution\u003c\u002fb\u003e",
                        "\u003cb\u003eCAGR\u003c\u002fb\u003e"
                    ],
                    [
                        "3%",
                        "-11%"
                    ],
                    [
                        "28%",
                        "-4%"
                    ],
                    [
                        "38%",
                        "5%"
                    ],
                    [
                        "15%",
                        "-4%"
                    ],
                    [
                        "16%",
                        "-2%"
                    ],
                    [
                        "\u003cb\u003e100%\u003c\u002fb\u003e",
                        "\u003cb\u003e-1%\u003c\u002fb\u003e"
                    ]
                ]
            },
            "header": {
                "align": "center",
                "fill": {
                    "color": "#eee"
                },
                "font": {
                    "size": 10
                },
                "line": {
                    "color": "darkgrey"
                },
                "values": [
                    "\u003cb\u003eRegion\u003c\u002fb\u003e",
                    "\u003cb\u003eGMA\u003c\u002fb\u003e",
                    "\u003cb\u003eMINDANAO\u003c\u002fb\u003e",
                    "\u003cb\u003eNoLUZON\u003c\u002fb\u003e",
                    "\u003cb\u003eSoLUZON\u003c\u002fb\u003e",
                    "\u003cb\u003eVISAYAS\u003c\u002fb\u003e",
                    "\u003cb\u003eTotal\u003c\u002fb\u003e"
                ]
            },
            "type": "table",
            "domain": {
                "x": [
                    0.0,
                    0.784
                ],
                "y": [
                    0.0,
                    0.194
                ]
            }
        }
    ]
    // LEVER 3 - Forecast vs Baseline (EXACT STREAMLIT DATA)

    const lever3ForecastData = [
        {
            "hovertemplate": "\u003cb\u003e%{text}\u003c\u002fb\u003e\u003cbr\u003eGM: %{x}%\u003cbr\u003eGrowth: %{y}%\u003cextra\u003e\u003c\u002fextra\u003e",
            "marker": {
                "color": "#5dade2",
                "line": {
                    "width": 0
                },
                "opacity": 0.9,
                "size": [
                    65,
                    35,
                    50,
                    40,
                    38
                ]
            },
            "mode": "markers+text",
            "text": [
                "SKU 1",
                "SKU 2",
                "SKU 3",
                "SKU 4",
                "SKU 5"
            ],
            "textfont": {
                "color": "#333",
                "size": 10,
                "weight": "bold"
            },
            "textposition": "bottom center",
            "x": [
                28.5,
                31.8,
                34.5,
                37.5,
                33.5
            ],
            "y": [
                12,
                7.5,
                6.8,
                -3,
                -7
            ],
            "type": "scatter"
        }
    ]

    return (
        <div className="flex-1 bg-slate-50 relative min-h-screen p-8 overflow-x-hidden">

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-100/40 to-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-rose-100/30 to-amber-100/30 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1800px] mx-auto space-y-6 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 font-[Montserrat] flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Activity className="w-8 h-8 text-primary" />
                            </div>
                            NRM Dashboard: Market Overview & Price Action
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={toggleFilters}
                            className={`h-11 px-6 rounded-full border-slate-200 font-semibold shadow-sm hover:shadow-md transition-all duration-300 ${showFilters ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Filters showFilters={showFilters} />
                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 rounded-2xl mt-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Last Assessment Done</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Last updated: Today</span>
                            <RefreshCw className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {/* 1. Forecast Volume */}
                        <Card className="relative overflow-hidden p-6 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 group rounded-xl">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Package className="w-16 h-16 text-secondary" />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <Package className="w-4 h-4 text-secondary" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Incremental Volume</p>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 tracking-tight">4,560,933</div>
                                <p className="text-xs text-slate-500 font-medium pt-1">Total predicted units</p>
                            </div>
                        </Card>

                        {/* 2. Forecast Value */}
                        <Card className="relative overflow-hidden p-6 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 shadow-sm hover:shadow-lg transition-all duration-300 group rounded-xl">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <DollarSign className="w-16 h-16 text-emerald-600" />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                                        <DollarSign className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Incremental Value</p>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 tracking-tight">₹ 195.99 Cr</div>
                                <p className="text-xs text-slate-500 font-medium pt-1">Total predicted revenue</p>
                            </div>
                        </Card>

                        {/* 3. YoY Growth */}
                        <Card className="relative overflow-hidden p-6 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 group rounded-xl">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <LineChart className="w-16 h-16 text-amber-600" />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-amber-100 rounded-lg">
                                        <LineChart className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">YoY Growth</p>
                                </div>
                                <div className="text-2xl font-bold tracking-tight text-emerald-600">
                                    +23.2%
                                </div>
                                <p className="text-xs text-slate-500 font-medium pt-1">vs Same Period Last Year</p>
                            </div>
                        </Card>

                        {/* 4. YTD Volume */}
                        <Card className="relative overflow-hidden p-6 bg-white hover:bg-violet-50/50 border border-slate-200 hover:border-violet-200 shadow-sm hover:shadow-lg transition-all duration-300 group rounded-xl">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Calendar className="w-16 h-16 text-violet-600" />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-violet-100 rounded-lg">
                                        <Calendar className="w-4 h-4 text-violet-600" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">YTD Volume (2024)</p>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 tracking-tight">13,626,982</div>
                                <p className="text-xs text-slate-500 font-medium pt-1">Total Actuals 2024</p>
                            </div>
                        </Card>

                        {/* 5. Accuracy & Bias */}
                        <Card className="relative overflow-hidden p-6 bg-white hover:bg-rose-50/50 border border-slate-200 hover:border-rose-200 shadow-sm hover:shadow-lg transition-all duration-300 group rounded-xl">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Activity className="w-16 h-16 text-rose-600" />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-rose-100 rounded-lg">
                                        <Activity className="w-4 h-4 text-rose-600" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model Accuracy</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xl font-bold text-slate-900">87.3%</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Acc.</span>
                                    </div>
                                    <div className="w-full h-px bg-slate-100"></div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-base font-bold text-orange-600">
                                            -12.7%
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Bias</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </Card>
            </div>

            {/* AI Chatbot */}
            <div className="w-full h-[600px] mt-8 mb-8 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-100/50 bg-gradient-to-b from-white to-slate-50/50">
                <Chatbot
                    filters={{}}
                    compact={true}
                    allowedModes={['what-if']}
                    nrmMode={true}
                    suggestions={[
                        "What will happen if I change the price by 5%?",
                        "I have a budget of $5000 how should I invest?",
                        "What should I SKU invest more in?",
                        "Which segment should I consider to launch a new pack?"
                    ]}
                />
            </div>

            <Tabs defaultValue="lever0" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-slate-100 rounded-xl mb-6">
                    <TabsTrigger value="lever0" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg font-bold text-slate-600 data-[state=active]:text-blue-600">Lever 0: Market Overview</TabsTrigger>
                    <TabsTrigger value="lever1" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg font-bold text-slate-600 data-[state=active]:text-emerald-600">Lever 1: Volume & Price</TabsTrigger>
                    <TabsTrigger value="lever2" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg font-bold text-slate-600 data-[state=active]:text-purple-600">Lever 2: Innovation</TabsTrigger>
                    <TabsTrigger value="lever3" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg font-bold text-slate-600 data-[state=active]:text-orange-600">Lever 3: Mix Optimization</TabsTrigger>
                </TabsList>

                <TabsContent value="lever0" className="space-y-6 focus-visible:outline-none data-[state=inactive]:hidden">
                    <Card className="bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden p-6 space-y-6">
                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Market Leadership - LEFT */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Market Leadership</h3>
                                <Plot
                                    data={treemapData}
                                    layout={{
                                        height: 450,
                                        margin: { l: 0, r: 0, t: 0, b: 0 },
                                        ...commonLayout
                                    }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    className="w-full"
                                />
                            </div>

                            {/* Channel Performance - RIGHT */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Channel Performance (The Channel 3 Slip)</h3>
                                <Plot
                                    data={channelBubbleData}
                                    layout={{
                                        height: 450,
                                        showlegend: true,
                                        xaxis: { title: '' },
                                        yaxis: { title: 'Volume' },
                                        ...commonLayout
                                    }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Growth Matrix */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Category Growth Matrix</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-300">
                                            <th className="p-3 text-left text-slate-600 font-semibold text-sm"></th>
                                            <th className="p-3 text-center text-slate-600 font-semibold text-sm">Channel 1</th>
                                            <th className="p-3 text-center text-slate-600 font-semibold text-sm">Channel 2</th>
                                            <th className="p-3 text-center text-slate-600 font-semibold text-sm">Channel 3</th>
                                            <th className="p-3 text-center text-slate-600 font-semibold text-sm">Channel 4</th>
                                            <th className="p-3 text-center text-slate-600 font-semibold text-sm">Channel 5</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                            <td className="p-3 text-slate-700 font-medium">Category 1</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+12.4%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+10.2%</td>
                                            <td className="p-3 text-center text-red-600 font-semibold">-15.2%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+14.1%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+18.5%</td>
                                        </tr>
                                        <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                            <td className="p-3 text-slate-700 font-medium">Category 2</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+8.1%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+5.4%</td>
                                            <td className="p-3 text-center text-red-600 font-semibold">-18.5%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+9.8%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+12.2%</td>
                                        </tr>
                                        <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                            <td className="p-3 text-slate-700 font-medium">Category 3</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+5.5%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+3.2%</td>
                                            <td className="p-3 text-center text-red-600 font-semibold">-5.4%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+4.4%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+8.9%</td>
                                        </tr>
                                        <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                            <td className="p-3 text-slate-700 font-medium">Category 4</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+2.3%</td>
                                            <td className="p-3 text-center text-red-600 font-semibold">-1.2%</td>
                                            <td className="p-3 text-center text-red-600 font-semibold">-22.1%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+1.1%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+5.6%</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 text-slate-700 font-medium">Category 5</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+10.1%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+7.5%</td>
                                            <td className="p-3 text-center text-red-600 font-semibold">-12.0%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+11.2%</td>
                                            <td className="p-3 text-center text-green-600 font-semibold">+15.4%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="lever1" className="space-y-6 focus-visible:outline-none data-[state=inactive]:hidden">
                    <Card className="bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden p-6 space-y-6">
                        {/* Diagnostic Header */}
                        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-5 rounded-xl border border-teal-200">
                            <h3 className="text-lg font-bold text-teal-900 mb-1">Diagnostic: Where we are losing and how to gain back volume</h3>
                        </div>

                        {/* 1. Market Share Evolution */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">1. Market Share Evolution (Target Brand vs Competition)</h3>
                            <Plot
                                data={marketShareData}
                                layout={{
                                    height: 450,
                                    barmode: 'stack',
                                    xaxis: { title: 'Month' },
                                    yaxis: { title: 'Share %', range: [0, 100] },
                                    ...commonLayout
                                }}
                                config={{ responsive: true, displayModeBar: false }}
                                className="w-full"
                            />
                        </div>

                        {/* 2. Volume Flow Analysis - Sankey */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">2. Volume Flow Analysis - Source of Loss</h3>
                            <p className="text-sm text-slate-600 mb-4 italic">Using exact volume flow data from analysis to trace point-of-interaction.</p>
                            <Plot
                                data={sankeyData}
                                layout={{
                                    height: 500,
                                    ...commonLayout
                                }}
                                config={{ responsive: true, displayModeBar: false }}
                                className="w-full"
                            />
                        </div>

                        {/* 3 & 4: Two-Column Grid for Pricing */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* LEFT: Pricing Interaction */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">3. Pricing Interaction (Correlation: -0.65)</h3>
                                <p className="text-sm text-slate-600 mb-4">Our Brand vs Comp A (Primary Competitor)</p>
                                <Plot
                                    data={pricingInteractionData}
                                    layout={{
                                        height: 400,
                                        xaxis: { title: 'Time Period' },
                                        yaxis: { title: 'Price Index', side: 'left' },
                                        yaxis2: { title: 'Volume', side: 'right', overlaying: 'y' },
                                        ...commonLayout
                                    }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    className="w-full"
                                />
                            </div>

                            {/* RIGHT: Price Response Curve */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">4. Price Response Curve - Recommendation</h3>

                                {/* Alert Box */}
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                                    <p className="text-red-900 font-semibold text-sm">
                                        Operating at <b>115 Index</b>. Recommended: Decrease to <b>105</b>.
                                    </p>
                                </div>

                                <Plot
                                    data={priceResponseData}
                                    layout={{
                                        height: 350,
                                        xaxis: { title: 'Price Index vs Comp A', range: [88, 122] },
                                        yaxis: { title: 'Estimated Volume Potential', range: [0, 1000] },
                                        ...commonLayout
                                    }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Strategic Action */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Target className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-green-900 mb-2">Strategic Action</h4>
                                    <p className="text-green-800">
                                        Execute a <b>price decrease</b> in <b>Channel 3</b> for <b>Category 1</b>. Volume flow analysis confirms this is our primary point of interaction with Comp A, and the response curve indicates significant recovery potential at a 105 index.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="lever2" className="space-y-6 focus-visible:outline-none data-[state=inactive]:hidden">
                    <Card className="bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden p-6 space-y-6">
                        {/* Strategic Introduction */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                            <h3 className="text-xl font-bold text-purple-900 mb-3">Strategic Shift: Premiumization Ladder</h3>
                            <p className="text-purple-800 text-base italic">
                                "Hey, you have almost all the market (80% share). To grow further, we must innovate internally via premiumization."
                            </p>
                        </div>

                        {/* 2x2 Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* TOP-LEFT: Incentive Curve */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Incentive Curve: Category 1 vs Category 2</h3>
                                <p className="text-sm text-slate-600 mb-4">Category 1 (Less Premium) vs Category 2 (More Premium).</p>
                                <Plot
                                    data={incentiveCurveData}
                                    layout={{
                                        "template": {
                                            "data": {
                                                "barpolar": [
                                                    {
                                                        "marker": {
                                                            "line": {
                                                                "color": "white",
                                                                "width": 0.5
                                                            },
                                                            "pattern": {
                                                                "fillmode": "overlay",
                                                                "size": 10,
                                                                "solidity": 0.2
                                                            }
                                                        },
                                                        "type": "barpolar"
                                                    }
                                                ],
                                                "bar": [
                                                    {
                                                        "error_x": {
                                                            "color": "#2a3f5f"
                                                        },
                                                        "error_y": {
                                                            "color": "#2a3f5f"
                                                        },
                                                        "marker": {
                                                            "line": {
                                                                "color": "white",
                                                                "width": 0.5
                                                            },
                                                            "pattern": {
                                                                "fillmode": "overlay",
                                                                "size": 10,
                                                                "solidity": 0.2
                                                            }
                                                        },
                                                        "type": "bar"
                                                    }
                                                ],
                                                "carpet": [
                                                    {
                                                        "aaxis": {
                                                            "endlinecolor": "#2a3f5f",
                                                            "gridcolor": "#C8D4E3",
                                                            "linecolor": "#C8D4E3",
                                                            "minorgridcolor": "#C8D4E3",
                                                            "startlinecolor": "#2a3f5f"
                                                        },
                                                        "baxis": {
                                                            "endlinecolor": "#2a3f5f",
                                                            "gridcolor": "#C8D4E3",
                                                            "linecolor": "#C8D4E3",
                                                            "minorgridcolor": "#C8D4E3",
                                                            "startlinecolor": "#2a3f5f"
                                                        },
                                                        "type": "carpet"
                                                    }
                                                ],
                                                "choropleth": [
                                                    {
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "type": "choropleth"
                                                    }
                                                ],
                                                "contourcarpet": [
                                                    {
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "type": "contourcarpet"
                                                    }
                                                ],
                                                "contour": [
                                                    {
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ],
                                                        "type": "contour"
                                                    }
                                                ],
                                                "heatmap": [
                                                    {
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ],
                                                        "type": "heatmap"
                                                    }
                                                ],
                                                "histogram2dcontour": [
                                                    {
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ],
                                                        "type": "histogram2dcontour"
                                                    }
                                                ],
                                                "histogram2d": [
                                                    {
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ],
                                                        "type": "histogram2d"
                                                    }
                                                ],
                                                "histogram": [
                                                    {
                                                        "marker": {
                                                            "pattern": {
                                                                "fillmode": "overlay",
                                                                "size": 10,
                                                                "solidity": 0.2
                                                            }
                                                        },
                                                        "type": "histogram"
                                                    }
                                                ],
                                                "mesh3d": [
                                                    {
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "type": "mesh3d"
                                                    }
                                                ],
                                                "parcoords": [
                                                    {
                                                        "line": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "type": "parcoords"
                                                    }
                                                ],
                                                "pie": [
                                                    {
                                                        "automargin": true,
                                                        "type": "pie"
                                                    }
                                                ],
                                                "scatter3d": [
                                                    {
                                                        "line": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "type": "scatter3d"
                                                    }
                                                ],
                                                "scattercarpet": [
                                                    {
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "type": "scattercarpet"
                                                    }
                                                ],
                                                "scattergeo": [
                                                    {
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "type": "scattergeo"
                                                    }
                                                ],
                                                "scattergl": [
                                                    {
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "type": "scattergl"
                                                    }
                                                ],
                                                "scattermapbox": [
                                                    {
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "type": "scattermapbox"
                                                    }
                                                ],
                                                "scattermap": [
                                                    {
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "type": "scattermap"
                                                    }
                                                ],
                                                "scatterpolargl": [
                                                    {
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "type": "scatterpolargl"
                                                    }
                                                ],
                                                "scatterpolar": [
                                                    {
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "type": "scatterpolar"
                                                    }
                                                ],
                                                "scatter": [
                                                    {
                                                        "fillpattern": {
                                                            "fillmode": "overlay",
                                                            "size": 10,
                                                            "solidity": 0.2
                                                        },
                                                        "type": "scatter"
                                                    }
                                                ],
                                                "scatterternary": [
                                                    {
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "type": "scatterternary"
                                                    }
                                                ],
                                                "surface": [
                                                    {
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ],
                                                        "type": "surface"
                                                    }
                                                ],
                                                "table": [
                                                    {
                                                        "cells": {
                                                            "fill": {
                                                                "color": "#EBF0F8"
                                                            },
                                                            "line": {
                                                                "color": "white"
                                                            }
                                                        },
                                                        "header": {
                                                            "fill": {
                                                                "color": "#C8D4E3"
                                                            },
                                                            "line": {
                                                                "color": "white"
                                                            }
                                                        },
                                                        "type": "table"
                                                    }
                                                ]
                                            },
                                            "layout": {
                                                "annotationdefaults": {
                                                    "arrowcolor": "#2a3f5f",
                                                    "arrowhead": 0,
                                                    "arrowwidth": 1
                                                },
                                                "autotypenumbers": "strict",
                                                "coloraxis": {
                                                    "colorbar": {
                                                        "outlinewidth": 0,
                                                        "ticks": ""
                                                    }
                                                },
                                                "colorscale": {
                                                    "diverging": [
                                                        [
                                                            0,
                                                            "#8e0152"
                                                        ],
                                                        [
                                                            0.1,
                                                            "#c51b7d"
                                                        ],
                                                        [
                                                            0.2,
                                                            "#de77ae"
                                                        ],
                                                        [
                                                            0.3,
                                                            "#f1b6da"
                                                        ],
                                                        [
                                                            0.4,
                                                            "#fde0ef"
                                                        ],
                                                        [
                                                            0.5,
                                                            "#f7f7f7"
                                                        ],
                                                        [
                                                            0.6,
                                                            "#e6f5d0"
                                                        ],
                                                        [
                                                            0.7,
                                                            "#b8e186"
                                                        ],
                                                        [
                                                            0.8,
                                                            "#7fbc41"
                                                        ],
                                                        [
                                                            0.9,
                                                            "#4d9221"
                                                        ],
                                                        [
                                                            1,
                                                            "#276419"
                                                        ]
                                                    ],
                                                    "sequential": [
                                                        [
                                                            0.0,
                                                            "#0d0887"
                                                        ],
                                                        [
                                                            0.1111111111111111,
                                                            "#46039f"
                                                        ],
                                                        [
                                                            0.2222222222222222,
                                                            "#7201a8"
                                                        ],
                                                        [
                                                            0.3333333333333333,
                                                            "#9c179e"
                                                        ],
                                                        [
                                                            0.4444444444444444,
                                                            "#bd3786"
                                                        ],
                                                        [
                                                            0.5555555555555556,
                                                            "#d8576b"
                                                        ],
                                                        [
                                                            0.6666666666666666,
                                                            "#ed7953"
                                                        ],
                                                        [
                                                            0.7777777777777778,
                                                            "#fb9f3a"
                                                        ],
                                                        [
                                                            0.8888888888888888,
                                                            "#fdca26"
                                                        ],
                                                        [
                                                            1.0,
                                                            "#f0f921"
                                                        ]
                                                    ],
                                                    "sequentialminus": [
                                                        [
                                                            0.0,
                                                            "#0d0887"
                                                        ],
                                                        [
                                                            0.1111111111111111,
                                                            "#46039f"
                                                        ],
                                                        [
                                                            0.2222222222222222,
                                                            "#7201a8"
                                                        ],
                                                        [
                                                            0.3333333333333333,
                                                            "#9c179e"
                                                        ],
                                                        [
                                                            0.4444444444444444,
                                                            "#bd3786"
                                                        ],
                                                        [
                                                            0.5555555555555556,
                                                            "#d8576b"
                                                        ],
                                                        [
                                                            0.6666666666666666,
                                                            "#ed7953"
                                                        ],
                                                        [
                                                            0.7777777777777778,
                                                            "#fb9f3a"
                                                        ],
                                                        [
                                                            0.8888888888888888,
                                                            "#fdca26"
                                                        ],
                                                        [
                                                            1.0,
                                                            "#f0f921"
                                                        ]
                                                    ]
                                                },
                                                "colorway": [
                                                    "#636efa",
                                                    "#EF553B",
                                                    "#00cc96",
                                                    "#ab63fa",
                                                    "#FFA15A",
                                                    "#19d3f3",
                                                    "#FF6692",
                                                    "#B6E880",
                                                    "#FF97FF",
                                                    "#FECB52"
                                                ],
                                                "font": {
                                                    "color": "#2a3f5f"
                                                },
                                                "geo": {
                                                    "bgcolor": "white",
                                                    "lakecolor": "white",
                                                    "landcolor": "white",
                                                    "showlakes": true,
                                                    "showland": true,
                                                    "subunitcolor": "#C8D4E3"
                                                },
                                                "hoverlabel": {
                                                    "align": "left"
                                                },
                                                "hovermode": "closest",
                                                "mapbox": {
                                                    "style": "light"
                                                },
                                                "paper_bgcolor": "white",
                                                "plot_bgcolor": "white",
                                                "polar": {
                                                    "angularaxis": {
                                                        "gridcolor": "#EBF0F8",
                                                        "linecolor": "#EBF0F8",
                                                        "ticks": ""
                                                    },
                                                    "bgcolor": "white",
                                                    "radialaxis": {
                                                        "gridcolor": "#EBF0F8",
                                                        "linecolor": "#EBF0F8",
                                                        "ticks": ""
                                                    }
                                                },
                                                "scene": {
                                                    "xaxis": {
                                                        "backgroundcolor": "white",
                                                        "gridcolor": "#DFE8F3",
                                                        "gridwidth": 2,
                                                        "linecolor": "#EBF0F8",
                                                        "showbackground": true,
                                                        "ticks": "",
                                                        "zerolinecolor": "#EBF0F8"
                                                    },
                                                    "yaxis": {
                                                        "backgroundcolor": "white",
                                                        "gridcolor": "#DFE8F3",
                                                        "gridwidth": 2,
                                                        "linecolor": "#EBF0F8",
                                                        "showbackground": true,
                                                        "ticks": "",
                                                        "zerolinecolor": "#EBF0F8"
                                                    },
                                                    "zaxis": {
                                                        "backgroundcolor": "white",
                                                        "gridcolor": "#DFE8F3",
                                                        "gridwidth": 2,
                                                        "linecolor": "#EBF0F8",
                                                        "showbackground": true,
                                                        "ticks": "",
                                                        "zerolinecolor": "#EBF0F8"
                                                    }
                                                },
                                                "shapedefaults": {
                                                    "line": {
                                                        "color": "#2a3f5f"
                                                    }
                                                },
                                                "ternary": {
                                                    "aaxis": {
                                                        "gridcolor": "#DFE8F3",
                                                        "linecolor": "#A2B1C6",
                                                        "ticks": ""
                                                    },
                                                    "baxis": {
                                                        "gridcolor": "#DFE8F3",
                                                        "linecolor": "#A2B1C6",
                                                        "ticks": ""
                                                    },
                                                    "bgcolor": "white",
                                                    "caxis": {
                                                        "gridcolor": "#DFE8F3",
                                                        "linecolor": "#A2B1C6",
                                                        "ticks": ""
                                                    }
                                                },
                                                "title": {
                                                    "x": 0.05
                                                },
                                                "xaxis": {
                                                    "automargin": true,
                                                    "gridcolor": "#EBF0F8",
                                                    "linecolor": "#EBF0F8",
                                                    "ticks": "",
                                                    "title": {
                                                        "standoff": 15
                                                    },
                                                    "zerolinecolor": "#EBF0F8",
                                                    "zerolinewidth": 2
                                                },
                                                "yaxis": {
                                                    "automargin": true,
                                                    "gridcolor": "#EBF0F8",
                                                    "linecolor": "#EBF0F8",
                                                    "ticks": "",
                                                    "title": {
                                                        "standoff": 15
                                                    },
                                                    "zerolinecolor": "#EBF0F8",
                                                    "zerolinewidth": 2
                                                }
                                            }
                                        },
                                        "xaxis": {
                                            "anchor": "y",
                                            "domain": [
                                                0.0,
                                                1.0
                                            ],
                                            "title": {
                                                "text": "Total_Net_Content"
                                            },
                                            "categoryarray": [
                                                " Catogery-1-12.00 ML",
                                                " Catogery-1-24.00 ML",
                                                " Catogery-2-130.00 ML",
                                                " Catogery-1-130.00 ML",
                                                " Catogery-2-250.00 ML",
                                                " Catogery-1-250.00 ML",
                                                " Catogery-2-500.00 ML",
                                                " Catogery-1-500.00 ML",
                                                " Catogery-2-1000.00 ML",
                                                " Catogery-1-1000.00 ML",
                                                " Catogery-1-3785.41 ML",
                                                " Catogery-1-3790.00 ML",
                                                " Catogery-1-3800.00 ML"
                                            ],
                                            "categoryorder": "array"
                                        },
                                        "yaxis": {
                                            "anchor": "x",
                                            "domain": [
                                                0.0,
                                                1.0
                                            ],
                                            "title": {
                                                "text": "API"
                                            }
                                        },
                                        "legend": {
                                            "title": {
                                                "text": " Catogery"
                                            },
                                            "tracegroupgap": 0,
                                            "itemsizing": "constant"
                                        },
                                        "title": {
                                            "text": "Brand Market Share Volume vs API"
                                        }
                                    }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    className="w-full"
                                />
                            </div>

                            {/* TOP-RIGHT: S-Curve */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">S-Curve: Identifying the White Space</h3>

                                {/* White Space Callout */}
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-4">
                                    <p className="text-yellow-900 font-semibold text-sm">
                                        Positioning Gap Identified: <b>Category 2 is missing in the 3800ml segment.</b>
                                    </p>
                                </div>

                                <Plot
                                    data={sCurveData}
                                    layout={{
                                        height: 350,
                                        title: { text: '   Catogery Market Share Volume vs API', font: { size: 13 } },
                                        xaxis: { title: 'Pack Size' },
                                        yaxis: { title: 'API', range: [0.5, 1.5] },
                                        ...commonLayout
                                    }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    className="w-full"
                                />
                            </div>
                            {/* Bottom-Left: Market Potential */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Market Potential: Growth vs Volume</h3>
                                <p className="text-sm text-slate-600 mb-4">The 3800ml pack size is a high-growth, high-volume segment.</p>
                                <Plot
                                    data={marketPotentialData}
                                    layout={{
                                        height: 400,
                                        xaxis: {
                                            title: 'Month',
                                            tickangle: -45
                                        },
                                        yaxis: { title: 'Sales Volume', side: 'left' },
                                        yaxis2: { title: 'Growth %', side: 'right', overlaying: 'y' },
                                        shapes: [{
                                            type: 'rect',
                                            xref: 'x',
                                            yref: 'paper',
                                            x0: '2025-03',
                                            x1: '2025-08',
                                            y0: 0,
                                            y1: 1,
                                            fillcolor: '#fef3c7',
                                            opacity: 0.3,
                                            line: { width: 0 }
                                        }],
                                        annotations: [{
                                            x: '2025-05',
                                            y: 1.05,
                                            xref: 'x',
                                            yref: 'paper',
                                            text: 'LAST 6 MONTHS PERFORMANCE',
                                            showarrow: false,
                                            font: { size: 11, color: '#92400e', weight: 'bold' },
                                            bgcolor: '#fef3c7',
                                            borderpad: 4
                                        }],
                                        ...commonLayout
                                    }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    className="w-full"
                                />
                            </div>



                            {/* BOTTOM-RIGHT: CAGR Support Analysis */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">CAGR Support Analysis</h3>
                                <Plot
                                    data={cagrData}
                                    layout={{
                                        height: 450,
                                        title: {
                                            text: 'Sales Volume CAGR Comparison<br><sub>Long-Term vs. Short-Term Growth Analysis</sub>',
                                            font: { size: 13 }
                                        },
                                        xaxis: { title: '' },
                                        yaxis: { title: 'CAGR %', range: [0, 50] },
                                        annotations: [{
                                            x: 'Short-Term (3M)',
                                            y: 45,
                                            text: 'Acceleration',
                                            showarrow: false,
                                            font: { size: 14, color: '#10b981', weight: 'bold' }
                                        }],
                                        ...commonLayout
                                    }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Strategic Recommendation */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-purple-900 mb-2">Lever 2 Recommendation</h4>
                                    <p className="text-purple-800">
                                        Launch <b>Category 2 (Premium)</b> in the <b>3800ml pack format</b>. While we are 'everywhere' with Category 1, the CAGR and Growth plots confirm that the 3800ml premium segment is the next volume driver.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="lever3" className="space-y-6 focus-visible:outline-none data-[state=inactive]:hidden">
                    <Card className="bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden p-6 space-y-6">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                            <h3 className="text-xl font-bold text-orange-900 mb-3">Optimization Strategy</h3>
                            <p className="text-orange-800 text-base italic">
                                "Optimize allocation across channels to maximize ROI and sales lift."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 overflow-x-auto">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Optimal Budget Allocation</h3>
                                <Plot
                                    data={lever3BarData}
                                    layout={{
                                        "template": {
                                            "data": {
                                                "histogram2dcontour": [
                                                    {
                                                        "type": "histogram2dcontour",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "choropleth": [
                                                    {
                                                        "type": "choropleth",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        }
                                                    }
                                                ],
                                                "histogram2d": [
                                                    {
                                                        "type": "histogram2d",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "heatmap": [
                                                    {
                                                        "type": "heatmap",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "contourcarpet": [
                                                    {
                                                        "type": "contourcarpet",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        }
                                                    }
                                                ],
                                                "contour": [
                                                    {
                                                        "type": "contour",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "surface": [
                                                    {
                                                        "type": "surface",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "mesh3d": [
                                                    {
                                                        "type": "mesh3d",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        }
                                                    }
                                                ],
                                                "scatter": [
                                                    {
                                                        "fillpattern": {
                                                            "fillmode": "overlay",
                                                            "size": 10,
                                                            "solidity": 0.2
                                                        },
                                                        "type": "scatter"
                                                    }
                                                ],
                                                "parcoords": [
                                                    {
                                                        "type": "parcoords",
                                                        "line": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scatterpolargl": [
                                                    {
                                                        "type": "scatterpolargl",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "bar": [
                                                    {
                                                        "error_x": {
                                                            "color": "#2a3f5f"
                                                        },
                                                        "error_y": {
                                                            "color": "#2a3f5f"
                                                        },
                                                        "marker": {
                                                            "line": {
                                                                "color": "#E5ECF6",
                                                                "width": 0.5
                                                            },
                                                            "pattern": {
                                                                "fillmode": "overlay",
                                                                "size": 10,
                                                                "solidity": 0.2
                                                            }
                                                        },
                                                        "type": "bar"
                                                    }
                                                ],
                                                "scattergeo": [
                                                    {
                                                        "type": "scattergeo",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scatterpolar": [
                                                    {
                                                        "type": "scatterpolar",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "histogram": [
                                                    {
                                                        "marker": {
                                                            "pattern": {
                                                                "fillmode": "overlay",
                                                                "size": 10,
                                                                "solidity": 0.2
                                                            }
                                                        },
                                                        "type": "histogram"
                                                    }
                                                ],
                                                "scattergl": [
                                                    {
                                                        "type": "scattergl",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scatter3d": [
                                                    {
                                                        "type": "scatter3d",
                                                        "line": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scattermap": [
                                                    {
                                                        "type": "scattermap",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scattermapbox": [
                                                    {
                                                        "type": "scattermapbox",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scatterternary": [
                                                    {
                                                        "type": "scatterternary",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scattercarpet": [
                                                    {
                                                        "type": "scattercarpet",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "carpet": [
                                                    {
                                                        "aaxis": {
                                                            "endlinecolor": "#2a3f5f",
                                                            "gridcolor": "white",
                                                            "linecolor": "white",
                                                            "minorgridcolor": "white",
                                                            "startlinecolor": "#2a3f5f"
                                                        },
                                                        "baxis": {
                                                            "endlinecolor": "#2a3f5f",
                                                            "gridcolor": "white",
                                                            "linecolor": "white",
                                                            "minorgridcolor": "white",
                                                            "startlinecolor": "#2a3f5f"
                                                        },
                                                        "type": "carpet"
                                                    }
                                                ],
                                                "table": [
                                                    {
                                                        "cells": {
                                                            "fill": {
                                                                "color": "#EBF0F8"
                                                            },
                                                            "line": {
                                                                "color": "white"
                                                            }
                                                        },
                                                        "header": {
                                                            "fill": {
                                                                "color": "#C8D4E3"
                                                            },
                                                            "line": {
                                                                "color": "white"
                                                            }
                                                        },
                                                        "type": "table"
                                                    }
                                                ],
                                                "barpolar": [
                                                    {
                                                        "marker": {
                                                            "line": {
                                                                "color": "#E5ECF6",
                                                                "width": 0.5
                                                            },
                                                            "pattern": {
                                                                "fillmode": "overlay",
                                                                "size": 10,
                                                                "solidity": 0.2
                                                            }
                                                        },
                                                        "type": "barpolar"
                                                    }
                                                ],
                                                "pie": [
                                                    {
                                                        "automargin": true,
                                                        "type": "pie"
                                                    }
                                                ]
                                            },
                                            "layout": {
                                                "autotypenumbers": "strict",
                                                "colorway": [
                                                    "#636efa",
                                                    "#EF553B",
                                                    "#00cc96",
                                                    "#ab63fa",
                                                    "#FFA15A",
                                                    "#19d3f3",
                                                    "#FF6692",
                                                    "#B6E880",
                                                    "#FF97FF",
                                                    "#FECB52"
                                                ],
                                                "font": {
                                                    "color": "#2a3f5f"
                                                },
                                                "hovermode": "closest",
                                                "hoverlabel": {
                                                    "align": "left"
                                                },
                                                "paper_bgcolor": "white",
                                                "plot_bgcolor": "#E5ECF6",
                                                "polar": {
                                                    "bgcolor": "#E5ECF6",
                                                    "angularaxis": {
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "ticks": ""
                                                    },
                                                    "radialaxis": {
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "ticks": ""
                                                    }
                                                },
                                                "ternary": {
                                                    "bgcolor": "#E5ECF6",
                                                    "aaxis": {
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "ticks": ""
                                                    },
                                                    "baxis": {
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "ticks": ""
                                                    },
                                                    "caxis": {
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "ticks": ""
                                                    }
                                                },
                                                "coloraxis": {
                                                    "colorbar": {
                                                        "outlinewidth": 0,
                                                        "ticks": ""
                                                    }
                                                },
                                                "colorscale": {
                                                    "sequential": [
                                                        [
                                                            0.0,
                                                            "#0d0887"
                                                        ],
                                                        [
                                                            0.1111111111111111,
                                                            "#46039f"
                                                        ],
                                                        [
                                                            0.2222222222222222,
                                                            "#7201a8"
                                                        ],
                                                        [
                                                            0.3333333333333333,
                                                            "#9c179e"
                                                        ],
                                                        [
                                                            0.4444444444444444,
                                                            "#bd3786"
                                                        ],
                                                        [
                                                            0.5555555555555556,
                                                            "#d8576b"
                                                        ],
                                                        [
                                                            0.6666666666666666,
                                                            "#ed7953"
                                                        ],
                                                        [
                                                            0.7777777777777778,
                                                            "#fb9f3a"
                                                        ],
                                                        [
                                                            0.8888888888888888,
                                                            "#fdca26"
                                                        ],
                                                        [
                                                            1.0,
                                                            "#f0f921"
                                                        ]
                                                    ],
                                                    "sequentialminus": [
                                                        [
                                                            0.0,
                                                            "#0d0887"
                                                        ],
                                                        [
                                                            0.1111111111111111,
                                                            "#46039f"
                                                        ],
                                                        [
                                                            0.2222222222222222,
                                                            "#7201a8"
                                                        ],
                                                        [
                                                            0.3333333333333333,
                                                            "#9c179e"
                                                        ],
                                                        [
                                                            0.4444444444444444,
                                                            "#bd3786"
                                                        ],
                                                        [
                                                            0.5555555555555556,
                                                            "#d8576b"
                                                        ],
                                                        [
                                                            0.6666666666666666,
                                                            "#ed7953"
                                                        ],
                                                        [
                                                            0.7777777777777778,
                                                            "#fb9f3a"
                                                        ],
                                                        [
                                                            0.8888888888888888,
                                                            "#fdca26"
                                                        ],
                                                        [
                                                            1.0,
                                                            "#f0f921"
                                                        ]
                                                    ],
                                                    "diverging": [
                                                        [
                                                            0,
                                                            "#8e0152"
                                                        ],
                                                        [
                                                            0.1,
                                                            "#c51b7d"
                                                        ],
                                                        [
                                                            0.2,
                                                            "#de77ae"
                                                        ],
                                                        [
                                                            0.3,
                                                            "#f1b6da"
                                                        ],
                                                        [
                                                            0.4,
                                                            "#fde0ef"
                                                        ],
                                                        [
                                                            0.5,
                                                            "#f7f7f7"
                                                        ],
                                                        [
                                                            0.6,
                                                            "#e6f5d0"
                                                        ],
                                                        [
                                                            0.7,
                                                            "#b8e186"
                                                        ],
                                                        [
                                                            0.8,
                                                            "#7fbc41"
                                                        ],
                                                        [
                                                            0.9,
                                                            "#4d9221"
                                                        ],
                                                        [
                                                            1,
                                                            "#276419"
                                                        ]
                                                    ]
                                                },
                                                "xaxis": {
                                                    "gridcolor": "white",
                                                    "linecolor": "white",
                                                    "ticks": "",
                                                    "title": {
                                                        "standoff": 15
                                                    },
                                                    "zerolinecolor": "white",
                                                    "automargin": true,
                                                    "zerolinewidth": 2
                                                },
                                                "yaxis": {
                                                    "gridcolor": "white",
                                                    "linecolor": "white",
                                                    "ticks": "",
                                                    "title": {
                                                        "standoff": 15
                                                    },
                                                    "zerolinecolor": "white",
                                                    "automargin": true,
                                                    "zerolinewidth": 2
                                                },
                                                "scene": {
                                                    "xaxis": {
                                                        "backgroundcolor": "#E5ECF6",
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "showbackground": true,
                                                        "ticks": "",
                                                        "zerolinecolor": "white",
                                                        "gridwidth": 2
                                                    },
                                                    "yaxis": {
                                                        "backgroundcolor": "#E5ECF6",
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "showbackground": true,
                                                        "ticks": "",
                                                        "zerolinecolor": "white",
                                                        "gridwidth": 2
                                                    },
                                                    "zaxis": {
                                                        "backgroundcolor": "#E5ECF6",
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "showbackground": true,
                                                        "ticks": "",
                                                        "zerolinecolor": "white",
                                                        "gridwidth": 2
                                                    }
                                                },
                                                "shapedefaults": {
                                                    "line": {
                                                        "color": "#2a3f5f"
                                                    }
                                                },
                                                "annotationdefaults": {
                                                    "arrowcolor": "#2a3f5f",
                                                    "arrowhead": 0,
                                                    "arrowwidth": 1
                                                },
                                                "geo": {
                                                    "bgcolor": "white",
                                                    "landcolor": "#E5ECF6",
                                                    "subunitcolor": "white",
                                                    "showland": true,
                                                    "showlakes": true,
                                                    "lakecolor": "white"
                                                },
                                                "title": {
                                                    "x": 0.05
                                                },
                                                "mapbox": {
                                                    "style": "light"
                                                }
                                            }
                                        },
                                        "xaxis": {
                                            "anchor": "y",
                                            "domain": [
                                                0.0,
                                                0.784
                                            ],
                                            "showgrid": false,
                                            "showticklabels": true
                                        },
                                        "yaxis": {
                                            "anchor": "x",
                                            "domain": [
                                                0.224,
                                                1.0
                                            ],
                                            "range": [
                                                420,
                                                550
                                            ],
                                            "showgrid": true,
                                            "gridcolor": "#f0f0f0",
                                            "title": {
                                                "text": "Pesos per Kg"
                                            }
                                        },
                                        "xaxis2": {
                                            "anchor": "y2",
                                            "domain": [
                                                0.804,
                                                1.0
                                            ]
                                        },
                                        "yaxis2": {
                                            "anchor": "x2",
                                            "domain": [
                                                0.0,
                                                0.194
                                            ]
                                        },
                                        "legend": {
                                            "orientation": "h",
                                            "yanchor": "bottom",
                                            "y": 1.02,
                                            "xanchor": "center",
                                            "x": 0.5,
                                            "bgcolor": "rgba(255,255,255,0.5)"
                                        },
                                        "title": {
                                            "text": "PPG - Pesos per Kg"
                                        },
                                        "plot_bgcolor": "white",
                                        "width": 1300,
                                        "height": 800
                                    }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    className="w-full"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Growth vs Gross Margin</h3>
                                <Plot
                                    data={lever3ForecastData}
                                    layout={{
                                        "template": {
                                            "data": {
                                                "histogram2dcontour": [
                                                    {
                                                        "type": "histogram2dcontour",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "choropleth": [
                                                    {
                                                        "type": "choropleth",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        }
                                                    }
                                                ],
                                                "histogram2d": [
                                                    {
                                                        "type": "histogram2d",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "heatmap": [
                                                    {
                                                        "type": "heatmap",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "contourcarpet": [
                                                    {
                                                        "type": "contourcarpet",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        }
                                                    }
                                                ],
                                                "contour": [
                                                    {
                                                        "type": "contour",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "surface": [
                                                    {
                                                        "type": "surface",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        },
                                                        "colorscale": [
                                                            [
                                                                0.0,
                                                                "#0d0887"
                                                            ],
                                                            [
                                                                0.1111111111111111,
                                                                "#46039f"
                                                            ],
                                                            [
                                                                0.2222222222222222,
                                                                "#7201a8"
                                                            ],
                                                            [
                                                                0.3333333333333333,
                                                                "#9c179e"
                                                            ],
                                                            [
                                                                0.4444444444444444,
                                                                "#bd3786"
                                                            ],
                                                            [
                                                                0.5555555555555556,
                                                                "#d8576b"
                                                            ],
                                                            [
                                                                0.6666666666666666,
                                                                "#ed7953"
                                                            ],
                                                            [
                                                                0.7777777777777778,
                                                                "#fb9f3a"
                                                            ],
                                                            [
                                                                0.8888888888888888,
                                                                "#fdca26"
                                                            ],
                                                            [
                                                                1.0,
                                                                "#f0f921"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "mesh3d": [
                                                    {
                                                        "type": "mesh3d",
                                                        "colorbar": {
                                                            "outlinewidth": 0,
                                                            "ticks": ""
                                                        }
                                                    }
                                                ],
                                                "scatter": [
                                                    {
                                                        "fillpattern": {
                                                            "fillmode": "overlay",
                                                            "size": 10,
                                                            "solidity": 0.2
                                                        },
                                                        "type": "scatter"
                                                    }
                                                ],
                                                "parcoords": [
                                                    {
                                                        "type": "parcoords",
                                                        "line": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scatterpolargl": [
                                                    {
                                                        "type": "scatterpolargl",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "bar": [
                                                    {
                                                        "error_x": {
                                                            "color": "#2a3f5f"
                                                        },
                                                        "error_y": {
                                                            "color": "#2a3f5f"
                                                        },
                                                        "marker": {
                                                            "line": {
                                                                "color": "#E5ECF6",
                                                                "width": 0.5
                                                            },
                                                            "pattern": {
                                                                "fillmode": "overlay",
                                                                "size": 10,
                                                                "solidity": 0.2
                                                            }
                                                        },
                                                        "type": "bar"
                                                    }
                                                ],
                                                "scattergeo": [
                                                    {
                                                        "type": "scattergeo",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scatterpolar": [
                                                    {
                                                        "type": "scatterpolar",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "histogram": [
                                                    {
                                                        "marker": {
                                                            "pattern": {
                                                                "fillmode": "overlay",
                                                                "size": 10,
                                                                "solidity": 0.2
                                                            }
                                                        },
                                                        "type": "histogram"
                                                    }
                                                ],
                                                "scattergl": [
                                                    {
                                                        "type": "scattergl",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scatter3d": [
                                                    {
                                                        "type": "scatter3d",
                                                        "line": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        },
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scattermap": [
                                                    {
                                                        "type": "scattermap",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scattermapbox": [
                                                    {
                                                        "type": "scattermapbox",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scatterternary": [
                                                    {
                                                        "type": "scatterternary",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "scattercarpet": [
                                                    {
                                                        "type": "scattercarpet",
                                                        "marker": {
                                                            "colorbar": {
                                                                "outlinewidth": 0,
                                                                "ticks": ""
                                                            }
                                                        }
                                                    }
                                                ],
                                                "carpet": [
                                                    {
                                                        "aaxis": {
                                                            "endlinecolor": "#2a3f5f",
                                                            "gridcolor": "white",
                                                            "linecolor": "white",
                                                            "minorgridcolor": "white",
                                                            "startlinecolor": "#2a3f5f"
                                                        },
                                                        "baxis": {
                                                            "endlinecolor": "#2a3f5f",
                                                            "gridcolor": "white",
                                                            "linecolor": "white",
                                                            "minorgridcolor": "white",
                                                            "startlinecolor": "#2a3f5f"
                                                        },
                                                        "type": "carpet"
                                                    }
                                                ],
                                                "table": [
                                                    {
                                                        "cells": {
                                                            "fill": {
                                                                "color": "#EBF0F8"
                                                            },
                                                            "line": {
                                                                "color": "white"
                                                            }
                                                        },
                                                        "header": {
                                                            "fill": {
                                                                "color": "#C8D4E3"
                                                            },
                                                            "line": {
                                                                "color": "white"
                                                            }
                                                        },
                                                        "type": "table"
                                                    }
                                                ],
                                                "barpolar": [
                                                    {
                                                        "marker": {
                                                            "line": {
                                                                "color": "#E5ECF6",
                                                                "width": 0.5
                                                            },
                                                            "pattern": {
                                                                "fillmode": "overlay",
                                                                "size": 10,
                                                                "solidity": 0.2
                                                            }
                                                        },
                                                        "type": "barpolar"
                                                    }
                                                ],
                                                "pie": [
                                                    {
                                                        "automargin": true,
                                                        "type": "pie"
                                                    }
                                                ]
                                            },
                                            "layout": {
                                                "autotypenumbers": "strict",
                                                "colorway": [
                                                    "#636efa",
                                                    "#EF553B",
                                                    "#00cc96",
                                                    "#ab63fa",
                                                    "#FFA15A",
                                                    "#19d3f3",
                                                    "#FF6692",
                                                    "#B6E880",
                                                    "#FF97FF",
                                                    "#FECB52"
                                                ],
                                                "font": {
                                                    "color": "#2a3f5f"
                                                },
                                                "hovermode": "closest",
                                                "hoverlabel": {
                                                    "align": "left"
                                                },
                                                "paper_bgcolor": "white",
                                                "plot_bgcolor": "#E5ECF6",
                                                "polar": {
                                                    "bgcolor": "#E5ECF6",
                                                    "angularaxis": {
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "ticks": ""
                                                    },
                                                    "radialaxis": {
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "ticks": ""
                                                    }
                                                },
                                                "ternary": {
                                                    "bgcolor": "#E5ECF6",
                                                    "aaxis": {
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "ticks": ""
                                                    },
                                                    "baxis": {
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "ticks": ""
                                                    },
                                                    "caxis": {
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "ticks": ""
                                                    }
                                                },
                                                "coloraxis": {
                                                    "colorbar": {
                                                        "outlinewidth": 0,
                                                        "ticks": ""
                                                    }
                                                },
                                                "colorscale": {
                                                    "sequential": [
                                                        [
                                                            0.0,
                                                            "#0d0887"
                                                        ],
                                                        [
                                                            0.1111111111111111,
                                                            "#46039f"
                                                        ],
                                                        [
                                                            0.2222222222222222,
                                                            "#7201a8"
                                                        ],
                                                        [
                                                            0.3333333333333333,
                                                            "#9c179e"
                                                        ],
                                                        [
                                                            0.4444444444444444,
                                                            "#bd3786"
                                                        ],
                                                        [
                                                            0.5555555555555556,
                                                            "#d8576b"
                                                        ],
                                                        [
                                                            0.6666666666666666,
                                                            "#ed7953"
                                                        ],
                                                        [
                                                            0.7777777777777778,
                                                            "#fb9f3a"
                                                        ],
                                                        [
                                                            0.8888888888888888,
                                                            "#fdca26"
                                                        ],
                                                        [
                                                            1.0,
                                                            "#f0f921"
                                                        ]
                                                    ],
                                                    "sequentialminus": [
                                                        [
                                                            0.0,
                                                            "#0d0887"
                                                        ],
                                                        [
                                                            0.1111111111111111,
                                                            "#46039f"
                                                        ],
                                                        [
                                                            0.2222222222222222,
                                                            "#7201a8"
                                                        ],
                                                        [
                                                            0.3333333333333333,
                                                            "#9c179e"
                                                        ],
                                                        [
                                                            0.4444444444444444,
                                                            "#bd3786"
                                                        ],
                                                        [
                                                            0.5555555555555556,
                                                            "#d8576b"
                                                        ],
                                                        [
                                                            0.6666666666666666,
                                                            "#ed7953"
                                                        ],
                                                        [
                                                            0.7777777777777778,
                                                            "#fb9f3a"
                                                        ],
                                                        [
                                                            0.8888888888888888,
                                                            "#fdca26"
                                                        ],
                                                        [
                                                            1.0,
                                                            "#f0f921"
                                                        ]
                                                    ],
                                                    "diverging": [
                                                        [
                                                            0,
                                                            "#8e0152"
                                                        ],
                                                        [
                                                            0.1,
                                                            "#c51b7d"
                                                        ],
                                                        [
                                                            0.2,
                                                            "#de77ae"
                                                        ],
                                                        [
                                                            0.3,
                                                            "#f1b6da"
                                                        ],
                                                        [
                                                            0.4,
                                                            "#fde0ef"
                                                        ],
                                                        [
                                                            0.5,
                                                            "#f7f7f7"
                                                        ],
                                                        [
                                                            0.6,
                                                            "#e6f5d0"
                                                        ],
                                                        [
                                                            0.7,
                                                            "#b8e186"
                                                        ],
                                                        [
                                                            0.8,
                                                            "#7fbc41"
                                                        ],
                                                        [
                                                            0.9,
                                                            "#4d9221"
                                                        ],
                                                        [
                                                            1,
                                                            "#276419"
                                                        ]
                                                    ]
                                                },
                                                "xaxis": {
                                                    "gridcolor": "white",
                                                    "linecolor": "white",
                                                    "ticks": "",
                                                    "title": {
                                                        "standoff": 15
                                                    },
                                                    "zerolinecolor": "white",
                                                    "automargin": true,
                                                    "zerolinewidth": 2
                                                },
                                                "yaxis": {
                                                    "gridcolor": "white",
                                                    "linecolor": "white",
                                                    "ticks": "",
                                                    "title": {
                                                        "standoff": 15
                                                    },
                                                    "zerolinecolor": "white",
                                                    "automargin": true,
                                                    "zerolinewidth": 2
                                                },
                                                "scene": {
                                                    "xaxis": {
                                                        "backgroundcolor": "#E5ECF6",
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "showbackground": true,
                                                        "ticks": "",
                                                        "zerolinecolor": "white",
                                                        "gridwidth": 2
                                                    },
                                                    "yaxis": {
                                                        "backgroundcolor": "#E5ECF6",
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "showbackground": true,
                                                        "ticks": "",
                                                        "zerolinecolor": "white",
                                                        "gridwidth": 2
                                                    },
                                                    "zaxis": {
                                                        "backgroundcolor": "#E5ECF6",
                                                        "gridcolor": "white",
                                                        "linecolor": "white",
                                                        "showbackground": true,
                                                        "ticks": "",
                                                        "zerolinecolor": "white",
                                                        "gridwidth": 2
                                                    }
                                                },
                                                "shapedefaults": {
                                                    "line": {
                                                        "color": "#2a3f5f"
                                                    }
                                                },
                                                "annotationdefaults": {
                                                    "arrowcolor": "#2a3f5f",
                                                    "arrowhead": 0,
                                                    "arrowwidth": 1
                                                },
                                                "geo": {
                                                    "bgcolor": "white",
                                                    "landcolor": "#E5ECF6",
                                                    "subunitcolor": "white",
                                                    "showland": true,
                                                    "showlakes": true,
                                                    "lakecolor": "white"
                                                },
                                                "title": {
                                                    "x": 0.05
                                                },
                                                "mapbox": {
                                                    "style": "light"
                                                }
                                            }
                                        },
                                        "shapes": [
                                            {
                                                "fillcolor": "rgba(144, 238, 144, 0.5)",
                                                "layer": "below",
                                                "line": {
                                                    "color": "green",
                                                    "width": 1
                                                },
                                                "type": "rect",
                                                "x0": 25,
                                                "x1": 31,
                                                "y0": 6,
                                                "y1": 20
                                            },
                                            {
                                                "fillcolor": "rgba(240, 128, 128, 0.5)",
                                                "layer": "below",
                                                "line": {
                                                    "color": "red",
                                                    "width": 1
                                                },
                                                "type": "rect",
                                                "x0": 25,
                                                "x1": 31,
                                                "y0": -12,
                                                "y1": 6
                                            },
                                            {
                                                "line": {
                                                    "color": "#2980b9",
                                                    "dash": "solid",
                                                    "width": 1.5
                                                },
                                                "type": "line",
                                                "x0": 31,
                                                "x1": 31,
                                                "y0": -12,
                                                "y1": 22
                                            },
                                            {
                                                "line": {
                                                    "color": "#2980b9",
                                                    "dash": "solid",
                                                    "width": 1.5
                                                },
                                                "type": "line",
                                                "x0": 25,
                                                "x1": 41,
                                                "y0": 6,
                                                "y1": 6
                                            }
                                        ],
                                        "annotations": [
                                            {
                                                "showarrow": false,
                                                "text": "Brand Avg GM: 31%",
                                                "x": 31.5,
                                                "xanchor": "left",
                                                "y": 21
                                            },
                                            {
                                                "showarrow": false,
                                                "text": "Brand Avg Growth: 6%",
                                                "x": 40,
                                                "xanchor": "right",
                                                "y": 7
                                            },
                                            {
                                                "font": {
                                                    "size": 12
                                                },
                                                "showarrow": false,
                                                "text": "\u003cb\u003eImprove Margins\u003c\u002fb\u003e",
                                                "x": 28,
                                                "y": 18
                                            },
                                            {
                                                "font": {
                                                    "size": 12
                                                },
                                                "showarrow": false,
                                                "text": "\u003cb\u003eReduce Investments\u003c\u002fb\u003e",
                                                "x": 28,
                                                "y": -10
                                            },
                                            {
                                                "showarrow": false,
                                                "text": "Brand Growth ----\u003e",
                                                "textangle": -90,
                                                "x": 25.5,
                                                "xanchor": "center",
                                                "y": 15
                                            },
                                            {
                                                "showarrow": false,
                                                "text": "Brand GM ----\u003e",
                                                "x": 39,
                                                "y": -5
                                            }
                                        ],
                                        "xaxis": {
                                            "title": {
                                                "text": ""
                                            },
                                            "range": [
                                                25,
                                                41
                                            ],
                                            "tickvals": [
                                                25,
                                                27,
                                                29,
                                                31,
                                                33,
                                                35,
                                                37,
                                                39
                                            ],
                                            "ticktext": [
                                                "25%",
                                                "27%",
                                                "29%",
                                                "31%",
                                                "33%",
                                                "35%",
                                                "37%",
                                                "39%"
                                            ],
                                            "showgrid": false
                                        },
                                        "yaxis": {
                                            "title": {
                                                "text": ""
                                            },
                                            "range": [
                                                -12,
                                                22
                                            ],
                                            "tickvals": [
                                                -10,
                                                -5,
                                                0,
                                                5,
                                                10,
                                                15,
                                                20
                                            ],
                                            "ticktext": [
                                                "-10%",
                                                "-5%",
                                                "0%",
                                                "5%",
                                                "10%",
                                                "15%",
                                                "20%"
                                            ],
                                            "showgrid": false
                                        },
                                        "margin": {
                                            "l": 40,
                                            "r": 40,
                                            "t": 60,
                                            "b": 60
                                        },
                                        "title": {
                                            "text": "Brand Growth vs Brand GM"
                                        },
                                        "plot_bgcolor": "rgba(240, 240, 240, 0.5)",
                                        "height": 550,
                                        "autosize": true
                                    }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    className="w-full"
                                />
                            </div>
                        </div>

                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PlanningAnalyst;
