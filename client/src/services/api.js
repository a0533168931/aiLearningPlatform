import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

export const userApi = {
  create: (data) => api.post("/users/create", data),
  getAll: () => api.get("/users/all"),
  getById: (id) => api.get(`/users/view/${id}`),
};



export default api;