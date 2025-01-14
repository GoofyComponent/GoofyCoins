import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost/api",
  headers: {
    "accept": "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

const DOMAIN = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost", // Pas de /api ici
  withCredentials: true, // Inclure les cookies
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { API, DOMAIN };