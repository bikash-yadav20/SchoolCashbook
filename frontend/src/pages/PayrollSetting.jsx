import React from "react";
import Periodsetting from "../components/Periodsetting";
import { useState } from "react";
import Emp_deduction from "../components/Emp_deduction";

const PayrollSetting = ({ periodOptions }) => {
  const [isActive, setIsActive] = useState(true);
  return (
    <div>
      {isActive ? (
        <Periodsetting setIsActive={setIsActive} />
      ) : (
        <Emp_deduction
          setIsActive={setIsActive}
          periodOptions={periodOptions}
        />
      )}
    </div>
  );
};

export default PayrollSetting;
