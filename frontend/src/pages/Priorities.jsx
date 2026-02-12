import { useEffect, useState } from "react";
import { togglePinExpense } from "../api/priorities";
import api from "../api/client";

export default function PrioritiesPage() {
  const [pinnedExpenses, setPinnedExpenses] = useState([]);
  const [err, setErr] = useState("");

  const loadPinned = async () => {
    try {
      const res = await api.get("/expenses/priorities");
      setPinnedExpenses(res.data);
    } catch {
      setErr("Failed to load pinned expenses");
    }
  };

  useEffect(() => {
    loadPinned();
  }, []);

  const handleTogglePin = async (id) => {
    const verifyTempPass = window.prompt("Enter your password");

    if (!verifyTempPass) return;

    try {
      if (verifyTempPass !== "kaizeno") {
        alert("Incorrect password");
        return;
      }

      const updated = await togglePinExpense(id);

      setPinnedExpenses((prev) => {
        const exists = prev.find((e) => e.id === id);

        if (exists) {
          // unpin → remove
          return prev.filter((e) => e.id !== id);
        } else {
          // pin → add
          return [...prev, updated];
        }
      });
    } catch (err) {
      setErr("Failed to toggle pin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      {/* Header */}
      <div className="mb-6 border-b pb-3">
        <h2 className="text-2xl font-semibold text-gray-800">📌 Priorities</h2>
        <p className="text-sm text-gray-500">
          Your pinned expenses for quick access
        </p>
      </div>

      {err && <p className="text-red-600 text-sm font-medium mb-4">{err}</p>}

      {/* Pinned Expenses Table */}
      <div className="overflow-x-auto border border-gray-300 bg-white rounded-lg shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-3 py-2 text-left">Reason</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pinnedExpenses.map((e) => (
              <tr key={e.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{e.reason}</td>
                <td className="px-3 py-2 text-right">
                  ₹ {Number(e.expense_amount).toFixed(2)}
                </td>
                <td className="px-3 py-2">{e.date}</td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => handleTogglePin(e.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    Unpin
                  </button>
                </td>
              </tr>
            ))}
            {pinnedExpenses.length === 0 && (
              <tr>
                <td colSpan="4" className="px-3 py-4 text-center text-gray-500">
                  No pinned expenses yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
