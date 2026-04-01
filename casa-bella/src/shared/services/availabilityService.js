import { getReservations } from './reservationsService';
import { getBlockedDates } from './blockedDatesService';

/**
 * Check if a date is blocked or reserved
 * @param {Date} date
 * @param {Array} reservations
 * @param {Array} blockedDates
 * @returns {Object} { available, reason }
 */
export const checkDateAvailability = (date, reservations, blockedDates) => {
  const dateStr = date.toISOString().split('T')[0];
  
  // Check blocked dates
  const isBlocked = blockedDates.some(blocked => {
    const blockedDate = new Date(blocked.date);
    return blockedDate.toISOString().split('T')[0] === dateStr;
  });
  
  if (isBlocked) {
    return { available: false, reason: 'blocked' };
  }
  
  // Check reservations
  const isReserved = reservations.some(reservation => {
    if (reservation.status === 'cancelada') return false;
    
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    
    return date >= checkIn && date < checkOut;
  });
  
  if (isReserved) {
    return { available: false, reason: 'reserved' };
  }
  
  return { available: true, reason: null };
};

/**
 * Get availability for a date range
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<Map>} Map of date strings to availability objects
 */
export const getAvailabilityMap = async (startDate, endDate) => {
  try {
    const [reservations, blockedDates] = await Promise.all([
      getReservations(),
      getBlockedDates(),
    ]);
    
    const availabilityMap = new Map();
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const availability = checkDateAvailability(new Date(currentDate), reservations, blockedDates);
      availabilityMap.set(dateStr, availability);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return availabilityMap;
  } catch (error) {
    console.error('Error getting availability:', error);
    return new Map();
  }
};

/**
 * Check if a date range is available
 * @param {Date} checkIn
 * @param {Date} checkOut
 * @returns {Promise<Object>}
 */
export const checkRangeAvailability = async (checkIn, checkOut) => {
  try {
    const [reservations, blockedDates] = await Promise.all([
      getReservations(),
      getBlockedDates(),
    ]);
    
    const currentDate = new Date(checkIn);
    const unavailableDates = [];
    
    while (currentDate < checkOut) {
      const availability = checkDateAvailability(new Date(currentDate), reservations, blockedDates);
      
      if (!availability.available) {
        unavailableDates.push({
          date: new Date(currentDate),
          reason: availability.reason,
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      available: unavailableDates.length === 0,
      unavailableDates,
    };
  } catch (error) {
    console.error('Error checking range availability:', error);
    return { available: false, error: error.message };
  }
};
