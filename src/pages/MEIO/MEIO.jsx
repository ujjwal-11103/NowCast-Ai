import React, { useRef, useState } from 'react';
import SideBar from '@/components/Sidebar/SideBar';
import { meioService } from '@/services/meioService';
import { useSidebar } from '@/context/sidebar/SidebarContext';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
    CloudUpload, X, FileSpreadsheet, Activity, CheckCircle,
    ChevronRight, Settings, Database, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { read, utils } from 'xlsx';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const MEIO = () => {
    const { isSidebarOpen } = useSidebar();
    const fileInputRef = useRef(null);

    // --- State Management ---

    // Global
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1: Project Setup
    const [projectName, setProjectName] = useState('');
    const [assumptions, setAssumptions] = useState({
        replenishment: false,
        prioritization: false,
        hierarchy: false
    });

    // Step 2: Data Process
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileId, setFileId] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([]);
    const [processStep, setProcessStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Step 3: Operational Params
    const [operationalParams, setOperationalParams] = useState({
        serviceLevel: 95,
        leadTime: 5,
        holdingCost: 20,
        stockoutCost: 50,
        orderingCost: 100
    });

    // Step 4: Baseline State
    const [baselineMetrics, setBaselineMetrics] = useState(null);
    const [isCalculatingBaseline, setIsCalculatingBaseline] = useState(false);

    // Step 5: Optimization Setup State
    const [optimizationConfig, setOptimizationConfig] = useState({
        objective: 'minimize_cost',
        constraints: {
            maxBudget: '',
            minServiceLevel: 95
        }
    });

    // Step 6: Execution State
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationResults, setOptimizationResults] = useState(null);

    // --- Validation Logic ---

    const isStep1Valid = projectName.trim().length > 0;
    const isStep2Valid = processStep === 1; // Must have processed data
    const isStep3Valid = operationalParams.serviceLevel > 0;
    const isStep4Valid = baselineMetrics !== null;
    const isStep5Valid = optimizationConfig.constraints.minServiceLevel > 0;
    const isStep6Valid = optimizationResults !== null;

    // --- Helper Functions ---

    const handleNextStep = () => {
        if (currentStep < 7) {
            setCurrentStep(prev => prev + 1);
        } else {
            toast.success("Assessment Complete!");
        }
    };

    const handleBackStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = ['.csv', '.xlsx', '.xls'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

            if (!validTypes.includes(fileExtension)) {
                toast.error('Invalid file type. Please upload CSV or Excel file.');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            if (file.size > 200 * 1024 * 1024) {
                toast.error('File size exceeds 200MB limit.');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const headers = utils.sheet_to_json(worksheet, { header: 1 })[0];

                if (!headers) {
                    toast.error('File is empty or looks invalid.');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    return;
                }

                // Basic column validation - flexible
                const headersStr = headers.map(h => String(h).toLowerCase().trim());
                // For now, accept any file but warn if 'date' or 'quantity' missing
                // Generate Column Defs
                const generatedColDefs = headers.map(header => ({
                    field: header,
                    filter: true,
                    sortable: true,
                    flex: 1
                }));

                const jsonData = utils.sheet_to_json(worksheet, { raw: false });
                setColDefs(generatedColDefs);
                setRowData(jsonData);
                setSelectedFile(file);
                toast.success(`File "${file.name}" loaded successfully`);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setRowData([]);
        setColDefs([]);
        setProcessStep(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleProcessData = async () => {
        setIsProcessing(true);
        try {
            // Upload to backend (or mock service)
            const response = await meioService.uploadDemandData(selectedFile);
            setFileId(response.fileId);
            setProcessStep(1);
            toast.success("Demand data processed and aggregated successfully.");
        } catch (error) {
            console.error("Processing error:", error);
            toast.error("Failed to process data. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCalculateBaseline = async () => {
        setIsCalculatingBaseline(true);
        try {
            const data = await meioService.calculateBaseline({
                fileId,
                ...operationalParams
            });
            setBaselineMetrics(data);
            toast.success("Baseline performance calculated successfully.");
        } catch (error) {
            console.error("Baseline error:", error);
            toast.error("Failed to calculate baseline.");
        } finally {
            setIsCalculatingBaseline(false);
        }
    };

    const handleRunOptimization = async () => {
        setIsOptimizing(true);
        try {
            const data = await meioService.runOptimization({
                fileId,
                baselineMetrics,
                objective: optimizationConfig.objective,
                constraints: optimizationConfig.constraints
            });
            setOptimizationResults(data);
            toast.success("MEIO Optimization completed successfully!");
        } catch (error) {
            console.error("Optimization error:", error);
            toast.error("Optimization failed. Please try again.");
        } finally {
            setIsOptimizing(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative font-sans">
            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-100/40 to-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-rose-100/30 to-amber-100/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-teal-100/30 rounded-full blur-[100px]" />
            </div>

            {/* Sidebar */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} fixed h-full z-20`}>
                <SideBar />
            </div>

            {/* Main content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"} p-8 overflow-y-auto h-screen relative z-10`}>
                <div className="max-w-4xl mx-auto space-y-8 mt-4">

                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Multi-Echelon Inventory Optimization (MEIO) Tool</h1>
                        <p className="text-slate-500 text-lg font-medium">Upload and process demand data for analysis.</p>
                    </div>

                    {/* Stepper */}
                    <div className="w-full overflow-x-auto pb-4 mb-6">
                        <div className="flex items-center justify-between min-w-[768px] px-2">
                            {[
                                { id: 1, label: "Setup", icon: Settings },
                                { id: 2, label: "Data", icon: Database },
                                { id: 3, label: "Params", icon: Activity },
                                { id: 4, label: "Baseline", icon: CheckCircle },
                                { id: 5, label: "Opt Setup", icon: FileSpreadsheet },
                                { id: 6, label: "Execution", icon: CloudUpload },
                                { id: 7, label: "Report", icon: Activity }
                            ].map((step, index, arr) => (
                                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                                    <div className={`flex flex-col items-center z-10 relative cursor-pointer group`} onClick={() => currentStep > step.id ? setCurrentStep(step.id) : null}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                                            ${currentStep >= step.id
                                                ? "bg-white border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.2)] text-blue-600"
                                                : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"}`}>
                                            <step.icon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-[10px] font-bold mt-2 whitespace-nowrap transition-colors uppercase tracking-wide ${currentStep >= step.id ? "text-blue-700" : "text-slate-400"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < arr.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-2 -mt-4 transition-all duration-500 ${currentStep > step.id ? "bg-blue-600" : "bg-slate-200"}`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Module Sections */}
                    <div className="space-y-6">

                        {/* STEP 1: Project Setup */}
                        {currentStep === 1 && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-slate-900 font-bold">Project Initiation</CardTitle>
                                        <CardDescription className="text-slate-500">Define your project parameters and operational assumptions.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="projectName" className="text-slate-700 font-semibold">Project Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="projectName"
                                                placeholder="e.g. Q1 Inventory Optimization"
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-slate-700 font-semibold block mb-2">Core Operational Assumptions <span className="text-red-500">*</span></Label>

                                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                                <Checkbox
                                                    id="assumption1"
                                                    checked={assumptions.replenishment}
                                                    onCheckedChange={(c) => setAssumptions(prev => ({ ...prev, replenishment: c }))}
                                                    className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                                />
                                                <label htmlFor="assumption1" className="text-sm font-medium leading-none text-slate-700 cursor-pointer">
                                                    Replenishment orders are complete and delivered on time
                                                </label>
                                            </div>

                                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                                <Checkbox
                                                    id="assumption2"
                                                    checked={assumptions.prioritization}
                                                    onCheckedChange={(c) => setAssumptions(prev => ({ ...prev, prioritization: c }))}
                                                    className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                                />
                                                <label htmlFor="assumption2" className="text-sm font-medium leading-none text-slate-700 cursor-pointer">
                                                    Demand is prioritized based on business rules
                                                </label>
                                            </div>

                                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                                <Checkbox
                                                    id="assumption3"
                                                    checked={assumptions.hierarchy}
                                                    onCheckedChange={(c) => setAssumptions(prev => ({ ...prev, hierarchy: c }))}
                                                    className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                                />
                                                <label htmlFor="assumption3" className="text-sm font-medium leading-none text-slate-700 cursor-pointer">
                                                    Distribution hierarchy remains static during the planning horizon
                                                </label>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end pt-2">
                                        <Button
                                            onClick={handleNextStep}
                                            disabled={!isStep1Valid}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] shadow-sm"
                                        >
                                            Next Step
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                        {/* STEP 2: Data Process */}
                        {currentStep === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-slate-900">Network & Demand Data</h2>
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={handleBackStep}>Back</Button>
                                        <Button
                                            onClick={handleNextStep}
                                            disabled={!isStep2Valid}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                        >
                                            Next Step
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm text-slate-600 font-medium block">
                                        Upload CSV/Excel file (columns: plant, warehouse, depot, dealer, retailer, date, quantity)
                                    </label>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".csv,.xlsx,.xls"
                                    />

                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 bg-white/50 flex items-center justify-between hover:bg-blue-50/50 hover:border-indigo-400 transition-all group shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors text-indigo-600">
                                                <CloudUpload className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {selectedFile ? selectedFile.name : "Drag and drop file here"}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {selectedFile ? (
                                                        <span className="text-emerald-600 font-medium">Ready to upload</span>
                                                    ) : (
                                                        "Limit 200MB per file • CSV, XLSX, XLS"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {selectedFile ? (
                                            <Button
                                                variant="outline"
                                                className="border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600"
                                                onClick={clearFile}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Remove
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="border-slate-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 hover:border-indigo-200"
                                                onClick={handleBrowseClick}
                                            >
                                                Browse files
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm text-slate-600 font-medium block">
                                        Specify Time Period for Analysis (for demand aggregation):
                                    </label>
                                    <Select defaultValue="daily">
                                        <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900 focus:ring-indigo-500">
                                            <SelectValue placeholder="Select Frequency" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-md">
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {rowData.length > 0 && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                                                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                                                Data Preview
                                                <span className="text-xs font-normal text-slate-400 ml-2">
                                                    ({rowData.length} rows)
                                                </span>
                                            </h3>

                                            {processStep === 0 ? (
                                                <Button
                                                    onClick={handleProcessData}
                                                    disabled={isProcessing}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] shadow-sm"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <Activity className="w-4 h-4 mr-2 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        "Process Data"
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-default">
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Processed
                                                </Button>
                                            )}
                                        </div>

                                        <div className="h-[400px] w-full ag-theme-quartz">
                                            <AgGridReact
                                                rowData={rowData}
                                                columnDefs={colDefs}
                                                pagination={true}
                                                paginationPageSize={10}
                                                defaultColDef={{
                                                    resizable: true,
                                                    sortable: true,
                                                    filter: true
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: Operational Parameters */}
                        {currentStep === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-slate-900 font-bold">Operational Parameters</CardTitle>
                                        <CardDescription className="text-slate-500">Define service levels, lead times, and cost parameters for optimization.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="serviceLevel" className="text-slate-700 font-semibold">Target Service Level (%)</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="serviceLevel"
                                                        type="number"
                                                        min="0" max="100"
                                                        value={operationalParams.serviceLevel}
                                                        onChange={(e) => setOperationalParams({ ...operationalParams, serviceLevel: parseFloat(e.target.value) })}
                                                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 pl-10"
                                                    />
                                                    <Activity className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                </div>
                                                <p className="text-xs text-slate-500">Desired fill rate probability (e.g., 95%)</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="leadTime" className="text-slate-700 font-semibold">Avg. Lead Time (Days)</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="leadTime"
                                                        type="number"
                                                        min="0"
                                                        value={operationalParams.leadTime}
                                                        onChange={(e) => setOperationalParams({ ...operationalParams, leadTime: parseFloat(e.target.value) })}
                                                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 pl-10"
                                                    />
                                                    <CheckCircle className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                </div>
                                                <p className="text-xs text-slate-500">Time from order to receipt</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="holdingCost" className="text-slate-700 font-semibold">Annual Holding Cost (%)</Label>
                                                <Input
                                                    id="holdingCost"
                                                    type="number"
                                                    min="0" max="100"
                                                    value={operationalParams.holdingCost}
                                                    onChange={(e) => setOperationalParams({ ...operationalParams, holdingCost: parseFloat(e.target.value) })}
                                                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="stockoutCost" className="text-slate-700 font-semibold">Stockout Cost ($/Unit)</Label>
                                                <Input
                                                    id="stockoutCost"
                                                    type="number"
                                                    min="0"
                                                    value={operationalParams.stockoutCost}
                                                    onChange={(e) => setOperationalParams({ ...operationalParams, stockoutCost: parseFloat(e.target.value) })}
                                                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="orderingCost" className="text-slate-700 font-semibold">Ordering Cost ($/Order)</Label>
                                                <Input
                                                    id="orderingCost"
                                                    type="number"
                                                    min="0"
                                                    value={operationalParams.orderingCost}
                                                    onChange={(e) => setOperationalParams({ ...operationalParams, orderingCost: parseFloat(e.target.value) })}
                                                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between pt-2">
                                        <Button variant="outline" onClick={handleBackStep} className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                                            Previous Step
                                        </Button>
                                        <Button
                                            onClick={handleNextStep}
                                            disabled={!isStep3Valid}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] shadow-sm"
                                        >
                                            Next Step
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                        {/* STEP 4: Baseline Performance */}
                        {currentStep === 4 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-slate-900 font-bold">Baseline Performance</CardTitle>
                                        <CardDescription className="text-slate-500">Establish the current system performance to measure optimization gains.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                            <p className="text-slate-700 mb-4">
                                                Based on your uploaded data and parameters, we will simulate the system to establish a baseline.
                                            </p>
                                            {!baselineMetrics ? (
                                                <Button
                                                    onClick={handleCalculateBaseline}
                                                    disabled={isCalculatingBaseline}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                                >
                                                    {isCalculatingBaseline ? (
                                                        <>
                                                            <Activity className="w-4 h-4 mr-2 animate-spin" />
                                                            Calculating Baseline...
                                                        </>
                                                    ) : "Calculate Baseline"}
                                                </Button>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Inventory Value</p>
                                                        <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(baselineMetrics.totalInventoryValue)}</p>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Avg. Service Level</p>
                                                        <p className="text-2xl font-bold text-amber-600 mt-1">{baselineMetrics.avgServiceLevel}%</p>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Annual Holding Cost</p>
                                                        <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(baselineMetrics.annualHoldingCost)}</p>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Est. Stockout Cost</p>
                                                        <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(baselineMetrics.stockoutCost)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between pt-2">
                                        <Button variant="outline" onClick={handleBackStep} className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                                            Previous Step
                                        </Button>
                                        <Button
                                            onClick={handleNextStep}
                                            disabled={!isStep4Valid}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] shadow-sm"
                                        >
                                            Next Step
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                        {/* STEP 5: Optimization Setup */}
                        {currentStep === 5 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-slate-900 font-bold">Optimization Setup</CardTitle>
                                        <CardDescription className="text-slate-500">Define your optimization objectives and constraints.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 font-semibold">Objective Function</Label>
                                                <Select
                                                    value={optimizationConfig.objective}
                                                    onValueChange={(val) => setOptimizationConfig({ ...optimizationConfig, objective: val })}
                                                >
                                                    <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900 focus:ring-indigo-500">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-md">
                                                        <SelectItem value="minimize_cost">Minimize Total Cost (Inventory + Stockout)</SelectItem>
                                                        <SelectItem value="maximize_service">Maximize Service Level (within budget)</SelectItem>
                                                        <SelectItem value="target_service">Achieve Target Service Level (Minimize Inventory)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700 font-semibold">Constraint: Min Service Level (%)</Label>
                                                    <Input
                                                        type="number"
                                                        value={optimizationConfig.constraints.minServiceLevel}
                                                        onChange={(e) => setOptimizationConfig({
                                                            ...optimizationConfig,
                                                            constraints: { ...optimizationConfig.constraints, minServiceLevel: e.target.value }
                                                        })}
                                                        className="bg-white border-slate-200"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700 font-semibold">Constraint: Max Budget ($)</Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="Optional"
                                                        value={optimizationConfig.constraints.maxBudget}
                                                        onChange={(e) => setOptimizationConfig({
                                                            ...optimizationConfig,
                                                            constraints: { ...optimizationConfig.constraints, maxBudget: e.target.value }
                                                        })}
                                                        className="bg-white border-slate-200"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between pt-2">
                                        <Button variant="outline" onClick={handleBackStep} className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                                            Previous Step
                                        </Button>
                                        <Button
                                            onClick={handleNextStep}
                                            disabled={!isStep5Valid}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] shadow-sm"
                                        >
                                            Next Step
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                        {/* STEP 6: MEIO Execution */}
                        {currentStep === 6 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-slate-900 font-bold">MEIO Execution</CardTitle>
                                        <CardDescription className="text-slate-500">Run the multi-echelon inventory optimization algorithms.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8 flex flex-col items-center justify-center py-8">
                                        {!optimizationResults ? (
                                            <div className="text-center space-y-6">
                                                <div className="bg-indigo-50 p-6 rounded-full inline-block">
                                                    <Database className={`w-12 h-12 text-indigo-600 ${isOptimizing ? 'animate-pulse' : ''}`} />
                                                </div>
                                                <div className="max-w-md mx-auto space-y-2">
                                                    <h3 className="text-lg font-semibold text-slate-900">Ready to Optimize</h3>
                                                    <p className="text-slate-500">The engine will calculate optimal safety stocks for every node in your supply chain network.</p>
                                                </div>
                                                <Button
                                                    onClick={handleRunOptimization}
                                                    disabled={isOptimizing}
                                                    size="lg"
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-lg shadow-md hover:shadow-lg transition-all"
                                                >
                                                    {isOptimizing ? (
                                                        <>
                                                            <Activity className="w-5 h-5 mr-3 animate-spin" />
                                                            Running Optimization Engine...
                                                        </>
                                                    ) : "Run Optimization"}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="w-full space-y-6">
                                                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center gap-3 text-emerald-800">
                                                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                                                    <div>
                                                        <p className="font-semibold">Optimization Successful</p>
                                                        <p className="text-sm">Optimal policy found in 2.4 seconds.</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                                        <p className="text-sm text-slate-500 font-medium uppercase">Optimized Inventory Value</p>
                                                        <div className="flex items-end gap-2 mt-2">
                                                            <span className="text-3xl font-bold text-slate-900">{formatCurrency(optimizationResults.optimizedInventoryValue)}</span>
                                                            <span className="text-sm font-medium text-emerald-600 mb-1">
                                                                (-{formatCurrency(baselineMetrics.totalInventoryValue - optimizationResults.optimizedInventoryValue)})
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                                        <p className="text-sm text-slate-500 font-medium uppercase">Projected Service Level</p>
                                                        <div className="flex items-end gap-2 mt-2">
                                                            <span className="text-3xl font-bold text-slate-900">{optimizationResults.optimizedServiceLevel}%</span>
                                                            <span className="text-sm font-medium text-emerald-600 mb-1">
                                                                (+{(optimizationResults.optimizedServiceLevel - baselineMetrics.avgServiceLevel).toFixed(1)}%)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex justify-between pt-2">
                                        <Button variant="outline" onClick={handleBackStep} className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                                            Previous Step
                                        </Button>
                                        <Button
                                            onClick={handleNextStep}
                                            disabled={!isStep6Valid}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] shadow-sm"
                                        >
                                            View Report
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                        {/* STEP 7: Comparison & Reporting */}
                        {currentStep === 7 && optimizationResults && baselineMetrics && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
                                <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-slate-900 font-bold">Executive Summary & Report</CardTitle>
                                        <CardDescription className="text-slate-500">Comparison of Baseline vs. Optimized supply chain performance.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">

                                        {/* Top Level Impact */}
                                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                                <div>
                                                    <h3 className="text-2xl font-bold mb-2">Total Projected Savings</h3>
                                                    <p className="text-indigo-100">Annual impact from inventory reduction and stockout avoidance.</p>
                                                </div>
                                                <div className="text-5xl font-extrabold tracking-tight">
                                                    {formatCurrency(optimizationResults.savings)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detailed Comparison Table */}
                                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-6 py-4">Key Metric</th>
                                                        <th className="px-6 py-4 text-center">Baseline</th>
                                                        <th className="px-6 py-4 text-center bg-indigo-50/50 text-indigo-700">Optimized</th>
                                                        <th className="px-6 py-4 text-right">Variance</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    <tr className="hover:bg-slate-50/50">
                                                        <td className="px-6 py-4 font-medium text-slate-900">Total Inventory Investment</td>
                                                        <td className="px-6 py-4 text-center text-slate-600">{formatCurrency(baselineMetrics.totalInventoryValue)}</td>
                                                        <td className="px-6 py-4 text-center font-bold text-indigo-700 bg-indigo-50/30">{formatCurrency(optimizationResults.optimizedInventoryValue)}</td>
                                                        <td className="px-6 py-4 text-right text-emerald-600 font-medium">-{formatCurrency(baselineMetrics.totalInventoryValue - optimizationResults.optimizedInventoryValue)}</td>
                                                    </tr>
                                                    <tr className="hover:bg-slate-50/50">
                                                        <td className="px-6 py-4 font-medium text-slate-900">Average Service Level</td>
                                                        <td className="px-6 py-4 text-center text-slate-600">{baselineMetrics.avgServiceLevel}%</td>
                                                        <td className="px-6 py-4 text-center font-bold text-indigo-700 bg-indigo-50/30">{optimizationResults.optimizedServiceLevel}%</td>
                                                        <td className="px-6 py-4 text-right text-emerald-600 font-medium">+{((optimizationResults.optimizedServiceLevel - baselineMetrics.avgServiceLevel)).toFixed(1)}% pts</td>
                                                    </tr>
                                                    <tr className="hover:bg-slate-50/50">
                                                        <td className="px-6 py-4 font-medium text-slate-900">Annual Holding Cost</td>
                                                        <td className="px-6 py-4 text-center text-slate-600">{formatCurrency(baselineMetrics.annualHoldingCost)}</td>
                                                        <td className="px-6 py-4 text-center font-bold text-indigo-700 bg-indigo-50/30">{formatCurrency(optimizationResults.optimizedHoldingCost)}</td>
                                                        <td className="px-6 py-4 text-right text-emerald-600 font-medium">-{formatCurrency(baselineMetrics.annualHoldingCost - optimizationResults.optimizedHoldingCost)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    </CardContent>
                                    <CardFooter className="flex justify-between pt-2">
                                        <Button variant="outline" onClick={handleBackStep} className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                                            Previous Step
                                        </Button>
                                        <Button
                                            onClick={() => toast.success("Downloading Executive Report...")}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                        >
                                            <CloudUpload className="w-4 h-4 mr-2" />
                                            Download Final Report
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default MEIO;
