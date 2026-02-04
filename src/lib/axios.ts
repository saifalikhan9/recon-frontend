import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", 
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Auto-attach Token
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Force redirect
    }
    return Promise.reject(error);
  }
);

export default api;