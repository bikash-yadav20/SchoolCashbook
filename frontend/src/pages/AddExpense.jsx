import { useState } from "react";
import { createExpense } from "../api/expenses";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await createExpense({
        expense_amount: Number(amount),
        reason,
        date,
      });
      setMsg("Expense recorded");
      setAmount("");
      setReason("");
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to save");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      {/* Page Header */}
      <div className="mb-6 border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800">Expense Entry</h2>
        <p className="text-sm text-gray-500">Record daily cash expenses</p>
      </div>

      {/* Form Section */}
      <form
        onSubmit={onSubmit}
        className="bg-white border border-gray-200 rounded-md p-6 max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Amount (Cash)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Reason */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Details / Reason
            </label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Stationery purchase, Advance salary, Bills"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium rounded"
          >
            Save Expense
          </button>

          {msg && (
            <span className="text-green-600 text-sm font-medium">{msg}</span>
          )}
          {err && (
            <span className="text-red-600 text-sm font-medium">{err}</span>
          )}
        </div>
      </form>
    </div>
  );
}
