import api from './client';
export const getTodaySummary = async () => (await api.get('/dashboard/today')).data;
