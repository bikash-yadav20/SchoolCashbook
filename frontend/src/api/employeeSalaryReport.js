import api from "./client";

export const empSalaryReport = async (employeeId) => {
  try {
    const response = await api.get(
      `/employee-salary/emp-salary-report/${employeeId}`,
    );
    return response.data;
  } catch (error) {
    console.error("error fetching salary report", error);
    throw error;
  }
};
