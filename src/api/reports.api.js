import axiosClient from "./axiosClient";

export const ReportsAPI = {
  getTransactions: (range) =>
    axiosClient.get(`/admin/reports/transactions?range=${range}`),

  getAccountSummaries: () =>
    axiosClient.get(`/admin/reports/account-summaries`),
};
  