import React from 'react';
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// Mini Waterfall Component for Forecast Components (Hybrid: Supports both Consensus and System Decomposition)
export const ForecastBridge = ({
    trend, seasonality, discount, spends, lag3, ma4,
    baseline, sales, marketing, finance,
    final, className = "h-16"
}) => {
    // 1. Determine Mode & Steps
    let steps = [];
    const isConsensusMode = sales !== undefined || marketing !== undefined || finance !== undefined;

    if (isConsensusMode) {
        steps = [
            { label: 'Base', value: baseline || 0, type: 'base', color: 'bg-slate-400' },
            { label: 'Sales', value: sales || 0, type: 'adj', color: 'bg-blue-500' },
            { label: 'Mkt', value: marketing || 0, type: 'adj', color: 'bg-green-500' },
            { label: 'Fin', value: finance || 0, type: 'adj', color: 'bg-purple-500' },
        ];
    } else {
        steps = [
            { label: 'Trend', value: trend || 0, type: 'adj', color: 'bg-indigo-600' },
            { label: 'Seas.', value: seasonality || 0, type: 'adj', color: 'bg-cyan-500' },
            { label: 'Disc.', value: discount || 0, type: 'adj', color: 'bg-amber-500' },
            { label: 'Spends', value: spends || 0, type: 'adj', color: 'bg-emerald-500' },
            { label: 'Lag3', value: lag3 || 0, type: 'adj', color: 'bg-violet-500' },
            { label: 'MA4', value: ma4 || 0, type: 'adj', color: 'bg-pink-500' },
        ];
    }

    // Calculate accumulation for positioning
    let currentPos = 0;
    const bridgeItems = steps.map((step, idx) => {
        let end;
        let barStart, barEnd;

        if (step.type === 'base') {
            barStart = 0;
            barEnd = step.value;
            end = step.value;
        } else {
            barStart = currentPos;
            barEnd = currentPos + step.value;
            end = barEnd;
        }

        const obj = {
            ...step,
            start: Math.min(barStart, barEnd),
            end: Math.max(barStart, barEnd),
            visualEnd: end, // For connector
            isNegative: step.value < 0,
            rowIdx: idx
        };

        currentPos = end;
        return obj;
    });

    // 2. Determine Scale
    const valuesToCheck = bridgeItems.flatMap(i => [i.start, i.end]).concat([final || currentPos, 0]);
    const maxVal = Math.max(...valuesToCheck);
    const minVal = Math.min(...valuesToCheck, 0);
    const range = ((maxVal - minVal) * 1.1) || 1;

    const getPct = (val) => ((val - minVal) / range) * 100;
    const getWidth = (val) => (Math.abs(val) / range) * 100;

    // Layout configuration
    const totalItems = bridgeItems.length;
    const rowHeightPct = 100 / totalItems;
    const barHeightPct = rowHeightPct * 0.6; // Use 60% of row height for bar, 40% for gap

    return (
        <TooltipProvider>
            <div className={`w-full relative bg-slate-50/50 rounded-md px-2 min-w-[300px] border border-gray-200/50 ${className}`}>
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                    {[1, 2, 3].map(i => <div key={i} className="border-b border-black h-1/4 w-full"></div>)}
                </div>

                {/* Zero Line */}
                {minVal < 0 && maxVal > 0 && (
                    <div
                        className="absolute h-full w-px bg-gray-400 z-0 top-0 opacity-30"
                        style={{ left: `${getPct(0)}%` }}
                    ></div>
                )}

                {/* SVG Connectors */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                    {bridgeItems.map((item, idx) => {
                        if (idx === bridgeItems.length - 1) return null;

                        // Connector line coordinates
                        const x = getPct(item.visualEnd);
                        // Vertical Layout Logic used below
                        const top1 = (idx * 100 / totalItems) + (100 / totalItems - barHeightPct) / 2;
                        const top2 = ((idx + 1) * 100 / totalItems) + (100 / totalItems - barHeightPct) / 2;

                        return (
                            <line
                                key={`conn-${idx}`}
                                x1={`${x}%`}
                                y1={`${top1 + barHeightPct}%`}
                                x2={`${x}%`}
                                y2={`${top2}%`}
                                stroke="#94a3b8"
                                strokeWidth="1"
                                strokeDasharray="2 2"
                                vectorEffect="non-scaling-stroke"
                            />
                        );
                    })}
                </svg>

                {/* Bars */}
                {bridgeItems.map((item, idx) => {
                    const width = getWidth(item.end - item.start);
                    if (width < 0.1 && item.type !== 'base') return null;

                    const left = getPct(item.start);
                    // Dynamically calculate Top to center in row
                    const rowTop = (idx * 100 / totalItems);
                    const centeringOffset = (100 / totalItems - barHeightPct) / 2;
                    const topPos = rowTop + centeringOffset;

                    return (
                        <Tooltip key={idx} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <div
                                    className={`absolute rounded-sm shadow-sm transition-all hover:brightness-110 hover:shadow-md cursor-help ${item.color} z-20`}
                                    style={{
                                        left: `${left}%`,
                                        width: `${Math.max(width, 0.5)}%`,
                                        top: `${topPos}%`,
                                        height: `${barHeightPct}%`
                                    }}
                                >
                                    {/* Optional: Value Label if bar is wide enough */}
                                    {width > 15 && (
                                        <div className="w-full h-full flex items-center justify-center text-[9px] text-white/90 font-medium overflow-hidden whitespace-nowrap px-1">
                                            {item.value > 0 ? '+' : ''}{Math.round(item.value).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs bg-slate-800 text-white border-slate-700">
                                <div className="font-semibold mb-1">{item.label}</div>
                                <div className="text-xs opacity-90">
                                    Value: {item.value > 0 ? '+' : ''}{Math.round(item.value).toLocaleString()}
                                </div>
                                <div className="text-[10px] opacity-70 mt-1">
                                    Cumulative: {Math.round(item.visualEnd).toLocaleString()}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}

                {/* Final Marker Line */}
                <div
                    className="absolute h-full w-0.5 bg-gray-600 z-10 top-0 opacity-50 border-l border-dashed border-gray-600"
                    style={{ left: `${getPct(final || minVal)}%` }}
                >
                    {/* Label Bubble for Total */}
                    <div className="absolute -top-3 -translate-x-1/2 bg-gray-700 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Total: {Math.round(final || 0).toLocaleString()}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

// Aliases for compatibility
export const ConsensusBridge = ForecastBridge;

const ForecastBreakupTable = ({ tableData }) => {
    if (!tableData || tableData.length === 0) return null;

    return (
        <Card className="overflow-hidden border border-gray-200 mt-4 p-0 shadow-sm">
            <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Forecast Component Analysis <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">System Decomposition</span>
                </h3>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                            <TableHead className="w-[120px]">Item</TableHead>
                            <TableHead className="w-[80px]">Month</TableHead>
                            <TableHead className="w-[300px]">Forecast Bridge</TableHead>
                            <TableHead className="text-right w-[80px] text-indigo-600">
                                <div className="flex items-center justify-end gap-1"><div className="w-2 h-2 rounded-full bg-indigo-600"></div>Trend</div>
                            </TableHead>
                            <TableHead className="text-right w-[80px] text-cyan-600">
                                <div className="flex items-center justify-end gap-1"><div className="w-2 h-2 rounded-full bg-cyan-500"></div>Seas.</div>
                            </TableHead>
                            <TableHead className="text-right w-[80px] text-amber-600">
                                <div className="flex items-center justify-end gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Disc.</div>
                            </TableHead>
                            <TableHead className="text-right w-[80px] text-emerald-600">
                                <div className="flex items-center justify-end gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Spends</div>
                            </TableHead>
                            <TableHead className="text-right w-[80px] text-violet-600">
                                <div className="flex items-center justify-end gap-1"><div className="w-2 h-2 rounded-full bg-violet-500"></div>Lag3</div>
                            </TableHead>
                            <TableHead className="text-right w-[80px] text-pink-600">
                                <div className="flex items-center justify-end gap-1"><div className="w-2 h-2 rounded-full bg-pink-500"></div>MA4</div>
                            </TableHead>
                            <TableHead className="text-right w-[100px] font-bold text-gray-900 border-l border-gray-100 bg-gray-50/30">Final</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.map((row) => (
                            <React.Fragment key={row.name}>
                                {['oct', 'nov', 'dec'].map((m, index) => {
                                    const suffix = m.charAt(0).toUpperCase() + m.slice(1); // Oct, Nov, Dec
                                    const forecast = row[`Forecast${suffix}`] || 0;

                                    const trend = row[`Trend${suffix}`] || 0;
                                    const seasonality = row[`Seasonality${suffix}`] || 0;
                                    const discount = row[`Discount${suffix}`] || 0;
                                    const spends = row[`Spends${suffix}`] || 0;
                                    const lag3 = row[`Lag3${suffix}`] || 0;
                                    const ma4 = row[`MA4${suffix}`] || 0;

                                    return (
                                        <TableRow key={`${row.name}-${m}`} className="hover:bg-blue-50/30 transition-colors border-b border-gray-100">
                                            {index === 0 && (
                                                <TableCell rowSpan={3} className="font-semibold text-gray-700 border-r border-gray-100 align-top bg-white py-4">
                                                    {row.name}
                                                </TableCell>
                                            )}
                                            <TableCell className="capitalize text-gray-500 text-sm">{m}</TableCell>

                                            {/* Waterfall Visual Column */}
                                            <TableCell>
                                                <ForecastBridge
                                                    trend={trend}
                                                    seasonality={seasonality}
                                                    discount={discount}
                                                    spends={spends}
                                                    lag3={lag3}
                                                    ma4={ma4}
                                                    final={forecast}
                                                />
                                            </TableCell>

                                            <TableCell className="text-right font-mono text-indigo-600 text-sm">{Math.round(trend).toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-mono text-cyan-600 text-sm">{Math.round(seasonality).toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-mono text-amber-600 text-sm">{Math.round(discount).toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-mono text-emerald-600 text-sm">{Math.round(spends).toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-mono text-violet-600 text-sm">{Math.round(lag3).toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-mono text-pink-600 text-sm">{Math.round(ma4).toLocaleString()}</TableCell>

                                            <TableCell className="text-right font-bold font-mono text-gray-900 border-l border-gray-100 bg-gray-50/30">
                                                {Math.round(forecast).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};

export default ForecastBreakupTable;
