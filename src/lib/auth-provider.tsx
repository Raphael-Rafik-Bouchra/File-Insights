'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { webSocketService } from '@/lib/websocket';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  setAuth: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load auth state from localStorage on mount
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && typeof parsedUser === 'object') {
            setToken(storedToken);
            setUser(parsedUser);
          }
        } catch (e) {
          // Invalid JSON in localStorage, clear it
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    } catch (e) {
      // Handle case where localStorage is not available
      console.error('Failed to access localStorage:', e);
    }
  }, []);

  const setAuth = (newToken: string, newUser: User) => {
    try {
      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Store in cookies
      document.cookie = `token=${newToken}; path=/`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify(newUser))}; path=/`;
      
      // Update state
      setToken(newToken);
      setUser(newUser);
      
      // Connect WebSocket
      webSocketService.connect(newToken);
    } catch (error) {
      console.error('Error setting auth:', error);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Clear state
    setToken(null);
    setUser(null);
    
    // Disconnect WebSocket
    webSocketService.disconnect();
    
    // Redirect to login
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
