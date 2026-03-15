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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const adminDoc = await findDocumentByField(COLLECTIONS.ADMINS, 'email', email);

    if (!adminDoc || !adminDoc.active) {
      await signOut(auth);
      throw new Error(ERROR_CODES.AUTH_UNAUTHORIZED);
    }

    return {
      id: user.uid,
      email: user.email,
      name: adminDoc.name,
      role: adminDoc.role,
      active: adminDoc.active,
    };
  } catch (error) {
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
      
      if (adminDoc && adminDoc.active) {
        callback({
          id: user.uid,
          email: user.email,
          name: adminDoc.name,
          role: adminDoc.role,
          active: adminDoc.active,
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
