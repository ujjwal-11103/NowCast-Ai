import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import Plot from "react-plotly.js";
import LaunchesTableData from "../../../jsons/supplychaintower/new_launches_table[1].json";
import NewLaunchesData from "../../../jsons/supplychaintower/charts/new_launches[1].json";

const getBarColor = (alert) => {
    if (alert.includes("Low Engagement")) return "#FF9999";
    if (alert.includes("Moderate Demand")) return "#FFD97D";
    return "#A8E6A2";
};

const normalizeAlert = (alert) => alert.replace(/\u[0-9A-Fa-f]{4}/g, "").trim();

const NewLaunches = () => {
    // Format table data
    const formattedData = Object.keys(LaunchesTableData.Item).map((key) => ({
        item: LaunchesTableData.Item[key],
        launch: LaunchesTableData.Launch[key],
        orders: LaunchesTableData.Orders[key],
        alert: normalizeAlert(LaunchesTableData.Alert[key]),
        recommendation: LaunchesTableData.Recommendation[key],
    }));

    // **Extracting and Transforming Data for Plotly Chart**
    const dataByCategory = NewLaunchesData.reduce((acc, item) => {
        const normalizedAlert = normalizeAlert(item.Alert);
        const key = `${item.JTBD_Category}-${normalizedAlert}`;
        if (!acc[key]) {
            acc[key] = { category: item.JTBD_Category, alert: normalizedAlert, orders: 0 };
        }
        acc[key].orders += item.Total_Orders;
        return acc;
    }, {});

    const plotData = Object.values(dataByCategory);

    // **Group Data by Alert for Stacked Bar Chart**
    const groupedByAlert = plotData.reduce((acc, item) => {
        if (!acc[item.alert]) {
            acc[item.alert] = { x: [], y: [] };
        }
        acc[item.alert].x.push(item.category);
        acc[item.alert].y.push(item.orders);
        return acc;
    }, {});

    // **Convert Grouped Data to Traces for Plotly**
    const traces = Object.keys(groupedByAlert).map(alertKey => ({
        x: groupedByAlert[alertKey].x,
        y: groupedByAlert[alertKey].y,
        name: alertKey,
        type: "bar",
        marker: { color: getBarColor(alertKey) },
    }));

    // **Pagination**
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const totalPages = Math.ceil(formattedData.length / rowsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // **Sorting**
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const handleSort = (column) => {
        let direction = "asc";
        if (sortConfig.key === column && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key: column, direction });
    };

    // Apply Sorting **BEFORE** Pagination
    const sortedData = [...formattedData].sort((a, b) => {
        if (sortConfig.key) {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];

            if (typeof valA === "number" && typeof valB === "number") {
                return sortConfig.direction === "asc" ? valA - valB : valB - valA;
            } else {
                return sortConfig.direction === "asc"
                    ? valA.toString().localeCompare(valB.toString())
                    : valB.toString().localeCompare(valA.toString());
            }
        }
        return 0;
    });

    // Apply Pagination After Sorting
    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="flex flex-col lg:flex-row gap-4 p-4">
            {/* Data Table */}
            <div className="bg-white w-full lg:min-w-1/2">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">New Launches Data</h2>
                <div className="overflow-x-auto">
                    <div className="max-h-[400px] overflow-y-auto border rounded-md">
                        <table className="w-full">
                            <thead className="bg-gray-100 sticky top-0 shadow">
                                <tr className="text-left border-b border-gray-200">
                                    {["item", "launch", "orders", "alert", "recommendation"].map((header) => (
                                        <th
                                            key={header}
                                            className="p-3 text-sm font-medium text-gray-600 cursor-pointer"
                                            onClick={() => handleSort(header)}
                                        >
                                            <span className="flex items-center gap-1">
                                                {header.charAt(0).toUpperCase() + header.slice(1)}
                                                <ArrowUpDown size={16} />
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-100 odd:bg-white even:bg-gray-50">
                                            <td className="p-3">{row.item}</td>
                                            <td className="p-3">{row.launch}</td>
                                            <td className="p-3">{row.orders}</td>
                                            <td className="p-3">
                                                <span className="px-2 py-1 rounded-md text-sm">
                                                    {row.alert}
                                                </span>
                                            </td>
                                            <td className="p-3">{row.recommendation}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center p-4 text-gray-500">
                                            No matching results found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 border rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-500"}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <button
                            className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-500"}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Plotly Chart */}
            <div className="w-full lg:w-1/2 border rounded-lg shadow-md p-4 bg-white">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">New Launches Analysis</h2>
                <Plot
                    data={traces}
                    layout={{
                        barmode: "stack",
                        title: { text: "", font: { size: 18 }, x: 0.5, y: 0.95 },
                        template: "plotly_white",
                        legend: { x: 0.5, y: 1 },
                        xaxis: { title: "" },
                        yaxis: { title: "" },
                        responsive: true,
                    }}
                    useResizeHandler={true}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </div>
    );
};

export default NewLaunches;
