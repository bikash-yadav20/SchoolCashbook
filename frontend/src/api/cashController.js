import api from "./client";

// Start the day (opening balance)
export const startDay = async (payload = {}) =>
  (await api.post("/ledger/opening", payload)).data;

// Close the day (closing balance + next opening)
export const closeDay = async (payload) =>
  (await api.post("/ledger/closing", payload)).data;

// Preview tomorrow’s opening balance
export const openingBalance = async (date) =>
  (await api.get("/ledger/opening-balance", { params: { date } })).data;
