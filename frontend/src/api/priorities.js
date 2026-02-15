import api from "./client";

export const togglePinExpense = async (id) => {
  const res = await api.put(`/priorities/${id}/pin`);
  return res.data;
};

export const getPinExpenses = async () => {
  const res = await api.get("/priorities/priorities");
  return res.data;
};
