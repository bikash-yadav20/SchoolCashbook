import api from "./client";

export const ledgerXlsx = async (date) => {
  const response = await api.get("/excel/daily-ledger", {
    params: { date },
    responseType: "blob",
  });
  return response;
};
