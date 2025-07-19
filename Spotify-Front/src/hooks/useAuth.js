import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const t = await AsyncStorage.getItem('token');
      setToken(t);
    };
    loadToken();
  }, []);

  return { token, isLoggedIn: !!token };
};
