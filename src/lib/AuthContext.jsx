import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: 'demo', public_settings: {} });

  // Symulacja ładowania (1s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);
      setIsAuthenticated(false); // Statycznie: nikt nie jest zalogowany
    }, 1000);
    return () => clearTimeout(timer);
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
