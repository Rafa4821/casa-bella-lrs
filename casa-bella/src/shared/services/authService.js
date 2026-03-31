import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { handleFirebaseError, ERROR_CODES } from '../utils/errors';
import { findDocumentByField } from '../utils/firestore';
import { COLLECTIONS } from '../constants/collections';

/**
 * @typedef {Object} AdminUser
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} role
 * @property {boolean} active
 */

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<AdminUser>}
 */
export const signInAdmin = async (email, password) => {
  try {
    console.log('authService: Attempting Firebase authentication for', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('authService: Firebase auth successful, UID:', user.uid);

    console.log('authService: Looking for admin document with email:', email);
    const adminDoc = await findDocumentByField(COLLECTIONS.ADMINS, 'email', email);
    console.log('authService: Admin document found:', adminDoc);

    if (!adminDoc) {
      console.error('authService: No admin document found for email:', email);
      await signOut(auth);
      throw new Error('No se encontró un usuario administrador con este email. Por favor contacta al administrador del sistema.');
    }

    console.log('authService: Checking isActive field:', adminDoc.isActive);
    if (!adminDoc.isActive) {
      console.error('authService: Admin account is inactive');
      await signOut(auth);
      throw new Error('Tu cuenta de administrador está desactivada. Por favor contacta al administrador del sistema.');
    }

    console.log('authService: Admin login successful');
    return {
      id: user.uid,
      email: user.email,
      name: adminDoc.name,
      role: adminDoc.role,
      active: adminDoc.isActive,
    };
  } catch (error) {
    console.error('authService: Login error:', error);
    throw handleFirebaseError(error);
  }
};

/**
 * @returns {Promise<void>}
 */
export const signOutAdmin = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * @param {Function} callback
 * @returns {Function} unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const adminDoc = await findDocumentByField(COLLECTIONS.ADMINS, 'email', user.email);
      
      if (adminDoc && adminDoc.isActive) {
        callback({
          id: user.uid,
          email: user.email,
          name: adminDoc.name,
          role: adminDoc.role,
          active: adminDoc.isActive,
        });
      } else {
        await signOut(auth);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * @returns {AdminUser|null}
 */
export const getCurrentAdmin = () => {
  return auth.currentUser;
};

/**
 * @param {string} email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const changePassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error(ERROR_CODES.AUTH_UNAUTHORIZED);
    }
    await updatePassword(user, newPassword);
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * @param {string} newEmail
 * @returns {Promise<void>}
 */
export const changeEmail = async (newEmail) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error(ERROR_CODES.AUTH_UNAUTHORIZED);
    }
    await updateEmail(user, newEmail);
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * Alias for onAuthChange (used by AuthContext)
 */
export const onAuthStateChange = onAuthChange;

/**
 * Get current user (checks if admin)
 * @returns {Promise<AdminUser|null>}
 */
export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  try {
    const adminDoc = await findDocumentByField(COLLECTIONS.ADMINS, 'email', user.email);
    
    if (adminDoc && adminDoc.isActive) {
      return {
        id: user.uid,
        email: user.email,
        name: adminDoc.name,
        role: adminDoc.role,
        active: adminDoc.isActive,
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};
