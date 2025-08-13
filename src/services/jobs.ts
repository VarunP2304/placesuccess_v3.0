import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });

export const getJobs = async () => {
  const res = await api.get('/employer/jobs');
  return res.data;
};

export const createJob = async (payload: any) => {
  const res = await api.post('/employer/jobs', payload);
  return res.data;
};

export const updateJob = async (id: number, payload: any) => {
  const res = await api.put(`/employer/jobs/${id}`, payload);
  return res.data;
};

export const closeJob = async (id: number) => {
  const res = await api.post(`/employer/jobs/${id}/close`);
  return res.data;
};

