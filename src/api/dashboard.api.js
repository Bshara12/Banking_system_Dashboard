import axiosClient from "./axiosClient";

export const getSystemHealth = () => axiosClient.get("/admin/health");

export const getWeeklyTransactions = () =>
  axiosClient.get("/admin/charts/transactions-weekly");

export const getTransactionStatus = () =>
  axiosClient.get("/admin/charts/transactions-status");

export const getAccountsMonthly = () =>
  axiosClient.get("/admin/charts/accounts-monthly?days=30");

export const getTopCustomers = () =>
  axiosClient.get("/admin/top/customers?limit=10");

export const getAccountsToday = () =>
  axiosClient.get("/admin/stats/accounts-today");

export const getTransactions24h = () =>
  axiosClient.get("/admin/stats/transactions-24h");

export const loadEmployees = () => axiosClient.get("/admin/getEmployees");
export const createEmployee = (body) =>
  axiosClient.post("/admin/createEmployee", body);

export const removeEmployee = (id) =>
  axiosClient.delete(`/admin/removeuser/${id}`);

export const getAccountUser = (id) =>
  axiosClient.post("/admin/getAccountUser", { account_number: id });

export const transaction = (body) => axiosClient.post("/transaction", body);

export const notifications = () => axiosClient.get("/getNotifications");

export const getRecentLogs = () => axiosClient.get("/admin/logs?per_page=5");
