import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ id: '1', name: 'Admin PolBel', role: 'admin' });
const [isAuthenticated, setIsAuthenticated] = useState(true); // Zmień na true
const [isLoadingAuth, setIsLoadingAuth] = useState(false); // Od razu false
const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false); // Od razu false
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: 'demo', public_settings: {} });

  // Symulacja ładowania (1s)
  useEffect(() => {
    
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    // Placeholder - przekierowanie na stronę główną
    window.location.href = '/';
  };

  const checkAppState = () => {
    // Mock - nic nie robi
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
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
