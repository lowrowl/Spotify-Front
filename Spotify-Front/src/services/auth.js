import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/users/login', { email, password });
  const { token, user } = res.data;
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const register = async (username, email, password) => {
  const res = await api.post('/users/register', { username, email, password });
  return res.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};
