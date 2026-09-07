import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

// Unified API instance
const api = axios.create({ baseURL: API_BASE });

// Request Interceptor: Attach current token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Seamless error recovery
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 encountered and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try automatic demo login re-authentication if stored user is a demo persona
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          const refreshRes = await axios.post(`${API_BASE}/auth/demo-login`, {
            phone: userObj.phone || (userObj.role === "farmer" ? "9876543210" : "9876543220"),
            role: userObj.role,
          });

          if (refreshRes.data.token) {
            localStorage.setItem("token", refreshRes.data.token);
            originalRequest.headers.Authorization = `Bearer ${refreshRes.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (recoveryErr) {
        console.warn("Auto-token recovery failed:", recoveryErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
