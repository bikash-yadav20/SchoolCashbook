import { useEffect, useState } from "react";
import { getTodaySummary } from "../api/dashboard";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    getTodaySummary()
      .then(setSummary)
      .catch(() => setErr("Failed to load summary"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      {/* Header */}
      <div className="mb-6 border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500">Today’s cashbook summary</p>
      </div>

      {err && <p className="text-red-600 text-sm font-medium mb-4">{err}</p>}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {/* Date */}
          <div className="bg-white border border-gray-300 px-4 py-3">
            <p className="text-sm text-gray-500">Date</p>
            <p className="text-base font-semibold text-gray-800">
              {summary.date}
            </p>
          </div>

          {/* Total Fees */}
          <div className="bg-white border border-gray-300 px-4 py-3">
            <p className="text-sm text-gray-500">Today’s Total Fees</p>
            <p className="text-base font-semibold text-gray-800">
              ₹ {summary.today_total_fees}
            </p>
          </div>

          {/* Cash Received */}
          <div className="bg-white border border-gray-300 px-4 py-3">
            <p className="text-sm text-gray-500">Cash Received</p>
            <p className="text-base font-semibold text-gray-800">
              ₹ {summary.today_cash}
            </p>
          </div>

          {/* Online Received */}
          <div className="bg-white border border-gray-300 px-4 py-3">
            <p className="text-sm text-gray-500">Online Received</p>
            <p className="text-base font-semibold text-gray-800">
              ₹ {summary.today_online}
            </p>
          </div>

          {/* Expenses */}
          <div className="bg-white border border-gray-300 px-4 py-3">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-base font-semibold text-gray-800">
              ₹ {summary.today_total_expenses}
            </p>
          </div>

          {/* Final Cash */}
          <div className="bg-green-50 border border-green-300 px-4 py-3">
            <p className="text-sm text-green-700 font-medium">
              FINAL CASH IN CASHBOX
            </p>
            <p className="text-lg font-bold text-green-800">
              ₹ {summary.today_final_cash_in_cashbox}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
