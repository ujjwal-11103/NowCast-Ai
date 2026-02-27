import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosnew from '@/utils/axiosnew';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ForecastTestPage = () => {
    const navigate = useNavigate();
    const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
    const [blobUrl, setBlobUrl] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [forecastUrl, setForecastUrl] = useState('');
    const [isLoading, setIsLoading] = useState({
        generateKey: false,
        generateBlob: false,
        forecast: false
    });

    // Initialize parameters with all required fields
    const [parameters, setParameters] = useState({
        general: {
            dataset_name: "Paragon",
            date_col: "Inv. date",
            cut_off_date: "2024-12-01",
            black_out_period: 0,
            forecast_horizon: 3,
            optimization_method: "optuna",
            direction: "minimize",
            n_trials: 100,
            compute_score_kwargs: { quantile: 0.75 },
            cv_start_date: "2024-07-01",
            cv_metric: "accuracy",
            cv_method: "rolling",
            cv_step_size: 1,
            n_splits: 3
        },
        feature_selection: {
            method: "LASSO",
            kwargs: { alpha: 0.1, max_iter: 1000, threshold: 0.01 }
        },
        target_col: "Sales quantity",
        columns_to_ignore: ["Amount", "BoxesSold"],
        models: {
            XGB: { abc: 1 },
            LR: { abc: 1 }
        }
    });

    // Generate API Key
    const generateApiKey = async () => {
        try {
            setIsLoading(prev => ({ ...prev, generateKey: true }));
            const response = await axiosnew.post('/api/v1/forecastAPI/generate-key');
            setApiKey(response.data.apiKey);
            localStorage.setItem('apiKey', response.data.apiKey);
            toast.success('API key generated successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to generate API key');
        } finally {
            setIsLoading(prev => ({ ...prev, generateKey: false }));
        }
    };

    // Generate Blob URL
    const generateBlobUrl = async () => {
        try {
            setIsLoading(prev => ({ ...prev, generateBlob: true }));
            const response = await axiosnew.get('/api/v1/forecastAPI/generate-blob-url', {
                headers: { 'x-api-key': apiKey }
            });
            setBlobUrl(response.data.blobUrl);
            toast.success('Blob URL generated. Upload your CSV file here.');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to generate blob URL');
        } finally {
            setIsLoading(prev => ({ ...prev, generateBlob: false }));
        }
    };

    // Handle Forecast Request
    const handleForecast = async () => {
        if (!fileUrl) {
            toast.error('Please enter the file URL after uploading');
            return;
        }

        try {
            setIsLoading(prev => ({ ...prev, forecast: true }));

            const payload = {
                fileUrl, // Sent separately
                parameters // Sent as a separate object
            };

            const response = await axiosnew.post(
                '/api/v1/forecastAPI/forecast',
                payload,
                { headers: { 'x-api-key': apiKey } }
            );

            setForecastUrl(response.data.forecastUrl);
            toast.success('Forecast completed successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Forecast request failed');
        } finally {
            setIsLoading(prev => ({ ...prev, forecast: false }));
        }
    };

    // Handle parameter changes
    const handleParamChange = (path, value) => {
        const pathParts = path.split('.');
        setParameters(prev => {
            const newParams = JSON.parse(JSON.stringify(prev));
            let current = newParams;

            for (let i = 0; i < pathParts.length - 1; i++) {
                current = current[pathParts[i]];
            }

            current[pathParts[pathParts.length - 1]] = value;
            return newParams;
        });
    };

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Forecast API Interface</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* API Key Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Step 1: API Key</h3>
                        {apiKey ? (
                            <div className="flex items-center gap-4">
                                <div className="text-sm font-mono bg-muted px-3 py-1.5 rounded-md">
                                    API Key: ****-****-{apiKey.slice(-4)}
                                </div>
                                <Button variant="outline"
                                    onClick={() => navigate('/pricing')}
                                >
                                    View Pricing
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={generateApiKey}
                                disabled={isLoading.generateKey}
                                className="text-white"
                            >
                                {isLoading.generateKey ? 'Generating...' : 'Generate API Key'}
                            </Button>
                        )}
                    </div>

                    {/* Blob URL Generation */}
                    {apiKey && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Step 2: Get Upload URL</h3>
                            <Button
                                onClick={generateBlobUrl}
                                disabled={isLoading.generateBlob}
                                className="text-white"
                            >
                                {isLoading.generateBlob ? 'Generating...' : 'Generate Blob URL'}
                            </Button>

                            {blobUrl && (
                                <div className="space-y-2">
                                    <Label>Upload your CSV to this URL (expires in 1 hour):</Label>
                                    <Input
                                        value={blobUrl}
                                        readOnly
                                        className="font-mono text-xs"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Use this URL with any HTTP client (curl, Postman, etc.) to upload your CSV
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* File URL Input */}
                    {blobUrl && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Step 3: Enter File URL</h3>
                            <div className="space-y-2">
                                <Label>Paste the URL after uploading your CSV:</Label>
                                <Input
                                    value={fileUrl}
                                    onChange={(e) => setFileUrl(e.target.value)}
                                    placeholder="https://yourstorage.blob.core.windows.net/.../file.csv"
                                />
                            </div>
                        </div>
                    )}

                    {/* Forecast Parameters */}
                    {fileUrl && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Step 4: Configure Forecast</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* General Parameters */}
                                <div className="space-y-4">
                                    <h4 className="font-medium">General Settings</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <Label>Date Column</Label>
                                            <Input
                                                value={parameters.general.date_col}
                                                onChange={(e) => handleParamChange('general.date_col', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Forecast Horizon (days)</Label>
                                            <Input
                                                type="number"
                                                value={parameters.general.forecast_horizon}
                                                onChange={(e) => handleParamChange('general.forecast_horizon', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <Label>Optimization Method</Label>
                                            <Select
                                                value={parameters.general.optimization_method}
                                                onValueChange={(value) => handleParamChange('general.optimization_method', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="optuna">Optuna</SelectItem>
                                                    <SelectItem value="grid">Grid Search</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature Selection */}
                                <div className="space-y-4">
                                    <h4 className="font-medium">Feature Selection</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <Label>Method</Label>
                                            <Select
                                                value={parameters.feature_selection.method}
                                                onValueChange={(value) => handleParamChange('feature_selection.method', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="LASSO">LASSO</SelectItem>
                                                    <SelectItem value="RF">Random Forest</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Target Column</Label>
                                            <Input
                                                value={parameters.target_col}
                                                onChange={(e) => handleParamChange('target_col', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleForecast}
                                disabled={isLoading.forecast}
                                className="w-full mt-4 text-white"
                            >
                                {isLoading.forecast ? 'Processing...' : 'Run Forecast'}
                            </Button>
                        </div>
                    )}

                    {/* Results */}
                    {forecastUrl && (
                        <div className="space-y-4 pt-4 ">
                            <h3 className="text-lg font-medium">Forecast Results</h3>
                            <Button
                                // onClick={() => window.open(forecastUrl, '_blank')}
                                className="w-full text-black  whitespace-nowrap overflow-x-auto scrollbar-thin"
                                variant="success"
                            >
                                <span className="block max-w-full overflow-x-auto">{forecastUrl}</span>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForecastTestPage;