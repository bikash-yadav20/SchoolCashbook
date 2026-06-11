import React, { useState } from "react";
import EmployeeDetails from "../components/EmployeeDetails";
import EditEmployeeDetails from "../components/EditEmployeeDetails";
import SalaryReportByEmp from "../components/SalaryReportByEmp";

const EmployeeDetailsPgae = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editTrue, setEditTrue] = useState(false);

  const viewReport = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <>
      {!selectedEmployee && <EmployeeDetails viewReport={viewReport} />}

      {selectedEmployee && (
        <SalaryReportByEmp
          employee={selectedEmployee}
          setEditTrue={setEditTrue}
        />
      )}

      {selectedEmployee && editTrue && (
        <EditEmployeeDetails employee={selectedEmployee} />
      )}
    </>
  );
};

export default EmployeeDetailsPgae;
