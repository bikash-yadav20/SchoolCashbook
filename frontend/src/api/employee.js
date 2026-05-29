import api from "./client";

export const createEmployee = async (payload) =>
  (await api.post("/employee/create-employee", payload)).data;

export const allEmployees = async () =>
  (await api.get("/employee/all-employees")).data;
