import api from "./client";

export const togglePinExpense = async (id) => {
  const res = await api.put(`/expenses/${id}/pin`);
  return res.data;
};

export const getPinExpenses = async () => {
  const res = await api.get("/expenses/priorities");
  return res.data;
};
