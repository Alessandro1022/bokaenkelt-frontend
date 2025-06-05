import axios from "axios";
import Cookies from "js-cookie";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem("token");
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // localStorage.removeItem("token");
      Cookies.remove("token");
      // window.location.href = '/customer/login';
      return Promise.reject(error);
    }

    // No response from server (network error)
    if (!error.response && error.request) {
      console.warn(
        "Network error or server not responding, using mock data fallback"
      );

      // Extract the path from the URL
      const path = error.config.url;

      // Return mock data for known endpoints
      if (path.includes("/api/stylists") && !path.includes("/api/stylists/")) {
        return Promise.resolve({ data: mockData.stylists });
      }

      if (
        path.includes("/api/auth/me") ||
        path.includes("/api/users/profile")
      ) {
        return Promise.resolve({ data: mockData.profile });
      }

      if (path.includes("/api/stylists/") && path.split("/").length > 3) {
        const id = path.split("/").pop();
        const stylist = mockData.stylists.find((s) => s._id === id);
        if (stylist) {
          return Promise.resolve({ data: stylist });
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
