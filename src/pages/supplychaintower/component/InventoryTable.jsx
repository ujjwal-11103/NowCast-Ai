import React, { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import inventoryData from "../../../jsons/supplychaintower/table.json";

const InventoryTable = () => {
    // State for search, filters, pagination, and sorting
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedInventoryAlert, setSelectedInventoryAlert] = useState("");
    const [budgetConstraint, setBudgetConstraint] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // Extract unique inventory alert options for dropdown
    const inventoryAlertOptions = [...new Set(inventoryData.map(item => item.Inventory_Alert))];

    // Filtering logic
    const filteredData = inventoryData.filter(item => {
        const matchesSearch = globalFilter
            ? Object.values(item).some(value =>
                String(value).toLowerCase().includes(globalFilter.toLowerCase())
            )
            : true;

        const matchesInventoryAlert = selectedInventoryAlert
            ? item.Inventory_Alert === selectedInventoryAlert
            : true;

        return matchesSearch && matchesInventoryAlert;
    });

    // Sorting logic
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (typeof valA === "number" && typeof valB === "number") {
            return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        } else {
            return sortConfig.direction === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        }
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Handle sorting
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
        }));
    };

    return (

        <div>
            {/* Filters Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 flex-1">
                    {/* Global Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Global Search"
                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>

                    {/* Inventory Alert Filter */}
                    <div className="relative">
                        <select
                            className="pl-4 pr-10 py-2 border border-gray-200 rounded-md appearance-none bg-white"
                            value={selectedInventoryAlert}
                            onChange={(e) => setSelectedInventoryAlert(e.target.value)}
                        >
                            <option value="">All</option>
                            {inventoryAlertOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                {/* Budget Constraint */}
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Budget Constraint:</span>
                        <input
                            type="number"
                            placeholder="Enter budget"
                            className="pl-4 pr-4 py-2 border border-gray-200 rounded-md w-40"
                            value={budgetConstraint}
                            onChange={(e) => setBudgetConstraint(e.target.value)}
                        />
                    </div>
                    <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => setBudgetConstraint("")}
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Table Section with Scrollbar */}
            <div className="overflow-x-auto">
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-200">
                                {["State", "Item", "Current_Stock", "Forecast_Feb", "Days_on_Hand", "Inventory_Alert"].map((col) => (
                                    <th
                                        key={col}
                                        className="p-3 text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort(col)}
                                    >
                                        <span className="flex items-center gap-1">
                                            {col.replace("_", " ")}
                                            <ArrowUpDown size={16} />
                                        </span>
                                    </th>


                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="p-3">{item.State}</td>
                                        <td className="p-3">{item.Item}</td>
                                        <td className="p-3">{item.Current_Stock}</td>
                                        <td className="p-3">{item.Forecast_Feb}</td>
                                        <td className="p-3">{item.Days_on_Hand}</td>
                                        <td className="p-3">{item.Inventory_Alert}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-4 text-gray-500">
                                        No matching results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <button
                        className={`px-4 py-2 border rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-500"}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-500"}`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryTable;
