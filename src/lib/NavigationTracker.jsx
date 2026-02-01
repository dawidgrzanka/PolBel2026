import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { pagesConfig } from '@/pages.config';

export default function NavigationTracker() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];

  // Usunięto base44.appLogs.logUserInApp() - statyczna strona bez analityki
  useEffect(() => {
    // Tutaj możesz dodać Google Analytics / inne tracking, np.:
    // gtag('event', 'page_view', { page_path: location.pathname });
  }, [location.pathname]);

  return null;
}
