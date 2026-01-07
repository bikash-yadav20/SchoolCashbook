import React, { useState } from "react";
import { startDay, closeDay } from "../api/cashController";

const Ledger = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [openingBalance, setOpeningBalance] = useState("");
  const [cashFees, setCashFees] = useState("");
  const [expenses, setExpenses] = useState("");
  const [closingCash, setClosingCash] = useState("");
  const [nextOpening, setNextOpening] = useState("");
  const [err, setErr] = useState("");

  const handleStartDay = async () => {
    setErr("");
    const confirmAction = confirm(
      "Are you sure you want to Open Account For the day?"
    );
    if (!confirmAction) return;

    try {
      const data = await startDay({ date });
      setOpeningBalance(data.opening_balance);
    } catch {
      setErr("Failed to start day");
    }
  };

  const handleCloseDay = async () => {
    setErr("");

    // ✅ Validation: all fields must be filled
    if (!cashFees || !expenses || !closingCash) {
      setErr("Please fill in all fields before closing the day.");
      return;
    }

    const confirmAction = confirm(
      "Are you sure you want to Close Account For the day?"
    );
    if (!confirmAction) return;

    try {
      const data = await closeDay({
        date,
        cash_fees_total: Number(cashFees),
        expenses_total: Number(expenses),
        closing_balance: Number(closingCash),
      });
      setNextOpening(data.nextOpeningBalance);
    } catch {
      setErr("Failed to close day");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      <h2 className="text-xl font-semibold mb-6">Daily Ledger Workflow</h2>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-1.5 text-sm"
          required
        />
      </div>

      {err && <p className="text-red-600 mb-4">{err}</p>}

      <button
        onClick={handleStartDay}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 cursor-pointer"
      >
        Open Cash
      </button>

      {openingBalance !== null && (
        <p className="mb-4">Opening Balance: ₹{openingBalance}</p>
      )}

      <div className="space-y-3">
        <input
          type="number"
          placeholder="Cash Fees Collected"
          value={cashFees}
          onChange={(e) => setCashFees(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Expenses Incurred"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Closing Cash Removed"
          value={closingCash}
          onChange={(e) => setClosingCash(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button
          onClick={handleCloseDay}
          className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Close Day
        </button>
      </div>

      {nextOpening !== null && (
        <p className="mt-6 font-semibold">
          Tomorrow’s Opening Balance: ₹{nextOpening}
        </p>
      )}
    </div>
  );
};

export default Ledger;
