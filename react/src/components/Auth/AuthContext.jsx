import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { fetchProfile } from '../../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [currentMember, setCurrentMember] = useState(null);

  useEffect(() => {
    try {
      const hasWindow = typeof window !== 'undefined';
      const storedToken = hasWindow && window.localStorage ? window.localStorage.getItem('authToken') : null;
      const storedMember = hasWindow && window.localStorage ? window.localStorage.getItem('authMember') : null;

      if (storedToken) {
        setAuthToken(storedToken);
      }

      if (storedMember) {
        try {
          const parsedMember = JSON.parse(storedMember);
          setCurrentMember(parsedMember);
        } catch (error) {
          setCurrentMember(null);
        }
      }
    } catch (error) {
      setAuthToken(null);
      setCurrentMember(null);
    }
  }, []);

  const login = useCallback((authResponse) => {
    if (!authResponse) {
      return;
    }

    const { member, token } = authResponse;

    try {
      const hasWindow = typeof window !== 'undefined';
      if (hasWindow && window.localStorage) {
        if (token) {
          window.localStorage.setItem('authToken', token);
        }
        if (member) {
          window.localStorage.setItem('authMember', JSON.stringify(member));
        }
      }
    } catch (error) {
      // If localStorage is not available, continue without persistent storage
    }

    setAuthToken(token || null);
    setCurrentMember(member || null);
  }, []);

  const logout = useCallback(() => {
    try {
      const hasWindow = typeof window !== 'undefined';
      if (hasWindow && window.localStorage) {
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('authMember');
      }
    } catch (error) {
      // Ignore storage errors
    }

    setAuthToken(null);
    setCurrentMember(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!authToken) {
      return null;
    }

    try {
      const freshMember = await fetchProfile();
      setCurrentMember(freshMember);

      try {
        const hasWindow = typeof window !== 'undefined';
        if (hasWindow && window.localStorage) {
          window.localStorage.setItem('authMember', JSON.stringify(freshMember));
        }
      } catch (error) {
        // Ignore storage errors
      }

      return freshMember;
    } catch (error) {
      return null;
    }
  }, [authToken]);

  const value = {
    authToken,
    currentMember,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
