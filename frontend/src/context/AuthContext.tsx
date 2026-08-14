import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAccessToken, setLogoutCallback } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
  };

  useEffect(() => {
    setLogoutCallback(logout);
    
    const initializeAuth = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await api('/auth/refresh', {
            method: 'POST',
            skipAuth: true,
            body: JSON.stringify({ refreshToken }),
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setAccessToken(data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const syncGuestProgress = async () => {
    const stored = localStorage.getItem('guest_problems_progress');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      const problemIds = Object.keys(parsed);
      if (problemIds.length === 0) return;

      for (const id of problemIds) {
        const item = parsed[id];
        try {
          await api(`/progress/${id}`, {
            method: 'POST',
            body: JSON.stringify({
              status: item.status,
              confidenceLevel: item.confidenceLevel,
              dryRunNotes: item.dryRunNotes,
              whyNotes: item.whyNotes,
              freeNotes: item.freeNotes,
            }),
          });
        } catch (e) {
          console.error(`Failed to sync guest progress for problem ${id}:`, e);
        }
      }
      localStorage.removeItem('guest_problems_progress');
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error syncing guest progress:', e);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api('/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    // Sync any sandbox progress saved in localStorage
    await syncGuestProgress();
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await api('/auth/signup', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to signup');
    }

    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    // Sync any sandbox progress saved in localStorage
    await syncGuestProgress();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
