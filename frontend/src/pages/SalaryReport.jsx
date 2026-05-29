import React, { useState } from "react";
import { getSalaryReport, getPeriod } from "../api/salaryLedger";
import { useEffect } from "react";

const SalaryReport = ({ setIsActive }) => {
  const [reports, setReports] = useState([]);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  console.log("sss", reports);

  const normalizeDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
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

  useEffect(() => {
    const fetchPeriod = async () => {
      try {
        const options = await getPeriod();
        setPeriodOptions(options);
        console.log(options);
      } catch (error) {
        console.error("error fetching options", error);
      }
    };
    fetchPeriod();
  }, []);

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
      </div>

      {reports.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Gross Salary</th>
                <th>Absent Days</th>
                <th>Absent Amount</th>
                <th>Late Days</th>
                <th>Late Amount</th>
                <th>Advance Amount</th>
                <th>Pf Amount</th>
                <th>Total Deduction</th>
                <th>Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.employeeId} className="hover:bg-gray-50">
                  <td>{r.employeeId}</td>
                  <td>{r.name}</td>
                  <td>{r.grossSalary}</td>
                  <td>{r.absentDays}</td>
                  <td>{r.absentAmount}</td>
                  <td>{r.lateDays}</td>
                  <td>{r.lateAmount}</td>
                  <td>{r.advanceAmount}</td>
                  <td>{r.pf}</td>
                  <td>{r.totalDeduction}</td>
                  <td className="font-semibold text-green-700">
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
