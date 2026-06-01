import api from "./client";

//create salary ledger for month
export const postSalaryLedger = async ({ periodStart, periodEnd }) =>
  await api.post("/payroll/salary-ledger", { periodStart, periodEnd });

// Get full salary report for an employee (JSON + Excel download)
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
