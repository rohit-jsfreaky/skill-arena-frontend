import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export const setupInterceptors = (getToken: () => Promise<string | null>) => {
  apiClient.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        window.location.href = "/";
        console.log("Error fetching token:", error);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default apiClient;
