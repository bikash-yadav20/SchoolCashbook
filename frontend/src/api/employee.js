import api from "./client";

export const createEmployee = async (payload) =>
  (await api.post("/employee/create-employee", payload)).data;

export const updateEmployee = async (payload, employeeId) => {
  const response = await api.put(
    `/employee/update-employee/${employeeId}`,
    payload,
  );
  return response.data;
};

export const allEmployees = async () =>
  (await api.get("/employee/all-employees")).data;
