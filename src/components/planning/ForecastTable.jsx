import { React } from 'react'
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const ForecastTable = ({ data, selections }) => {
    // Define the hierarchy levels in order from most general to most specific
    const hierarchyLevels = ['Channel', 'Chain', 'Depot', 'SubCat', 'SKU']

    // Determine which level to show in Item column
    const getItemLevel = () => {
        // Create a map of selection values for easy lookup
        const selectionMap = {}
        selections.forEach(sel => {
            selectionMap[sel.field] = sel.value
        })

        // Special case: If all levels below Channel are "All", show Channels
        if (selectionMap.Chain === 'All') return 'Channel'
        if (selectionMap.Depot === 'All') return 'Chain'
        if (selectionMap.SubCat === 'All') return 'Depot'
        if (selectionMap.SKU === 'All') return 'SubCat'

        // Default to most specific level if no "All" selections
        return 'SKU'
    }

    const itemLevel = getItemLevel()

    // Filter data based on selections (excluding the item level)
    const filteredData = data.filter(item => {
        return selections.every(sel => {
            // Skip filtering for the item level we're showing
            if (sel.field === itemLevel) return true

            // Include all if "All" is selected
            if (sel.value === 'All') return true

            // Otherwise filter by exact match
            return item[sel.field] === sel.value
        })
    })

    // Group data by the item level and calculate sums
    const groupedData = filteredData.reduce((acc, item) => {
        const key = item[itemLevel]
        if (!acc[key]) {
            acc[key] = {
                name: key,
                LYJan: 0,
                LYFeb: 0,
                ForecastJan: 0,
                ForecastFeb: 0
            }
        }

        // Sum values based on date
        if (item.Date.includes('2024-01')) acc[key].LYJan += item.actual || 0
        if (item.Date.includes('2024-02')) acc[key].LYFeb += item.actual || 0
        if (item.Date.includes('2025-01')) acc[key].ForecastJan += item.forecast || 0
        if (item.Date.includes('2025-02')) acc[key].ForecastFeb += item.forecast || 0

        return acc
    }, {})

    // Convert to array and calculate L2F/L2A ratio
    const tableData = Object.values(groupedData).map(item => ({
        ...item,
        L2FL2A: (item.LYJan + item.LYFeb) > 0
            ? ((item.ForecastJan + item.ForecastFeb) / (item.LYJan + item.LYFeb)).toFixed(2)
            : 'N/A'
    }))

    return (
        <div className="space-y-4">
            {/* Main Data Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{itemLevel}</TableHead>
                            <TableHead className="text-right">LY Jan</TableHead>
                            <TableHead className="text-right">LY Feb</TableHead>
                            <TableHead className="text-right">Forecast Jan</TableHead>
                            <TableHead className="text-right">Forecast Feb</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell className="font-medium">{row.name}</TableCell>
                                <TableCell className="text-right">{Math.round(row.LYJan)}</TableCell>
                                <TableCell className="text-right">{Math.round(row.LYFeb)}</TableCell>
                                <TableCell className="text-right">{Math.round(row.ForecastJan)}</TableCell>
                                <TableCell className="text-right">{Math.round(row.ForecastFeb)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Teams Input Section */}
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <div className="min-w-[800px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{itemLevel}</TableHead>
                                <TableHead colSpan={3} className="text-center">Sales Team</TableHead>
                                <TableHead colSpan={3} className="text-center">Marketing Team</TableHead>
                                <TableHead colSpan={3} className="text-center">Finance Team</TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead></TableHead>
                                {/* Sales Team */}
                                <TableHead>Jan</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Owner</TableHead>
                                {/* Marketing Team */}
                                <TableHead>Jan</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Owner</TableHead>
                                {/* Finance Team */}
                                <TableHead>Jan</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Owner</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell className="font-medium">{row.name}</TableCell>
                                    {/* Sales Team */}
                                    <TableCell><input type="number" className="w-20" /></TableCell>
                                    <TableCell><input type="text" className="w-32" /></TableCell>
                                    <TableCell><input type="text" className="w-24" /></TableCell>
                                    {/* Marketing Team */}
                                    <TableCell><input type="number" className="w-20" /></TableCell>
                                    <TableCell><input type="text" className="w-32" /></TableCell>
                                    <TableCell><input type="text" className="w-24" /></TableCell>
                                    {/* Finance Team */}
                                    <TableCell><input type="number" className="w-20" /></TableCell>
                                    <TableCell><input type="text" className="w-32" /></TableCell>
                                    <TableCell><input type="text" className="w-24" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}

export default ForecastTable