
import React, { useState } from "react";
import { ArrowDown, ExternalLink, LineChart } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SideBar from "@/components/Sidebar/SideBar";

const Planning = () => {
    const [selectedFilters, setSelectedFilters] = useState({
        channel: "Channel 2",
        chain: "Chain 3",
        depot: "Depot 5",
        subcat: "SubCat 5",
        sku: "SKU 10",
    })

    return (
        <div className="flex h-full">
            <SideBar />
            <div className="flex-1 overflow-auto">
                <header className="flex items-center justify-between border-b p-4">
                    <h1 className="text-2xl font-bold text-[#0A2472]">Planning Module</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">Deploy</Button>
                        <Button variant="ghost" size="icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-more-vertical"
                            >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                            </svg>
                        </Button>
                    </div>
                </header>

                <main className="p-6">
                    <h2 className="mb-4 text-xl font-semibold">Forecasted Months: Jan - Feb '25</h2>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="font-medium">Forecasted Sales for:</span>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-[#1E40AF] hover:bg-[#0A2472]">Channel 2</Badge>
                                <span>&gt;</span>
                                <Badge className="bg-[#1E40AF] hover:bg-[#0A2472]">Chain 3</Badge>
                                <span>&gt;</span>
                                <Badge className="bg-[#1E40AF] hover:bg-[#0A2472]">Depot 5</Badge>
                                <span>&gt;</span>
                                <Badge className="bg-[#1E40AF] hover:bg-[#0A2472]">SubCat 5</Badge>
                                <span>&gt;</span>
                                <Badge className="bg-[#1E40AF] hover:bg-[#0A2472]">SKU 10</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-[#0A2472]"
                                    >
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                    <span className="text-sm font-medium">Forecasted Volume</span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-[#0A2472]">2.4</span>
                                    <span className="ml-1 text-lg font-medium">K Units</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">Total predicted units</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-[#0A2472]"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                    <span className="text-sm font-medium">Forecasted Value</span>
                                    <ExternalLink size={14} className="text-gray-400" />
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-[#0A2472]">₹ 58.3</span>
                                    <span className="ml-1 text-lg font-medium">K</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">Total predicted revenue</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <LineChart className="text-[#0A2472]" size={24} />
                                    <span className="text-sm font-medium">YoY Growth</span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <ArrowDown className="text-red-500" size={16} />
                                        <span className="text-red-500 font-medium">-15.4%</span>
                                        <span className="text-xs text-gray-500">(Volume)</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <ArrowDown className="text-red-500" size={16} />
                                        <span className="text-red-500 font-medium">-15.4%</span>
                                        <span className="text-xs text-gray-500">(Value)</span>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">vs Jan-Feb 2024 Actuals</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-[#0A2472]"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                                        <path d="M2 12h20" />
                                    </svg>
                                    <span className="text-sm font-medium">Total Volume</span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-[#0A2472]">13.0</span>
                                    <span className="ml-1 text-lg font-medium">K Units</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">Total volume for SKU: SKU 10</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Legend</span>
                                <div className="flex items-center gap-1">
                                    <div className="h-1 w-6 bg-gray-400 rounded"></div>
                                    <span className="text-xs">Actual Sales</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="h-1 w-6 bg-green-400 rounded"></div>
                                    <span className="text-xs">Forecast</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Sales Trend Chart</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead colSpan={2}>Last Year Values</TableHead>
                                        <TableHead colSpan={2}>Baseline Forecast</TableHead>
                                        <TableHead>Custom Metric</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead colSpan={2}>Sales Team</TableHead>
                                        <TableHead colSpan={2}>Consensus</TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Jan</TableHead>
                                        <TableHead>Feb</TableHead>
                                        <TableHead>Jan</TableHead>
                                        <TableHead>Feb</TableHead>
                                        <TableHead>LZF/LZA</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Jan</TableHead>
                                        <TableHead>Comment</TableHead>
                                        <TableHead>Jan</TableHead>
                                        <TableHead>Feb</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>2290</TableCell>
                                        <TableCell>578</TableCell>
                                        <TableCell>1182</TableCell>
                                        <TableCell>1246</TableCell>
                                        <TableCell>0.85</TableCell>
                                        <TableCell>SKU 10</TableCell>
                                        <TableCell>0</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>1182</TableCell>
                                        <TableCell>1246</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>4380</TableCell>
                                        <TableCell>4380</TableCell>
                                        <TableCell>2638</TableCell>
                                        <TableCell>2755</TableCell>
                                        <TableCell>0.62</TableCell>
                                        <TableCell>SKU 5</TableCell>
                                        <TableCell>0</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>2638</TableCell>
                                        <TableCell>2755</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>1409</TableCell>
                                        <TableCell>682</TableCell>
                                        <TableCell>1133</TableCell>
                                        <TableCell>1606</TableCell>
                                        <TableCell>1.31</TableCell>
                                        <TableCell>SKU 6</TableCell>
                                        <TableCell>0</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>1133</TableCell>
                                        <TableCell>1606</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>1268</TableCell>
                                        <TableCell>1900</TableCell>
                                        <TableCell>1010</TableCell>
                                        <TableCell>1392</TableCell>
                                        <TableCell>0.76</TableCell>
                                        <TableCell>SKU 9</TableCell>
                                        <TableCell>0</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>1010</TableCell>
                                        <TableCell>1392</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-semibold">Waterfall Charts</h2>
                            <ExternalLink size={16} className="text-gray-400" />
                        </div>

                        <Accordion type="multiple" className="space-y-4">
                            <AccordionItem value="item-1" className="border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 10 - Jan Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Jan Waterfall Chart for SKU 10</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 10 - Feb Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Feb Waterfall Chart for SKU 10</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 5 - Jan Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Jan Waterfall Chart for SKU 5</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 5 - Feb Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Feb Waterfall Chart for SKU 5</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5" className="border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 6 - Jan Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Jan Waterfall Chart for SKU 6</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-6" className="border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 6 - Feb Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Feb Waterfall Chart for SKU 6</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-7" className="border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 9 - Jan Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Jan Waterfall Chart for SKU 9</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-8" className="border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                    <span className="font-medium">SKU 9 - Feb Waterfall</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Feb Waterfall Chart for SKU 9</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Planning