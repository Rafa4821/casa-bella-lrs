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
 * @typedef {Object} Reservation
 * @property {string} id
 * @property {string} guestName
 * @property {string} guestEmail
 * @property {string} guestPhone
 * @property {Date} checkInDate
 * @property {Date} checkOutDate
 * @property {number} numberOfGuests
 * @property {number} numberOfNights
 * @property {number} totalAmount
 * @property {string} status - pending, confirmed, cancelled, completed
 * @property {string} [notes]
 * @property {string} [paymentStatus] - pending, partial, paid
 * @property {number} [paidAmount]
 */

/**
 * @param {string} id
 * @returns {Promise<Reservation|null>}
 */
export const getReservation = async (id) => {
  return await getDocument(COLLECTIONS.RESERVATIONS, id);
};

/**
 * @param {Object} [filters]
 * @param {string} [filters.status]
 * @param {Date} [filters.startDate]
 * @param {Date} [filters.endDate]
 * @returns {Promise<Array<Reservation>>}
 */
export const getReservations = async (filters = {}) => {
  const constraints = [orderBy('checkInDate', 'desc')];
  
  if (filters.status) {
    constraints.unshift(where('status', '==', filters.status));
  }
  
  if (filters.startDate) {
    constraints.push(where('checkInDate', '>=', Timestamp.fromDate(filters.startDate)));
  }
  
  if (filters.endDate) {
    constraints.push(where('checkOutDate', '<=', Timestamp.fromDate(filters.endDate)));
  }
  
  return await getDocuments(COLLECTIONS.RESERVATIONS, constraints);
};

/**
 * @param {Omit<Reservation, 'id'>} data
 * @returns {Promise<string>}
 */
export const createReservation = async (data) => {
  const reservationData = {
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    guestPhone: data.guestPhone,
    checkInDate: Timestamp.fromDate(data.checkInDate),
    checkOutDate: Timestamp.fromDate(data.checkOutDate),
    numberOfGuests: data.numberOfGuests,
    numberOfNights: data.numberOfNights,
    totalAmount: data.totalAmount,
    status: data.status || 'pending',
    notes: data.notes || '',
    paymentStatus: data.paymentStatus || 'pending',
    paidAmount: data.paidAmount || 0,
  };
  
  return await createDocument(COLLECTIONS.RESERVATIONS, reservationData);
};

/**
 * @param {string} id
 * @param {Partial<Reservation>} data
 * @returns {Promise<void>}
 */
export const updateReservation = async (id, data) => {
  const updateData = { ...data };
  
  if (data.checkInDate) {
    updateData.checkInDate = Timestamp.fromDate(data.checkInDate);
  }
  
  if (data.checkOutDate) {
    updateData.checkOutDate = Timestamp.fromDate(data.checkOutDate);
  }
  
  await updateDocument(COLLECTIONS.RESERVATIONS, id, updateData);
};

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteReservation = async (id) => {
  await deleteDocument(COLLECTIONS.RESERVATIONS, id);
};

/**
 * @param {string} id
 * @param {string} status
 * @returns {Promise<void>}
 */
export const updateReservationStatus = async (id, status) => {
  await updateReservation(id, { status });
};

/**
 * @param {Date} checkIn
 * @param {Date} checkOut
 * @returns {Promise<Array<Reservation>>}
 */
export const getReservationsByDateRange = async (checkIn, checkOut) => {
  const constraints = [
    where('checkInDate', '>=', Timestamp.fromDate(checkIn)),
    where('checkInDate', '<=', Timestamp.fromDate(checkOut)),
    where('status', 'in', ['confirmed', 'pending']),
  ];
  
  return await getDocuments(COLLECTIONS.RESERVATIONS, constraints);
};
