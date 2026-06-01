import React from "react";
import Periodsetting from "../components/Periodsetting";
import { useState } from "react";
import Emp_deduction from "../components/Emp_deduction";

const PayrollSetting = () => {
  const [isActive, setIsActive] = useState(true);
  return (
    <div>
      {isActive ? (
        <Periodsetting setIsActive={setIsActive} />
      ) : (
        <Emp_deduction setIsActive={setIsActive} />
      )}
    </div>
  );
};

export default PayrollSetting;
