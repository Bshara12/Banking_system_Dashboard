// src/api/accounts.api.js
import axiosClient from "./axiosClient";

export const accountsApi = {
  listAll: () => axiosClient.get("/account/all"),
  getTree: (id) => axiosClient.get(`/account/${id}/tree`),
  getTypes: () => axiosClient.get("/account/types/all"),
  getStatuses: () => axiosClient.get("/account/statuses/all"),
  changeStatus: (id, statusId) => axiosClient.post(`/account/${id}/status`, { status_id: statusId }),
  create: (payload) => axiosClient.post("/account", payload),
};
