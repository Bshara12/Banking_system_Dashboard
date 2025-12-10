// src/api/transactions.api.js
import axios from "./axiosClient";

export const transactionsApi = {
  listAll() {
    return axios.get("/transactions/all");
  },

  weekly() {
    return axios.get("/admin/charts/transactions-weekly");
  },

  statusChart() {
    return axios.get("/admin/charts/transactions-status");
  },

  stats24h() {
    return axios.get("/admin/stats/transactions-24h");
  },

  transactionRequests() {
    return axios.get("show-transactions");
  },

  approve(id) {
    return axios.post(`transaction/${id}/approve`);
  },

  reject(id) {
    return axios.post(`transaction/${id}/reject`);
  },

  // لو في API إضافي لاحقاً
  // getById(id) {
  //   return axios.get(`/transaction/${id}`);
  // },

  // retryTransaction(id) {
  //   return axios.post(`/transaction/${id}/retry`);
  // },

  updateStatus(id, statusName) {
    return axios.post(`/transaction/${id}/status`, { status: statusName });
  },
  // updateStatus(id, statusName) {
  //   return axios.post(`/transaction/${id}/status`, { status: statusName });
  // }
};
