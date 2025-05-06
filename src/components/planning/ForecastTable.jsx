import React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

const ForecastTable = () => {
    const months = ["Jan", "Feb"]

    const teams = ["Sales Team", "Marketing Team", "Finance Team"]
    const data = [
        {
            item: "Item A",
            lyJan: 100,
            lyFeb: 120,
            forecastJan: 130,
            forecastFeb: 140,
            teamData: {
                "Sales Team": {
                    Jan: { value: 135, comment: "Spike expected", owner: "Alice" },
                    Feb: { value: 145, comment: "Promotion running", owner: "Bob" }
                },
                "Marketing Team": {
                    Jan: { value: 132, comment: "New campaign", owner: "Chris" },
                    Feb: { value: 142, comment: "", owner: "Diana" }
                },
                "Finance Team": {
                    Jan: { value: 130, comment: "", owner: "Evan" },
                    Feb: { value: 138, comment: "Budget adjusted", owner: "Fiona" }
                }
            }
        },
        {
            item: "Item B",
            lyJan: 100,
            lyFeb: 120,
            forecastJan: 130,
            forecastFeb: 140,
            teamData: {
                "Sales Team": {
                    Jan: { value: 135, comment: "Spike expected", owner: "Alice" },
                    Feb: { value: 145, comment: "Promotion running", owner: "Bob" }
                },
                "Marketing Team": {
                    Jan: { value: 132, comment: "New campaign", owner: "Chris" },
                    Feb: { value: 142, comment: "", owner: "Diana" }
                },
                "Finance Team": {
                    Jan: { value: 130, comment: "", owner: "Evan" },
                    Feb: { value: 138, comment: "Budget adjusted", owner: "Fiona" }
                }
            }
        },
        {
            item: "Item C",
            lyJan: 100,
            lyFeb: 120,
            forecastJan: 130,
            forecastFeb: 140,
            teamData: {
                "Sales Team": {
                    Jan: { value: 135, comment: "Spike expected", owner: "Alice" },
                    Feb: { value: 145, comment: "Promotion running", owner: "Bob" }
                },
                "Marketing Team": {
                    Jan: { value: 132, comment: "New campaign", owner: "Chris" },
                    Feb: { value: 142, comment: "", owner: "Diana" }
                },
                "Finance Team": {
                    Jan: { value: 130, comment: "", owner: "Evan" },
                    Feb: { value: 138, comment: "Budget adjusted", owner: "Fiona" }
                }
            }
        }
    ]

    return (
        <div className="overflow-auto p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead rowSpan={2} className="border border-gray-300">
                            Item
                        </TableHead>
                        <TableHead colSpan={months.length} className="border border-gray-300">
                            LY
                        </TableHead>
                        <TableHead colSpan={months.length} className="border border-gray-300">
                            Forecast
                        </TableHead>
                        {teams.map((team) => (
                            <TableHead key={team} colSpan={months.length * 3} className="border border-gray-300">
                                {team}
                            </TableHead>
                        ))}
                    </TableRow>
                    <TableRow>
                        {months.map((month) => (
                            <TableHead key={`ly-${month}`} className="border border-gray-300">
                                {month}
                            </TableHead>
                        ))}
                        {months.map((month) => (
                            <TableHead key={`forecast-${month}`} className="border border-gray-300">
                                {month}
                            </TableHead>
                        ))}
                        {teams.flatMap((team) =>
                            months.map((month) => (
                                <React.Fragment key={`${team}-${month}`}>
                                    <TableHead className="border border-gray-300">{month}</TableHead>
                                    <TableHead className="border border-gray-300">{month} Comment</TableHead>
                                    <TableHead className="border border-gray-300">{month} Comment Owner</TableHead>
                                </React.Fragment>
                            ))
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell className="border border-gray-300">{row.item}</TableCell>
                            <TableCell className="border border-gray-300">{row.lyJan}</TableCell>
                            <TableCell className="border border-gray-300">{row.lyFeb}</TableCell>
                            <TableCell className="border border-gray-300">{row.forecastJan}</TableCell>
                            <TableCell className="border border-gray-300">{row.forecastFeb}</TableCell>
                            {teams.flatMap((team) =>
                                months.map((month) => (
                                    <React.Fragment key={`${team}-${month}-data`}>
                                        <TableCell className="border border-gray-300">
                                            {row.teamData[team][month]?.value ?? "-"}
                                        </TableCell>
                                        <TableCell className="border border-gray-300">
                                            {row.teamData[team][month]?.comment || "-"}
                                        </TableCell>
                                        <TableCell className="border border-gray-300">
                                            {row.teamData[team][month]?.owner || "-"}
                                        </TableCell>
                                    </React.Fragment>
                                ))
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ForecastTable
