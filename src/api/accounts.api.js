// src/api/accounts.api.js
import axiosClient from "./axiosClient";

// export const accountsApi = {
//   listAll: () => axiosClient.get("/account/all"),
//   getTree: (id) => axiosClient.get(`/account/${id}/tree`),
//   getTypes: () => axiosClient.get("/account/types/all"),
//   getStatuses: () => axiosClient.get("/account/statuses/all"),
//   changeStatus: (id, statusId) =>
//     axiosClient.post(`/account/${id}/status`, { status_id: statusId }),
//   create: (payload) => axiosClient.post("/account", payload),
// };

export const accountsApi = {
  listAll: () => axiosClient.get("/account/all"),
  getTree: (id) => axiosClient.get(`/account/${id}/tree`),
  getTypes: () => axiosClient.get("/account/types/all"),
  getStatuses: () => axiosClient.get("/account/statuses/all"),
  create: (payload) => axiosClient.post("/account", payload),
  addFeature: (id, feature) =>
    axiosClient.post(`/accounts/${id}/features`, { feature }),
  removeFeature: (id, feature) =>
    axiosClient.delete(`/accounts/${id}/features/${feature}`),

  // 🔥 ضيفها هون
  updateAccountStatus: (id, body) =>
    axiosClient.post(`/account/${id}/status`, body),
};
export const getAccountStatuses = () =>
  axiosClient.get("/account/statuses/all");

// export const updateAccountStatus = (id, bode) =>
//   axiosClient.post(`/account/${id}/status`,  bode );
