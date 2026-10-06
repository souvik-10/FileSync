import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { getMeApi, loginApi, registerApi } from '../services/api';
import { initSocket, disconnectSocket } from '../services/socket';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('filesync_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getMeApi();
          setUser(res.data);
          initSocket(res.data._id);
        } catch (error) {
          console.error('[AuthContext] Session check failed:', error);
          localStorage.removeItem('filesync_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await loginApi(credentials);
    const authData: AuthResponse = res.data;
    localStorage.setItem('filesync_token', authData.token);
    setToken(authData.token);
    setUser({
      _id: authData._id,
      name: authData.name,
      email: authData.email,
      avatar: authData.avatar,
    });
    initSocket(authData._id);
  };

  const register = async (details: { name: string; email: string; password: string }) => {
    const res = await registerApi(details);
    const authData: AuthResponse = res.data;
    localStorage.setItem('filesync_token', authData.token);
    setToken(authData.token);
    setUser({
      _id: authData._id,
      name: authData.name,
      email: authData.email,
      avatar: authData.avatar,
    });
    initSocket(authData._id);
  };

  const logout = () => {
    localStorage.removeItem('filesync_token');
    setToken(null);
    setUser(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
