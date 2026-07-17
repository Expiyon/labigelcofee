"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminApi, publicApi } from '@/lib/api';
import { AuthResponse, LoginRequest, User, SiteSettings } from '@/types';
import { getErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  settings: SiteSettings | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Apply colors dynamically
  const applyColors = (primaryHex: string) => {
    try {
      const hex = primaryHex || '#E31E24';
      document.documentElement.style.setProperty('--color-primary', hex);
      document.documentElement.style.setProperty('--color-border-hover', hex);
      document.documentElement.style.setProperty('--color-accent-diamond', hex);
      document.documentElement.style.setProperty('--color-accent-heart', hex);
      
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        document.documentElement.style.setProperty('--color-primary-glow', `rgba(${r}, ${g}, ${b}, 0.15)`);
        document.documentElement.style.setProperty(
          '--color-primary-dark',
          `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`
        );
        document.documentElement.style.setProperty(
          '--color-primary-light',
          `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`
        );
      }
    } catch (e) {
      console.error('Error applying custom colors', e);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Fetch site settings
      try {
        const settingsRes = await publicApi.getSettings();
        if (settingsRes.success && settingsRes.data) {
          setSettings(settingsRes.data);
          if (settingsRes.data.primaryColor) {
            applyColors(settingsRes.data.primaryColor);
          }
        }
      } catch (error) {
        console.error("Site ayarları yüklenemedi", error);
      }

      // 2. Fetch user auth info
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await adminApi.getMe();
          if (res.success) {
            setUser({ email: res.data.email, fullName: res.data.fullName, role: res.data.role });
          }
        } catch {
          console.error("Token geçersiz veya süresi dolmuş");
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const res = await adminApi.login(data);
      if (res.success) {
        const authData: AuthResponse = res.data;
        localStorage.setItem('token', authData.token);
        setUser({ email: authData.email, fullName: authData.fullName, role: authData.role });
        toast.success(res.message || 'Giriş başarılı');
        
        // Refresh site settings on login to sync colors
        try {
          const settingsRes = await publicApi.getSettings();
          if (settingsRes.success && settingsRes.data) {
            setSettings(settingsRes.data);
            if (settingsRes.data.primaryColor) {
              applyColors(settingsRes.data.primaryColor);
            }
          }
        } catch {}
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Giriş başarısız'));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Çıkış yapıldı');
    window.location.href = '/admin/giris';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, settings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
