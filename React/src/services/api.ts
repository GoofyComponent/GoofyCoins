import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost/api",
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

const DOMAIN = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost", // Pas de /api ici
  withCredentials: true, // Inclure les cookies
  withXSRFToken: true, // Inclure le jeton CSRF
});

API.interceptors.request.use(
  (config) => {
    // Récupérer tous les cookies
    const cookies = document.cookie.split(";");
    // Trouver le cookie `auth_token`
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );
    // Extraire la valeur du token
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    // Ajouter l'en-tête Authorization si le token existe
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { API, DOMAIN };
