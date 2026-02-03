// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export const ProtectedRoute = ({ children }) => {
  if (!base44.auth.isAuthenticated()) {
    // Jeśli nie ma tokena, wyrzuć na stronę logowania
    return <Navigate to="/login" replace />;
  }
  return children;
};