import axios from "axios";
import NProgress from "nprogress";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// 🔥 ADD TOKEN AUTOMATICALLY
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  NProgress.start();
  return config;
});

// 🔥 HANDLE RESPONSE
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default api;