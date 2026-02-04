// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { polbelApi} from '@/api/apiClient';

export const ProtectedRoute = ({ children }) => {
  if (!polbelApi.auth.isAuthenticated()) {
    // Jeśli nie ma tokena, wyrzuć na stronę logowania
    return <Navigate to="/login" replace />;
  }
  return children;
};