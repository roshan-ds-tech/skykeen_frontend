import axios from 'axios';

// Configure axios to use credentials for session-based authentication
axios.defaults.withCredentials = true;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/admin/login/', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/api/admin/logout/');
  return response.data;
};

export const checkAuth = async () => {
  const response = await api.get('/api/admin/check/');
  return response.data;
};

export const getRegistrations = async () => {
  const response = await api.get('/api/registrations/');
  return response.data;
};

export const getRegistration = async (id: number) => {
  const response = await api.get(`/api/registrations/${id}/`);
  return response.data;
};

export const verifyPayment = async (id: number, payment_verified: boolean, notes?: string) => {
  const response = await api.patch(`/api/registrations/${id}/verify/`, {
    payment_verified,
    notes,
  });
  return response.data;
};

export default api;

