import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import NavigationTracker from '@/lib/NavigationTracker';
import { pagesConfig } from './pages.config';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { CartProvider } from '@/components/shop/useCart';
import { base44 } from '@/api/base44Client';

// IMPORT TWOJEJ STRONY LOGOWANIA
// Upewnij się, że stworzyłeś plik src/pages/LoginPage.jsx
import LoginPage from './pages/LoginPage'; 

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

/**
 * Komponent ochronny - sprawdza czy w localStorage jest token
 */
const AdminGuard = ({ children }) => {
  const isAuthenticated = base44.auth.isAuthenticated();
  
  if (!isAuthenticated) {
    // Jeśli brak autoryzacji, przekieruj do /login
    return <Navigate to="/login" replace />;
  }
  return children;
};

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Ekran ładowania przy sprawdzaniu sesji
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Obsługa błędów autoryzacji systemu bazowego
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* 1. TRASA LOGOWANIA - Poza layoutem i poza automatycznym mapowaniem */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. STRONA GŁÓWNA */}
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />

      {/* 3. DYNAMICZNE MAPOWANIE STRON Z PAGES.CONFIG */}
      {Object.entries(Pages).map(([path, Page]) => {
        // Sprawdzamy czy ścieżka to Admin, admin-orders itp. (ignorujemy wielkość liter)
        const isAdminPage = path.toLowerCase().startsWith('admin');

        return (
          <Route
            key={path}
            path={`/${path}`}
            element={
              isAdminPage ? (
                <AdminGuard>
                  <LayoutWrapper currentPageName={path}>
                    <Page />
                  </LayoutWrapper>
                </AdminGuard>
              ) : (
                <LayoutWrapper currentPageName={path}>
                  <Page />
                </LayoutWrapper>
              )
            }
          />
        );
      })}
      
      {/* 4. STRONA 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <CartProvider>
          <Router>
            <NavigationTracker />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;