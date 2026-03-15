import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { handleFirebaseError, ERROR_CODES } from './errors';

/**
 * @template T
 * @typedef {Object} DocumentData
 * @property {string} id
 * @property {T} data
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @param {string} collectionName
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * @param {string} collectionName
 * @param {Array} queryConstraints
 * @returns {Promise<Array>}
 */
export const getDocuments = async (collectionName, queryConstraints = []) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = queryConstraints.length > 0 
      ? query(collectionRef, ...queryConstraints)
      : collectionRef;
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * @param {string} collectionName
 * @param {Object} data
 * @returns {Promise<string>}
 */
export const createDocument = async (collectionName, data) => {
  try {
    const timestamp = Timestamp.now();
    const collectionRef = collection(db, collectionName);
    
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return docRef.id;
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * @param {string} collectionName
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<void>}
 */
export const setDocument = async (collectionName, id, data) => {
  try {
    const timestamp = Timestamp.now();
    const docRef = doc(db, collectionName, id);
    
    await setDoc(docRef, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * @param {string} collectionName
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(ERROR_CODES.FIRESTORE_NOT_FOUND);
    }

    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * @param {string} collectionName
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * @param {string} collectionName
 * @param {string} field
 * @param {any} value
 * @returns {Promise<Object|null>}
 */
export const findDocumentByField = async (collectionName, field, value) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(field, '==', value), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

export { where, orderBy, limit, startAfter, Timestamp };
