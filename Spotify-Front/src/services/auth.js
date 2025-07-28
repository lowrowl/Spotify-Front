import API from './api';

export const register = async (userData) => {
  const res = await API.post('/auth/register', userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await API.post('/auth/login', credentials);
  return res.data;
};
