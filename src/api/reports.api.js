import axiosClient from "./axiosClient";

export const ReportsAPI = {
  getTransactions: (range) =>
    axiosClient.get(`/reports/transactions?range=${range}`),

  getAccountSummaries: () =>
    axiosClient.get(`/reports/account-summaries`),
};
  