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

export const getRecentLogs = () => axiosClient.get("/admin/logs?per_page=5");
