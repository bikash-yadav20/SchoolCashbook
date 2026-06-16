import React, { useEffect, useState } from "react";
import { employeeList } from "../api/employee";
import { createDeduction } from "../api/employeeDeductions";
import { empSalaryReport } from "../api/employeeSalaryReport.js";
import { ToastContainer, toast } from "react-toastify";

const EmployeeDetails = ({ viewReport }) => {
  const today = new Date().toISOString().split("T")[0];
  const todayMonthDay = today.slice(5, 10);

  const [employees, setEmployees] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [advPopup, setAdvPopup] = useState(false);
  const [reportPopup, setReportPopup] = useState(false);
  const [salaryReport, setSalaryReport] = useState(null);
  const [empAdvance, setEmpAdvance] = useState({
    employeeId: "",
    advance_amount: "",
    type: "Advance",
    deduction_date: today,
    description: "",
  });
  const [department, setDepartment] = useState("all department");
  const [empStatus, setEmpStatus] = useState("active");
  const [searchKeywords, setSearchKeywords] = useState("");

  //search logic -------
  const filteredEmployees = employees.filter(
    (emp) =>
      (searchKeywords === "" ||
        `${emp.firstname} ${emp.lastname}`
          .toLowerCase()
          .includes(searchKeywords.toLowerCase()) ||
        emp.employeeId.toString().includes(searchKeywords)) &&
      (department === "all department" || emp.designation === department),
  );

  //gettin salary report by employee id
  const openReportPopup = async (emp) => {
    setReportPopup(true);
    setSelectedEmployee(emp);

    try {
      const data = await empSalaryReport(emp.employeeId);
      setSalaryReport(data);
      console.log(data);
    } catch (error) {
      console.error("error fetching salary report", error);
    }
  };

  // Advance payment -----------------------
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setEmpAdvance({
      ...empAdvance,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const saveAdvance = async (advanceData) => {
    try {
      const data = await createDeduction(advanceData);
      toast.success("Advance payment successfull");
      closeAdvancePopup();

      setEmpAdvance({
        employeeId: "",
        advance_amount: "",
        type: "",
        deduction_date: today,
        description: "",
      });
    } catch (err) {
      console.error({ error: err });
      toast.error("Failed to save advance payment");
    }
  };

  // Advance payment -----------------------

  const fetchEmployees = async () => {
    try {
      const { employees } = await employeeList(empStatus);
      setEmployees(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [empStatus]);

  const openAdvancePopup = (emp) => {
    setAdvPopup(true);
    setSelectedEmployee(emp);
    setEmpAdvance({
      ...empAdvance,
      employeeId: emp.employeeId,
    });
  };

  const closeAdvancePopup = () => {
    setAdvPopup(false);
    setSelectedEmployee(null);
  };

  const closeReportPopup = () => {
    setReportPopup(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full bg-blue-500 shadow-md p-4 sm:px-6">
        <div className="flex gap-12 items-center">
          <select
            name="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg bg-white px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all department">All Department</option>
            <option value="principle">Principal</option>
            <option value="vice principle">Vice principal</option>
            <option value="teacher">Teacher</option>
            <option value="assistant-teacher">Assistant Teacher</option>
            <option value="office-employee">Office Employee</option>
            <option value="grade-iv">Grade IV</option>
          </select>

          <div className="flex items-center gap-4">
            <select
              value={empStatus}
              onChange={(e) => setEmpStatus(e.target.value)}
              name="status"
              className="border border-gray-300 rounded-lg bg-white px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="active">Active</option>
              <option value="exited">Exited</option>
            </select>

            <button
              onClick={() => fetchEmployees()}
              className="bg-red-500 rounded-lg py-2 px-6 text-white font-semibold shadow hover:bg-red-600 transition duration-300"
            >
              Filter
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            className="border border-black bg-white rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            value={searchKeywords}
            onChange={(e) => setSearchKeywords(e.target.value)}
            name="search"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="bg-gray-100 flex flex-col w-full items-center justify-center p-2">
        {employees.map((emp) => {
          const empMonthDay = emp.DOB ? emp.DOB.slice(5, 10) : null;
          return (
            <p key={emp.employeeId}>
              {empMonthDay && todayMonthDay === empMonthDay
                ? `Today is ${emp.firstname} ${emp.lastname}'s birthday`
                : ""}
            </p>
          );
        })}

        <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Employee List
              </h2>
              <button className="bg-green-500 text-white font-bold px-4 py-2 rounded cursor-pointer hover:bg-green-600">
                Download Salary Slip
              </button>
            </div>

            {/* Employee List */}
            <div className="space-y-4">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.employeeId}
                  className="flex justify-between items-center border rounded-lg p-4 bg-gray-50 hover:shadow-md transition"
                >
                  {/* Left Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      {emp.firstname} {emp.lastname}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {emp.employeeId}
                    </p>
                    <div className="mt-2 space-y-1 text-gray-600">
                      <p>
                        <span className="font-medium">Salary:</span> ₹
                        {emp.salary}
                      </p>
                      <p>
                        <span className="font-medium">Provident Fund:</span> ₹
                        {emp.pf}
                      </p>
                      {emp.advance && (
                        <p>
                          <span className="font-medium">Advance Taken:</span> ₹
                          {emp.advance}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => viewReport(emp)}
                      className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition cursor-pointer"
                    >
                      Open profile
                    </button>
                    <button
                      onClick={() => openReportPopup(emp)}
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => openAdvancePopup(emp)}
                      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition cursor-pointer"
                    >
                      Advance Pay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advance Popup */}
          {advPopup && selectedEmployee && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="flex flex-col w-96 p-6 shadow-lg space-y-6 bg-white text-black rounded">
                <h3 className="text-lg font-semibold">
                  Enter Advance for {selectedEmployee.firstname}{" "}
                  {selectedEmployee.lastname} {selectedEmployee.employeeId}
                </h3>
                <input
                  className="w-full border rounded p-2 mb-3"
                  type="number"
                  name="advance_amount"
                  value={empAdvance.advance_amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  required
                />
                <select
                  name="type"
                  onChange={handleChange}
                  value={empAdvance.type}
                >
                  <option value="advance">Advance</option>
                </select>
                <input
                  className="w-full border rounded p-2 mb-3"
                  type="text"
                  name="description"
                  value={empAdvance.description}
                  onChange={handleChange}
                  placeholder="Note"
                />
                <input
                  className="w-full border rounded p-2 mb-3"
                  type="date"
                  onChange={handleChange}
                  value={empAdvance.deduction_date}
                  placeholder="date"
                />
                <div className="flex justify-between">
                  <button
                    onClick={closeAdvancePopup}
                    className="bg-gray-600 px-4 py-2 text-white font-semibold rounded-lg hover:bg-gray-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      saveAdvance({
                        ...empAdvance,
                        employeeId: selectedEmployee.employeeId,
                      })
                    }
                    className="bg-green-500 px-4 py-2 text-white font-semibold rounded-lg hover:bg-green-600 transition cursor-pointer"
                  >
                    Pay
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Report Popup */}
          {reportPopup && selectedEmployee && salaryReport && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Report for {selectedEmployee.firstname}{" "}
                  {selectedEmployee.lastname}
                </h3>
                <hr className="mb-4" />

                <ul className="space-y-2 text-gray-700">
                  <li className="flex justify-between">
                    <span>Absents</span>
                    <span className="font-medium">
                      {salaryReport.absentDays}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Absent deduction</span>
                    <span className="text-red-600 font-medium">
                      {salaryReport.absentAmount}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Late</span>
                    <span className="font-medium">{salaryReport.lateDays}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Late deduction</span>
                    <span className="text-red-600 font-medium">
                      {salaryReport.lateAmount}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Advance taken</span>
                    <span className="text-blue-600 font-medium">
                      {salaryReport.advanceAmount}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Provident fund</span>
                    <span className="text-blue-600 font-medium">
                      {salaryReport.pf}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Other deduction</span>
                    <span className="text-red-600 font-medium"></span>
                  </li>
                  <li className="text-sm text-gray-500 italic">
                    {salaryReport.description}
                  </li>
                </ul>

                <div className="mt-4 border-t pt-3 flex justify-between text-gray-800 font-semibold">
                  <div className="flex flex-col">
                    <span>
                      Net Deduction:{" "}
                      <span className="text-red-700">
                        {salaryReport.totalDeduction}
                      </span>
                    </span>
                    <span>Payable amount: {salaryReport.netSalary}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeReportPopup}
                    className="bg-gray-600 px-4 py-2 text-white font-semibold rounded-lg hover:bg-gray-700 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
