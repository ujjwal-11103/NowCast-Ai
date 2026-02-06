import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

/**
 * Reusable Sales Filters Component
 * mimic-ing the Demand Planning filters UI
 * 
 * Props:
 * - showFilters: boolean to toggle visibility
 * - config: Array of filter objects { key, label, options: [] }
 * - filters: current filter state object
 * - onFilterChange: callback (key, value) => void
 * - onReset: callback () => void
 */
const SalesFilters = ({ showFilters, config = [], filters = {}, onFilterChange, onReset }) => {
    return (
        <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {config.map((field, index) => {
                        // Logic: Show if it's the first item OR if the previous item has a value
                        const isVisible = index === 0 || (filters[config[index - 1].key] && filters[config[index - 1].key] !== '');

                        if (!isVisible) return null;

                        return (
                            <div key={field.key} className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                                <Select
                                    value={filters[field.key] || ""}
                                    onValueChange={(val) => onFilterChange(field.key, val)}
                                >
                                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-indigo-100">
                                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                        <SelectItem value="All">All {field.label}s</SelectItem>
                                        {field.options && field.options.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        );
                    })}

                    {/* Reset/Action Area (Optional - maybe integrated or extra) */}
                    {onReset && (
                        <div className="flex items-end">
                            <Button
                                variant="ghost"
                                onClick={onReset}
                                className="text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 w-full justify-start px-2"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reset Filters
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SalesFilters;
