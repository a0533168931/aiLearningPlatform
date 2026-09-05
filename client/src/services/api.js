import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const userApi = {
  create: (data) => api.post("/users/create", data),
  login: (data) => api.post("/users/login", data),
  getAll: async () => {
    const res = await api.get("/users/all");
    return res.data.data;
  },
  getById: async (id) => {
    const res = await api.get(`/users/view/${id}`);
    return res.data.data;
  },
};

export const categoryApi = {
  getAll: async () => {
    const res = await api.get("/categories");
    return res.data.data;
  },
  getSubcategories: async (categoryId) => {
    const res = await api.get(`/categories/${categoryId}/subcategories`);
    return res.data.data;
  },
};

export const promptApi = {
  create: async (data) => {
    const res = await api.post("/prompts/create", data);
    return res.data.data;
  },
  getHistory: async (userId) => {
    const res = await api.get(`/prompts/history/${userId}`);
    return res.data.data;
  },
};

export default api;