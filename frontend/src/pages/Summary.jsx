import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import {
  getOverallSum,
  overallTotalOnline,
  overallTotalCash,
  overallTotalExpense,
  getSummeryByDateRange,
  getExpenseSummaryByRange,
} from "../api/summary";

const Summary = () => {
  const [overall, setOverall] = useState({
    fees: 0,
    online: 0,
    cash: 0,
    expenses: 0,
  });

  const [range, setRange] = useState({
    startDate: "",
    endDate: "",
    fees: 0,
    expenses: 0,
  });

  // Helper to format YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Fetch overall totals once on mount
  useEffect(() => {
    const fetchOverall = async () => {
      try {
        const fees = await getOverallSum();
        const online = await overallTotalOnline();
        const cash = await overallTotalCash();
        const expenses = await overallTotalExpense();

        setOverall({
          fees: fees.total,
          online: online.onlineTotal,
          cash: cash.cashTotal,
          expenses: expenses.expenseTotal,
        });
      } catch (err) {
        console.error(err);
      }
    };

    // Default last 30 days
    const today = new Date();
    const past30 = new Date();
    past30.setDate(today.getDate() - 30);

    setRange((prev) => ({
      ...prev,
      startDate: formatDate(past30),
      endDate: formatDate(today),
    }));

    fetchOverall();
  }, []);

  // Fetch range totals whenever start/end dates change
  useEffect(() => {
    const fetchRange = async () => {
      if (!range.startDate || !range.endDate) return;
      try {
        const fees = await getSummeryByDateRange(
          range.startDate,
          range.endDate
        );
        const expenses = await getExpenseSummaryByRange(
          range.startDate,
          range.endDate
        );
        setRange((prev) => ({
          ...prev,
          fees: fees.total,
          expenses: expenses.total,
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRange();
  }, [range.startDate, range.endDate]);

  // Chart data for overall totals
  const overallChartData = {
    labels: ["Total Amounts", "Online Amounts", "Cash Amounts", "Expenses"],
    datasets: [
      {
        label: "Overall Summary",
        data: [overall.fees, overall.online, overall.cash, overall.expenses],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"],
      },
    ],
  };

  // Chart data for last 30 days (or selected range)
  const rangeChartData = {
    labels: ["Amount(online & offline)", "Expenses (Range)"],
    datasets: [
      {
        label: `Summary (${range.startDate} → ${range.endDate})`,
        data: [range.fees, range.expenses],
        backgroundColor: ["#8BC34A", "#E91E63"],
      },
    ],
  };

  const options = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: true } },
  };

  return (
    <div style={{ width: "800px", margin: "auto" }}>
      <h2>School Cashbook Dashboard</h2>

      {/* Overall bar chart */}
      <Bar data={overallChartData} options={options} />

      {/* Range bar chart */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Summary by Date Range (default: last 30 days)</h3>
        <form style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="date"
            value={range.startDate}
            onChange={(e) =>
              setRange((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
          <input
            type="date"
            value={range.endDate}
            onChange={(e) =>
              setRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </form>

        <Bar data={rangeChartData} options={options} />
      </div>
    </div>
  );
};

export default Summary;
