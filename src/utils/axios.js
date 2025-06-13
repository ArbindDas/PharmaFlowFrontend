

import axios from "axios";
import authService from "./api/auth";

const api = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Single request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from either localStorage or authService (choose one approach)
    const token = localStorage.getItem('token') || authService.getCurrentUser()?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
      
      // Debugging logs (remove in production)
      if (process.env.NODE_ENV === 'development') {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("Token expiry:", new Date(payload.exp * 1000));
        } catch (e) {
          console.warn("Failed to parse token payload:", e);
        }
      }
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Single response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error scenarios
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Please try again.";
      console.error("Request timeout:", error.config.url);
    } else if (!error.response) {
      // Network error (no response from server)
      error.message = "Network error. Please check your connection.";
      console.error("Network error:", error.message);
    } else {
      // Server responded with error status (4xx, 5xx)
      const { status, data } = error.response;
      
      // Customize error messages
      error.message = data?.message || 
        (status === 401 ? "Unauthorized. Please login again." :
         status === 403 ? "Forbidden. You lack necessary permissions." :
         status === 404 ? "Resource not found." :
         status === 500 ? "Internal server error. Please try again later." :
         `Request failed with status ${status}`);
      
      // Special handling for 401
      if (status === 401) {
        localStorage.removeItem('token');
        // Consider redirecting here if using SPA
        // window.location = '/login';
      }
    }

    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);

export default api;

// ✅ Establishes and manages communication between your frontend and backend API
// It does more than just "connect" — here's what it really helps with

// api.js (Axios instance)	Handles all
// API requests, including automatically attaching the token using
// authService.getCurrentUser() and handling errors globally.
