import axiosnew from "@/utils/axiosnew";

// Toggle this to false when backend endpoints are ready
const USE_MOCK = true;

export const meioService = {
    /**
     * Upload demand data file
     * @param {File} file 
     */
    uploadDemandData: async (file) => {
        if (USE_MOCK) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        message: "File uploaded successfully",
                        fileId: "mock-file-id-12345",
                        rowsProcessed: 1250
                    });
                }, 1500);
            });
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosnew.post("/meio/upload", formData, {
            headers: { "Content-Type": undefined },
        });
        return response.data;
    },

    /**
     * Calculate Baseline Performance based on uploaded data and params
     * @param {Object} params - { fileId, serviceLevel, leadTime, etc. }
     */
    calculateBaseline: async (params) => {
        if (USE_MOCK) {
            // Simulate processing calculation
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        totalInventoryValue: 2450000,
                        avgServiceLevel: 88.5,
                        annualHoldingCost: 490000,
                        stockoutCost: 125000
                    });
                }, 2000);
            });
        }

        const response = await axiosnew.post("/meio/baseline", params);
        return response.data;
    },

    /**
     * Run MEIO Optimization engine
     * @param {Object} config - { objective, constraints, fileId, baselineId, etc }
     */
    runOptimization: async (config) => {
        if (USE_MOCK) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        optimizedInventoryValue: 1980000,
                        optimizedServiceLevel: 96.2,
                        optimizedHoldingCost: 396000,
                        optimizedStockoutCost: 45000,
                        savings: 470000
                    });
                }, 3000);
            });
        }

        const response = await axiosnew.post("/meio/optimize", config);
        return response.data;
    }
};
