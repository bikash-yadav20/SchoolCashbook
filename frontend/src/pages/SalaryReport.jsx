import React, { useState } from "react";
import {
  getSalaryReport,
  getPeriod,
  downloadSalaryReport,
} from "../api/salaryLedger";
import { useEffect } from "react";

const SalaryReport = ({ setIsActive, periodOptions }) => {
  const [reports, setReports] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  console.log("sss", reports);

  const normalizeDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleReportDownload = async () => {
    if (!setSelectedPeriod) return;
    const { periodStart, periodEnd } = JSON.parse(selectedPeriod);
    await downloadSalaryReport({
      periodStart: normalizeDate(periodStart),
      periodEnd: normalizeDate(periodEnd),
    });
  };

  const fetchReports = async () => {
    if (!selectedPeriod) return;
    const { periodStart, periodEnd } = JSON.parse(selectedPeriod);

    const data = await getSalaryReport({
      periodStart: normalizeDate(periodStart),
      periodEnd: normalizeDate(periodEnd),
    });
    setReports(data);
    console.log(data);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Salary Reports
      </h2>

      <div className="flex items-center gap-3 mb-6">
        <select
          name="period"
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="">Select Period</option>
          {periodOptions.map((p, i) => (
            <option
              key={i}
              value={JSON.stringify({
                periodStart: p.periodStart,
                periodEnd: p.periodEnd,
              })}
            >
              {p.periodStart} - {p.periodEnd}
            </option>
          ))}
        </select>

        <button
          onClick={fetchReports}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Get All Reports
        </button>
        <button
          onClick={handleReportDownload}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Download Reports
        </button>
      </div>

      {reports.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Employee ID</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Gross Salary</th>
                <th className="border p-2">Absent Days</th>
                <th className="border p-2">Absent Amount</th>
                <th className="border p-2">Late Days</th>
                <th className="border p-2">Late Amount</th>
                <th className="border p-2">Advance Amount</th>
                <th className="border p-2">Pf Amount</th>
                <th className="border p-2">Total Deduction</th>
                <th className="border p-2">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.employeeId} className="hover:bg-gray-50">
                  <td className="border p-2">{r.employeeId}</td>
                  <td className="border p-2">{r.status}</td>
                  <td className="border p-2">{r.name}</td>
                  <td className="border p-2">{r.grossSalary}</td>
                  <td className="border p-2">{r.absentDays}</td>
                  <td className="border p-2">{r.absentAmount}</td>
                  <td className="border p-2">{r.lateDays}</td>
                  <td className="border p-2">{r.lateAmount}</td>
                  <td className="border p-2">{r.advanceAmount}</td>
                  <td className="border p-2">{r.pf}</td>
                  <td className="border p-2">{r.totalDeduction}</td>
                  <td className=" border p-2 font-semibold text-green-700">
                    {r.netSalary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalaryReport;
