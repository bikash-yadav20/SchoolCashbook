import api from "./client";

export const createDeduction = async (payload) => {
  const response = await api.post("/payroll/salary-deduction", payload);
  return response.data;
};
