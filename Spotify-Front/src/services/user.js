import API from './api';

export const getProfile = async () => {
  const res = await API.get('/user/profile');
  return res.data;
};

export const updateProfile = async (updatedData) => {
  const res = await API.put('/user/profile', updatedData);
  return res.data;
};

export const deleteAccount = async () => {
  const res = await API.delete('/user/profile');
  return res.data;
};
