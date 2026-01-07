import { useEffect, useState } from "react";
import { getFeesByDate, getFeeTotalsByDate } from "../api/fees";
import { getExpensesByDate, getExpenseTotalsByDate } from "../api/expenses";
import { openingBalance } from "../api/cashController";

export default function Report() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [fees, setFees] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState(null);
  const [err, setErr] = useState("");
  const [closing, setClosing] = useState();
  const [cashout, setCashout] = useState();

  const load = async (d) => {
    setErr("");
    try {
      const [feesList, feeTotals, expenseList, expenseTotals, opening] =
        await Promise.all([
          getFeesByDate(d),
          getFeeTotalsByDate(d),
          getExpensesByDate(d),
          getExpenseTotalsByDate(d),
          openingBalance(d),
        ]);
      setFees(feesList);
      setExpenses(expenseList);
      setCashout(Number(opening.closing_balance));
      setClosing(opening.next_opening_balance);
      setTotals({
        date: d,
        total_fees: feeTotals.total_fees,
        total_cash_received: feeTotals.total_cash,
        total_online_received: feeTotals.total_online,
        total_expenses: expenseTotals.total_expenses,
        openingBlnc: Number(opening.opening_balance),
        final_cash_in_cashbox:
          Number(opening.opening_balance) +
          Number(feeTotals.total_cash) -
          Number(expenseTotals.total_expenses),
      });
    } catch {
      setErr("Failed to load report");
    }
  };

  useEffect(() => {
    load(date);
  }, []);

  const onChangeDate = (e) => {
    const d = e.target.value;
    setDate(d);
    load(d);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      {/* Header */}
      <div className="mb-6 border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Date-wise Cashbook Report
        </h2>
        <p className="text-sm text-gray-500">Fees, expenses and cash balance</p>
      </div>

      {/* Date Selector */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Select Date:
        </label>
        <input
          type="date"
          value={date}
          onChange={onChangeDate}
          className="border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600"
        />
      </div>

      {err && <p className="text-red-600 text-sm font-medium mb-4">{err}</p>}

      {/* Fees Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Fees Collection
        </h3>
        <div className="overflow-x-auto border border-gray-300 bg-white">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-3 py-2 text-left">Reason</th>
                <th className="px-3 py-2 text-right">Cash</th>
                <th className="px-3 py-2 text-right">Online</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="px-3 py-2">{f.reason}</td>
                  <td className="px-3 py-2 text-right">
                    {Number(f.cash_amount).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {Number(f.online_amount).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {Number(f.total_amount).toFixed(2)}
                  </td>
                  <td className="px-3 py-2">{f.date}</td>
                </tr>
              ))}
              {fees.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-3 py-4 text-center text-gray-500"
                  >
                    No fees recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Expenses</h3>
        <div className="overflow-x-auto border border-gray-300 bg-white">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-3 py-2 text-left">Reason</th>
                <th className="px-3 py-2 text-right">Cash</th>
                <th className="px-3 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-3 py-2">{e.reason}</td>
                  <td className="px-3 py-2 text-right">
                    {Number(e.expense_amount).toFixed(2)}
                  </td>
                  <td className="px-3 py-2">{e.date}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-3 py-4 text-center text-gray-500"
                  >
                    No expenses recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      {totals && (
        <div className="border border-gray-300 bg-white p-5 max-w-xl">
          <p className="text-sm">
            <strong>Date:</strong> {totals.date}
          </p>
          <p className="text-sm">
            <strong>Opening Cash:</strong> {totals.openingBlnc}
          </p>
          <p className="text-sm">
            <strong>Total Fees Received:</strong> ₹ {totals.total_fees}
          </p>
          <p className="text-sm">
            <strong>Total Cash Received:</strong> ₹{" "}
            {totals.total_cash_received + totals.openingBlnc}{" "}
            <strong className="text-gray-500 font-bold">
              (Includes opening balance)
            </strong>
          </p>
          <p className="text-sm">
            <strong>Total Online Received:</strong> ₹{" "}
            {totals.total_online_received}
          </p>
          <p className="text-sm">
            <strong>Total Expenses:</strong> ₹ {totals.total_expenses}
          </p>

          <div className="mt-3 inline-block bg-green-100 text-green-800 px-4 py-2 font-semibold text-sm">
            FINAL CASH IN CASHBOX: ₹ {totals.final_cash_in_cashbox.toFixed(2)}
            <strong className="text-gray-500 font-bold">
              (includes opening balance)
            </strong>
          </div>
          <div className="flex flex-col">
            <div className="mt-3 inline-block bg-blue-100 text-blue-800 px-4 py-2 font-semibold text-sm">
              CASH OUT:{" "}
              {cashout === 0 ? "The account is not yet closed" : `₹ ${cashout}`}
            </div>

            <div className="mt-3 inline-block bg-red-100 text-red-800 px-4 py-2 font-semibold text-sm">
              FINAL CASH AFTER CLOSING: ₹ {closing}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
