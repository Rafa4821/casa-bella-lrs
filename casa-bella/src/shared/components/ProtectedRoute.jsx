import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from './ui';
import { logger } from '../utils/logger';

export const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen message="Verificando acceso..." />;
  }

  if (!user || !isAdmin) {
    logger.warn('ProtectedRoute: Unauthorized access attempt', { 
      path: location.pathname,
      hasUser: !!user,
      isAdmin 
    });
    
    // Redirigir a login
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  logger.info('ProtectedRoute: Access granted', { path: location.pathname });
  return children;
};
