import axiosClient from "./axiosClient";

export const SupportAPI = {
  getTickets() {
    return axiosClient.get("/tickets");
  },

  getTicket(id) {
    return axiosClient.get(`/tickets/${id}`);
  },

  replyToTicket(id, body) {
    return axiosClient.post(`/tickets/${id}/reply`, body);
  },

  changeStatus(id, status) {
    return axiosClient.post(`/tickets/${id}/status`, { status });
  }
};
