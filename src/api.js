import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AdminApi = {
  addProduct: (data) => api.post("/admin/products/add", data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  dailyBusiness: (date) =>
    api.get("/admin/analytics/daily", { params: { date } }),
  monthlyBusiness: (month, year) =>
    api.get("/admin/analytics/monthly", { params: { month, year } }),
  yearlyBusiness: (year) =>
    api.get("/admin/analytics/yearly", { params: { year } }),
  overallBusiness: () => api.get("/admin/analytics/overall"),
};

export default api;
