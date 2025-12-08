import axiosClient from "./axiosClient";

export const customersApi = {
  list: () => axiosClient.get("/admin/users/customers")
};
