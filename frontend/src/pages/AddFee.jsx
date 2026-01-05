import { useState, useMemo } from "react";
import { createFee } from "../api/fees";

export default function AddFee() {
  const [total, setTotal] = useState("");
  const [online, setOnline] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const cash = useMemo(() => {
    const t = parseFloat(total || 0);
    const o = parseFloat(online || 0);
    return t - o >= 0 ? (t - o).toFixed(2) : "0.00";
  }, [total, online]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await createFee({
        total_amount: Number(total),
        online_amount: Number(online || 0),
        reason,
        date,
      });
      setMsg("Fee recorded");
      setTotal("");
      setOnline("");
      setReason("");
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to save");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      {/* Header */}
      <div className="mb-6 border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Fee Collection Entry
        </h2>
        <p className="text-sm text-gray-500">
          Record student fee payments (cash and online)
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="bg-white border border-gray-200 rounded-md p-6 max-w-5xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount Received
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Online Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Online Payment (GPay / UPI)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={online}
              onChange={(e) => setOnline(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
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
              Reason / Description
            </label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Monthly Fees, Uniform Fees, Admit"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Cash Auto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cash Amount (Auto Calculated)
            </label>
            <input
              value={cash}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 px-3 py-2 text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm font-medium rounded"
          >
            Save Fee Entry
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
