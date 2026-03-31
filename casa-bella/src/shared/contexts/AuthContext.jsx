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
    console.log('AuthContext: Setting up onAuthStateChange listener');
    
    const unsubscribe = onAuthStateChange((authUser) => {
      console.log('AuthContext: Auth state changed, user:', authUser);
      
      if (authUser) {
        // onAuthChange already verified admin status
        setUser(authUser);
        setIsAdmin(true);
        logger.info('AuthProvider: Admin user authenticated', { uid: authUser.id });
        console.log('AuthContext: Admin verified and state updated');
      } else {
        setUser(null);
        setIsAdmin(false);
        logger.info('AuthProvider: User logged out');
        console.log('AuthContext: User logged out, state cleared');
      }
      setLoading(false);
    });

    return () => {
      logger.info('AuthProvider: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      logger.info('AuthProvider: Attempting login', { email });
      console.log('AuthContext: Starting login for', email);
      
      const adminUser = await signInAdmin(email, password);
      
      console.log('AuthContext: Login successful, admin user:', adminUser);
      // Don't manually set state - let the auth listener handle it
      logger.info('AuthProvider: Login successful', { uid: adminUser.id });
    } catch (error) {
      console.error('AuthContext: Login failed with error:', error);
      logger.error('AuthProvider: Login failed', error);
      throw error;
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
