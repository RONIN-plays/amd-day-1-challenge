import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nutrismart_token');
    if (token) {
      api.get('/auth/me')
        .then(({ data }) => setUser(data.user))
        .catch(() => { localStorage.removeItem('nutrismart_token'); localStorage.removeItem('nutrismart_refresh'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('nutrismart_token', data.token);
    localStorage.setItem('nutrismart_refresh', data.refreshToken);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, health_goal) => {
    const { data } = await api.post('/auth/register', { name, email, password, health_goal });
    localStorage.setItem('nutrismart_token', data.token);
    localStorage.setItem('nutrismart_refresh', data.refreshToken);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('nutrismart_token');
    localStorage.removeItem('nutrismart_refresh');
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
