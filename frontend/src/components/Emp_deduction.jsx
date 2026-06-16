import React, { useEffect, useState } from "react";
import { allEmployees } from "../api/employee";
import { createDeduction } from "../api/employeeDeductions";
import { toast } from "react-toastify";
import { markPaid, paymentStatus } from "../api/salaryLedger";

const Emp_deduction = ({ setIsActive, periodOptions }) => {
  const today = new Date().toISOString().split("T")[0];
  const [employees, setEmployees] = useState([]);
  const [deductionData, setDeductionData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  //  create deduction & /* mark employee as paid after submitting deductions */
  const handleChange = (empId, e) => {
    setDeductionData({
      ...deductionData,
      [empId]: {
        ...deductionData[empId],
        [e.target.name]: e.target.value,
        deduction_date: today,
      },
    });
  };

  /* convert date to iso format */

  const toISO = (dateStr) => {
    if (dateStr.includes("-")) return dateStr;
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const createEmpDeduction = async (emp, empDeduction) => {
    if (
      (!empDeduction.absent_days || empDeduction.absent_days === "") &&
      (!empDeduction.late_days || empDeduction.late_days === "")
    ) {
      toast.error("Please enter absent or late days before submitting");
      return;
    }
    try {
      const data = await createDeduction(empDeduction);
      console.log("Deduction created:", data);
      toast.success("Deduction successfull");
      /* mark employee as paid after submitting deductions */

      await markPaid(emp.employeeId, {
        periodStart: toISO(selectedPeriod.periodStart),
        periodEnd: toISO(selectedPeriod.periodEnd),
        isPaid: 1,
      });

      setEmployees((prev) =>
        prev.map((e) =>
          e.employeeId === emp.employeeId ? { ...e, status: "Paid" } : e,
        ),
      );
    } catch (error) {
      console.error("Failed to add deduction", error);
      toast.error(data.message || "Deduction failed");
    }
    setDeductionData({});
  };

  /* get payment status */

  //   fetchEmployees

  const fetchEmployees = async () => {
    try {
      if (!selectedPeriod) {
        return toast.error("Please select a period first");
      }
      const data = await allEmployees(
        toISO(selectedPeriod.periodStart),
        toISO(selectedPeriod.periodEnd),
      );
      setEmployees(data);

      const statusData = await paymentStatus(
        toISO(selectedPeriod.periodStart),
        toISO(selectedPeriod.periodEnd),
      );

      setEmployees((prev) =>
        prev.map((emp) => {
          const match = statusData.statusList?.find(
            (s) => s.employeeId === emp.employeeId,
          );
          return match ? { ...emp, status: match.status } : emp;
        }),
      );
    } catch (error) {
      console.error("Error fetching employees for deduction", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        className="bg-gray-800 text-white w-24 py-2 px-4 mt-4 rounded cursor-pointer hover:bg-gray-700"
        onClick={() => setIsActive(true)}
      >
        Back
      </button>
      <div className="flex gap-12 ">
        <select
          name="period"
          onChange={(e) => setSelectedPeriod(JSON.parse(e.target.value))}
        >
          <option value="select">Select</option>
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
          onClick={() => fetchEmployees()}
          className="bg-blue-500 rounded  px-4 py-2 cursor-pointer"
        >
          Get
        </button>
      </div>

      <div className="flex flex-col">
        <div className="flex">
          <table className="border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">ID</th>
                <th className="border p-2">Absent Days</th>
                <th className="border p-2">Late Days</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.employeeId}>
                  <td className="border p-2">
                    {emp.firstname} {emp.lastname}
                  </td>
                  <td className="border p-2">{emp.employeeId}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name="absent_days"
                      value={deductionData[emp.employeeId]?.absent_days || ""}
                      onChange={(e) => handleChange(emp.employeeId, e)}
                      placeholder="Absent"
                      className="w-20 border rounded p-1"
                      required
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name="late_days"
                      value={deductionData[emp.employeeId]?.late_days || ""}
                      onChange={(e) => handleChange(emp.employeeId, e)}
                      placeholder="Late"
                      className="w-20 border rounded p-1"
                      required
                    />
                  </td>
                  <td className="border p-2">
                    {emp.status === "Paid" ? (
                      <p className="text-lg font-bold text-green-500">Paid</p>
                    ) : (
                      <p className="text-lg font-bold text-red-500">Unpaid</p>
                    )}
                  </td>

                  <td className="border p-2">
                    <button
                      onClick={() => {
                        createEmpDeduction(emp, {
                          employeeId: emp.employeeId,
                          deduction_date: today,
                          ...deductionData[emp.employeeId],
                        });
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Submit
                    </button>
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

export default Emp_deduction;
