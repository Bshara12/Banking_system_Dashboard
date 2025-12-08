import axiosClient from "./axiosClient";

export const logsApi = {
  getAll: (page = 1) => axiosClient.get(`/admin/logs?page=${page}`),

  filterByUser: (userId, page = 1) =>
    axiosClient.get(`/admin/logs?user_id=${userId}&page=${page}`),

  filterByAction: (action, page = 1) =>
    axiosClient.get(`/admin/logs?action=${action}&page=${page}`),

  filterByDateRange: (from, to, page = 1) =>
    axiosClient.get(`/admin/logs?date_from=${from}&date_to=${to}&page=${page}`),

  latest: () => axiosClient.get(`/admin/logs/latest`),

  export: () => axiosClient.get(`/admin/logs/export`, { responseType: "blob" }),
};
