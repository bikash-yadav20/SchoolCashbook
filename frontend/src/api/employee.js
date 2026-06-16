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
/* fetch employees period wise */
export const allEmployees = async (periodStart, periodEnd) =>
  (await api.get(`/employee/all-employees/${periodStart}/${periodEnd}`)).data;

/* fetch all employees */
export const employeeList = async (empStatus) =>
  (await api.get(`/employee/employees-list/${empStatus}`)).data;
