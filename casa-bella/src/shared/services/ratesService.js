import { COLLECTIONS } from '../constants/collections';
import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  where,
  orderBy,
  Timestamp,
} from '../utils/firestore';

/**
 * @typedef {Object} Rate
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} pricePerNight
 * @property {Date} [startDate]
 * @property {Date} [endDate]
 * @property {number} [minNights]
 * @property {number} [maxGuests]
 * @property {boolean} active
 * @property {string} type - standard, seasonal, special
 */

/**
 * @param {string} id
 * @returns {Promise<Rate|null>}
 */
export const getRate = async (id) => {
  return await getDocument(COLLECTIONS.RATES, id);
};

/**
 * @param {boolean} [activeOnly=false]
 * @returns {Promise<Array<Rate>>}
 */
export const getRates = async (activeOnly = false) => {
  const constraints = [orderBy('pricePerNight', 'asc')];
  
  if (activeOnly) {
    constraints.unshift(where('active', '==', true));
  }
  
  return await getDocuments(COLLECTIONS.RATES, constraints);
};

/**
 * @param {Omit<Rate, 'id'>} data
 * @returns {Promise<string>}
 */
export const createRate = async (data) => {
  const rateData = {
    name: data.name,
    description: data.description || '',
    pricePerNight: data.pricePerNight,
    startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
    endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
    minNights: data.minNights || 1,
    maxGuests: data.maxGuests || null,
    active: data.active !== undefined ? data.active : true,
    type: data.type || 'standard',
  };
  
  return await createDocument(COLLECTIONS.RATES, rateData);
};

/**
 * @param {string} id
 * @param {Partial<Rate>} data
 * @returns {Promise<void>}
 */
export const updateRate = async (id, data) => {
  const updateData = { ...data };
  
  if (data.startDate) {
    updateData.startDate = Timestamp.fromDate(data.startDate);
  }
  
  if (data.endDate) {
    updateData.endDate = Timestamp.fromDate(data.endDate);
  }
  
  await updateDocument(COLLECTIONS.RATES, id, updateData);
};

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteRate = async (id) => {
  await deleteDocument(COLLECTIONS.RATES, id);
};

/**
 * @param {Date} date
 * @returns {Promise<Rate|null>}
 */
export const getActiveRateForDate = async (date) => {
  const timestamp = Timestamp.fromDate(date);
  
  const constraints = [
    where('active', '==', true),
    where('startDate', '<=', timestamp),
    where('endDate', '>=', timestamp),
    orderBy('pricePerNight', 'desc'),
  ];
  
  const rates = await getDocuments(COLLECTIONS.RATES, constraints);
  
  if (rates.length > 0) {
    return rates[0];
  }
  
  const standardRates = await getDocuments(COLLECTIONS.RATES, [
    where('active', '==', true),
    where('type', '==', 'standard'),
  ]);
  
  return standardRates.length > 0 ? standardRates[0] : null;
};
