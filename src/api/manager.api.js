import axiosClient from "./axiosClient";

export const ManagerAPI = {
  async getEmployees() {
    return axiosClient.get("/admin/users/employees");
  },

  async getRoles() {
    return axiosClient.get("/roles/all");
  },

  async deleteUser(id) {
    return axiosClient.delete(`/admin/removeuser/${id}`);
  },

  async addManager(payload) {
    return axiosClient.post("/admin/addManager", payload);
  },
};
