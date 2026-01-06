import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_BASE,
=======
  baseURL: import.meta.env.VITE_API_BASE
>>>>>>> 82a894b4b9385de4ea9462bebb9fb5076d0d62be
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
