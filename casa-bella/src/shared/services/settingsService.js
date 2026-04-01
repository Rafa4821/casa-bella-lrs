import { COLLECTIONS } from '../constants/collections';
import {
  getDocument,
  getDocuments,
  setDocument,
  updateDocument,
} from '../utils/firestore';

/**
 * @typedef {Object} Settings
 * @property {string} posadaName
 * @property {string} description
 * @property {string} phone
 * @property {string} email
 * @property {string} address
 * @property {Object} socialMedia
 * @property {number} maxGuests
 * @property {string} checkInTime
 * @property {string} checkOutTime
 * @property {string} currency
 * @property {number} taxRate
 */

const SETTINGS_DOC_ID = 'general';

/**
 * @returns {Promise<Settings|null>}
 */
export const getSettings = async () => {
  return await getDocument(COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
};

/**
 * @param {Settings} data
 * @returns {Promise<void>}
 */
export const createSettings = async (data) => {
  await setDocument(COLLECTIONS.SETTINGS, SETTINGS_DOC_ID, data);
};

/**
 * @param {Partial<Settings>} data
 * @returns {Promise<void>}
 */
export const updateSettings = async (data) => {
  // Check if settings document exists
  const existingSettings = await getSettings();
  
  if (!existingSettings) {
    // Create default settings first
    await getOrCreateSettings();
  }
  
  // Now update with the provided data
  await updateDocument(COLLECTIONS.SETTINGS, SETTINGS_DOC_ID, data);
};

/**
 * @returns {Promise<Settings>}
 */
export const getOrCreateSettings = async () => {
  let settings = await getSettings();
  
  if (!settings) {
    const defaultSettings = {
      posadaName: 'Casa Bella',
      description: 'Posada en Los Roques, Venezuela',
      phone: '',
      email: '',
      address: 'Los Roques, Venezuela',
      socialMedia: {
        facebook: '',
        instagram: '',
        whatsapp: '',
      },
      maxGuests: 20,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      currency: 'USD',
      taxRate: 0,
    };
    
    await createSettings(defaultSettings);
    settings = await getSettings();
  }
  
  return settings;
};
