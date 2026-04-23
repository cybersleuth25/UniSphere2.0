import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { BASE_URL } from '../constants/Config';

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      let token, storedUser;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken');
        storedUser = localStorage.getItem('userInfo');
      } else {
        token = await SecureStore.getItemAsync('userToken');
        storedUser = await SecureStore.getItemAsync('userInfo');
      }

      if (token) {
        setUserToken(token);
        if (storedUser) {
          try {
            setUserInfo(JSON.parse(storedUser));
          } catch(err) {}
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        // Explicitly set token to null when no token exists
        setUserToken(null);
      }
    } catch (e) {
      console.log('Failed to load token', e);
      setUserToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/doLogin`, null, {
        params: { username: email.trim(), password: password }
      });

      if (response.data.success) {
        const token = response.data.token;
        const user = response.data.user;
        setUserToken(token);
        setUserInfo(user);
        
        if (Platform.OS === 'web') {
          localStorage.setItem('userToken', token);
          localStorage.setItem('userInfo', JSON.stringify(user));
        } else {
          await SecureStore.setItemAsync('userToken', token);
          await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (e) {
      console.error(e);
      // Show the actual server response so we can debug
      const serverMsg = e.response?.data?.message || e.message;
      const status = e.response?.status || 'no status';
      alert(`Error ${status}: ${serverMsg}`);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    if (Platform.OS === 'web') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
    } else {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userInfo');
    }
    delete axios.defaults.headers.common['Authorization'];
    setIsLoading(false);
  };

  // Allow signup to directly set token/user state without re-authenticating
  const setSession = async (token, user) => {
    setUserToken(token);
    setUserInfo(user);

    if (Platform.OS === 'web') {
      localStorage.setItem('userToken', token);
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  return (
    <AuthContext.Provider value={{ login, logout, setSession, isLoading, userToken, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
