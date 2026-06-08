import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);
const SHARED_CUSTOMER_EMAIL = 'customer@surpriseventure.com';

const getGuestCredentials = () => {
  let email = localStorage.getItem('sv_guest_email');
  let password = localStorage.getItem('sv_guest_password');
  let name = localStorage.getItem('sv_guest_name');

  if (!email || !password || !name) {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    email = `guest-${id}@razsurprisehub.local`;
    password = `guest-${id}`.slice(0, 64);
    name = 'Guest Customer';
    localStorage.setItem('sv_guest_email', email);
    localStorage.setItem('sv_guest_password', password);
    localStorage.setItem('sv_guest_name', name);
  }

  return { email, password, name, phone: '' };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    let token = localStorage.getItem('sv_token');
    if (token) {
      try {
        const { data } = await api.get('/auth/me');
        if (data.user?.email === SHARED_CUSTOMER_EMAIL) {
          localStorage.removeItem('sv_token');
        } else {
          setUser(data.user);
          setLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem('sv_token');
      }
    }

    const guest = getGuestCredentials();

    try {
      const { data } = await api.post('/auth/login', {
        email: guest.email,
        password: guest.password,
      });
      localStorage.setItem('sv_token', data.token);
      setUser(data.user);
    } catch (err) {
      try {
        const { data } = await api.post('/auth/register', guest);
        localStorage.setItem('sv_token', data.token);
        setUser(data.user);
      } catch (regErr) {
        console.error('Guest login and registration failed:', regErr);
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
