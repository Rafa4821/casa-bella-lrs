import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getCurrentUser } from '../services/authService';
import { logger } from '../utils/logger';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    logger.info('AuthProvider: Setting up auth listener');
    
    const unsubscribe = onAuthStateChange(async (authUser) => {
      if (authUser) {
        try {
          // Verificar si es admin usando el servicio
          const adminUser = await getCurrentUser();
          if (adminUser) {
            setUser(authUser);
            setIsAdmin(true);
            logger.info('AuthProvider: Admin user authenticated', { uid: authUser.uid });
          } else {
            // Usuario autenticado pero no es admin
            setUser(null);
            setIsAdmin(false);
            logger.warn('AuthProvider: Authenticated but not admin', { uid: authUser.uid });
          }
        } catch (error) {
          logger.error('AuthProvider: Error verifying admin', error);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        logger.info('AuthProvider: User logged out');
      }
      setLoading(false);
    });

    return () => {
      logger.info('AuthProvider: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
