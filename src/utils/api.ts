import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to clear cookies and logout
const logoutAndRedirect = () => {
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Function to refresh access token
const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}api/admin/auth/refresh-token`,
      {},
      { withCredentials: true }
    );

    const newAccessToken = response.data.newAccessToken;

    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];

    return newAccessToken;
  } catch (error) {
    console.log("Token refresh failed:", error);
    logoutAndRedirect(); // Clear cookies & redirect on failure
    return null;
  } finally {
    isRefreshing = false;
  }
};

// Axios Response Interceptor (Handles Token Expiry)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("originalRequest", originalRequest);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
