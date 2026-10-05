import React, { createContext, useState, useEffect } from 'react';
import API from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('royal_pizza_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('royal_pizza_token');
    if (token) {
      API.get('/auth/profile')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('royal_pizza_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('royal_pizza_token', token);
    localStorage.setItem('royal_pizza_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const adminLogin = async (email, password) => {
    const res = await API.post('/auth/admin/login', { email, password });
    const { token, ...adminData } = res.data;
    localStorage.setItem('royal_pizza_token', token);
    localStorage.setItem('royal_pizza_user', JSON.stringify(adminData));
    setUser(adminData);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    return res.data;
  };

  const verifyEmail = async (email, otp) => {
    const res = await API.post('/auth/verify-email', { email, otp });
    const { token, ...userData } = res.data;
    localStorage.setItem('royal_pizza_token', token);
    localStorage.setItem('royal_pizza_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const updateProfile = async (profileData) => {
    const res = await API.put('/auth/profile', profileData);
    const { token, ...userData } = res.data;
    if (token) {
      localStorage.setItem('royal_pizza_token', token);
    }
    localStorage.setItem('royal_pizza_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('royal_pizza_token');
    localStorage.removeItem('royal_pizza_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        adminLogin,
        register,
        verifyEmail,
        updateProfile,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
