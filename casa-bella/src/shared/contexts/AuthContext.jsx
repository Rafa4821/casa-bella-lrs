import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getCurrentUser, signInAdmin, signOutAdmin } from '../services/authService';
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

  const login = async (email, password) => {
    setLoading(true);
    try {
      logger.info('AuthProvider: Attempting login', { email });
      const adminUser = await signInAdmin(email, password);
      setUser(adminUser);
      setIsAdmin(true);
      logger.info('AuthProvider: Login successful', { uid: adminUser.id });
    } catch (error) {
      logger.error('AuthProvider: Login failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      logger.info('AuthProvider: Logging out');
      await signOutAdmin();
      setUser(null);
      setIsAdmin(false);
      logger.info('AuthProvider: Logout successful');
    } catch (error) {
      logger.error('AuthProvider: Logout failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
