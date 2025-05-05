import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  Database,
  FileText,
  Info,
  Layers,
  List,
  Upload,
  Cloud,
  ThumbsUp,
  Server,
  BarChart,
  ArrowDownLeft,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function Ingestion() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-black rounded-full p-2">
          <Upload className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Data Ingestion Dashboard</h1>
      </div>

      <p className="text-sm text-muted-foreground mb-8">Status as of: 2025-05-05 17:56:18</p>
      <hr />
      <Separator className="my-6" />

      {/* Overall Status */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Info className="h-5 w-5" />
          <h2 className="text-xl font-bold">Overall Status</h2>
        </div>

        <div className="border-l-4 border-green-600 pl-4 py-3 bg-green-50 rounded-r-md">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold">Status: Success</span>
          </div>
          <p className="text-sm">Ingestion pipeline completed successfully. Data is up-to-date.</p>
        </div>
      </div>
      <hr />
      <Separator className="my-6" />

      {/* Data Freshness and Schema Check */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5" />
            <h2 className="text-xl font-bold">Data Freshness</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
              <h3 className="text-2xl font-bold">2025-05-05 16:33:18</h3>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Time Since Last Update</p>
              <h3 className="text-2xl font-bold">1h 23m ago</h3>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <Layers className="h-5 w-5" />
            <h2 className="text-xl font-bold">Schema Check</h2>
          </div>

          <div className="border-l-4 border-green-600 pl-4 py-3 bg-green-50 rounded-r-md">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Status: Passed</span>
            </div>
            <p className="text-sm">Schema matches expected structure.</p>
          </div>
        </div>
      </div>

      <hr />
      <Separator className="my-6" />

      {/* Data Sources */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Database className="h-5 w-5" />
          <h2 className="text-xl font-bold">Data Sources</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DataSourceCard icon={<Server className="h-5 w-5" />} title="ERP Database" status="Connected" records={9020} color="green" />
          <DataSourceCard icon={<Cloud className="h-5 w-5" />} title="Salesforce API" status="Connected" records={1367} color="green" />
          <DataSourceCard icon={<FileText className="h-5 w-5" />} title="Partner FTP Files" status="Delayed" records={968} color="yellow" />
          <DataSourceCard icon={<BarChart className="h-5 w-5" />} title="Web Analytics Feed" status="Connected" records={32604} color="green" />
        </div>
      </div>

      <hr />
      <Separator className="my-6" />

      {/* Data Volume */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Database className="h-5 w-5" />
          <h2 className="text-xl font-bold">Data Volume</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Total Records Ingested</p>
              <h3 className="text-4xl font-bold">74,505</h3>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Change from Previous Run</p>
              <h3 className="text-4xl font-bold">-3.4%</h3>
              <div className="flex items-center text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>-3.4%</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Ingestion Trend (Last 7 Days)</p>
            <IngestionTrendChart />
          </div>
        </div>
      </div>

      <hr />
      <Separator className="my-6" />



      {/* Data Quality & Integrity */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <List className="h-5 w-5" />
          <h2 className="text-xl font-bold">Data Quality & Integrity</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-6">Displaying sample quality metrics.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QualityMetricCard
            icon={<CheckCircle className="h-5 w-5" />}
            title="Data Completeness"
            value="97.8%"
            target="Target: >95.0%"
            progress={97.8}
            meetsTarget={true}
          />

          <QualityMetricCard
            icon={<FileText className="h-5 w-5" />}
            title="Unique IDs Found"
            value="561 Combinations"
            showProgress={false}
          />

          <QualityMetricCard
            icon={<Clock className="h-5 w-5" />}
            title="Update Timeliness"
            value="93.9% On Time"
            target="Target: >90.0% On Time"
            progress={93.9}
            meetsTarget={true}
          />
        </div>
      </div>

      <hr />
      <Separator className="my-6" />


    </div>
  );
}

// No type annotations
function IngestionTrendChart() {
  return (
    <div className="w-full h-[150px] bg-white border rounded-md p-2">
      <div className="relative w-full h-full">
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>40,000</span>
          <span>30,000</span>
          <span>20,000</span>
          <span>10,000</span>
          <span>0</span>
        </div>
        <div className="absolute left-[40px] right-0 top-0 bottom-[20px] flex items-end">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points="0,30 10,29 20,28 30,27 40,25 50,23 60,20 70,18 80,15 90,20 100,25"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="absolute left-[40px] right-0 bottom-0 flex justify-between text-[8px] text-gray-500">
          <span>06 PM</span>
          <span>06 AM</span>
          <span>06 PM</span>
          <span>06 AM</span>
          <span>06 PM</span>
          <span>06 AM</span>
          <span>06 PM</span>
          <span>06 AM</span>
          <span>06 PM</span>
          <span>06 AM</span>
          <span>06 PM</span>
          <span>06 AM</span>
        </div>
      </div>
    </div>
  );
}

// Default props fallback instead of typing
function QualityMetricCard({ icon, title, value, target, progress, meetsTarget, showProgress = true }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <p className="font-medium">{title}</p>
        </div>

        <div className="text-2xl font-bold mb-2">{value}</div>

        {target && <p className="text-sm text-muted-foreground mb-3">{target}</p>}

        {showProgress && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-gray-200 [&>div]:bg-green-800" />
            {meetsTarget && (
              <div className="flex items-center text-green-600 text-sm">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>Meets Target</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DataSourceCard({ icon, title, status, records, color }) {
  // Define status colors
  const statusColors = {
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  const statusClass = statusColors[color] || "bg-gray-50 text-gray-600"; // Default to gray if no color is provided

  const getBorderColor = () => {
    if (color === "green") {
      return "border-t-green-600"
    } else if (color === "yellow") {
      return "border-t-yellow-500"
    } else {
      return "border-t-red-600"
    }
  }

  return (
    <Card className={`border-t-4 ${getBorderColor()}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <p className="font-medium text-lg">{title}</p>
        </div>

        <div className="mb-2 text-sm text-muted-foreground">Status: <span className={`font-semibold ${statusClass}`}>{status}</span></div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Records: </span>
          <span className="font-semibold">{records}</span>
        </div>
      </CardContent>
    </Card>
  );
}

