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
 * @typedef {Object} BlockedDate
 * @property {string} id
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {string} reason
 * @property {string} type - maintenance, booked, unavailable
 */

/**
 * @param {string} id
 * @returns {Promise<BlockedDate|null>}
 */
export const getBlockedDate = async (id) => {
  return await getDocument(COLLECTIONS.BLOCKED_DATES, id);
};

/**
 * @param {Date} [startDate]
 * @param {Date} [endDate]
 * @returns {Promise<Array<BlockedDate>>}
 */
export const getBlockedDates = async (startDate = null, endDate = null) => {
  const constraints = [orderBy('startDate', 'asc')];
  
  if (startDate) {
    constraints.push(where('endDate', '>=', Timestamp.fromDate(startDate)));
  }
  
  if (endDate) {
    constraints.push(where('startDate', '<=', Timestamp.fromDate(endDate)));
  }
  
  return await getDocuments(COLLECTIONS.BLOCKED_DATES, constraints);
};

/**
 * @param {Omit<BlockedDate, 'id'>} data
 * @returns {Promise<string>}
 */
export const createBlockedDate = async (data) => {
  const blockedDateData = {
    startDate: Timestamp.fromDate(data.startDate),
    endDate: Timestamp.fromDate(data.endDate),
    reason: data.reason || '',
    type: data.type || 'unavailable',
  };
  
  return await createDocument(COLLECTIONS.BLOCKED_DATES, blockedDateData);
};

/**
 * @param {string} id
 * @param {Partial<BlockedDate>} data
 * @returns {Promise<void>}
 */
export const updateBlockedDate = async (id, data) => {
  const updateData = { ...data };
  
  if (data.startDate) {
    updateData.startDate = Timestamp.fromDate(data.startDate);
  }
  
  if (data.endDate) {
    updateData.endDate = Timestamp.fromDate(data.endDate);
  }
  
  await updateDocument(COLLECTIONS.BLOCKED_DATES, id, updateData);
};

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteBlockedDate = async (id) => {
  await deleteDocument(COLLECTIONS.BLOCKED_DATES, id);
};

/**
 * @param {Date} checkIn
 * @param {Date} checkOut
 * @returns {Promise<boolean>}
 */
export const isDateRangeAvailable = async (checkIn, checkOut) => {
  const blockedDates = await getBlockedDates(checkIn, checkOut);
  return blockedDates.length === 0;
};

/**
 * @param {Date} date
 * @returns {Promise<boolean>}
 */
export const isDateBlocked = async (date) => {
  const timestamp = Timestamp.fromDate(date);
  
  const constraints = [
    where('startDate', '<=', timestamp),
    where('endDate', '>=', timestamp),
  ];
  
  const blockedDates = await getDocuments(COLLECTIONS.BLOCKED_DATES, constraints);
  return blockedDates.length > 0;
};

// Alias for admin pages compatibility
export const getAllBlockedDates = getBlockedDates;
