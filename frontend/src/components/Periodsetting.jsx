import React, { useState } from "react";
import { postSalaryLedger } from "../api/salaryLedger";
import { Link } from "react-router-dom";

const Periodsetting = ({ setIsActive }) => {
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const createSalaryLedger = async () => {
    try {
      const data = await postSalaryLedger({
        periodStart: normalizeDate(periodStart),
        periodEnd: normalizeDate(periodEnd),
      });
      console.log("Ledger created:", data);
    } catch (error) {
      console.error("Error creating ledger:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 justify-center items-center">
      <h2 className="text-2xl font-bold">Salary Period Control</h2>

      <div className="flex gap-12 h-full w-screen items-center justify-center">
        <p className="text-lg font-bold text-blue-600">Start period</p>
        <input
          className="w-64 border rounded px-4 py-2"
          type="date"
          value={periodStart}
          onChange={(e) => setPeriodStart(e.target.value)}
        />

        <p className="text-lg font-bold text-red-600">End period</p>
        <input
          className="w-64 border rounded px-4 py-2"
          type="date"
          value={periodEnd}
          onChange={(e) => setPeriodEnd(e.target.value)}
        />

        <button
          onClick={createSalaryLedger}
          className="bg-blue-600 py-2 px-4 rounded text-white h-full hover:bg-blue-400 cursor-pointer"
        >
          Start period
        </button>
      </div>

      <div className="mt-8">
        <button
          onClick={() => setIsActive(false)}
          className="bg-red-500 py-2 px-4 w-full text-white text-3xl cursor-pointer rounded hover:bg-red-400"
        >
          Manage current salary payment
        </button>
      </div>
    </div>
  );
};

export default Periodsetting;
