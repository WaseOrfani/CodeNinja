import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const adminData = await api.getMe();
      setAdmin(adminData);
    } catch (error) {
      localStorage.removeItem('admin_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.login(email, password);
    await checkAuth();
    return response;
  };

  const logout = () => {
    api.logout();
    setAdmin(null);
  };

  const getToken = () => localStorage.getItem('admin_token');

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
