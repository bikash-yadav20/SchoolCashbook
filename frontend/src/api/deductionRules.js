import api from "./client";
export const deductionTypes = async () =>
  (await api.get("/deduction-rules/deduction-types")).data;
export const createDeductionRule = async (payload) =>
  await api.post("/deduction-rules/create-deduction-rule", payload).data;
export const getDeductionRules = async () =>
  (await api.get("/deduction-rules/get-deduction-rules")).data;
