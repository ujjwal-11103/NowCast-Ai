import axios from "axios";

// Base URL from environment variable (optional, fallback)
const defaultBaseUrl = import.meta.env.VITE_API_BASEURL || "";

// Create Axios instance using Singleton pattern
const axiosInstance = axios.create({
  baseURL: defaultBaseUrl, // Fallback URL if not provided in request
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to modify baseURL dynamically
const requestInterceptor = (config) => {
  // Check if the request has a custom `baseURL`, if so, use it
  if (config.baseURL) {
    config.baseURL = config.baseURL; // Use the provided baseURL
  } else {
    config.baseURL = defaultBaseUrl; // Use the default baseURL if none provided
  }

  return config;
};

// Response interceptor for handling errors
const responseInterceptor = (response) => {
  return response;
};

const errorInterceptor = (error) => {
  return Promise.reject(error);
};

// Attaching interceptors to axios instance
axiosInstance.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);
axiosInstance.interceptors.response.use(responseInterceptor, errorInterceptor);

export { axiosInstance };
