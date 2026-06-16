import api from "./client";

//create salary ledger for month
export const postSalaryLedger = async ({ periodStart, periodEnd }) =>
  await api.post("/payroll/salary-ledger", { periodStart, periodEnd });

// Get full salary report
export const getSalaryReport = async ({ periodStart, periodEnd }) =>
  (await api.post("/payroll/salary-full-report", { periodStart, periodEnd }))
    .data;

//get the period attributes
export const getPeriod = async () => (await api.get("/payroll/period")).data;

//download excel file
export const downloadSalaryReport = async ({ periodStart, periodEnd }) => {
  const response = await api.post(
    "/payroll/download-full-report",
    { periodStart, periodEnd },
    { responseType: "blob" },
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "salary_report.xlsx");
  document.body.appendChild(link);
  link.click();
};

//get salary report for an employee

export const getEmployeeSalary = async (employeeId) => {
  try {
    const response = await api.get(`/payroll/salary-report/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee salary report", error);
    throw error;
  }
};

/* mark as paid on deductions completions */
export const markPaid = async (employeeId, payload) => {
  try {
    const response = await api.put(
      `/payroll/update-payment/${employeeId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Payment failed");
    throw error;
  }
};

export const paymentStatus = async (periodStart, periodEnd) => {
  try {
    const response = await api.get(
      `/payroll/payment-status/${periodStart}/${periodEnd}`,
    );
    return response.data;
  } catch (error) {
    console.error("error getting status");
    throw error;
  }
};
