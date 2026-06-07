import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    let token = localStorage.getItem('sv_token');
    if (token) {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem('sv_token');
      }
    }

    try {
      const { data } = await api.post('/auth/login', {
        email: 'customer@surpriseventure.com',
        password: 'customer123456',
      });
      localStorage.setItem('sv_token', data.token);
      setUser(data.user);
    } catch (err) {
      try {
        const { data } = await api.post('/auth/register', {
          name: 'Customer',
          email: 'customer@surpriseventure.com',
          password: 'customer123456',
          phone: '1234567890',
        });
        localStorage.setItem('sv_token', data.token);
        setUser(data.user);
      } catch (regErr) {
        console.error('Auto-login and auto-register failed:', regErr);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('sv_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('sv_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('sv_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
