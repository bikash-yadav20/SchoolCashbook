import api from './client';

export const createFee = async (payload) => (await api.post('/fees', payload)).data;
export const getFeesByDate = async (date) => (await api.get('/fees', { params: { date } })).data;
export const getFeeTotalsByDate = async (date) => (await api.get('/fees/totals', { params: { date } })).data;
