import axios from "axios";
import { BASE_URL } from "@/config/config";

// Create axios instance with base URL
const axiosnew = axios.create({
    baseURL: BASE_URL,
    withCredentials: false, // Set to true if using cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
axiosnew.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
// axiosnew.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Attempt to refresh token
//         const refreshToken = localStorage.getItem("refreshToken");
//         if (refreshToken) {
//           const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
//             refreshToken,
//           });

//           const { token, refreshToken: newRefreshToken } = response.data;

//           // Store new tokens
//           localStorage.setItem("token", token);
//           localStorage.setItem("refreshToken", newRefreshToken);

//           // Retry original request
//           originalRequest.headers["Authorization"] = `Bearer ${token}`;
//           return axiosnew(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
//         localStorage.removeItem("token");
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/login"; // Redirect to login
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosnew;