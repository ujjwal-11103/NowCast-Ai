import React, { Suspense, useState } from "react"
import NavBar from "@/components/navbar/NavBar"
import { Clock, Package, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import flipkart from "../../assets/company logo/Flipkart_logo.png"
// import amazon from "../../assets/company logo/Amazon-Logo.png"
// import blinkit from "../../assets/company logo/blinkit-logo.png"

import DOH from "./charts/DOH"
import Age from "./charts/Age"
import ChannelCard from "./component/ChannelCard";
import ChannelCredit from "./charts/ChannelCredit";
import InventoryTable from "./component/InventoryTable"
import NewLaunches from "./component/NewLaunches"

// Lazy load components for better performance in Vite
const MapComponent = React.lazy(() => import("./charts/IndiaMap"))

const SupplyChainTower = () => {
    const [activeTab, setActiveTab] = useState("DOH")
    const [view, setView] = useState("Snapshot"); // Default view is Snapshot



    const goodPerformerData = [
        {
            state: "Uttar Pradesh",
            item: "Una 100% Whey Blue Lab 4.5 Lbs - Cookies & Cream",
            currentStock: 2,
            forecastFeb: 3,
            weeksOnHand: 0.07,
        },
        {
            state: "Uttar Pradesh",
            item: "Muscle & Strength India Perfect Creatine - 200 Gms",
            currentStock: 2,
            forecastFeb: 3,
            weeksOnHand: 0.07,
        },
        {
            state: "Karnataka",
            item: "Muscle & Strength India Perfect Whey Isolate - 1 kg",
            currentStock: 2,
            forecastFeb: 3,
            weeksOnHand: 0.07,
        }
    ];


    const badPerformerData = [
        {
            state: "Uttar Pradesh",
            item: "Muscle & Strength India Perfect Max Gaïnz Tablets",
            currentStock: 9,
            forecastFeb: 6,
            weeksOnHand: 1.56,
        },
        {
            state: "Haryana",
            item: "Muscle & Strength India Perfect Max Gaïnz Tablets",
            currentStock: 6,
            forecastFeb: 4,
            weeksOnHand: 1.42,
        },
        {
            state: "Uttar Pradesh",
            item: "Muscle & Strength India Hydration Gaïlon 1.5 Liter - Black",
            currentStock: 4,
            forecastFeb: 2,
            weeksOnHand: 2.0,
        },
        {
            state: "Rajasthan",
            item: "Muscle & Strength India Perfect Max Gaïnz Tablets",
            currentStock: 3,
            forecastFeb: 2,
            weeksOnHand: 1.67,
        },
        {
            state: "Haryana",
            item: "Muscle & Strength India Perfect Raw Concentrate 1 kg",
            currentStock: 3,
            forecastFeb: 2,
            weeksOnHand: 1.5,
        },
        {
            state: "Punjab",
            item: "Dynataka Pte W.o Sweet Cherry Lima 20 Savings",
            currentStock: 3,
            forecastFeb: 2,
            weeksOnHand: 1.5,
        },
        {
            state: "Uttar Pradesh",
            item: "GNC L-Carnitine Tab 500 Mg 140g",
            currentStock: 3,
            forecastFeb: 2,
            weeksOnHand: 1.5,
        }
    ];


    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <NavBar />

            {/* Main Content */}
            <main className="p-4">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { title: "Inventory Cost", value: "6cr", Icon: DollarSign },
                        { title: "Stock on Hand", value: "3107 Units", Icon: Package },
                        { title: "Days on Hand", value: "1.02", Icon: Calendar },
                        { title: "Average Age", value: "90 Days", Icon: Clock },
                    ].map(({ title, value, Icon }, index) => (
                        <Card key={index} className="shadow-sm">
                            <CardContent className=" flex justify-between items-center">
                                <div>
                                    <p className="text-gray-600 mb-1">{title}</p>
                                    <h2 className="text-3xl font-bold text-[#0a1e63]">{value}</h2>
                                </div>
                                <div className="bg-blue-100 p-4 rounded-lg">
                                    <Icon className="h-6 w-6 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Map Visualization */}
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <h3 className="text-lg font-medium text-gray-700">Interactive Map Visualization</h3>
                            <Suspense fallback={<div className="h-[400px] bg-gray-100 animate-pulse rounded-md"></div>}>
                                <MapComponent />
                            </Suspense>
                        </CardContent>
                    </Card>

                    {/* Bar Chart */}
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            {/* Tab Navigation */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-700">
                                    {activeTab === "DOH" ? "Week on Hand vs Count of SKUs" : "Inventory Aging Distribution"}
                                </h3>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                                    <TabsList>
                                        <TabsTrigger
                                            value="DOH"
                                            className={`cursor-pointer ${activeTab === "DOH" ? "bg-blue-500 text-white" : ""}`}>
                                            DOH
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="Aging"
                                            className={`cursor-pointer ${activeTab === "Aging" ? "bg-blue-500 text-white" : ""}`}>
                                            Aging
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {/* Content Switching */}
                            <Suspense fallback={<div className="h-[300px] bg-gray-100 animate-pulse rounded-md"></div>}>
                                {activeTab === "DOH" ? <DOH /> : <Age />}
                            </Suspense>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts Table */}
                <div className="grid lg:grid-cols-12 gap-6 mb-6">
                    {/* Good Performers Table */}
                    <div className="lg:col-span-6 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
                        <div className="p-4 border-b border-neutral-200">
                            <h2 className="text-lg font-semibold">Top Alerts Out Of Stock</h2>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left bg-blue-500/10">
                                        <th className="px-4 py-3 text-sm font-semibold text-primary">STATE</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-primary">ITEM</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-primary">CURRENT STOCK</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-primary">WEEKS ON HAND</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {goodPerformerData.map((row, index) => (
                                        <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                            <td className="px-4 py-3">{row.state}</td>
                                            <td className="px-4 py-3">{row.item}</td>
                                            <td className="px-4 py-3">{row.currentStock}</td>
                                            <td className="px-4 py-3">{row.weeksOnHand}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bad Performers Table */}
                    <div className="lg:col-span-6 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
                        <div className="p-4 border-b border-neutral-200">
                            <h2 className="text-lg font-semibold">Top Alerts Over Inventory</h2>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left bg-red-500/10">
                                        <th className="px-4 py-3 text-sm font-semibold text-primary">STATE</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-primary">ITEM</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-primary">CURRENT STOCK</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-primary">WEEKS ON HAND</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {badPerformerData.map((row, index) => (
                                        <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                            <td className="px-4 py-3">{row.state}</td>
                                            <td className="px-4 py-3">{row.item}</td>
                                            <td className="px-4 py-3">{row.currentStock}</td>
                                            <td className="px-4 py-3">{row.weeksOnHand}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Tabs for Snapshot & Credit */}
                <div>
                    <Tabs value={view} onValueChange={setView} className="w-auto">
                        <TabsList>
                            <TabsTrigger
                                value="Snapshot"
                                className={`cursor-pointer ${view === "Snapshot" ? "bg-blue-500 text-white" : ""}`}>
                                Snapshot
                            </TabsTrigger>
                            <TabsTrigger
                                value="Credit"
                                className={`cursor-pointer ${view === "Credit" ? "bg-blue-500 text-white" : ""}`}>
                                Credit
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Conditional Rendering */}
                    {view === "Snapshot" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
                            <ChannelCard
                                logo="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                                state="NA"
                                fillRate={80}
                            />
                            <ChannelCard
                                logo="https://upload.wikimedia.org/wikipedia/commons/0/05/Flipkart_logo.png"
                                state="NA"
                                fillRate={80}
                            />
                            <ChannelCard
                                logo="https://blinkit.com/images/logo.svg"
                                state="Delhi"
                                fillRate={68}
                            />
                            <ChannelCard
                                logo="https://www.zeptonow.com/images/logo.svg"
                                state="Maharashtra"
                                fillRate={66}
                            />
                            <ChannelCard
                                logo="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg"
                                state="Punjab"
                                fillRate={69}
                            />
                            <ChannelCard
                                logo="https://www.bigbasket.com/static/v2489/common/img/bb_logo.png"
                                state="Karnataka"
                                fillRate={68}
                            />
                        </div>
                    ) : (
                        <ChannelCredit />
                    )}
                </div>

                {/* Outlet table and chart */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                Inventory Recommendation
                            </button>
                            <button className="px-4 py-2 text-gray-700">New Launches</button>
                        </div>
                        <h2 className="text-lg font-semibold text-[#0A1D56]">
                            Inventory Recommendation Data
                        </h2>
                    </div>
                    <InventoryTable />
                    <NewLaunches />

                </div>


            </main>
        </div>
    )
}

export default SupplyChainTower
