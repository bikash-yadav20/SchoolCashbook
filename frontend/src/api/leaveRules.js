import api from "./client";

export const leaveTypes = async () =>
  (await api.get("/leave-rules/leave-types")).data;
export const createLeaveRules = async (payload) =>
  (await api.post("/leave-rules/create-leave", payload)).data;
export const getLeaveRules = async () =>
  (await api.get("/leave-rules/leave-rules")).data;
