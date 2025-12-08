import axiosClient from "./axiosClient";

export const loginApi = async (identifier, password) => {
  const response = await axiosClient.post("/login", {
    identifier,
    password,
  });

  return response.data; // token + user
};
