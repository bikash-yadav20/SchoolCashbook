import api from "./client";

export const login = async (username, password) => {
  const { data } = await api.post("/auth/login", { username, password });
  return data;
};
export const resetPassword = async ({ currentPassword, newPassword }) => {
  const { data } = await api.put("/auth/reset-password", {
    currentPassword,
    newPassword,
  });
  return data;
};
