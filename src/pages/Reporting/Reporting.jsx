import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MetricCard from "./components/MetricCard";
import SeasonalityChart from "./components/SeasonalityChart";
import TargetAchievementChart from "./components/TargetAchievementChart";
import TrendChart from "./components/TrendChart";

const Reporting = () => {
    return (
        <div className="bg-gray-50 p-6 w-full min-h-screen"> {/* Ensure full width and height */}
            <div className="w-full"> {/* Remove max-w and make this div take full width */}
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Reporting Module</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <MetricCard
                        title="Future Targets"
                        value="230,000"
                        subtitle="Next Quarter"
                    />
                    <MetricCard
                        title="Forecast Bias"
                        value="+3.5%"
                        subtitle="(Over-forecast)"
                        valueColor="text-amber-500"
                    />
                    <MetricCard
                        title="Cumulative Growth (Year-over)"
                        value="1,200,000"
                        subtitle="4:3:3%"
                        subtitleColor="text-green-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Seasonality</h3>
                                <Tabs defaultValue="year">
                                    <TabsList>
                                        <TabsTrigger value="year">Year</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <SeasonalityChart />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-medium mb-4">Trend</h3>
                            <TrendChart />
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4">Target vs. Achievement</h3>
                        <TargetAchievementChart />
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-gray-500 mt-10">
                    Reporting Module Overview
                </div>
            </div>
        </div>
    );
};

export default Reporting;
