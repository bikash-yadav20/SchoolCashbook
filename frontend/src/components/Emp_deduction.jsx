import React, { useEffect, useState } from "react";
import { allEmployees } from "../api/employee";
import { createDeduction } from "../api/employeeDeductions";

const Emp_deduction = ({ setIsActive }) => {
  const today = new Date().toISOString().split("T")[0];
  const [employees, setEmployees] = useState([]);
  const [deductionData, setDeductionData] = useState({});

  //  create deduction
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

  const createEmpDeduction = async (empDeduction) => {
    try {
      const data = await createDeduction(empDeduction);
      console.log("Deduction created:", data);
    } catch (error) {
      console.error("Failed to add deduction", error);
    }
  };

  //   fetchEmployees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await allEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees for deduction", error);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <button
        className="bg-gray-800 text-white w-24 py-2 px-4 mt-4 rounded cursor-pointer hover:bg-gray-700"
        onClick={() => setIsActive(true)}
      >
        Back
      </button>

      <div className="flex flex-col">
        <div className="flex">
          <table className="border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">ID</th>
                <th className="border p-2">Absent Days</th>
                <th className="border p-2">Late Days</th>
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
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() =>
                        createEmpDeduction({
                          employeeId: emp.employeeId,
                          deduction_date: today,
                          ...deductionData[emp.employeeId],
                        })
                      }
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
