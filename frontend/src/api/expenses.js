import api from "./client";

export const createExpense = async (payload) =>
  (await api.post("/expenses", payload)).data;
export const getExpensesByDate = async (date) =>
  (await api.get("/expenses", { params: { date } })).data;
export const getExpenseTotalsByDate = async (date) =>
  (await api.get("/expenses/totals", { params: { date } })).data;
export const deleteExpense = async (id) =>
  (await api.delete(`/expenses/${id}`)).data;
