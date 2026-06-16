import React, { useEffect, useState } from "react";
import { getEmployeeSalary } from "../api/salaryLedger";
import { updateEmployee } from "../api/employee";
import exitLogo from "../assets/exit.png";
import { toast } from "react-toastify";

const SalaryReportByEmp = ({ employee, setEditTrue }) => {
  const [reports, setReports] = useState([]);
  const fetchReport = async (employeeId = employee.employeeId) => {
    try {
      const data = await getEmployeeSalary(employeeId);
      setReports(data);
    } catch (error) {
      console.error("Error fetching employee salary report", error);
    }
  };
  console.log(reports);
  console.table(reports);

  // exit employee
  const exitEmployee = async (employeeId = employee.employeeId) => {
    const confirmation = confirm(`Are you sure to remove ${employeeId}`);
    if (!confirmation) return;
    try {
      await updateEmployee({ status: "exited" }, employeeId);
      toast.success("Employee removed successfully");
    } catch (error) {
      console.error("error removing employee", error);
      toast("Failed to remove employee");
    }
  };

  useEffect(() => {
    if (employee?.employeeId) {
      fetchReport(employee.employeeId);
    }
  }, [employee.employeeId]);
  return (
    <div>
      <div>
        <div className="flex bg-blue-400 w-full p-2 justify-between items-center  text-white">
          <h2 className="text-2xl">
            Salary report for {employee.firstname} {employee.lastname}{" "}
          </h2>
          <div className="flex items-center  gap-6">
            <button
              onClick={(e) => exitEmployee()}
              className="flex flex-col border-2 hover:border-red-500 cursor-pointer text-sm font-mono font-semibold"
            >
              <img className="w-8 h-auto" src={exitLogo} alt="" />
              Exit
            </button>
            <button
              onClick={() => setEditTrue(true)}
              className="bg-red-500 rounded px-2 py-2 hover:bg-red-400 cursor-pointer"
            >
              Edit profile
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-white shadow-md rounded-lg p-6 m-4">
          <p className="text-blue-600 font-semibold text-lg">
            Select Salary Period
          </p>

          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="salaryPeriod"
            id="salaryPeriod"
          >
            <option value="">15-06-2026 to 16-07-2026</option>
            <option value="">17-07-2026 to 16-08-2026</option>
            <option value="">17-08-2026 to 16-09-2026</option>
          </select>

          <button className="cursor-pointer bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300">
            Get Report
          </button>
        </div>
        <div>
          <table className="w-full border-collapse mt-6">
            <thead className="bg-blue-50">
              <tr>
                <th className="border p-2">Month</th>
                <th className="border p-2">Gross Salary</th>
                <th className="border p-2">Late days</th>
                <th className="border p-2">Late deduction</th>
                <th className="border p-2">Absent days</th>
                <th className="border p-2">Absent deduction</th>
                <th className="border p-2">Advance payments</th>
                <th className="border p-2">PF Deduction</th>
                <th className="border p-2">Total Deductions</th>
                <th className="border p-2">Net Payable</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="text-center hover:bg-blue-50">
                  <td className="border p-2">
                    {r.periodStart} → {r.periodEnd}
                  </td>
                  <td className="border p-2">{r.grossSalary}</td>
                  <td className="border p-2">{r.lateDays}</td>
                  <td className="border p-2">{r.lateAmount}</td>
                  <td className="border p-2">{r.absentDays}</td>
                  <td className="border p-2">{r.absentAmount}</td>
                  <td className="border p-2">{r.advanceAmount}</td>
                  <td className="border p-2">{r.pf}</td>
                  <td className="border p-2">{r.totalDeduction}</td>
                  <td className="border p-2 font-semibold text-green-700">
                    {r.netSalary}
                  </td>
                  <td className="border p-2">
                    {r.paymentStatus === "Paid" ? (
                      <p className="text-green-500 font-semibold">Paid</p>
                    ) : (
                      <p className="text-red-500 font-semibold">Unpaid</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalaryReportByEmp;
