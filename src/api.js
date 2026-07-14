import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// ---------- Auth ----------
export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  googleLogin: (data) => api.post("/api/auth/google-login", data),
  me: () => api.get("/api/auth/me"),
};

// ---------- Users ----------
export const userAPI = {
  all: () => api.get("/api/users"),
  me: () => api.get("/api/users/me"),
  remove: (id) => api.delete(`/api/users/${id}`),
  updateRole: (id, role) => api.patch(`/api/users/${id}/role`, { role }),
  addCredits: (credits) => api.patch("/api/users/credits", { credits }),
  adminStats: () => api.get("/api/users/admin/stats"),
};

// ---------- Campaigns ----------
export const campaignAPI = {
  approved: (page = 1, limit = 12) =>
    api.get(`/api/campaigns/approved?page=${page}&limit=${limit}`),
  topFunded: () => api.get("/api/campaigns/top-funded"),
  getOne: (id) => api.get(`/api/campaigns/${id}`),
  create: (data) => api.post("/api/campaigns", data),
  myCampaigns: () => api.get("/api/campaigns/creator/my-campaigns"),
  update: (id, data) => api.patch(`/api/campaigns/${id}`, data),
  remove: (id) => api.delete(`/api/campaigns/${id}`),
  pending: () => api.get("/api/campaigns/admin/pending"),
  approve: (id) => api.patch(`/api/campaigns/${id}/approve`),
  reject: (id) => api.patch(`/api/campaigns/${id}/reject`),
  adminAll: () => api.get("/api/campaigns/admin/all"),
  adminRemove: (id) => api.delete(`/api/campaigns/admin/${id}`),
  suspend: (id) => api.patch(`/api/campaigns/${id}/suspend`),
};

// ---------- Contributions ----------
export const contributionAPI = {
  create: (data) => api.post("/api/contributions", data),
  creatorPending: () => api.get("/api/contributions/creator/pending"),
  approve: (id) => api.patch(`/api/contributions/${id}/approve`),
  reject: (id) => api.patch(`/api/contributions/${id}/reject`),
  supporterApproved: () => api.get("/api/contributions/supporter/approved"),
  supporterAll: (page, limit) =>
    api.get(`/api/contributions/supporter/all?page=${page}&limit=${limit}`),
  supporterStats: () => api.get("/api/contributions/supporter/stats"),
};

// ---------- Withdrawals ----------
export const withdrawalAPI = {
  creatorAll: () => api.get("/api/withdrawals/creator"),
  creatorStats: () => api.get("/api/withdrawals/creator/stats"),
  create: (data) => api.post("/api/withdrawals", data),
  adminPending: () => api.get("/api/withdrawals/admin/pending"),
  approve: (id) => api.patch(`/api/withdrawals/${id}/approve`),
};

// ---------- Notifications ----------
export const notificationAPI = {
  all: () => api.get("/api/notifications"),
  markRead: (id) => api.patch(`/api/notifications/${id}/read`),
};

// ---------- Payments ----------
export const paymentAPI = {
  supporterAll: () => api.get("/api/payments/supporter"),
  create: (data) => api.post("/api/payments", data),
  adminAll: () => api.get("/api/payments/admin/all"),
};

// ---------- Reports ----------
export const reportAPI = {
  create: (data) => api.post("/api/reports", data),
  adminAll: () => api.get("/api/reports/admin"),
  resolve: (id) => api.patch(`/api/reports/${id}/resolve`),
};

// ---------- Upload (Cloudinary) ----------
export const uploadAPI = {
  image: (imageBase64) => api.post("/api/upload", { imageBase64 }),
  publicImage: (imageBase64) =>
    api.post("/api/upload/public", { imageBase64 }),
};
