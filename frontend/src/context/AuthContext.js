import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('oria-admin-token');
    if (token) {
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmin(response.data);
    } catch (error) {
      localStorage.removeItem('oria-admin-token');
      localStorage.removeItem('oria-admin-refresh');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API}/admin/login`, { email, password });
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('oria-admin-token', access_token);
    localStorage.setItem('oria-admin-refresh', refresh_token);
    await checkAuth(access_token);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('oria-admin-token');
    localStorage.removeItem('oria-admin-refresh');
    setAdmin(null);
  };

  const getToken = () => localStorage.getItem('oria-admin-token');

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
