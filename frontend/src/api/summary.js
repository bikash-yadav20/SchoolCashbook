import api from "./client";
//get total fees data for selected range
export const getSummeryByDateRange = async (startDate, endDate) =>
  (await api.get("/summary/range-total", { params: { startDate, endDate } }))
    .data;

// get overall fees data

export const getOverallSum = async () =>
  (await api.get("summary/overall-total")).data;

// get overall online received cash_amount
export const overallTotalOnline = async () =>
  (await api.get("summary/overall-online")).data;

// get overall cash received amount

export const overallTotalCash = async () =>
  (await api.get("summary/overall-cash")).data;

//get ranged expense totals
export const getExpenseSummaryByRange = async (startDate, endDate) =>
  (await api.get("/summary/range-expense", { params: { startDate, endDate } }))
    .data;

// get overall expense
export const overallTotalExpense = async () =>
  (await api.get("summary/overall-expense")).data;
